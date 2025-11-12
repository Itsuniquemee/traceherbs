const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const Document = require('../models/Document');
const User = require('../models/User');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// @desc    Get processor dashboard
// @route   GET /api/processor/dashboard
// @access  Private (Processor, Admin)
router.get('/dashboard', authenticate, authorize('processor', 'admin'), async (req, res) => {
  try {
    const processorId = req.user.role === 'admin' ? req.query.processorId || req.user._id : req.user._id;

    // Get batches processed by this processor
    const totalProcessed = await Batch.countDocuments({
      'processing.processorId': processorId
    });

    const inProgress = await Batch.countDocuments({
      'processing.processorId': processorId,
      status: 'in_processing'
    });

    const qualityTesting = await Batch.countDocuments({
      'processing.processorId': processorId,
      status: 'quality_testing'
    });

    const completed = await Batch.countDocuments({
      'processing.processorId': processorId,
      status: { $in: ['approved', 'packaged', 'shipped'] }
    });

    // Recent processing activities
    const recentActivities = await Batch.find({
      'processing.processorId': processorId
    })
    .sort({ 'processing.date': -1 })
    .limit(10)
    .select('batchId product.name status processing.$')
    .populate('farmer.farmerId', 'firstName lastName');

    // Processing efficiency metrics
    const efficiencyStats = await Batch.aggregate([
      { $match: { 'processing.processorId': processorId } },
      { $unwind: '$processing' },
      { $match: { 'processing.processorId': processorId } },
      {
        $group: {
          _id: '$processing.processType',
          avgDuration: { $avg: { $toDouble: '$processing.duration' } },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalProcessed,
          inProgress,
          qualityTesting,
          completed
        },
        recentActivities,
        efficiencyStats
      }
    });
  } catch (error) {
    console.error('Processor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @desc    Receive new batch for processing
// @route   POST /api/processor/receive-batch
// @access  Private (Processor, Admin)
router.post('/receive-batch', authenticate, authorize('processor', 'admin'), [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('receivedQuantity').isNumeric().withMessage('Received quantity must be a number'),
  body('qualityCheck.condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid quality condition'),
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

    const { batchId, receivedQuantity, qualityCheck, notes } = req.body;
    const processorId = req.user._id;

    // Find the batch
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Add processor to the batch processing chain
    const processor = await User.findById(processorId);
    
    batch.processing.push({
      processorId,
      processType: 'receiving',
      date: new Date(),
      location: processor.processorProfile?.companyName || processor.fullName,
      method: 'batch_receipt',
      notes,
      qualityBefore: qualityCheck,
      qualityAfter: qualityCheck
    });

    // Add to supply chain
    batch.supply_chain.push({
      step: batch.supply_chain.length + 1,
      entity: {
        type: 'processor',
        id: processorId,
        name: processor.fullName,
        location: processor.address?.city || 'Processing Facility'
      },
      action: 'receive',
      date: new Date(),
      quantity: receivedQuantity,
      notes: `Received batch for processing. Quality: ${qualityCheck.condition}`
    });

    // Update status
    batch.status = 'in_processing';

    await batch.save();

    res.json({
      success: true,
      message: 'Batch received successfully',
      data: batch
    });
  } catch (error) {
    console.error('Receive batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error receiving batch'
    });
  }
});

// @desc    Add processing step to batch
// @route   POST /api/processor/processing-step
// @access  Private (Processor, Admin)
router.post('/processing-step', authenticate, authorize('processor', 'admin'), [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('processType').isIn(['cleaning', 'drying', 'grinding', 'extraction', 'packaging', 'storage', 'other']).withMessage('Invalid process type'),
  body('method').notEmpty().withMessage('Processing method is required'),
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

    const { batchId, processType, method, equipment, duration, temperature, qualityBefore, qualityAfter, notes } = req.body;
    const processorId = req.user._id;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Add processing step
    const processor = await User.findById(processorId);
    
    batch.processing.push({
      processorId,
      processType,
      date: new Date(),
      location: processor.processorProfile?.companyName || processor.fullName,
      method,
      equipment,
      duration,
      temperature,
      notes,
      qualityBefore,
      qualityAfter
    });

    // Add to supply chain
    batch.supply_chain.push({
      step: batch.supply_chain.length + 1,
      entity: {
        type: 'processor',
        id: processorId,
        name: processor.fullName,
        location: processor.address?.city || 'Processing Facility'
      },
      action: 'process',
      date: new Date(),
      notes: `Processing: ${processType} - ${method}`
    });

    await batch.save();

    res.json({
      success: true,
      message: 'Processing step added successfully',
      data: batch
    });
  } catch (error) {
    console.error('Add processing step error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding processing step'
    });
  }
});

// @desc    Add quality test to batch
// @route   POST /api/processor/quality-test
// @access  Private (Processor, Admin)
router.post('/quality-test', authenticate, authorize('processor', 'admin'), [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('testType').isIn(['purity', 'moisture', 'heavy_metals', 'pesticide_residue', 'microbiological', 'potency', 'identity', 'other']).withMessage('Invalid test type'),
  body('results.status').isIn(['pass', 'fail', 'warning', 'pending']).withMessage('Invalid test status'),
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

    const { batchId, testType, testMethod, laboratory, results, certificate } = req.body;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Generate test ID
    const testId = `TEST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Add quality test
    batch.qualityTests.push({
      testId,
      testType,
      testDate: new Date(),
      laboratory,
      testMethod,
      results,
      certificate
    });

    // Update batch status based on test results
    if (results.status === 'pass') {
      if (batch.status === 'quality_testing') {
        batch.status = 'approved';
      }
    } else if (results.status === 'fail') {
      batch.status = 'quality_testing'; // Keep in testing for remedial action
    }

    await batch.save();

    res.json({
      success: true,
      message: 'Quality test added successfully',
      data: {
        testId,
        batch: batch
      }
    });
  } catch (error) {
    console.error('Add quality test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding quality test'
    });
  }
});

// @desc    Generate QR code for batch
// @route   POST /api/processor/generate-qr/:batchId
// @access  Private (Processor, Admin)
router.post('/generate-qr/:batchId', authenticate, authorize('processor', 'admin'), async (req, res) => {
  try {
    const { batchId } = req.params;
    const { packageInfo } = req.body;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Generate QR code data
    const qrData = {
      batchId: batch.batchId,
      productName: batch.product.name,
      harvestDate: batch.harvest.harvestDate,
      farmer: batch.farmer.farmerName,
      status: batch.status,
      traceUrl: `${process.env.FRONTEND_URL}/trace/${batch.batchId}`,
      verificationCode: uuidv4().slice(0, 8).toUpperCase(),
      generatedAt: new Date().toISOString()
    };

    // Generate QR code as base64
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update batch with QR code info
    batch.qrCode = `qr_${batchId}.png`;
    
    if (packageInfo) {
      batch.packaging = {
        packageDate: new Date(),
        ...packageInfo,
        qrCodeGenerated: true
      };
      batch.status = 'packaged';
    }

    await batch.save();

    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrCode: qrCodeDataURL,
        qrData,
        batch
      }
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating QR code'
    });
  }
});

// @desc    Get batches for processing
// @route   GET /api/processor/batches
// @access  Private (Processor, Admin)
router.get('/batches', authenticate, authorize('processor', 'admin'), async (req, res) => {
  try {
    const processorId = req.user.role === 'admin' ? req.query.processorId || req.user._id : req.user._id;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;

    let query = {};

    if (req.user.role !== 'admin') {
      // Show batches that are either assigned to this processor or available for processing
      query = {
        $or: [
          { 'processing.processorId': processorId },
          { status: { $in: ['harvested', 'in_processing'] } }
        ]
      };
    }

    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;
    const total = await Batch.countDocuments(query);

    const batches = await Batch.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate('farmer.farmerId', 'firstName lastName farmerProfile')
      .populate('processing.processorId', 'firstName lastName processorProfile');

    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.json({
      success: true,
      count: batches.length,
      total,
      pagination,
      data: batches
    });
  } catch (error) {
    console.error('Get processor batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batches'
    });
  }
});

// @desc    Get chain of custody for batch
// @route   GET /api/processor/chain-custody/:batchId
// @access  Private (Processor, Admin)
router.get('/chain-custody/:batchId', authenticate, authorize('processor', 'admin'), async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId })
      .populate('farmer.farmerId', 'firstName lastName farmerProfile')
      .populate('processing.processorId', 'firstName lastName processorProfile')
      .populate('supply_chain.entity.id', 'firstName lastName');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Build complete chain of custody
    const chainOfCustody = {
      batchInfo: {
        batchId: batch.batchId,
        productName: batch.product.name,
        harvestDate: batch.harvest.harvestDate,
        currentStatus: batch.status
      },
      farmer: {
        name: batch.farmer.farmerName,
        farmName: batch.farmer.farmName,
        location: batch.farmer.location,
        certifications: batch.farmer.farmerId?.farmerProfile?.certifications || []
      },
      supplyChain: batch.supply_chain.map((step, index) => ({
        stepNumber: step.step || index + 1,
        entity: step.entity,
        action: step.action,
        date: step.date,
        quantity: step.quantity,
        notes: step.notes,
        verification: step.verification
      })),
      processing: batch.processing.map(process => ({
        processor: process.processorId,
        processType: process.processType,
        date: process.date,
        method: process.method,
        equipment: process.equipment,
        qualityBefore: process.qualityBefore,
        qualityAfter: process.qualityAfter,
        notes: process.notes
      })),
      qualityTests: batch.qualityTests.map(test => ({
        testId: test.testId,
        testType: test.testType,
        date: test.testDate,
        laboratory: test.laboratory,
        results: test.results,
        certificate: test.certificate
      })),
      compliance: batch.compliance,
      sustainability: batch.sustainability
    };

    res.json({
      success: true,
      data: chainOfCustody
    });
  } catch (error) {
    console.error('Get chain of custody error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chain of custody'
    });
  }
});

// @desc    Transfer batch to next processor
// @route   POST /api/processor/transfer-batch
// @access  Private (Processor, Admin)
router.post('/transfer-batch', authenticate, authorize('processor', 'admin'), [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('toProcessorId').notEmpty().withMessage('Destination processor ID is required'),
  body('transferQuantity').isNumeric().withMessage('Transfer quantity must be a number'),
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

    const { batchId, toProcessorId, transferQuantity, notes } = req.body;
    const fromProcessorId = req.user._id;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    const toProcessor = await User.findById(toProcessorId);
    if (!toProcessor || toProcessor.role !== 'processor') {
      return res.status(404).json({
        success: false,
        message: 'Destination processor not found'
      });
    }

    // Add transfer to supply chain
    batch.supply_chain.push({
      step: batch.supply_chain.length + 1,
      entity: {
        type: 'processor',
        id: toProcessorId,
        name: toProcessor.fullName,
        location: toProcessor.address?.city || 'Processing Facility'
      },
      action: 'receive',
      date: new Date(),
      quantity: transferQuantity,
      notes: notes || `Transferred from ${req.user.fullName}`,
      verification: {
        verified: false,
        verifiedBy: '',
        verificationDate: null
      }
    });

    await batch.save();

    res.json({
      success: true,
      message: 'Batch transferred successfully',
      data: batch
    });
  } catch (error) {
    console.error('Transfer batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error transferring batch'
    });
  }
});

module.exports = router;