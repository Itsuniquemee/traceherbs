const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Generate production report
// @route   GET /api/reports/production
// @access  Private
router.get('/production', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const query = {};
    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    const productionData = await Batch.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            category: '$product.category'
          },
          totalBatches: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' },
          avgQuality: { $avg: { $switch: { 
            branches: [
              { case: { $eq: ['$harvest.quality.grade', 'A+'] }, then: 5 },
              { case: { $eq: ['$harvest.quality.grade', 'A'] }, then: 4 },
              { case: { $eq: ['$harvest.quality.grade', 'B+'] }, then: 3 },
              { case: { $eq: ['$harvest.quality.grade', 'B'] }, then: 2 },
              { case: { $eq: ['$harvest.quality.grade', 'C'] }, then: 1 }
            ],
            default: 0
          }}}
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    if (format === 'csv') {
      // Convert to CSV format
      const csv = [
        'Year,Month,Category,Total Batches,Total Quantity,Average Quality',
        ...productionData.map(row => 
          `${row._id.year},${row._id.month},${row._id.category},${row.totalBatches},${row.totalQuantity},${row.avgQuality.toFixed(2)}`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="production_report.csv"');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: productionData
    });
  } catch (error) {
    console.error('Production report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating production report'
    });
  }
});

// @desc    Generate quality report
// @route   GET /api/reports/quality
// @access  Private
router.get('/quality', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage['qualityTests.testDate'] = dateFilter;
    }

    const qualityData = await Batch.aggregate([
      { $match: matchStage },
      { $unwind: '$qualityTests' },
      {
        $group: {
          _id: {
            testType: '$qualityTests.testType',
            status: '$qualityTests.results.status'
          },
          count: { $sum: 1 },
          batches: { $addToSet: '$batchId' }
        }
      },
      {
        $group: {
          _id: '$_id.testType',
          results: {
            $push: {
              status: '$_id.status',
              count: '$count',
              batches: '$batches'
            }
          },
          totalTests: { $sum: '$count' }
        }
      }
    ]);

    res.json({
      success: true,
      data: qualityData
    });
  } catch (error) {
    console.error('Quality report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating quality report'
    });
  }
});

// @desc    Generate farmer performance report
// @route   GET /api/reports/farmer-performance
// @access  Private
router.get('/farmer-performance', authenticate, authorize('admin', 'processor', 'regulator'), async (req, res) => {
  try {
    const farmerPerformance = await Batch.aggregate([
      {
        $group: {
          _id: '$farmer.farmerId',
          farmerName: { $first: '$farmer.farmerName' },
          totalBatches: { $sum: 1 },
          totalQuantity: { $sum: '$harvest.quantity.amount' },
          avgQuality: { $avg: { $switch: { 
            branches: [
              { case: { $eq: ['$harvest.quality.grade', 'A+'] }, then: 5 },
              { case: { $eq: ['$harvest.quality.grade', 'A'] }, then: 4 },
              { case: { $eq: ['$harvest.quality.grade', 'B+'] }, then: 3 },
              { case: { $eq: ['$harvest.quality.grade', 'B'] }, then: 2 },
              { case: { $eq: ['$harvest.quality.grade', 'C'] }, then: 1 }
            ],
            default: 0
          }}},
          organicPercentage: {
            $avg: { $cond: [{ $eq: ['$cultivation.farmingMethod', 'organic'] }, 100, 0] }
          },
          sustainabilityScore: { $avg: '$sustainability.sustainabilityScore' }
        }
      },
      { $sort: { avgQuality: -1, totalQuantity: -1 } }
    ]);

    res.json({
      success: true,
      data: farmerPerformance
    });
  } catch (error) {
    console.error('Farmer performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating farmer performance report'
    });
  }
});

module.exports = router;