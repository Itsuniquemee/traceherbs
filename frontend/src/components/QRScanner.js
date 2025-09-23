import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Flashlight,
  FlashlightOff,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';

const QRScanner = ({ onScan, onClose, isOpen = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied or not available');
      console.error('Camera error:', err);
    }
  };

  const startScanning = () => {
    if (hasPermission && videoRef.current) {
      setIsScanning(true);
      setError(null);
      
      // Simulate QR code detection
      // In a real app, you would use a QR code detection library like jsQR
      setTimeout(() => {
        const mockQRCode = 'TURMERIC_001';
        handleQRCodeDetected(mockQRCode);
      }, 2000);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleQRCodeDetected = (code) => {
    if (!scannedCodes.includes(code)) {
      setScannedCodes(prev => [...prev, code]);
      onScan(code);
      
      // Show success feedback
      setTimeout(() => {
        setIsScanning(false);
      }, 1000);
    }
  };

  const toggleFlashlight = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities().torch) {
        videoTrack.applyConstraints({
          advanced: [{ torch: !flashlightOn }]
        }).then(() => {
          setFlashlightOn(!flashlightOn);
        }).catch(err => {
          console.error('Flashlight error:', err);
        });
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetScanner = () => {
    stopScanning();
    setTimeout(() => {
      requestCameraPermission();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-4xl max-h-full">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <QrCode className="h-6 w-6 text-white" />
                <h2 className="text-xl font-semibold text-white">QR Code Scanner</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative w-full h-full flex items-center justify-center">
            {hasPermission === null && (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Requesting camera permission...</p>
              </div>
            )}

            {hasPermission === false && (
              <div className="text-center text-white max-w-md">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
                <p className="text-gray-300 mb-4">
                  Please allow camera access to scan QR codes. You can also manually enter the product code.
                </p>
                <button
                  onClick={requestCameraPermission}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {hasPermission && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                      
                      {/* Scanning Line */}
                      {isScanning && (
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-primary"
                          animate={{ y: [0, 256, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                    
                    {/* Instructions */}
                    <div className="text-center mt-8">
                      <p className="text-white text-lg font-medium">
                        Position the QR code within the frame
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        Make sure the code is clearly visible and well-lit
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
            <div className="flex items-center justify-center space-x-4">
              {hasPermission && (
                <>
                  <button
                    onClick={isScanning ? stopScanning : startScanning}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                      isScanning 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isScanning ? (
                      <CameraOff className="h-5 w-5" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                    <span>{isScanning ? 'Stop Scanning' : 'Start Scanning'}</span>
                  </button>

                  <button
                    onClick={toggleFlashlight}
                    className="p-3 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                  >
                    {flashlightOn ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={resetScanner}
                    className="p-3 rounded-lg bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Success Feedback */}
          <AnimatePresence>
            {scannedCodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    QR Code Scanned!
                  </h3>
                  <p className="text-muted-foreground">
                    Product Code: {scannedCodes[scannedCodes.length - 1]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRScanner;