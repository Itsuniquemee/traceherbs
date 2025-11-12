const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const Document = require('../models/Document');
const User = require('../models/User');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// @desc    Get farmer dashboard data
// @route   GET /api/farmer/dashboard
// @access  Private (Farmer, Admin)
router.get('/dashboard', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;

    // Get batch statistics
    const totalBatches = await Batch.countDocuments({ 'farmer.farmerId': farmerId });
    const activeBatches = await Batch.countDocuments({ 
      'farmer.farmerId': farmerId, 
      status: { $in: ['harvested', 'in_processing', 'quality_testing'] }
    });
    const completedBatches = await Batch.countDocuments({ 
      'farmer.farmerId': farmerId, 
      status: { $in: ['approved', 'packaged', 'shipped', 'delivered'] }
    });

    // Get recent batches
    const recentBatches = await Batch.find({ 'farmer.farmerId': farmerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('batchId product.name status harvest.harvestDate createdAt');

    // Get monthly harvest data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyHarvests = await Batch.aggregate([
      {
        $match: {
          'farmer.farmerId': farmerId,
          'harvest.harvestDate': { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$harvest.harvestDate' },
            month: { $month: '$harvest.harvestDate' }
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get quality test statistics
    const qualityStats = await Batch.aggregate([
      { $match: { 'farmer.farmerId': farmerId } },
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: '$qualityTests.results.status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get crop categories
    const cropCategories = await Batch.aggregate([
      { $match: { 'farmer.farmerId': farmerId } },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalBatches,
          activeBatches,
          completedBatches,
          qualityPassRate: qualityStats.find(q => q._id === 'pass')?.count || 0
        },
        recentBatches,
        monthlyHarvests,
        qualityStats,
        cropCategories
      }
    });
  } catch (error) {
    console.error('Farmer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @desc    Create new crop/batch
// @route   POST /api/farmer/batches
// @access  Private (Farmer, Admin)
router.post('/batches', authenticate, authorize('farmer', 'admin'), [
  body('product.name').notEmpty().withMessage('Product name is required'),
  body('product.category').isIn(['herb', 'spice', 'medicinal_plant', 'extract', 'powder', 'oil', 'other']).withMessage('Invalid product category'),
  body('harvest.harvestDate').isISO8601().withMessage('Valid harvest date is required'),
  body('harvest.quantity.amount').isNumeric().withMessage('Harvest quantity must be a number'),
  body('cultivation.farmingMethod').isIn(['organic', 'conventional', 'biodynamic', 'sustainable']).withMessage('Invalid farming method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const farmerId = req.user.role === 'admin' ? req.body.farmerId || req.user._id : req.user._id;
    
    // Get farmer details
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Generate unique batch ID
    const batchId = `BTH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const batchData = {
      ...req.body,
      batchId,
      farmer: {
        farmerId,
        farmerName: farmer.fullName,
        farmName: farmer.farmerProfile?.farmName || `${farmer.fullName}'s Farm`,
        location: farmer.address
      },
      status: 'harvested',
      supply_chain: [{
        step: 1,
        entity: {
          type: 'farmer',
          id: farmerId,
          name: farmer.fullName,
          location: farmer.address?.city || 'Unknown'
        },
        action: 'harvest',
        date: req.body.harvest.harvestDate,
        quantity: req.body.harvest.quantity.amount,
        notes: 'Initial harvest entry'
      }]
    };

    const batch = await Batch.create(batchData);

    // Generate QR code
    const qrData = batch.generateQRData();
    const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData));
    
    // In a real application, you'd save this QR code to cloud storage
    batch.qrCode = `qr_${batchId}.png`;
    await batch.save();

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating batch'
    });
  }
});

// @desc    Get farmer's batches
// @route   GET /api/farmer/batches
// @access  Private (Farmer, Admin)
router.get('/batches', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    // Build query
    const query = { 'farmer.farmerId': farmerId };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query['product.category'] = category;
    }
    
    if (search) {
      query.$or = [
        { batchId: new RegExp(search, 'i') },
        { 'product.name': new RegExp(search, 'i') }
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await Batch.countDocuments(query);
    
    const batches = await Batch.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('processing.processorId', 'firstName lastName processorProfile');

    // Pagination
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      count: batches.length,
      total,
      pagination,
      data: batches
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batches'
    });
  }
});

// @desc    Get single batch details
// @route   GET /api/farmer/batches/:batchId
// @access  Private (Farmer, Admin)
router.get('/batches/:batchId', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId })
      .populate('farmer.farmerId', 'firstName lastName farmerProfile')
      .populate('processing.processorId', 'firstName lastName processorProfile');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check if user owns this batch (unless admin)
    if (req.user.role !== 'admin' && batch.farmer.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch details'
    });
  }
});

// @desc    Update batch information
// @route   PUT /api/farmer/batches/:batchId
// @access  Private (Farmer, Admin)
router.put('/batches/:batchId', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && batch.farmer.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['product', 'cultivation', 'harvest', 'notes', 'tags'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedBatch = await Batch.findOneAndUpdate(
      { batchId: req.params.batchId },
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Batch updated successfully',
      data: updatedBatch
    });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating batch'
    });
  }
});

// @desc    Upload documents for batch
// @route   POST /api/farmer/batches/:batchId/documents
// @access  Private (Farmer, Admin)
router.post('/batches/:batchId/documents', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && batch.farmer.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, type, file } = req.body;

    // Create document record
    const document = await Document.create({
      title,
      description,
      type,
      uploadedBy: req.user._id,
      relatedEntity: {
        entityType: 'batch',
        entityId: batch._id
      },
      file: {
        filename: file.filename,
        originalName: file.originalName,
        mimetype: file.mimetype,
        size: file.size,
        url: file.url
      }
    });

    // Add document to batch attachments
    batch.attachments.push({
      filename: file.filename,
      url: file.url,
      type: file.mimetype,
      uploadedBy: req.user._id
    });

    await batch.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
});

// @desc    Get farmer's documents
// @route   GET /api/farmer/documents
// @access  Private (Farmer, Admin)
router.get('/documents', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const type = req.query.type;

    const query = { uploadedBy: farmerId };
    
    if (type) {
      query.type = type;
    }

    const startIndex = (page - 1) * limit;
    const total = await Document.countDocuments(query);

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('relatedEntity.entityId', 'batchId product.name');

    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.json({
      success: true,
      count: documents.length,
      total,
      pagination,
      data: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
});

// @desc    Get harvest records
// @route   GET /api/farmer/harvest-records
// @access  Private (Farmer, Admin)
router.get('/harvest-records', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;
    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();

    // Get harvest data for the specified year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const harvestRecords = await Batch.find({
      'farmer.farmerId': farmerId,
      'harvest.harvestDate': {
        $gte: startDate,
        $lte: endDate
      }
    }).select('batchId product harvest cultivation createdAt');

    // Aggregate monthly data
    const monthlyData = await Batch.aggregate([
      {
        $match: {
          'farmer.farmerId': farmerId,
          'harvest.harvestDate': {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$harvest.harvestDate' },
            category: '$product.category'
          },
          totalQuantity: { $sum: '$harvest.quantity.amount' },
          batchCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        harvestRecords,
        monthlyData,
        year
      }
    });
  } catch (error) {
    console.error('Get harvest records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching harvest records'
    });
  }
});

// @desc    Get supply chain tracking for farmer's batches
// @route   GET /api/farmer/supply-tracking
// @access  Private (Farmer, Admin)
router.get('/supply-tracking', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;

    // Get all batches with their current supply chain status
    const batches = await Batch.find({ 'farmer.farmerId': farmerId })
      .select('batchId product.name status supply_chain createdAt')
      .sort({ createdAt: -1 });

    // Process supply chain data
    const supplyTracking = batches.map(batch => {
      const latestStep = batch.supply_chain && batch.supply_chain.length > 0 
        ? batch.supply_chain[batch.supply_chain.length - 1] 
        : null;

      return {
        batchId: batch.batchId,
        productName: batch.product.name,
        status: batch.status,
        currentStep: latestStep ? latestStep.entity.name : 'At Farm',
        currentLocation: latestStep ? latestStep.entity.location : 'Farm',
        lastUpdate: latestStep ? latestStep.date : batch.createdAt,
        totalSteps: batch.supply_chain ? batch.supply_chain.length : 1
      };
    });

    res.json({
      success: true,
      data: supplyTracking
    });
  } catch (error) {
    console.error('Get supply tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supply tracking data'
    });
  }
});

// @desc    Get quality feedback for farmer
// @route   GET /api/farmer/quality-feedback
// @access  Private (Farmer, Admin)
router.get('/quality-feedback', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;

    // Get quality test results for farmer's batches
    const qualityFeedback = await Batch.aggregate([
      { $match: { 'farmer.farmerId': farmerId } },
      { $unwind: '$qualityTests' },
      {
        $project: {
          batchId: 1,
          productName: '$product.name',
          testType: '$qualityTests.testType',
          testDate: '$qualityTests.testDate',
          result: '$qualityTests.results',
          laboratory: '$qualityTests.laboratory.name',
          recommendations: '$qualityTests.results.notes'
        }
      },
      { $sort: { testDate: -1 } },
      { $limit: 50 }
    ]);

    // Calculate quality scores by category
    const qualityScores = await Batch.aggregate([
      { $match: { 'farmer.farmerId': farmerId } },
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: '$qualityTests.testType',
          avgScore: {
            $avg: {
              $cond: [
                { $eq: ['$qualityTests.results.status', 'pass'] },
                100,
                { $cond: [{ $eq: ['$qualityTests.results.status', 'warning'] }, 75, 25] }
              ]
            }
          },
          totalTests: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        qualityFeedback,
        qualityScores
      }
    });
  } catch (error) {
    console.error('Get quality feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quality feedback'
    });
  }
});

// @desc    Get transparency credits/rewards
// @route   GET /api/farmer/transparency-credits
// @access  Private (Farmer, Admin)
router.get('/transparency-credits', authenticate, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const farmerId = req.user.role === 'admin' ? req.query.farmerId || req.user._id : req.user._id;

    // Calculate transparency score based on various factors
    const farmer = await User.findById(farmerId);
    const batches = await Batch.find({ 'farmer.farmerId': farmerId });

    let transparencyScore = 0;
    let credits = 0;

    // Base score for profile completion
    if (farmer.farmerProfile && farmer.farmerProfile.farmName) transparencyScore += 10;
    if (farmer.farmerProfile && farmer.farmerProfile.certifications.length > 0) transparencyScore += 15;
    if (farmer.address && farmer.address.coordinates) transparencyScore += 10;

    // Score for batch documentation
    batches.forEach(batch => {
      // Complete harvest data
      if (batch.harvest && batch.harvest.harvestDate) credits += 5;
      
      // Quality tests
      if (batch.qualityTests && batch.qualityTests.length > 0) credits += 10;
      
      // Processing documentation
      if (batch.processing && batch.processing.length > 0) credits += 8;
      
      // Sustainability data
      if (batch.sustainability && batch.sustainability.carbonFootprint) credits += 12;
      
      // Document attachments
      if (batch.attachments && batch.attachments.length > 0) credits += 5;
    });

    transparencyScore += Math.min(credits, 200); // Cap at 200 points from batches

    // Calculate rewards and benefits
    const rewards = {
      bronze: transparencyScore >= 50,
      silver: transparencyScore >= 100,
      gold: transparencyScore >= 200,
      platinum: transparencyScore >= 300
    };

    const benefits = [];
    
    if (rewards.bronze) benefits.push('Basic verification badge');
    if (rewards.silver) benefits.push('Priority support', 'Marketing materials');
    if (rewards.gold) benefits.push('Premium listing', '5% bonus payments');
    if (rewards.platinum) benefits.push('Partnership opportunities', '10% bonus payments');

    res.json({
      success: true,
      data: {
        transparencyScore,
        credits,
        rewards,
        benefits,
        nextMilestone: transparencyScore < 50 ? 50 : transparencyScore < 100 ? 100 : transparencyScore < 200 ? 200 : transparencyScore < 300 ? 300 : null
      }
    });
  } catch (error) {
    console.error('Get transparency credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transparency credits'
    });
  }
});

module.exports = router;