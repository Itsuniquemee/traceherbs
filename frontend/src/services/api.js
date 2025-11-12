// TraceHerbss API Service Functions - Full Integration
import { apiClient, API_BASE_URL } from '../config/api';

// Authentication Services
export const authService = {
  // User Registration
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('traceherbs_token', response.data.token);
    }
    return response.data;
  },

  // User Login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('traceherbs_token', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('traceherbs_token');
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Change Password
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (resetData) => {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  }
};

// Farmer Services
export const farmerService = {
  // Get Dashboard Data
  getDashboard: async () => {
    const response = await apiClient.get('/farmer/dashboard');
    return response.data;
  },

  // Get Farmer Profile
  getProfile: async () => {
    const response = await apiClient.get('/farmer/profile');
    return response.data;
  },

  // Update Farmer Profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/farmer/profile', profileData);
    return response.data;
  },

  // Batch Management
  getBatches: async (params = {}) => {
    const response = await apiClient.get('/farmer/batches', { params });
    return response.data;
  },

  createBatch: async (batchData) => {
    const response = await apiClient.post('/farmer/batches', batchData);
    return response.data;
  },

  getBatch: async (batchId) => {
    const response = await apiClient.get(`/farmer/batches/${batchId}`);
    return response.data;
  },

  updateBatch: async (batchId, batchData) => {
    const response = await apiClient.put(`/farmer/batches/${batchId}`, batchData);
    return response.data;
  },

  deleteBatch: async (batchId) => {
    const response = await apiClient.delete(`/farmer/batches/${batchId}`);
    return response.data;
  },

  // Cultivation Management
  addCultivation: async (cultivationData) => {
    const response = await apiClient.post('/farmer/cultivation', cultivationData);
    return response.data;
  },

  // Harvest Management
  addHarvest: async (harvestData) => {
    const response = await apiClient.post('/farmer/harvest', harvestData);
    return response.data;
  },

  // Document Management
  uploadDocuments: async (formData) => {
    const response = await apiClient.post('/farmer/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getDocuments: async (batchId) => {
    const response = await apiClient.get(`/farmer/documents?batchId=${batchId}`);
    return response.data;
  },

  // Sustainability
  getSustainability: async () => {
    const response = await apiClient.get('/farmer/sustainability');
    return response.data;
  },

  updateSustainability: async (sustainabilityData) => {
    const response = await apiClient.post('/farmer/sustainability', sustainabilityData);
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await apiClient.get('/farmer/analytics', { params });
    return response.data;
  }
};

// Processor Services
export const processorService = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get('/processor/dashboard');
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await apiClient.get('/processor/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/processor/profile', profileData);
    return response.data;
  },

  // Batch Processing
  receiveBatch: async (batchData) => {
    const response = await apiClient.post('/processor/receive', batchData);
    return response.data;
  },

  getProcessingBatches: async (params = {}) => {
    const response = await apiClient.get('/processor/batches', { params });
    return response.data;
  },

  updateProcessing: async (batchId, processingData) => {
    const response = await apiClient.put(`/processor/processing/${batchId}`, processingData);
    return response.data;
  },

  // Quality Testing
  getQualityTests: async (params = {}) => {
    const response = await apiClient.get('/processor/quality-tests', { params });
    return response.data;
  },

  createQualityTest: async (testData) => {
    const response = await apiClient.post('/processor/quality-tests', testData);
    return response.data;
  },

  updateQualityTest: async (testId, testData) => {
    const response = await apiClient.put(`/processor/quality-tests/${testId}`, testData);
    return response.data;
  },

  // QR Code Management
  generateQR: async (qrData) => {
    const response = await apiClient.post('/processor/generate-qr', qrData);
    return response.data;
  },

  getQRCodes: async (params = {}) => {
    const response = await apiClient.get('/processor/qr-codes', { params });
    return response.data;
  },

  // Transfers
  transferBatch: async (transferData) => {
    const response = await apiClient.post('/processor/transfer', transferData);
    return response.data;
  },

  getTransfers: async (params = {}) => {
    const response = await apiClient.get('/processor/transfers', { params });
    return response.data;
  }
};

// Consumer Services
export const consumerService = {
  // Product Verification
  verifyProduct: async (qrCode) => {
    const response = await apiClient.get(`/consumer/verify/${qrCode}`);
    return response.data;
  },

  traceProduct: async (batchId) => {
    const response = await apiClient.get(`/consumer/trace/${batchId}`);
    return response.data;
  },

  getProductTimeline: async (batchId) => {
    const response = await apiClient.get(`/consumer/timeline/${batchId}`);
    return response.data;
  },

  // Search & Discovery
  searchProducts: async (searchParams) => {
    const response = await apiClient.get('/consumer/search', { params: searchParams });
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/consumer/categories');
    return response.data;
  },

  // Feedback & Reviews
  submitFeedback: async (feedbackData) => {
    const response = await apiClient.post('/consumer/feedback', feedbackData);
    return response.data;
  },

  submitReview: async (reviewData) => {
    const response = await apiClient.post('/consumer/reviews', reviewData);
    return response.data;
  },

  getReviews: async (productId) => {
    const response = await apiClient.get(`/consumer/reviews/${productId}`);
    return response.data;
  },

  // Favorites
  getFavorites: async () => {
    const response = await apiClient.get('/consumer/favorites');
    return response.data;
  },

  addToFavorites: async (productId) => {
    const response = await apiClient.post('/consumer/favorites', { productId });
    return response.data;
  },

  removeFromFavorites: async (favoriteId) => {
    const response = await apiClient.delete(`/consumer/favorites/${favoriteId}`);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  verifyUser: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/verify`);
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  // Batch Management
  getAllBatches: async (params = {}) => {
    const response = await apiClient.get('/admin/batches', { params });
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await apiClient.get('/admin/analytics', { params });
    return response.data;
  },

  // Reports
  getReports: async (params = {}) => {
    const response = await apiClient.get('/admin/reports', { params });
    return response.data;
  },

  // System Configuration
  getConfig: async () => {
    const response = await apiClient.get('/admin/config');
    return response.data;
  },

  updateConfig: async (configData) => {
    const response = await apiClient.put('/admin/config', configData);
    return response.data;
  }
};

// Analytics Services
export const analyticsService = {
  getOverview: async (params = {}) => {
    const response = await apiClient.get('/analytics/overview', { params });
    return response.data;
  },

  getSupplyChainAnalytics: async (params = {}) => {
    const response = await apiClient.get('/analytics/supply-chain', { params });
    return response.data;
  },

  getFarmerAnalytics: async (params = {}) => {
    const response = await apiClient.get('/analytics/farmer', { params });
    return response.data;
  },

  getProcessorAnalytics: async (params = {}) => {
    const response = await apiClient.get('/analytics/processor', { params });
    return response.data;
  },

  getQualityAnalytics: async (params = {}) => {
    const response = await apiClient.get('/analytics/quality', { params });
    return response.data;
  }
};

// QR Code Services
export const qrService = {
  generateQR: async (batchId) => {
    const response = await apiClient.post(`/qr/generate/${batchId}`);
    return response.data;
  },

  getQR: async (batchId) => {
    const response = await apiClient.get(`/qr/${batchId}`);
    return response.data;
  },

  scanQR: async (qrData) => {
    const response = await apiClient.post('/qr/scan', qrData);
    return response.data;
  },

  validateQR: async (qrCode) => {
    const response = await apiClient.post('/qr/validate', { qrCode });
    return response.data;
  }
};

// Notification Services
export const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// File Upload Services
export const uploadService = {
  uploadSingle: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(options).forEach(key => formData.append(key, options[key]));
    
    const response = await apiClient.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadMultiple: async (files, options = {}) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    Object.keys(options).forEach(key => formData.append(key, options[key]));
    
    const response = await apiClient.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getUserFiles: async (userId) => {
    const response = await apiClient.get(`/upload/files/${userId}`);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/upload/files/${fileId}`);
    return response.data;
  },

  downloadFile: async (fileId) => {
    const response = await apiClient.get(`/upload/download/${fileId}`, {
      responseType: 'blob'
    });
    return response;
  }
};

// Report Services
export const reportService = {
  getProductionReport: async (params = {}) => {
    const response = await apiClient.get('/reports/production', { params });
    return response.data;
  },

  getQualityReport: async (params = {}) => {
    const response = await apiClient.get('/reports/quality', { params });
    return response.data;
  },

  getFarmerPerformanceReport: async (params = {}) => {
    const response = await apiClient.get('/reports/farmer-performance', { params });
    return response.data;
  },

  exportReport: async (reportType, format, params = {}) => {
    const response = await apiClient.get(`/reports/${reportType}`, {
      params: { ...params, format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return response;
  }
};

// System Services
export const systemService = {
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getStatus: async () => {
    const response = await apiClient.get('/status');
    return response.data;
  },

  getDocs: async () => {
    const response = await apiClient.get('/docs');
    return response.data;
  }
};

// Export all services
export default {
  auth: authService,
  farmer: farmerService,
  processor: processorService,
  consumer: consumerService,
  admin: adminService,
  analytics: analyticsService,
  qr: qrService,
  notifications: notificationService,
  upload: uploadService,
  reports: reportService,
  system: systemService
};