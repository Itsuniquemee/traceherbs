const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// GET /api/fhir/bundle/:batchId - return a FHIR-style provenance bundle
router.get('/bundle/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    // Construct simplified FHIR-like Bundle
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      id: `bundle-${batch.batchId}`,
      timestamp: new Date().toISOString(),
      entry: []
    };

    // CollectionEvent(s)
    (batch.collectionEvents || []).forEach((ev) => {
      bundle.entry.push({
        fullUrl: `urn:uuid:${ev.eventId}`,
        resource: {
          resourceType: 'CollectionEvent',
          id: ev.eventId,
          batchId: batch.batchId,
          capturedAt: ev.capturedAt,
          collectorType: ev.collectorType,
          source: ev.source,
          quantity: ev.quantity,
          coordinates: ev.coordinates,
          environment: ev.environment,
          proof: ev.ledger
        }
      });
    });

    // ProcessingStep(s)
    (batch.processing || []).forEach((p, idx) => {
      bundle.entry.push({
        fullUrl: `urn:uuid:proc-${idx}`,
        resource: {
          resourceType: 'ProcessingStep',
          id: `proc-${idx}`,
          batchId: batch.batchId,
          processType: p.processType,
          date: p.date,
          location: p.location,
          method: p.method,
          equipment: p.equipment,
          duration: p.duration,
          qualityBefore: p.qualityBefore,
          qualityAfter: p.qualityAfter
        }
      });
    });

    // QualityTest(s)
    (batch.qualityTests || []).forEach((qt, idx) => {
      bundle.entry.push({
        fullUrl: `urn:uuid:qt-${idx}`,
        resource: {
          resourceType: 'QualityTest',
          id: `qt-${idx}`,
          batchId: batch.batchId,
          testType: qt.testType,
          testDate: qt.testDate,
          laboratory: qt.laboratory,
          method: qt.testMethod,
          results: qt.results,
          certificate: qt.certificate
        }
      });
    });

    // Provenance
    bundle.entry.push({
      fullUrl: `urn:uuid:prov-${batch.batchId}`,
      resource: {
        resourceType: 'Provenance',
        id: `prov-${batch.batchId}`,
        target: [
          ...bundle.entry.map(e => ({ reference: e.fullUrl }))
        ],
        recorded: new Date().toISOString(),
        activity: {
          coding: [{ system: 'http://loinc.org', code: 'LA', display: 'Traceability' }]
        },
        entity: (batch.supply_chain || []).map((sc, i) => ({
          role: 'source',
          what: {
            display: `${sc.entity.type}:${sc.entity.name}`
          },
          agent: [{ who: { display: sc.entity.name } }]
        }))
      }
    });

    res.json({ success: true, data: bundle });
  } catch (error) {
    console.error('FHIR bundle error:', error);
    res.status(500).json({ success: false, message: 'Error generating FHIR bundle' });
  }
});

module.exports = router;