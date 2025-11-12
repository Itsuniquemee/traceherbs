// TraceHerbss React Hooks for Data Management - Real Backend Integration
import { useState, useEffect, useCallback, useContext, createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import dataManager from '../services/dataManager';
import { toast } from 'react-toastify';

// Create context for global state management
const TraceHerbsContext = createContext();

// Context provider component
export const TraceHerbsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('traceherbs_token');
        if (token) {
          const userResult = await dataManager.handleAuth('getCurrentUser');
          if (userResult.success) {
            setUser(userResult.data);
            
            // Load initial notifications
            const notifResult = await dataManager.handleNotifications('get');
            if (notifResult.success) {
              setNotifications(notifResult.data);
            }
            
            const unreadResult = await dataManager.handleNotifications('getUnreadCount');
            if (unreadResult.success) {
              setUnreadCount(unreadResult.data.count);
            }
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Subscribe to auth events
    const unsubscribeAuth = dataManager.subscribe('auth:login', (userData) => {
      setUser(userData);
    });

    const unsubscribeLogout = dataManager.subscribe('auth:logout', () => {
      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
    });

    const unsubscribeNotifications = dataManager.subscribe('notifications:get', (notifData) => {
      setNotifications(notifData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLogout();
      unsubscribeNotifications();
    };
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    setLoading,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount
  }), [user, loading, notifications, unreadCount]);

  return (
    <TraceHerbsContext.Provider value={value}>
      {children}
    </TraceHerbsContext.Provider>
  );
};

TraceHerbsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use the context
export const useTraceHerbs = () => {
  const context = useContext(TraceHerbsContext);
  if (!context) {
    throw new Error('useTraceHerbs must be used within TraceHerbsProvider');
  }
  return context;
};

// Authentication hook
export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useTraceHerbs();

  const login = useCallback(async (credentials) => {
    setLoading(true);
    const result = await dataManager.handleAuth('login', credentials);
    if (result.success) {
      setUser(result.data.user);
      toast.success('Login successful!');
    }
    setLoading(false);
    return result;
  }, [setUser, setLoading]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    const result = await dataManager.handleAuth('register', userData);
    if (result.success) {
      setUser(result.data.user);
      toast.success('Registration successful!');
    }
    setLoading(false);
    return result;
  }, [setUser, setLoading]);

  const logout = useCallback(async () => {
    setLoading(true);
    const result = await dataManager.handleAuth('logout');
    if (result.success) {
      setUser(null);
      toast.success('Logged out successfully!');
    }
    setLoading(false);
    return result;
  }, [setUser, setLoading]);

  const changePassword = useCallback(async (passwordData) => {
    return dataManager.handleAuth('changePassword', passwordData);
  }, []);

  const isAuthenticated = !!user;
  const userRole = user?.role;

  return {
    user,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated,
    userRole,
    loading
  };
};

// Farmer operations hook
export const useFarmer = () => {
  const [dashboard, setDashboard] = useState(null);
  const [batches, setBatches] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboard = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    const result = await dataManager.handleFarmer('getDashboard', null, { forceRefresh });
    if (result.success) {
      setDashboard(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const getBatches = useCallback(async (params = {}) => {
    setLoading(true);
    const result = await dataManager.handleFarmer('getBatches', params);
    if (result.success) {
      setBatches(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const createBatch = useCallback(async (batchData) => {
    const result = await dataManager.manageBatch('create', batchData);
    if (result.success) {
      // Refresh batches
      getBatches();
      toast.success('Batch created successfully!');
    }
    return result;
  }, [getBatches]);

  const updateBatch = useCallback(async (batchId, batchData) => {
    const result = await dataManager.manageBatch('update', { id: batchId, ...batchData });
    if (result.success) {
      // Refresh batches
      getBatches();
      toast.success('Batch updated successfully!');
    }
    return result;
  }, [getBatches]);

  const getProfile = useCallback(async (forceRefresh = false) => {
    const result = await dataManager.handleFarmer('getProfile', null, { forceRefresh });
    if (result.success) {
      setProfile(result.data);
    }
    return result;
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const result = await dataManager.handleFarmer('updateProfile', profileData);
    if (result.success) {
      setProfile(result.data);
      toast.success('Profile updated successfully!');
    }
    return result;
  }, []);

  return {
    dashboard,
    batches,
    profile,
    loading,
    getDashboard,
    getBatches,
    createBatch,
    updateBatch,
    getProfile,
    updateProfile
  };
};

// Processor operations hook
export const useProcessor = () => {
  const [dashboard, setDashboard] = useState(null);
  const [processingBatches, setProcessingBatches] = useState([]);
  const [qualityTests, setQualityTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDashboard = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    const result = await dataManager.handleProcessor('getDashboard', null, { forceRefresh });
    if (result.success) {
      setDashboard(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const getProcessingBatches = useCallback(async (params = {}) => {
    setLoading(true);
    const result = await dataManager.handleProcessor('getProcessingBatches', params);
    if (result.success) {
      setProcessingBatches(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const receiveBatch = useCallback(async (batchData) => {
    const result = await dataManager.manageBatch('receive', batchData);
    if (result.success) {
      getProcessingBatches();
      toast.success('Batch received successfully!');
    }
    return result;
  }, [getProcessingBatches]);

  const updateProcessing = useCallback(async (batchId, processingData) => {
    const result = await dataManager.manageBatch('update', { id: batchId, ...processingData });
    if (result.success) {
      getProcessingBatches();
      toast.success('Processing updated successfully!');
    }
    return result;
  }, [getProcessingBatches]);

  const createQualityTest = useCallback(async (testData) => {
    const result = await dataManager.handleProcessor('createQualityTest', testData);
    if (result.success) {
      // Refresh quality tests
      const testsResult = await dataManager.handleProcessor('getQualityTests');
      if (testsResult.success) {
        setQualityTests(testsResult.data);
      }
      toast.success('Quality test created successfully!');
    }
    return result;
  }, []);

  const generateQR = useCallback(async (qrData) => {
    const result = await dataManager.handleQR('generate', qrData);
    if (result.success) {
      toast.success('QR code generated successfully!');
    }
    return result;
  }, []);

  return {
    dashboard,
    processingBatches,
    qualityTests,
    loading,
    getDashboard,
    getProcessingBatches,
    receiveBatch,
    updateProcessing,
    createQualityTest,
    generateQR
  };
};

// Consumer operations hook
export const useConsumer = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [traceResult, setTraceResult] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = useCallback(async (searchParams) => {
    setLoading(true);
    const result = await dataManager.handleConsumer('searchProducts', searchParams);
    if (result.success) {
      setSearchResults(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const verifyProduct = useCallback(async (qrCode) => {
    setLoading(true);
    const result = await dataManager.handleQR('verify', qrCode);
    if (result.success) {
      setVerificationResult(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const traceProduct = useCallback(async (batchId) => {
    setLoading(true);
    const result = await dataManager.manageBatch('trace', { id: batchId });
    if (result.success) {
      setTraceResult(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const getFavorites = useCallback(async () => {
    const result = await dataManager.handleConsumer('getFavorites');
    if (result.success) {
      setFavorites(result.data);
    }
    return result;
  }, []);

  const addToFavorites = useCallback(async (productId) => {
    const result = await dataManager.handleConsumer('addToFavorites', productId);
    if (result.success) {
      getFavorites();
      toast.success('Added to favorites!');
    }
    return result;
  }, [getFavorites]);

  const submitFeedback = useCallback(async (feedbackData) => {
    const result = await dataManager.handleConsumer('submitFeedback', feedbackData);
    if (result.success) {
      toast.success('Feedback submitted successfully!');
    }
    return result;
  }, []);

  return {
    searchResults,
    verificationResult,
    traceResult,
    favorites,
    loading,
    searchProducts,
    verifyProduct,
    traceProduct,
    getFavorites,
    addToFavorites,
    submitFeedback
  };
};

// Admin operations hook
export const useAdmin = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboard = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    const result = await dataManager.handleAdmin('getDashboard', null, { forceRefresh });
    if (result.success) {
      setDashboard(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const getUsers = useCallback(async (params = {}) => {
    setLoading(true);
    const result = await dataManager.handleAdmin('getUsers', params);
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const createUser = useCallback(async (userData) => {
    const result = await dataManager.handleAdmin('createUser', userData);
    if (result.success) {
      getUsers();
      toast.success('User created successfully!');
    }
    return result;
  }, [getUsers]);

  const updateUser = useCallback(async (userId, userData) => {
    const result = await dataManager.handleAdmin('updateUser', userData, { userId });
    if (result.success) {
      getUsers();
      toast.success('User updated successfully!');
    }
    return result;
  }, [getUsers]);

  const verifyUser = useCallback(async (userId) => {
    const result = await dataManager.handleAdmin('verifyUser', { userId });
    if (result.success) {
      getUsers();
      toast.success('User verified successfully!');
    }
    return result;
  }, [getUsers]);

  const getAnalytics = useCallback(async (params = {}) => {
    const result = await dataManager.getAnalytics('overview', params);
    if (result.success) {
      setAnalytics(result.data);
    }
    return result;
  }, []);

  return {
    dashboard,
    users,
    analytics,
    loading,
    getDashboard,
    getUsers,
    createUser,
    updateUser,
    verifyUser,
    getAnalytics
  };
};

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = useCallback(async (files, metadata = {}) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    const result = await dataManager.handleFileUpload(files, metadata);
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 1000);

    if (result.success) {
      toast.success('Files uploaded successfully!');
    }

    return result;
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadFiles
  };
};

// Notifications hook
export const useNotifications = () => {
  const { notifications, setNotifications, unreadCount, setUnreadCount } = useTraceHerbs();

  const markAsRead = useCallback(async (notificationId) => {
    const result = await dataManager.handleNotifications('markRead', notificationId);
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return result;
  }, [setNotifications, setUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    const result = await dataManager.handleNotifications('markAllRead');
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    }
    return result;
  }, [setNotifications, setUnreadCount]);

  const deleteNotification = useCallback(async (notificationId) => {
    const result = await dataManager.handleNotifications('delete', notificationId);
    if (result.success) {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    }
    return result;
  }, [setNotifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

// Analytics hook
export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  const getAnalytics = useCallback(async (type, params = {}) => {
    setLoading(true);
    const result = await dataManager.getAnalytics(type, params);
    if (result.success) {
      setAnalyticsData(prev => ({
        ...prev,
        [type]: result.data
      }));
    }
    setLoading(false);
    return result;
  }, []);

  return {
    analyticsData,
    loading,
    getAnalytics
  };
};

// QR Code operations hook
export const useQRCode = () => {
  const [qrData, setQrData] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQR = useCallback(async (batchId) => {
    setLoading(true);
    const result = await dataManager.handleQR('generate', batchId);
    if (result.success) {
      setQrData(result.data);
      toast.success('QR code generated successfully!');
    }
    setLoading(false);
    return result;
  }, []);

  const scanQR = useCallback(async (qrCode) => {
    setLoading(true);
    const result = await dataManager.handleQR('scan', qrCode);
    if (result.success) {
      setScanResult(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  const validateQR = useCallback(async (qrCode) => {
    const result = await dataManager.handleQR('validate', qrCode);
    return result;
  }, []);

  return {
    qrData,
    scanResult,
    loading,
    generateQR,
    scanQR,
    validateQR
  };
};

// Search hook
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query, filters = {}) => {
    setLoading(true);
    const result = await dataManager.search(query, filters);
    if (result.success) {
      setSearchResults(result.data);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    searchResults,
    loading,
    search
  };
};

// All hooks are already individually exported above