import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
  import { 
  Menu, 
  X, 
  Home, 
  Leaf, 
  Users, 
  BarChart3, 
  MapPin, 
  QrCode, 
  Settings, 
  Bell, 
  Sun, 
  Moon,
  LogOut,
  User,
  Shield,
  AlertTriangle,
  FileText,
  Camera,
  Maximize,
  Minimize,
  Upload,
  Download,
  Eye,
  Activity,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Zap,
  Database,
  TrendingUp,
  Award,
  Globe,
  Lock,
  RefreshCw,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toggleFullscreen, isFullscreen, onFullscreenChange, fixMobileViewport } from '../utils/fullscreen';

const MainLayout = ({ children, currentPage, onPageChange, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Load notifications only once on mount
  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = localStorage.getItem('herbaltrace_notifications');
      if (storedNotifications) {
        try {
          const parsed = JSON.parse(storedNotifications);
          setNotifications(parsed);
        } catch (error) {
          console.error('Error parsing stored notifications:', error);
          setNotifications([]);
        }
      } else {
        // Only show initial mock notifications on first load
        const initialNotifications = [
          { id: 1, type: 'warning', message: 'Quality test failed for batch #1234', time: '2 min ago', read: false, timestamp: Date.now() },
          { id: 2, type: 'info', message: 'New collection from Rajasthan region', time: '15 min ago', read: false, timestamp: Date.now() - 15 * 60 * 1000 },
          { id: 3, type: 'success', message: 'Recall simulation completed successfully', time: '1 hour ago', read: false, timestamp: Date.now() - 60 * 60 * 1000 }
        ];
        setNotifications(initialNotifications);
        localStorage.setItem('herbaltrace_notifications', JSON.stringify(initialNotifications));
      }
    };

    loadNotifications();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('herbaltrace_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Functions to handle notifications
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown') && !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Setup fullscreen change listener
    const cleanup = onFullscreenChange(() => {
      setIsFullscreenMode(isFullscreen());
    });

    // Mobile viewport fixes
    const mobileCleanup = fixMobileViewport();

    // Handle window resize
    const handleResize = () => {
      const desktopBreakpoint = window.innerWidth >= 1024;
      setIsDesktop(desktopBreakpoint);
      
      // On desktop, sidebar should be open by default
      // On mobile, close sidebar if it was open
      if (desktopBreakpoint && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (!desktopBreakpoint && sidebarOpen) {
        // Only close if we're switching from desktop to mobile
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      cleanup();
      mobileCleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Define all navigation items with comprehensive role-based features
  const allNavigationItems = [
    // Core Navigation
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard', roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] },
    
    // Farmer-specific features
    { id: 'crop-upload', label: 'Upload Crop Details', icon: Upload, path: '/farmer/crop-upload', roles: ['farmer'] },
    { id: 'harvest-data', label: 'Harvest Records', icon: Leaf, path: '/farmer/harvest-data', roles: ['farmer'] },
    { id: 'farm-documents', label: 'Farm Documents', icon: FileText, path: '/farmer/documents', roles: ['farmer'] },
    { id: 'supply-tracking', label: 'Track My Produce', icon: TrendingUp, path: '/farmer/supply-tracking', roles: ['farmer'] },
    { id: 'quality-feedback', label: 'Quality Feedback', icon: MessageSquare, path: '/farmer/feedback', roles: ['farmer'] },
    { id: 'transparency-credits', label: 'Transparency Credits', icon: Award, path: '/farmer/credits', roles: ['farmer'] },
    { id: 'farmer-generate-qr', label: 'Generate QR Codes', icon: QrCode, path: '/farmer/generate-qr', roles: ['farmer'] },
    
    // Processor-specific features
    { id: 'batch-receiving', label: 'Receive Batches', icon: Package, path: '/processor/receive-batches', roles: ['processor'] },
    { id: 'processing-steps', label: 'Processing Records', icon: Activity, path: '/processor/processing-steps', roles: ['processor'] },
    { id: 'quality-tests', label: 'Quality Tests', icon: CheckCircle, path: '/processor/quality-tests', roles: ['processor'] },
    { id: 'generate-qr', label: 'Generate QR Codes', icon: QrCode, path: '/processor/generate-qr', roles: ['processor'] },
    { id: 'chain-custody', label: 'Chain of Custody', icon: Shield, path: '/processor/chain-custody', roles: ['processor'] },
    
    // Regulator-specific features
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Eye, path: '/regulator/live-monitoring', roles: ['regulator'] },
    { id: 'audit-trails', label: 'Audit Trails', icon: Search, path: '/regulator/audit-trails', roles: ['regulator'] },
    { id: 'batch-approval', label: 'Batch Approval', icon: CheckCircle, path: '/regulator/batch-approval', roles: ['regulator'] },
    { id: 'fraud-alerts', label: 'Fraud Detection', icon: AlertTriangle, path: '/regulator/fraud-alerts', roles: ['regulator'] },
    { id: 'certification-verify', label: 'Verify Certifications', icon: Award, path: '/regulator/certifications', roles: ['regulator'] },
    
    // Consumer-specific features
    { id: 'product-scanner', label: 'Scan Products', icon: Camera, path: '/consumer/scanner', roles: ['consumer'] },
    { id: 'product-comparison', label: 'Compare Products', icon: BarChart3, path: '/consumer/compare', roles: ['consumer'] },
    { id: 'authenticity-check', label: 'Authenticity Check', icon: Shield, path: '/consumer/authenticity', roles: ['consumer'] },
    { id: 'product-reviews', label: 'Reviews & Ratings', icon: Star, path: '/consumer/reviews', roles: ['consumer'] },
    { id: 'fraud-reporting', label: 'Report Fraud', icon: XCircle, path: '/consumer/report-fraud', roles: ['consumer'] },
    
    // Admin-specific features
    { id: 'user-management', label: 'User Management', icon: Users, path: '/admin/users', roles: ['admin'] },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: Clock, path: '/admin/pending-approvals', roles: ['admin'] },
    { id: 'analytics-dashboard', label: 'Analytics Dashboard', icon: BarChart3, path: '/admin/analytics', roles: ['admin'] },
    { id: 'ai-predictions', label: 'AI Predictions', icon: Zap, path: '/admin/ai-predictions', roles: ['admin'] },
    { id: 'system-control', label: 'System Control', icon: Settings, path: '/admin/system', roles: ['admin'] },
    { id: 'cybersecurity', label: 'Security Monitoring', icon: Lock, path: '/admin/security', roles: ['admin'] },
    { id: 'integration-hub', label: 'Integration Hub', icon: Globe, path: '/admin/integrations', roles: ['admin'] },
    
    // Shared features
    { id: 'qr-scanner', label: 'QR Scanner', icon: Camera, path: '/qr-scanner', roles: ['admin', 'farmer', 'consumer', 'processor'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['admin', 'processor', 'regulator'] },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports', roles: ['admin', 'processor', 'regulator'] },
    { id: 'recall', label: 'Recall Simulation', icon: AlertTriangle, path: '/recall', roles: ['admin', 'regulator'] },
    
    // Universal features
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'farmer', 'consumer', 'processor', 'regulator'] }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    item.roles.includes(user?.role || 'consumer')
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'success': return <Leaf className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const sidebarVariants = React.useMemo(() => ({
    open: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: isDesktop ? 0 : "-100%", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  }), [isDesktop]);

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border shadow-lg lg:relative lg:translate-x-0 flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HerbalTrace</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Core Navigation */}
            <div className="space-y-2 mb-6">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Core
              </h3>
              {navigationItems
                .filter(item => ['dashboard', 'qr-scanner', 'analytics', 'reports'].includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                  (item.path === '/dashboard' && location.pathname === '/');
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        if (!isDesktop) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
            </div>

            {/* Role-specific sections */}
            {user?.role && (
              <div className="space-y-2 mb-6">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {user.role === 'farmer' && 'Farm Management'}
                  {user.role === 'processor' && 'Processing'}
                  {user.role === 'regulator' && 'Regulatory'}
                  {user.role === 'consumer' && 'Consumer Tools'}
                  {user.role === 'admin' && 'Administration'}
                </h3>
                {navigationItems
                  .filter(item => !['dashboard', 'qr-scanner', 'analytics', 'reports', 'profile', 'settings', 'recall'].includes(item.id))
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate(item.path);
                          if (!isDesktop) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
              </div>
            )}

            {/* System & Settings */}
            <div className="space-y-2">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System
              </h3>
              {navigationItems
                .filter(item => ['recall', 'profile', 'settings'].includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        if (!isDesktop) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role || 'Farmer'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-foreground">
                {navigationItems.find(item => item.path === location.pathname)?.label || 
                 navigationItems.find(item => item.path === '/dashboard')?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="notifications-button p-2 rounded-md hover:bg-accent relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Fullscreen toggle */}
              <button
                onClick={() => toggleFullscreen()}
                className="p-2 rounded-md hover:bg-accent"
                title={isFullscreenMode ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreenMode ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-accent"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {user?.name || 'User'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Notifications dropdown */}
      <AnimatePresence>
        {showNotifications && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="notifications-dropdown fixed top-20 right-6 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-md hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border last:border-b-0 hover:bg-accent transition-colors ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="p-1 rounded hover:bg-accent-foreground/10"
                          title="Mark as read"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 rounded hover:bg-accent-foreground/10"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <button
                onClick={() => {
                  setNotifications([]);
                  setShowNotifications(false);
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;