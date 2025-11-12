const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
router.get('/overview', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Production analytics
    const productionStats = await Batch.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalBatches: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' },
          avgQuality: { $avg: { $switch: { 
            branches: [
              { case: { $eq: ['$harvest.quality.grade', 'A+'] }, then: 100 },
              { case: { $eq: ['$harvest.quality.grade', 'A'] }, then: 90 },
              { case: { $eq: ['$harvest.quality.grade', 'B+'] }, then: 80 },
              { case: { $eq: ['$harvest.quality.grade', 'B'] }, then: 70 },
              { case: { $eq: ['$harvest.quality.grade', 'C'] }, then: 60 }
            ],
            default: 0
          }}},
          organicPercentage: {
            $avg: { $cond: [{ $eq: ['$cultivation.farmingMethod', 'organic'] }, 100, 0] }
          }
        }
      }
    ]);

    // Category distribution
    const categoryStats = await Batch.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Regional analysis
    const regionalStats = await Batch.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$farmer.location.state',
          batchCount: { $sum: 1 },
          farmerCount: { $addToSet: '$farmer.farmerId' },
          totalQuantity: { $sum: '$harvest.quantity.amount' }
        }
      },
      {
        $project: {
          _id: 1,
          batchCount: 1,
          farmerCount: { $size: '$farmerCount' },
          totalQuantity: 1
        }
      },
      { $sort: { batchCount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        production: productionStats[0] || {},
        categories: categoryStats,
        regions: regionalStats,
        period
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// @desc    Get quality analytics
// @route   GET /api/analytics/quality
// @access  Private
router.get('/quality', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    // Quality test results over time
    const qualityTrends = await Batch.aggregate([
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m', date: '$qualityTests.testDate' } },
            testType: '$qualityTests.testType',
            status: '$qualityTests.results.status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Quality by farming method
    const qualityByMethod = await Batch.aggregate([
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: {
            farmingMethod: '$cultivation.farmingMethod',
            status: '$qualityTests.results.status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top performing farmers
    const topFarmers = await Batch.aggregate([
      { $unwind: '$qualityTests' },
      { $match: { 'qualityTests.results.status': 'pass' } },
      {
        $group: {
          _id: '$farmer.farmerId',
          farmerName: { $first: '$farmer.farmerName' },
          passedTests: { $sum: 1 },
          avgSustainability: { $avg: '$sustainability.sustainabilityScore' }
        }
      },
      { $sort: { passedTests: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        trends: qualityTrends,
        byFarmingMethod: qualityByMethod,
        topFarmers
      }
    });
  } catch (error) {
    console.error('Quality analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quality analytics' });
  }
});

// @desc    Get supply chain analytics
// @route   GET /api/analytics/supply-chain
// @access  Private
router.get('/supply-chain', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    // Supply chain efficiency
    const supplyChainMetrics = await Batch.aggregate([
      {
        $project: {
          batchId: 1,
          'product.name': 1,
          supplyChainLength: { $size: '$supply_chain' },
          startDate: { $arrayElemAt: ['$supply_chain.date', 0] },
          endDate: { $arrayElemAt: ['$supply_chain.date', -1] }
        }
      },
      {
        $project: {
          batchId: 1,
          'product.name': 1,
          supplyChainLength: 1,
          durationDays: {
            $divide: [
              { $subtract: ['$endDate', '$startDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgChainLength: { $avg: '$supplyChainLength' },
          avgDuration: { $avg: '$durationDays' },
          minDuration: { $min: '$durationDays' },
          maxDuration: { $max: '$durationDays' }
        }
      }
    ]);

    // Processing step distribution
    const processingSteps = await Batch.aggregate([
      { $unwind: '$processing' },
      {
        $group: {
          _id: '$processing.processType',
          count: { $sum: 1 },
          avgDuration: { $avg: { $toDouble: '$processing.duration' } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        metrics: supplyChainMetrics[0] || {},
        processingSteps
      }
    });
  } catch (error) {
    console.error('Supply chain analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching supply chain analytics' });
  }
});

// @desc    Get sustainability metrics
// @route   GET /api/analytics/sustainability
// @access  Private
router.get('/sustainability', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    // Sustainability scores by category
    const sustainabilityByCategory = await Batch.aggregate([
      { $match: { 'sustainability.sustainabilityScore': { $exists: true } } },
      {
        $group: {
          _id: '$product.category',
          avgScore: { $avg: '$sustainability.sustainabilityScore' },
          count: { $sum: 1 },
          avgCarbonFootprint: { $avg: '$sustainability.carbonFootprint' },
          avgWaterUsage: { $avg: '$sustainability.waterUsage' }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    // Organic vs conventional comparison
    const farmingMethodComparison = await Batch.aggregate([
      {
        $group: {
          _id: '$cultivation.farmingMethod',
          count: { $sum: 1 },
          avgSustainabilityScore: { $avg: '$sustainability.sustainabilityScore' },
          avgYield: { $avg: '$harvest.quantity.amount' }
        }
      }
    ]);

    // Carbon footprint trends
    const carbonTrends = await Batch.aggregate([
      { $match: { 'sustainability.carbonFootprint': { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          avgCarbon: { $avg: '$sustainability.carbonFootprint' },
          batchCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        byCategory: sustainabilityByCategory,
        byFarmingMethod: farmingMethodComparison,
        carbonTrends
      }
    });
  } catch (error) {
    console.error('Sustainability analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching sustainability analytics' });
  }
});

module.exports = router;