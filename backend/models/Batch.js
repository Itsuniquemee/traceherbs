const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  product: {
    name: {
      type: String,
      required: [true, 'Product name is required']
    },
    scientificName: String,
    category: {
      type: String,
      enum: ['herb', 'spice', 'medicinal_plant', 'extract', 'powder', 'oil', 'other'],
      default: 'herb'
    },
    variety: String,
    description: String
  },
  farmer: {
    farmerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    farmerName: String,
    farmName: String,
    location: {
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      address: String,
      region: String,
      district: String,
      state: String,
      country: String
    }
  },
  cultivation: {
    sowingDate: Date,
    harvestDate: {
      type: Date,
      required: [true, 'Harvest date is required']
    },
    farmingMethod: {
      type: String,
      enum: ['organic', 'conventional', 'biodynamic', 'sustainable'],
      default: 'organic'
    },
    soilType: String,
    climateConditions: String,
    irrigationMethod: String,
    fertilizers: [String],
    pesticides: [String],
    certifications: [String],
    seasonalNotes: String
  },
  harvest: {
    quantity: {
      amount: {
        type: Number,
        required: [true, 'Harvest quantity is required']
      },
      unit: {
        type: String,
        enum: ['kg', 'grams', 'tons', 'pounds'],
        default: 'kg'
      }
    },
    quality: {
      grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C'],
        default: 'A'
      },
      moistureContent: Number,
      notes: String
    },
    harvestMethod: String,
    weather: {
      temperature: Number,
      humidity: Number,
      conditions: String
    }
  },
  processing: [{
    processorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    processType: {
      type: String,
      enum: ['cleaning', 'drying', 'grinding', 'extraction', 'packaging', 'storage', 'other']
    },
    date: {
      type: Date,
      default: Date.now
    },
    location: String,
    method: String,
    equipment: String,
    duration: String,
    temperature: Number,
    notes: String,
    qualityBefore: {
      moistureContent: Number,
      color: String,
      aroma: String,
      texture: String
    },
    qualityAfter: {
      moistureContent: Number,
      color: String,
      aroma: String,
      texture: String
    },
    batchSplit: [{
      newBatchId: String,
      quantity: Number,
      percentage: Number
    }]
  }],
  qualityTests: [{
    testId: String,
    testType: {
      type: String,
      enum: ['purity', 'moisture', 'heavy_metals', 'pesticide_residue', 'microbiological', 'potency', 'identity', 'other']
    },
    testDate: {
      type: Date,
      default: Date.now
    },
    laboratory: {
      name: String,
      accreditation: String,
      contactInfo: String
    },
    testMethod: String,
    results: {
      value: mongoose.Schema.Types.Mixed,
      unit: String,
      status: {
        type: String,
        enum: ['pass', 'fail', 'warning', 'pending'],
        default: 'pending'
      },
      standardLimit: mongoose.Schema.Types.Mixed,
      notes: String
    },
    certificate: {
      url: String,
      issuedBy: String,
      validUntil: Date
    },
    retestRequired: Boolean
  }],
  storage: [{
    facilityId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    storageDate: {
      type: Date,
      default: Date.now
    },
    location: String,
    conditions: {
      temperature: Number,
      humidity: Number,
      lightConditions: String,
      ventilation: String,
      pestControl: String
    },
    containerType: String,
    quantity: Number,
    notes: String
  }],
  supply_chain: [{
    step: Number,
    entity: {
      type: {
        type: String,
        enum: ['farmer', 'collector', 'processor', 'packager', 'distributor', 'retailer', 'consumer']
      },
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      name: String,
      location: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['harvest', 'collect', 'receive', 'process', 'package', 'ship', 'store', 'sell', 'return']
    },
    quantity: Number,
    documents: [String], // URLs to documents
    notes: String,
    verification: {
      verified: { type: Boolean, default: false },
      verifiedBy: String,
      verificationDate: Date,
      digitalSignature: String
    }
  }],
  packaging: {
    packageDate: Date,
    packageType: String,
    packageSize: String,
    labelInfo: {
      productName: String,
      batchNumber: String,
      manufacturingDate: Date,
      expiryDate: Date,
      instructions: String,
      warnings: String,
      nutritionalInfo: mongoose.Schema.Types.Mixed
    },
    barcodeGenerated: Boolean,
    qrCodeGenerated: Boolean
  },
  transportation: [{
    vehicleId: String,
    driverInfo: {
      name: String,
      license: String,
      contact: String
    },
    route: {
      from: String,
      to: String,
      waypoints: [String]
    },
    startDate: Date,
    endDate: Date,
    conditions: {
      temperature: Number,
      humidity: Number,
      handling: String
    },
    trackingInfo: {
      gpsCoordinates: [[Number]], // Array of [lat, lng] points
      timestamps: [Date]
    },
    documents: [String]
  }],
  compliance: {
    regulations: [String],
    permits: [String],
    inspections: [{
      date: Date,
      inspector: String,
      agency: String,
      result: {
        type: String,
        enum: ['pass', 'fail', 'conditional']
      },
      notes: String,
      certificate: String
    }],
    recalls: [{
      recallDate: Date,
      reason: String,
      scope: String,
      status: {
        type: String,
        enum: ['initiated', 'in_progress', 'completed']
      }
    }]
  },
  sustainability: {
    carbonFootprint: Number,
    waterUsage: Number,
    energyUsage: Number,
    wasteGenerated: Number,
    recyclablePackaging: Boolean,
    sustainabilityScore: Number,
    certifications: [String]
  },
  blockchain: {
    transactionHash: String,
    blockNumber: Number,
    smartContractAddress: String,
    immutableRecordHash: String
  },
  status: {
    type: String,
    enum: ['harvested', 'in_processing', 'quality_testing', 'approved', 'packaged', 'shipped', 'delivered', 'recalled'],
    default: 'harvested'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'stakeholders_only'],
    default: 'public'
  },
  tags: [String],
  notes: String,
  attachments: [{
    filename: String,
    url: String,
    type: String,
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
batchSchema.index({ batchId: 1 });
batchSchema.index({ qrCode: 1 });
batchSchema.index({ 'farmer.farmerId': 1 });
batchSchema.index({ 'product.name': 1 });
batchSchema.index({ 'product.category': 1 });
batchSchema.index({ status: 1 });
batchSchema.index({ createdAt: -1 });
batchSchema.index({ 'harvest.harvestDate': -1 });

// Virtual for batch age
batchSchema.virtual('batchAge').get(function() {
  if (this.harvest && this.harvest.harvestDate) {
    const now = new Date();
    const harvestDate = new Date(this.harvest.harvestDate);
    const diffTime = Math.abs(now - harvestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for current location in supply chain
batchSchema.virtual('currentLocation').get(function() {
  if (this.supply_chain && this.supply_chain.length > 0) {
    const sortedChain = this.supply_chain.sort((a, b) => b.date - a.date);
    return sortedChain[0].entity.location;
  }
  return this.farmer.location.address;
});

// Method to generate QR code data
batchSchema.methods.generateQRData = function() {
  return {
    batchId: this.batchId,
    productName: this.product.name,
    harvestDate: this.harvest.harvestDate,
    farmer: this.farmer.farmerName,
    status: this.status,
    traceUrl: `${process.env.FRONTEND_URL}/trace/${this.batchId}`
  };
};

// Method to add processing step
batchSchema.methods.addProcessingStep = function(stepData) {
  this.processing.push(stepData);
  return this.save();
};

// Method to add quality test
batchSchema.methods.addQualityTest = function(testData) {
  this.qualityTests.push(testData);
  return this.save();
};

// Method to update status
batchSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static method to search batches
batchSchema.statics.searchBatches = function(query) {
  const searchCriteria = {};
  
  if (query.batchId) {
    searchCriteria.batchId = new RegExp(query.batchId, 'i');
  }
  
  if (query.productName) {
    searchCriteria['product.name'] = new RegExp(query.productName, 'i');
  }
  
  if (query.farmerId) {
    searchCriteria['farmer.farmerId'] = query.farmerId;
  }
  
  if (query.status) {
    searchCriteria.status = query.status;
  }
  
  if (query.category) {
    searchCriteria['product.category'] = query.category;
  }
  
  if (query.dateFrom || query.dateTo) {
    searchCriteria['harvest.harvestDate'] = {};
    if (query.dateFrom) {
      searchCriteria['harvest.harvestDate'].$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      searchCriteria['harvest.harvestDate'].$lte = new Date(query.dateTo);
    }
  }
  
  return this.find(searchCriteria)
    .populate('farmer.farmerId', 'firstName lastName username farmerProfile')
    .populate('processing.processorId', 'firstName lastName username processorProfile')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Batch', batchSchema);