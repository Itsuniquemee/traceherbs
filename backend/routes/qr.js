const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Batch = require('../models/Batch');

// @desc    Generate QR code for batch
// @route   POST /api/qr/generate
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const { batchId, data } = req.body;

    if (!batchId && !data) {
      return res.status(400).json({
        success: false,
        message: 'Batch ID or data is required'
      });
    }

    let qrData;
    
    if (batchId) {
      // Get batch data for QR code
      const batch = await Batch.findOne({ batchId });
      if (!batch) {
        return res.status(404).json({
          success: false,
          message: 'Batch not found'
        });
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

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        qrData
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating QR code'
    });
  }
});

// @desc    Scan/decode QR code
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

    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR data format'
      });
    }

    // If it contains a batchId, get full batch information
    if (decodedData.batchId) {
      const batch = await Batch.findOne({ batchId: decodedData.batchId })
        .populate('farmer.farmerId', 'firstName lastName')
        .select('batchId product farmer harvest status qualityTests sustainability');

      if (batch) {
        res.json({
          success: true,
          data: {
            decoded: decodedData,
            batch,
            isValid: true
          }
        });
      } else {
        res.json({
          success: true,
          data: {
            decoded: decodedData,
            batch: null,
            isValid: false,
            message: 'Batch not found in database'
          }
        });
      }
    } else {
      res.json({
        success: true,
        data: {
          decoded: decodedData,
          isValid: true
        }
      });
    }
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing QR code'
    });
  }
});

module.exports = router;