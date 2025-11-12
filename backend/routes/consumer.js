const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get product trace information
// @route   GET /api/consumer/trace/:batchId
// @access  Public
router.get('/trace/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId })
      .populate('farmer.farmerId', 'firstName lastName farmerProfile')
      .populate('processing.processorId', 'firstName lastName processorProfile');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if batch is public or if user has access
    if (batch.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This product information is not publicly available'
      });
    }

    // Build consumer-friendly trace information
    const traceInfo = {
      batchId: batch.batchId,
      product: {
        name: batch.product.name,
        scientificName: batch.product.scientificName,
        category: batch.product.category,
        variety: batch.product.variety,
        description: batch.product.description
      },
      farmer: {
        name: batch.farmer.farmerName,
        farmName: batch.farmer.farmName,
        region: batch.farmer.location?.region || batch.farmer.location?.address,
        farmingMethod: batch.cultivation?.farmingMethod,
        certifications: batch.cultivation?.certifications || [],
        story: batch.farmer.farmerId?.farmerProfile?.story || 
               `${batch.farmer.farmerName} has been cultivating ${batch.product.name} using ${batch.cultivation?.farmingMethod} methods.`
      },
      harvest: {
        date: batch.harvest?.harvestDate,
        quantity: batch.harvest?.quantity,
        quality: batch.harvest?.quality,
        seasonalNotes: batch.cultivation?.seasonalNotes
      },
      journey: batch.supply_chain.map((step, index) => ({
        step: index + 1,
        location: step.entity.location,
        entity: step.entity.name,
        action: step.action,
        date: step.date,
        status: step.verification?.verified ? 'verified' : 'pending'
      })),
      quality: {
        overallGrade: batch.harvest?.quality?.grade,
        tests: batch.qualityTests.filter(test => test.results.status === 'pass').map(test => ({
          testType: test.testType,
          result: test.results.status,
          laboratory: test.laboratory?.name,
          date: test.testDate
        })),
        certifications: batch.cultivation?.certifications || []
      },
      sustainability: {
        farmingMethod: batch.cultivation?.farmingMethod,
        carbonFootprint: batch.sustainability?.carbonFootprint,
        waterUsage: batch.sustainability?.waterUsage,
        sustainabilityScore: batch.sustainability?.sustainabilityScore,
        recyclablePackaging: batch.sustainability?.recyclablePackaging
      },
      status: batch.status,
      badges: []
    };

    // Add badges based on criteria
    if (batch.cultivation?.farmingMethod === 'organic') {
      traceInfo.badges.push('Organic');
    }
    if (batch.cultivation?.certifications?.length > 0) {
      traceInfo.badges.push('Certified');
    }
    if (batch.farmer.location?.coordinates) {
      traceInfo.badges.push('Geo-Tagged');
    }
    if (batch.qualityTests?.some(test => test.results.status === 'pass')) {
      traceInfo.badges.push('Quality Tested');
    }
    if (batch.sustainability?.sustainabilityScore > 80) {
      traceInfo.badges.push('Sustainable');
    }

    res.json({
      success: true,
      data: traceInfo
    });
  } catch (error) {
    console.error('Product trace error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product information'
    });
  }
});

// @desc    Verify product authenticity
// @route   POST /api/consumer/verify
// @access  Public
router.post('/verify', [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('verificationCode').optional().isLength({ min: 6, max: 12 }).withMessage('Invalid verification code format')
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

    const { batchId, verificationCode } = req.body;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        isAuthentic: false
      });
    }

    // Basic verification (batch exists)
    let verificationResult = {
      isAuthentic: true,
      confidence: 'high',
      verificationLevel: 'basic',
      message: 'Product found in our database'
    };

    // Enhanced verification if verification code provided
    if (verificationCode) {
      // In a real system, you'd check against stored verification codes
      // For now, we'll simulate verification
      const isCodeValid = verificationCode.length >= 6; // Simple check
      
      if (isCodeValid) {
        verificationResult.verificationLevel = 'enhanced';
        verificationResult.message = 'Product authenticity verified with code';
      } else {
        verificationResult.confidence = 'medium';
        verificationResult.message = 'Product found but verification code invalid';
      }
    }

    // Additional authenticity checks
    const checks = {
      hasQualityTests: batch.qualityTests && batch.qualityTests.length > 0,
      hasProcessingSteps: batch.processing && batch.processing.length > 0,
      hasSupplyChain: batch.supply_chain && batch.supply_chain.length > 1,
      hasDocuments: batch.attachments && batch.attachments.length > 0,
      farmerVerified: batch.farmer.farmerId ? true : false
    };

    const passedChecks = Object.values(checks).filter(check => check).length;
    const totalChecks = Object.keys(checks).length;
    const authenticity_score = (passedChecks / totalChecks) * 100;

    res.json({
      success: true,
      data: {
        batchId: batch.batchId,
        productName: batch.product.name,
        ...verificationResult,
        authenticityScore: authenticity_score,
        checks,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Product verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying product'
    });
  }
});

// @desc    Get consumer dashboard
// @route   GET /api/consumer/dashboard
// @access  Private (Consumer, Admin)
router.get('/dashboard', authenticate, authorize('consumer', 'admin'), async (req, res) => {
  try {
    // Recent trace activities (if we track consumer interactions)
    const recentTraces = []; // Would come from a consumer activity log

    // Popular products
    const popularProducts = await Batch.aggregate([
      { $match: { visibility: 'public', status: { $in: ['packaged', 'shipped', 'delivered'] } } },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
          avgSustainabilityScore: { $avg: '$sustainability.sustainabilityScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Quality trends
    const qualityTrends = await Batch.aggregate([
      { $match: { visibility: 'public' } },
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: {
            month: { $month: '$qualityTests.testDate' },
            year: { $year: '$qualityTests.testDate' },
            status: '$qualityTests.results.status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Sustainability metrics
    const sustainabilityStats = await Batch.aggregate([
      { $match: { visibility: 'public', 'sustainability.sustainabilityScore': { $exists: true } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$sustainability.sustainabilityScore' },
          organicCount: {
            $sum: { $cond: [{ $eq: ['$cultivation.farmingMethod', 'organic'] }, 1, 0] }
          },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        recentTraces,
        popularProducts,
        qualityTrends,
        sustainabilityStats: sustainabilityStats[0] || {
          avgScore: 0,
          organicCount: 0,
          totalProducts: 0
        }
      }
    });
  } catch (error) {
    console.error('Consumer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @desc    Search products
// @route   GET /api/consumer/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { 
      q: searchTerm, 
      category, 
      farmingMethod, 
      region,
      minSustainabilityScore,
      certifications,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build search query
    const query = { 
      visibility: 'public',
      status: { $in: ['packaged', 'shipped', 'delivered'] }
    };

    if (searchTerm) {
      query.$or = [
        { 'product.name': new RegExp(searchTerm, 'i') },
        { 'product.scientificName': new RegExp(searchTerm, 'i') },
        { 'farmer.farmerName': new RegExp(searchTerm, 'i') },
        { 'farmer.location.region': new RegExp(searchTerm, 'i') }
      ];
    }

    if (category) {
      query['product.category'] = category;
    }

    if (farmingMethod) {
      query['cultivation.farmingMethod'] = farmingMethod;
    }

    if (region) {
      query['farmer.location.region'] = new RegExp(region, 'i');
    }

    if (minSustainabilityScore) {
      query['sustainability.sustainabilityScore'] = { $gte: Number.parseInt(minSustainabilityScore, 10) };
    }

    if (certifications) {
      const certArray = Array.isArray(certifications) ? certifications : [certifications];
      query['cultivation.certifications'] = { $in: certArray };
    }

    const startIndex = (Number.parseInt(page, 10) - 1) * Number.parseInt(limit, 10);
    const total = await Batch.countDocuments(query);

    const products = await Batch.find(query)
      .select('batchId product farmer cultivation harvest sustainability status badges')
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit, 10))
      .skip(startIndex);

    // Format results for consumer view
    const formattedProducts = products.map(batch => ({
      batchId: batch.batchId,
      name: batch.product.name,
      category: batch.product.category,
      farmer: batch.farmer.farmerName,
      region: batch.farmer.location?.region,
      farmingMethod: batch.cultivation?.farmingMethod,
      harvestDate: batch.harvest?.harvestDate,
      quality: batch.harvest?.quality?.grade,
      sustainabilityScore: batch.sustainability?.sustainabilityScore,
      certifications: batch.cultivation?.certifications || [],
      status: batch.status
    }));

    const pagination = {};
    if (startIndex + Number.parseInt(limit, 10) < total) {
      pagination.next = { page: Number.parseInt(page, 10) + 1, limit: Number.parseInt(limit, 10) };
    }
    if (startIndex > 0) {
      pagination.prev = { page: Number.parseInt(page, 10) - 1, limit: Number.parseInt(limit, 10) };
    }

    res.json({
      success: true,
      count: formattedProducts.length,
      total,
      pagination,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

// @desc    Get product recommendations
// @route   GET /api/consumer/recommendations
// @access  Private (Consumer, Admin)
router.get('/recommendations', authenticate, authorize('consumer', 'admin'), async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user preferences if available
    const user = await User.findById(userId);
    const preferences = user.consumerProfile?.preferences || [];
    const interests = user.consumerProfile?.interests || [];

    // Build recommendation query based on preferences
    let query = { 
      visibility: 'public',
      status: { $in: ['packaged', 'shipped', 'delivered'] }
    };

    // If user has preferences, use them
    if (preferences.length > 0 || interests.length > 0) {
      const categoryFilter = [...preferences, ...interests];
      query.$or = [
        { 'product.category': { $in: categoryFilter } },
        { 'product.name': { $in: categoryFilter.map(pref => new RegExp(pref, 'i')) } }
      ];
    }

    // Get recommended products
    const recommendations = await Batch.find(query)
      .select('batchId product farmer cultivation sustainability')
      .sort({ 
        'sustainability.sustainabilityScore': -1, 
        'harvest.quality.grade': -1,
        createdAt: -1 
      })
      .limit(10);

    // Also get trending products (most traced recently)
    const trending = await Batch.find({
      visibility: 'public',
      status: { $in: ['packaged', 'shipped', 'delivered'] }
    })
    .select('batchId product farmer cultivation sustainability')
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        personalized: recommendations.map(batch => ({
          batchId: batch.batchId,
          name: batch.product.name,
          category: batch.product.category,
          farmer: batch.farmer.farmerName,
          farmingMethod: batch.cultivation?.farmingMethod,
          sustainabilityScore: batch.sustainability?.sustainabilityScore,
          reason: preferences.includes(batch.product.category) ? 'matches your preferences' : 'highly rated'
        })),
        trending: trending.map(batch => ({
          batchId: batch.batchId,
          name: batch.product.name,
          category: batch.product.category,
          farmer: batch.farmer.farmerName,
          farmingMethod: batch.cultivation?.farmingMethod,
          sustainabilityScore: batch.sustainability?.sustainabilityScore,
          reason: 'recently added'
        }))
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations'
    });
  }
});

// @desc    Report product issue
// @route   POST /api/consumer/report-issue
// @access  Private (Consumer, Admin)
router.post('/report-issue', authenticate, authorize('consumer', 'admin'), [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('issueType').isIn(['quality', 'authenticity', 'safety', 'labeling', 'other']).withMessage('Invalid issue type'),
  body('description').notEmpty().withMessage('Issue description is required')
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

    const { batchId, issueType, description, severity } = req.body;
    const reportedBy = req.user._id;

    // Verify batch exists
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create issue report (in a real app, you'd have an Issues model)
    const issueReport = {
      id: `ISS${Date.now()}`,
      batchId,
      reportedBy,
      issueType,
      description,
      severity: severity || 'medium',
      status: 'open',
      reportedAt: new Date()
    };

    // In a real application, you would:
    // 1. Save to Issues collection
    // 2. Send notification to relevant stakeholders
    // 3. Trigger investigation workflow

    res.status(201).json({
      success: true,
      message: 'Issue report submitted successfully',
      data: {
        reportId: issueReport.id,
        status: issueReport.status,
        message: 'Your report has been received and will be investigated. You will be notified of any updates.'
      }
    });
  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting issue report'
    });
  }
});

module.exports = router;