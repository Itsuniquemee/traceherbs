const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// @desc    Get trace information for a batch
// @route   GET /api/trace/:batchId
// @access  Public
router.get('/:batchId', async (req, res) => {
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

    // Check visibility
    if (batch.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This product information is not publicly available'
      });
    }

    // Build complete trace timeline
    const timeline = [];

    // Add harvest event
    timeline.push({
      step: 1,
      label: 'Harvested',
      date: batch.harvest?.harvestDate,
      location: batch.farmer.location?.address || batch.farmer.location?.region,
      entity: batch.farmer.farmerName,
      status: 'completed',
      icon: '🌱',
      details: {
        quantity: batch.harvest?.quantity,
        quality: batch.harvest?.quality,
        method: batch.cultivation?.farmingMethod
      }
    });

    // Add processing steps
    if (batch.processing && batch.processing.length > 0) {
      batch.processing.forEach((process, index) => {
        timeline.push({
          step: timeline.length + 1,
          label: `${process.processType} Processing`,
          date: process.date,
          location: process.location,
          entity: process.processorId?.firstName || 'Processor',
          status: 'completed',
          icon: '⚙️',
          details: {
            method: process.method,
            equipment: process.equipment,
            duration: process.duration,
            qualityBefore: process.qualityBefore,
            qualityAfter: process.qualityAfter
          }
        });
      });
    }

    // Add quality testing
    if (batch.qualityTests && batch.qualityTests.length > 0) {
      const latestTest = batch.qualityTests[batch.qualityTests.length - 1];
      timeline.push({
        step: timeline.length + 1,
        label: 'Quality Tested',
        date: latestTest.testDate,
        location: latestTest.laboratory?.name || 'Testing Lab',
        entity: latestTest.laboratory?.name || 'Quality Lab',
        status: latestTest.results.status === 'pass' ? 'completed' : 'warning',
        icon: '🧪',
        details: {
          testType: latestTest.testType,
          result: latestTest.results.status,
          value: latestTest.results.value
        }
      });
    }

    // Add packaging if available
    if (batch.packaging && batch.packaging.packageDate) {
      timeline.push({
        step: timeline.length + 1,
        label: 'Packaged',
        date: batch.packaging.packageDate,
        location: 'Packaging Facility',
        entity: 'Packaging Team',
        status: 'completed',
        icon: '📦',
        details: {
          packageType: batch.packaging.packageType,
          packageSize: batch.packaging.packageSize
        }
      });
    }

    // Current status
    const currentStatus = batch.status;
    if (['shipped', 'delivered'].includes(currentStatus)) {
      timeline.push({
        step: timeline.length + 1,
        label: currentStatus === 'shipped' ? 'Shipped' : 'Delivered',
        date: new Date(), // In real system, would be actual ship/delivery date
        location: 'Distribution Center',
        entity: 'Logistics Team',
        status: currentStatus === 'delivered' ? 'completed' : 'in-progress',
        icon: currentStatus === 'shipped' ? '🚚' : '📍'
      });
    }

    // Build geographic path
    const geoPath = [];
    if (batch.farmer.location?.coordinates) {
      geoPath.push([
        batch.farmer.location.coordinates.latitude,
        batch.farmer.location.coordinates.longitude
      ]);
    }

    // Add processing locations if available
    batch.supply_chain?.forEach(step => {
      if (step.entity.location && step.entity.coordinates) {
        geoPath.push([step.entity.coordinates.latitude, step.entity.coordinates.longitude]);
      }
    });

    res.json({
      success: true,
      data: {
        batchId: batch.batchId,
        product: {
          name: batch.product.name,
          scientificName: batch.product.scientificName,
          category: batch.product.category,
          description: batch.product.description
        },
        farmer: {
          name: batch.farmer.farmerName,
          farmName: batch.farmer.farmName,
          region: batch.farmer.location?.region,
          story: batch.farmer.farmerId?.farmerProfile?.story || 
                 `${batch.farmer.farmerName} has been cultivating ${batch.product.name} with care and dedication.`
        },
        timeline,
        geoPath,
        qualityResults: batch.qualityTests?.map(test => ({
          test: test.testType,
          value: test.results.value,
          unit: test.results.unit,
          status: test.results.status,
          date: test.testDate
        })) || [],
        sustainability: {
          farmingMethod: batch.cultivation?.farmingMethod,
          certifications: batch.cultivation?.certifications || [],
          sustainabilityScore: batch.sustainability?.sustainabilityScore,
          carbonFootprint: batch.sustainability?.carbonFootprint
        },
        status: batch.status,
        visibility: batch.visibility
      }
    });
  } catch (error) {
    console.error('Trace error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trace information'
    });
  }
});

// @desc    Get trace summary for multiple batches
// @route   POST /api/trace/batch-summary
// @access  Public
router.post('/batch-summary', async (req, res) => {
  try {
    const { batchIds } = req.body;

    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Array of batch IDs is required'
      });
    }

    const batches = await Batch.find({ 
      batchId: { $in: batchIds },
      visibility: { $ne: 'private' }
    }).select('batchId product.name farmer.farmerName status harvest.harvestDate');

    const summaries = batches.map(batch => ({
      batchId: batch.batchId,
      productName: batch.product.name,
      farmer: batch.farmer.farmerName,
      status: batch.status,
      harvestDate: batch.harvest?.harvestDate
    }));

    res.json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    console.error('Batch summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch summaries'
    });
  }
});

module.exports = router;