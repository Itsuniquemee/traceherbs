const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: [
      'certificate',
      'test_report',
      'permit',
      'invoice',
      'contract',
      'inspection_report',
      'compliance_document',
      'photo',
      'video',
      'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['quality', 'compliance', 'financial', 'operational', 'legal', 'marketing'],
    default: 'operational'
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['batch', 'user', 'farm', 'facility'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.ObjectId,
      required: true
    }
  },
  file: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    storageProvider: {
      type: String,
      enum: ['local', 'aws_s3', 'google_cloud', 'azure_blob'],
      default: 'local'
    },
    hash: String // For integrity verification
  },
  access: {
    visibility: {
      type: String,
      enum: ['private', 'internal', 'public', 'stakeholders'],
      default: 'internal'
    },
    allowedRoles: [{
      type: String,
      enum: ['farmer', 'processor', 'consumer', 'admin', 'regulator']
    }],
    allowedUsers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationNotes: String,
    digitalSignature: String
  },
  compliance: {
    retentionPeriod: Number, // in days
    complianceStandards: [String],
    auditTrail: [{
      action: String,
      performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }]
  },
  metadata: {
    tags: [String],
    expiryDate: Date,
    renewalRequired: Boolean,
    issuedBy: String,
    issuedDate: Date,
    validUntil: Date,
    certificationBody: String,
    standardVersion: String
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked', 'pending_review', 'archived'],
    default: 'active'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastAccessed: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ 'metadata.expiryDate': 1 });

// Virtual for file size in human readable format
documentSchema.virtual('fileSizeFormatted').get(function() {
  const size = this.file.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
});

// Virtual for days until expiry
documentSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.metadata.expiryDate) return null;
  
  const now = new Date();
  const expiry = new Date(this.metadata.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if user can access document
documentSchema.methods.canUserAccess = function(user) {
  // Admin can access everything
  if (user.role === 'admin') return true;
  
  // Owner can always access
  if (this.uploadedBy.toString() === user._id.toString()) return true;
  
  // Check visibility settings
  if (this.access.visibility === 'public') return true;
  
  if (this.access.visibility === 'private') {
    return this.access.allowedUsers.includes(user._id);
  }
  
  if (this.access.visibility === 'stakeholders') {
    return this.access.allowedRoles.includes(user.role) || 
           this.access.allowedUsers.includes(user._id);
  }
  
  if (this.access.visibility === 'internal') {
    return ['farmer', 'processor', 'admin', 'regulator'].includes(user.role);
  }
  
  return false;
};

// Method to log access
documentSchema.methods.logAccess = function(userId) {
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  
  this.compliance.auditTrail.push({
    action: 'download',
    performedBy: userId,
    timestamp: new Date(),
    notes: 'Document downloaded'
  });
  
  return this.save();
};

// Method to verify document
documentSchema.methods.verify = function(verifierId, notes) {
  this.verification.isVerified = true;
  this.verification.verifiedBy = verifierId;
  this.verification.verificationDate = new Date();
  this.verification.verificationNotes = notes;
  
  this.compliance.auditTrail.push({
    action: 'verify',
    performedBy: verifierId,
    timestamp: new Date(),
    notes: notes || 'Document verified'
  });
  
  return this.save();
};

// Static method to find expiring documents
documentSchema.statics.findExpiringDocuments = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    'metadata.expiryDate': {
      $exists: true,
      $lte: futureDate,
      $gte: new Date()
    },
    status: 'active'
  }).populate('uploadedBy', 'firstName lastName email');
};

module.exports = mongoose.model('Document', documentSchema);