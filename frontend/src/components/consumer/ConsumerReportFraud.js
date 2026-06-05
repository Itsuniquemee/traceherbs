import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Camera, FileText, Send, MapPin, Calendar, User, Phone } from 'lucide-react';

const ConsumerReportFraud = () => {
  const [reportData, setReportData] = useState({
    productName: '',
    batchId: '',
    purchaseDate: '',
    purchaseLocation: '',
    suspiciousAspects: [],
    description: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const suspiciousAspectOptions = [
    'Suspicious packaging',
    'Unusual smell or taste',
    'Wrong color or texture',
    'QR code verification failed',
    'Price too good to be true',
    'Seller seemed unreliable',
    'Missing certifications',
    'Poor product quality',
    'Packaging damage',
    'Expired product',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setReportData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setReportData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAspectToggle = (aspect) => {
    setReportData(prev => ({
      ...prev,
      suspiciousAspects: prev.suspiciousAspects.includes(aspect)
        ? prev.suspiciousAspects.filter(a => a !== aspect)
        : [...prev.suspiciousAspects, aspect]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these files
    setReportData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(file => URL.createObjectURL(file))]
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-card border border-border rounded-lg p-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Report Submitted Successfully</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for reporting this suspicious product. Our fraud detection team will investigate your report within 24-48 hours.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Report ID:</strong> FR{Date.now().toString().slice(-6)}
            </p>
            <p className="text-blue-800 text-sm">
              Keep this ID for reference. We'll send updates to your email.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setReportData({
                productName: '',
                batchId: '',
                purchaseDate: '',
                purchaseLocation: '',
                suspiciousAspects: [],
                description: '',
                contactInfo: { name: '', email: '', phone: '' },
                images: []
              });
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Report Another Product
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Report Suspicious Product</h1>
        <p className="text-muted-foreground">
          Help us maintain quality standards by reporting counterfeit or suspicious products
        </p>
      </motion.div>

      {/* Warning Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Important Notice</h3>
            <ul className="text-red-800 text-sm space-y-1">
              <li>• Only report products you genuinely suspect are counterfeit or fraudulent</li>
              <li>• Provide accurate information to help our investigation</li>
              <li>• False reports may result in account suspension</li>
              <li>• Your identity will be protected during the investigation</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Report Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Product Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={reportData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="e.g., Organic Turmeric Powder"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Batch ID / Product Code
              </label>
              <input
                type="text"
                value={reportData.batchId}
                onChange={(e) => handleInputChange('batchId', e.target.value)}
                placeholder="e.g., TUR2024001"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={reportData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Purchase Location
              </label>
              <input
                type="text"
                value={reportData.purchaseLocation}
                onChange={(e) => handleInputChange('purchaseLocation', e.target.value)}
                placeholder="Store name or online platform"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Suspicious Aspects */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">What seems suspicious?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suspiciousAspectOptions.map((aspect) => (
              <label
                key={aspect}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={reportData.suspiciousAspects.includes(aspect)}
                  onChange={() => handleAspectToggle(aspect)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{aspect}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Detailed Description</h2>
          <textarea
            value={reportData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Please provide detailed information about what made you suspicious of this product. Include any specific observations, comparisons with authentic products, or other relevant details..."
            rows={6}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
          />
        </div>

        {/* Image Upload */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Upload Photos (Optional)</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Upload photos of the product, packaging, labels, or QR codes
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors inline-block"
              >
                Choose Photos
              </label>
            </div>
            
            {reportData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reportData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setReportData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={reportData.contactInfo.name}
                onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={reportData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={reportData.contactInfo.phone}
                onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Your contact information will only be used for this fraud investigation and will not be shared publicly.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !reportData.productName || !reportData.contactInfo.name || !reportData.contactInfo.email}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ConsumerReportFraud;