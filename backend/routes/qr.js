const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Batch = require('../models/Batch');
const qrService = require('../services/qrService');

async function buildQRPayload({ batchId, data }) {
  if (!batchId && !data) {
    const err = new Error('Batch ID or data is required');
    err.status = 400;
    throw err;
  }

  let qrData;
  if (batchId) {
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      const err = new Error('Batch not found');
      err.status = 404;
      throw err;
    }
    qrData = {
      batchId: batch.batchId,
      productName: batch.product.name,
      farmer: batch.farmer.farmerName,
      harvestDate: batch.harvest?.harvestDate,
      traceUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/trace/${batch.batchId}`,
      generatedAt: new Date().toISOString()
    };
  } else {
    qrData = data;
  }

  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' }
  });

  return { qrCodeDataURL, qrData };
}

// @desc    Generate QR code for batch
// @route   POST /api/qr/generate
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const { batchId } = req.body;
    
    if (!batchId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Batch ID is required' 
      });
    }

    const result = await qrService.generateQRForBatch(batchId);
    
    res.json({ 
      success: true, 
      data: {
        qrCode: result.qrCodeDataURL,
        qrData: result.qrData,
        traceUrl: result.traceUrl
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error generating QR code' 
    });
  }
});

// @desc    Generate QR code for batch by ID
// @route   POST /api/qr/generate/:batchId
// @access  Public
router.post('/generate/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const result = await qrService.generateQRForBatch(batchId);
    
    res.json({ 
      success: true, 
      data: {
        qrCode: result.qrCodeDataURL,
        qrData: result.qrData,
        traceUrl: result.traceUrl
      }
    });
  } catch (error) {
    console.error('QR generation error (by ID):', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error generating QR code' 
    });
  }
});

// @desc    Scan/verify QR code
// @route   POST /api/qr/scan
// @access  Public
router.post('/scan', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    // Verify QR code using the service
    const verificationResult = await qrService.verifyQR(qrData);
    
    // Record the scan if valid
    if (verificationResult.isValid && verificationResult.qrData?.batchId) {
      await qrService.recordScan(verificationResult.qrData.batchId, {
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }

    res.json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing QR code'
    });
  }
});

// @desc    Verify QR code authenticity
// @route   POST /api/qr/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    const verificationResult = await qrService.verifyQR(qrData);
    
    res.json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    console.error('QR verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying QR code'
    });
  }
});

// @desc    Get QR analytics for batch
// @route   GET /api/qr/analytics/:batchId
// @access  Public
router.get('/analytics/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const analytics = await qrService.getQRAnalytics(batchId);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('QR analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting QR analytics'
    });
  }
});

// @desc    Validate QR format (URL or JSON)
// @route   POST /api/qr/validate
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { qrCode } = req.body;
    if (!qrCode) return res.status(400).json({ success: false, message: 'qrCode is required' });

    let type = 'unknown';
    let isValid = false;
    if (typeof qrCode === 'string' && qrCode.startsWith('http')) {
      type = 'url';
      isValid = /\/trace\//.test(qrCode);
    } else {
      try {
        const parsed = JSON.parse(qrCode);
        type = 'json';
        isValid = !!parsed;
      } catch (e) {
        isValid = false;
      }
    }

    res.json({ success: true, data: { type, isValid } });
  } catch (error) {
    console.error('QR validate error:', error);
    res.status(500).json({ success: false, message: 'Error validating QR code' });
  }
});

module.exports = router;
