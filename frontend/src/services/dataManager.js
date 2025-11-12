// TraceHerbss Data Management Service - Real Data Storage Integration
import apiService from './api';
import { toast } from 'react-toastify';

// Centralized data management with real backend integration
class DataManager {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
    this.isOnline = navigator.onLine;
    
    // Monitor online status
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }

  // Cache management
  setCache(key, data, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache(pattern) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Event listening for real-time updates
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Authentication data management
  async handleAuth(action, data) {
    try {
      let result;
      switch (action) {
        case 'login':
          result = await apiService.auth.login(data);
          this.emit('auth:login', result.user);
          break;
        case 'register':
          result = await apiService.auth.register(data);
          this.emit('auth:register', result.user);
          break;
        case 'logout':
          await apiService.auth.logout();
          this.clearCache();
          this.emit('auth:logout', null);
          break;
        case 'getCurrentUser':
          const cacheKey = 'current_user';
          let user = this.getCache(cacheKey);
          if (!user) {
            user = await apiService.auth.getCurrentUser();
            this.setCache(cacheKey, user);
          }
          result = user;
          break;
        default:
          result = await apiService.auth[action](data);
      }
      return { success: true, data: result };
    } catch (error) {
      console.error(`Auth ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Authentication failed');
      return { success: false, error: error.message };
    }
  }

  // Farmer data management
  async handleFarmer(action, data, options = {}) {
    try {
      const cacheKey = `farmer_${action}_${JSON.stringify(options)}`;
      let result;

      if (action === 'getDashboard' || action === 'getProfile') {
        result = this.getCache(cacheKey);
        if (result && !options.forceRefresh) {
          return { success: true, data: result, cached: true };
        }
      }

      result = await apiService.farmer[action](data, options);
      
      // Cache dashboard and profile data
      if (action === 'getDashboard' || action === 'getProfile') {
        this.setCache(cacheKey, result);
      }

      // Clear relevant cache on updates
      if (['updateProfile', 'createBatch', 'updateBatch', 'deleteBatch'].includes(action)) {
        this.clearCache('farmer_');
      }

      this.emit(`farmer:${action}`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Farmer ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Farmer operation failed');
      return { success: false, error: error.message };
    }
  }

  // Processor data management
  async handleProcessor(action, data, options = {}) {
    try {
      const cacheKey = `processor_${action}_${JSON.stringify(options)}`;
      let result;

      if (['getDashboard', 'getProfile', 'getProcessingBatches'].includes(action)) {
        result = this.getCache(cacheKey);
        if (result && !options.forceRefresh) {
          return { success: true, data: result, cached: true };
        }
      }

      result = await apiService.processor[action](data, options);
      
      // Cache frequently accessed data
      if (['getDashboard', 'getProfile', 'getProcessingBatches'].includes(action)) {
        this.setCache(cacheKey, result);
      }

      // Clear relevant cache on updates
      if (['updateProfile', 'receiveBatch', 'updateProcessing', 'transferBatch'].includes(action)) {
        this.clearCache('processor_');
      }

      this.emit(`processor:${action}`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Processor ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Processor operation failed');
      return { success: false, error: error.message };
    }
  }

  // Consumer data management
  async handleConsumer(action, data, options = {}) {
    try {
      const cacheKey = `consumer_${action}_${data || 'default'}`;
      let result;

      // Cache product verification and tracing
      if (['verifyProduct', 'traceProduct', 'getProductTimeline'].includes(action)) {
        result = this.getCache(cacheKey);
        if (result && !options.forceRefresh) {
          return { success: true, data: result, cached: true };
        }
      }

      result = await apiService.consumer[action](data, options);
      
      // Cache product data for offline access
      if (['verifyProduct', 'traceProduct', 'getProductTimeline'].includes(action)) {
        this.setCache(cacheKey, result, 600000); // 10 minutes for product data
      }

      this.emit(`consumer:${action}`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Consumer ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Consumer operation failed');
      return { success: false, error: error.message };
    }
  }

  // Admin data management
  async handleAdmin(action, data, options = {}) {
    try {
      const cacheKey = `admin_${action}_${JSON.stringify(options)}`;
      let result;

      // Cache dashboard and analytics
      if (['getDashboard', 'getAnalytics', 'getReports'].includes(action)) {
        result = this.getCache(cacheKey);
        if (result && !options.forceRefresh) {
          return { success: true, data: result, cached: true };
        }
      }

      result = await apiService.admin[action](data, options);
      
      // Cache admin data
      if (['getDashboard', 'getAnalytics', 'getReports'].includes(action)) {
        this.setCache(cacheKey, result);
      }

      // Clear cache on user management actions
      if (['createUser', 'updateUser', 'deleteUser', 'verifyUser', 'suspendUser'].includes(action)) {
        this.clearCache('admin_');
        this.clearCache('users_');
      }

      this.emit(`admin:${action}`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Admin ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Admin operation failed');
      return { success: false, error: error.message };
    }
  }

  // Batch management with real-time updates
  async manageBatch(action, batchData, options = {}) {
    try {
      let result;
      const userRole = this.getCache('current_user')?.role;

      switch (action) {
        case 'create':
          if (userRole === 'farmer') {
            result = await apiService.farmer.createBatch(batchData);
          } else {
            throw new Error('Unauthorized: Only farmers can create batches');
          }
          break;
          
        case 'update':
          if (userRole === 'farmer') {
            result = await apiService.farmer.updateBatch(batchData.id, batchData);
          } else if (userRole === 'processor') {
            result = await apiService.processor.updateProcessing(batchData.id, batchData);
          } else {
            throw new Error('Unauthorized');
          }
          break;
          
        case 'transfer':
          result = await apiService.processor.transferBatch(batchData);
          break;
          
        case 'receive':
          result = await apiService.processor.receiveBatch(batchData);
          break;
          
        case 'trace':
          result = await apiService.consumer.traceProduct(batchData.id);
          break;
          
        default:
          throw new Error(`Unknown batch action: ${action}`);
      }

      // Clear relevant caches
      this.clearCache('batch_');
      this.clearCache('farmer_');
      this.clearCache('processor_');
      
      // Emit real-time update
      this.emit(`batch:${action}`, result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error(`Batch ${action} error:`, error);
      toast.error(error.response?.data?.message || 'Batch operation failed');
      return { success: false, error: error.message };
    }
  }

  // File upload management
  async handleFileUpload(files, metadata = {}) {
    try {
      let result;
      
      if (Array.isArray(files) && files.length > 1) {
        result = await apiService.upload.uploadMultiple(files, metadata);
      } else {
        const file = Array.isArray(files) ? files[0] : files;
        result = await apiService.upload.uploadSingle(file, metadata);
      }

      this.emit('file:uploaded', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('File upload failed');
      return { success: false, error: error.message };
    }
  }

  // QR Code management
  async handleQR(action, data) {
    try {
      let result;
      
      switch (action) {
        case 'generate':
          result = await apiService.qr.generateQR(data);
          break;
        case 'scan':
          result = await apiService.qr.scanQR(data);
          break;
        case 'validate':
          result = await apiService.qr.validateQR(data);
          break;
        case 'verify':
          result = await apiService.consumer.verifyProduct(data);
          break;
        default:
          result = await apiService.qr[action](data);
      }

      this.emit(`qr:${action}`, result);
      return { success: true, data: result };
    } catch (error) {
      console.error(`QR ${action} error:`, error);
      toast.error(error.response?.data?.message || 'QR operation failed');
      return { success: false, error: error.message };
    }
  }

  // Analytics data management
  async getAnalytics(type, params = {}) {
    try {
      const cacheKey = `analytics_${type}_${JSON.stringify(params)}`;
      let result = this.getCache(cacheKey);
      
      if (!result || params.forceRefresh) {
        switch (type) {
          case 'overview':
            result = await apiService.analytics.getOverview(params);
            break;
          case 'supply-chain':
            result = await apiService.analytics.getSupplyChainAnalytics(params);
            break;
          case 'farmer':
            result = await apiService.analytics.getFarmerAnalytics(params);
            break;
          case 'processor':
            result = await apiService.analytics.getProcessorAnalytics(params);
            break;
          case 'quality':
            result = await apiService.analytics.getQualityAnalytics(params);
            break;
          default:
            throw new Error(`Unknown analytics type: ${type}`);
        }
        
        this.setCache(cacheKey, result, 180000); // 3 minutes for analytics
      }

      return { success: true, data: result };
    } catch (error) {
      console.error(`Analytics ${type} error:`, error);
      toast.error('Failed to load analytics');
      return { success: false, error: error.message };
    }
  }

  // Notification management
  async handleNotifications(action, data = null) {
    try {
      let result;
      
      switch (action) {
        case 'get':
          result = await apiService.notifications.getNotifications(data);
          break;
        case 'markRead':
          result = await apiService.notifications.markAsRead(data);
          break;
        case 'markAllRead':
          result = await apiService.notifications.markAllAsRead();
          break;
        case 'getUnreadCount':
          result = await apiService.notifications.getUnreadCount();
          break;
        case 'delete':
          result = await apiService.notifications.deleteNotification(data);
          break;
        default:
          throw new Error(`Unknown notification action: ${action}`);
      }

      // Clear notifications cache
      this.clearCache('notifications_');
      this.emit(`notifications:${action}`, result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error(`Notifications ${action} error:`, error);
      return { success: false, error: error.message };
    }
  }

  // Comprehensive search across all data
  async search(query, filters = {}) {
    try {
      const userRole = this.getCache('current_user')?.role;
      let results = {};

      // Search based on user role
      if (userRole === 'consumer' || !userRole) {
        results.products = await apiService.consumer.searchProducts({ 
          query, 
          ...filters 
        });
      }

      if (userRole === 'farmer') {
        results.batches = await apiService.farmer.getBatches({ 
          search: query, 
          ...filters 
        });
      }

      if (userRole === 'processor') {
        results.batches = await apiService.processor.getProcessingBatches({ 
          search: query, 
          ...filters 
        });
      }

      if (userRole === 'admin') {
        results.users = await apiService.admin.getUsers({ 
          search: query, 
          ...filters 
        });
        results.batches = await apiService.admin.getAllBatches({ 
          search: query, 
          ...filters 
        });
      }

      return { success: true, data: results };
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      return { success: false, error: error.message };
    }
  }

  // Health check and system status
  async checkSystemHealth() {
    try {
      const health = await apiService.system.getHealth();
      this.emit('system:health', health);
      return { success: true, data: health };
    } catch (error) {
      console.error('System health check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Export functionality
  async exportData(type, format = 'json', params = {}) {
    try {
      let result;
      
      switch (type) {
        case 'production':
          result = await apiService.reports.exportReport('production', format, params);
          break;
        case 'quality':
          result = await apiService.reports.exportReport('quality', format, params);
          break;
        case 'farmer-performance':
          result = await apiService.reports.exportReport('farmer-performance', format, params);
          break;
        default:
          throw new Error(`Unknown export type: ${type}`);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error(`Export ${type} error:`, error);
      toast.error('Export failed');
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const dataManager = new DataManager();

// Export the instance and the class
export { DataManager };
export default dataManager;