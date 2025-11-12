const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: [
      'batch_update',
      'quality_test_result',
      'processing_complete',
      'shipment_update',
      'quality_alert',
      'recall_notice',
      'system_update',
      'payment_update',
      'certification_expiry',
      'inspection_scheduled',
      'general'
    ],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['batch', 'user', 'order', 'payment', 'report']
    },
    entityId: mongoose.Schema.ObjectId
  },
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },
  readAt: Date,
  deliveredAt: Date,
  scheduledFor: Date,
  expiresAt: Date,
  metadata: {
    batchId: String,
    actionRequired: Boolean,
    actionUrl: String,
    tags: [String]
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  return this.create(data);
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: { $in: ['pending', 'sent', 'delivered'] }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);