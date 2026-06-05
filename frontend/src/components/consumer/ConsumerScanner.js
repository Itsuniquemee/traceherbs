import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, QrCode, Search, MapPin, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { qrAPI } from '../../config/api';
import { toast } from 'react-hot-toast';

const ConsumerScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      productName: 'Organic Turmeric Powder',
      batchId: 'TUR2024001',
      scanDate: '2024-01-20',
      status: 'authentic',
      location: 'Rajasthan, India'
    },
    {
      id: 2,
      productName: 'Ashwagandha Extract',
      batchId: 'ASH2024002',
      scanDate: '2024-01-19',
      status: 'authentic',
      location: 'Kerala, India'
    }
  ]);

  const handleScan = async (scannedQRData = null) => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      // Use provided QR data or simulate for demo
      const qrDataToVerify = scannedQRData || JSON.stringify({
        batchId: 'TUR2024001',
        productName: 'Organic Turmeric Powder',
        farmer: 'Rajesh Kumar',
        harvestDate: '2024-01-10',
        timestamp: Date.now(),
        systemGenerated: true,
        signature: 'demo-signature-for-testing'
      });
      
      // Verify QR with backend
      const response = await qrAPI.verifyQR(qrDataToVerify);
      
      if (response.success) {
        const verification = response.data;
        
        if (verification.isValid && verification.isSystemGenerated) {
          // Valid system-generated QR
          const batchData = verification.batchData;
          
          setScanResult({
            isValid: true,
            isSystemGenerated: true,
            productName: batchData?.product?.name || verification.qrData.productName,
            batchId: verification.qrData.batchId,
            status: 'authentic',
            farmer: batchData?.farmer?.farmerName || verification.qrData.farmer,
            location: batchData?.farmer?.location?.address || 'Rajasthan, India',
            harvestDate: batchData?.harvest?.harvestDate || verification.qrData.harvestDate,
            qualityScore: 95,
            verificationTime: verification.verificationTime,
            scanCount: batchData?.scanCount || 0,
            batchDetails: batchData
          });
          
          toast.success('QR code verified successfully!');
        } else {
          // Invalid or non-system QR
          setScanResult({
            isValid: false,
            isSystemGenerated: verification.isSystemGenerated,
            error: verification.error || 'Invalid QR code',
            status: 'invalid'
          });
          
          toast.error(verification.error || 'QR code verification failed');
        }
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error('QR scanning error:', error);
      
      setScanResult({
        isValid: false,
        isSystemGenerated: false,
        error: 'Failed to verify QR code',
        status: 'error'
      });
      
      toast.error('Failed to scan QR code. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Scanner</h1>
        <p className="text-muted-foreground">
          Scan QR codes to verify product authenticity and trace origins
        </p>
      </motion.div>

      {/* Scanner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-8 text-center"
      >
        <div className="space-y-6">
          <div className="relative">
            <div className="w-48 h-48 mx-auto border-4 border-dashed border-primary rounded-lg flex items-center justify-center">
              {isScanning ? (
                <div className="animate-pulse">
                  <Camera className="h-16 w-16 text-primary" />
                </div>
              ) : (
                <QrCode className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              {isScanning ? 'Scanning...' : 'Ready to Scan'}
            </h2>
            <p className="text-muted-foreground mb-6">
              Position the QR code within the camera frame
            </p>

            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scan Result */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card border rounded-lg p-6 ${
            scanResult.isValid 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            {scanResult.isValid ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {scanResult.isValid ? 'Verified Product' : 'Verification Failed'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {scanResult.isSystemGenerated ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    System Generated
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Not System Generated
                  </span>
                )}
              </div>
            </div>
          </div>

          {scanResult.isValid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product</label>
                  <p className="text-foreground font-medium">{scanResult.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Batch ID</label>
                  <p className="text-foreground font-medium">{scanResult.batchId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Farmer</label>
                  <p className="text-foreground font-medium">{scanResult.farmer}</p>
                </div>
                {scanResult.verificationTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verified At</label>
                    <p className="text-foreground text-sm">{new Date(scanResult.verificationTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{scanResult.location}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Harvest Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{scanResult.harvestDate}</span>
                  </div>
                </div>
                {scanResult.qualityScore && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quality Score</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${scanResult.qualityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-foreground font-medium">{scanResult.qualityScore}%</span>
                    </div>
                  </div>
                )}
                {scanResult.scanCount !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Scans</label>
                    <p className="text-foreground">{scanResult.scanCount} times</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Verification Error</h4>
                  <p className="text-red-700 text-sm mt-1">
                    {scanResult.error || 'This QR code could not be verified as authentic.'}
                  </p>
                  {!scanResult.isSystemGenerated && (
                    <p className="text-red-600 text-sm mt-2 font-medium">
                      ⚠️ This QR code was not generated by our system. Please verify the product source.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Scan History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Scans</h3>
        <div className="space-y-3">
          {scanHistory.map((scan) => (
            <div key={scan.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">{scan.productName}</p>
                  <p className="text-sm text-muted-foreground">Batch: {scan.batchId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{scan.scanDate}</p>
                <p className="text-xs text-muted-foreground">{scan.location}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ConsumerScanner;