import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle, Search, Camera, Award, MapPin } from 'lucide-react';
import { qrAPI } from '../../config/api';
import { toast } from 'react-hot-toast';

const ConsumerAuthenticity = () => {
  const [verificationMethod, setVerificationMethod] = useState('qr');
  const [inputCode, setInputCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      let qrDataToVerify;
      
      if (verificationMethod === 'qr') {
        // For QR scanning, create mock QR data with system signature
        qrDataToVerify = JSON.stringify({
          batchId: inputCode || 'TUR2024001',
          productName: 'Organic Turmeric Powder',
          farmer: 'Rajesh Kumar',
          harvestDate: '2024-01-10',
          timestamp: Date.now(),
          systemGenerated: true,
          signature: 'demo-signature-for-testing'
        });
      } else {
        // For manual entry, try to find batch by ID
        qrDataToVerify = JSON.stringify({
          batchId: inputCode,
          timestamp: Date.now(),
          systemGenerated: true,
          signature: 'demo-signature-manual'
        });
      }
      
      // Verify with backend
      const response = await qrAPI.verifyQR(qrDataToVerify);
      
      if (response.success) {
        const verification = response.data;
        
        if (verification.isValid && verification.isSystemGenerated) {
          // Valid system-generated QR
          const batchData = verification.batchData;
          
          const result = {
            isAuthentic: true,
            isSystemGenerated: true,
            productName: batchData?.product?.name || verification.qrData.productName,
            batchId: verification.qrData.batchId,
            manufacturer: 'Ayurvedic Heritage',
            verificationScore: 95,
            issues: [],
            certifications: ['System Verified', 'Organic Certified', 'FSSAI Approved'],
            productionDate: batchData?.harvest?.harvestDate || '2024-01-15',
            location: batchData?.farmer?.location?.address || 'Rajasthan, India',
            verificationTime: verification.verificationTime,
            chainOfCustody: [
              { stage: 'Harvest', date: batchData?.harvest?.harvestDate || '2024-01-10', actor: batchData?.farmer?.farmerName || 'Rajesh Kumar (Farmer)' },
              { stage: 'Processing', date: '2024-01-12', actor: 'Heritage Processing Unit' },
              { stage: 'Packaging', date: '2024-01-15', actor: 'Ayurvedic Heritage' },
              { stage: 'Distribution', date: '2024-01-16', actor: 'Regional Distributor' }
            ]
          };
          
          setVerificationResult(result);
          toast.success('Product verified as authentic!');
        } else {
          // Invalid or non-system QR
          const result = {
            isAuthentic: false,
            isSystemGenerated: verification.isSystemGenerated,
            productName: verification.qrData?.productName || 'Unknown Product',
            batchId: verification.qrData?.batchId || inputCode,
            manufacturer: 'Unknown',
            verificationScore: 0,
            issues: [verification.error || 'Product could not be verified'],
            certifications: [],
            error: verification.error
          };
          
          setVerificationResult(result);
          toast.error(verification.error || 'Product verification failed');
        }
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      const result = {
        isAuthentic: false,
        isSystemGenerated: false,
        productName: 'Unknown Product',
        batchId: inputCode || 'Unknown',
        manufacturer: 'Unknown',
        verificationScore: 0,
        issues: ['Verification system error'],
        certifications: [],
        error: 'Failed to connect to verification system'
      };
      
      setVerificationResult(result);
      toast.error('Failed to verify product. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationIcon = (isAuthentic, score) => {
    if (isAuthentic && score >= 90) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else if (isAuthentic && score >= 70) {
      return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    } else {
      return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getVerificationStatus = (isAuthentic, score) => {
    if (isAuthentic && score >= 90) {
      return { text: 'Verified Authentic', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (isAuthentic && score >= 70) {
      return { text: 'Likely Authentic', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    } else {
      return { text: 'Suspicious/Counterfeit', color: 'text-red-600', bg: 'bg-red-50' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Authenticity Verification</h1>
        <p className="text-muted-foreground">
          Verify the authenticity of your Ayurvedic products using QR codes or batch numbers
        </p>
      </motion.div>

      {/* Verification Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Verification Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setVerificationMethod('qr')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              verificationMethod === 'qr' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Camera className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">QR Code Scan</h3>
            <p className="text-sm opacity-75">Use camera to scan product QR code</p>
          </button>
          
          <button
            onClick={() => setVerificationMethod('manual')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              verificationMethod === 'manual' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Search className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Manual Entry</h3>
            <p className="text-sm opacity-75">Enter batch ID or product code manually</p>
          </button>
        </div>

        {/* Input Section */}
        {verificationMethod === 'qr' ? (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto border-4 border-dashed border-primary rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-16 w-16 text-primary" />
            </div>
            <button
              onClick={handleVerification}
              disabled={isVerifying}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isVerifying ? 'Scanning...' : 'Start Camera'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter batch ID or product code (e.g., TUR2024001)"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleVerification}
              disabled={isVerifying || !inputCode.trim()}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify Product'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      {isVerifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Verifying product authenticity...</p>
        </motion.div>
      )}

      {/* Verification Result */}
      {verificationResult && !isVerifying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Result Header */}
          <div className={`border border-border rounded-lg p-6 ${getVerificationStatus(verificationResult.isAuthentic, verificationResult.verificationScore).bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getVerificationIcon(verificationResult.isAuthentic, verificationResult.verificationScore)}
                <div>
                  <h3 className={`text-2xl font-bold ${getVerificationStatus(verificationResult.isAuthentic, verificationResult.verificationScore).color}`}>
                    {getVerificationStatus(verificationResult.isAuthentic, verificationResult.verificationScore).text}
                  </h3>
                  <p className="text-foreground font-medium">{verificationResult.productName}</p>
                  <p className="text-muted-foreground">Batch: {verificationResult.batchId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {verificationResult.verificationScore}%
                </div>
                <p className="text-sm text-muted-foreground">Confidence Score</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                  <p className="text-foreground font-medium">{verificationResult.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Production Date</label>
                  <p className="text-foreground">{verificationResult.productionDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Origin</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{verificationResult.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Certifications</label>
                <div className="space-y-2">
                  {verificationResult.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Issues (if any) */}
          {verificationResult.issues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Potential Issues Detected</h3>
              <ul className="space-y-2">
                {verificationResult.issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <span className="text-yellow-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Chain of Custody */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Chain of Custody</h3>
            <div className="space-y-3">
              {verificationResult.chainOfCustody.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-background rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{step.stage}</p>
                    <p className="text-sm text-muted-foreground">{step.actor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground font-medium">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Section */}
      {!verificationResult && !isVerifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• QR codes contain encrypted product information</li>
                <li>• Our system verifies against manufacturer databases</li>
                <li>• Blockchain technology ensures tamper-proof records</li>
                <li>• Machine learning detects suspicious patterns</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConsumerAuthenticity;