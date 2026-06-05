const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const Batch = require('../models/Batch');
const ledger = require('../services/ledger');
const { v4: uuidv4 } = require('uuid');

// POST /api/collection - record a geo-tagged collection event
router.post('/', authenticate, authorize('farmer', 'processor', 'admin'), [
  body('batchId').notEmpty().withMessage('batchId is required'),
  body('coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('latitude invalid'),
  body('coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude invalid'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    }

    const { batchId, coordinates, environment, quantity, notes, source, collectorType } = req.body;
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const event = {
      eventId: `CE_${uuidv4()}`,
      collectorType: collectorType || (req.user.role === 'farmer' ? 'farmer' : 'wild_collector'),
      source: source || 'mobile',
      coordinates,
      environment: environment || {},
      quantity: quantity || {},
      notes: notes || '',
      capturedAt: new Date()
    };

    // Append basic ledger proof (stubbed)
    const proof = await ledger.recordEvent('CollectionEvent', {
      batchId,
      eventId: event.eventId,
      coordinates,
      environment,
      timestamp: event.capturedAt
    });
    event.ledger = proof;

    batch.collectionEvents.push(event);

    // Also append to supply_chain for visibility
    batch.supply_chain.push({
      step: batch.supply_chain.length + 1,
      entity: {
        type: event.collectorType === 'farmer' ? 'farmer' : 'collector',
        id: req.user._id,
        name: req.user.fullName,
        location: batch.farmer.location?.address || 'Field',
        coordinates: { latitude: coordinates.latitude, longitude: coordinates.longitude }
      },
      action: 'collect',
      date: event.capturedAt,
      quantity: quantity?.amount,
      notes: notes || 'Geo-tagged collection event',
      documents: []
    });

    await batch.save();

    res.status(201).json({ success: true, message: 'Collection event recorded', data: event });
  } catch (error) {
    console.error('Create collection event error:', error);
    res.status(500).json({ success: false, message: 'Error recording collection event' });
  }
});

// GET /api/collection - list collection events (by batch)
router.get('/', authenticate, authorize('farmer', 'processor', 'admin', 'regulator'), async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'batchId query is required' });
    }

    const batch = await Batch.findOne({ batchId }).select('batchId collectionEvents');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    res.json({ success: true, count: batch.collectionEvents.length, data: batch.collectionEvents });
  } catch (error) {
    console.error('List collection events error:', error);
    res.status(500).json({ success: false, message: 'Error fetching collection events' });
  }
});

module.exports = router;