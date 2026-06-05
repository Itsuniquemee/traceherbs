import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import TraceHerbs provider and hooks for real backend integration
import { TraceHerbsProvider, useAuth } from './hooks/useTraceHerbs';

// Import components
import PASLandingPage from './components/PASLandingPage';
import LandingPage from './components/LandingPage';

// Import marketing pages
import HomePage from './pages/marketing/HomePage';
import FeaturesPage from './pages/marketing/FeaturesPage';
import HowItWorksPage from './pages/marketing/HowItWorksPage';
import PricingPage from './pages/marketing/PricingPage';
import ResourcesPage from './pages/marketing/ResourcesPage';
import ModernDashboard from './components/ModernDashboard';
import CollectionForm from './components/CollectionForm';
import ConsumerPortal from './components/ConsumerPortal';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import RecallSimulation from './components/RecallSimulation';
import AdminPanel from './components/AdminPanel';
import FileUpload from './components/FileUpload';
import QRScanner from './components/QRScanner';
import TraceViewer from './components/TraceViewer';
import FarmerApp from './components/FarmerApp';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import UsersManagement from './components/UsersManagement';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Import farmer components
import FarmerCropUpload from './components/farmer/FarmerCropUpload';
import FarmerHarvestRecords from './components/farmer/FarmerHarvestRecords';
import FarmerDocuments from './components/farmer/FarmerDocuments';
import FarmerSupplyTracking from './components/farmer/FarmerSupplyTracking';
import FarmerQualityFeedback from './components/farmer/FarmerQualityFeedback';
import FarmerTransparencyCredits from './components/farmer/FarmerTransparencyCredits';
import FarmerQRGeneration from './components/farmer/FarmerQRGeneration';

// Import processor components
import ProcessorReceiveBatches from './components/processor/ProcessorReceiveBatches';
import ProcessorRecords from './components/processor/ProcessorRecords';
import ProcessorQualityTests from './components/processor/ProcessorQualityTests';
import ProcessorQRGeneration from './components/processor/ProcessorQRGeneration';
import ProcessorChainOfCustody from './components/processor/ProcessorChainOfCustody';

// Import consumer components
import ConsumerScanner from './components/consumer/ConsumerScanner';
import ConsumerCompare from './components/consumer/ConsumerCompare';
import ConsumerAuthenticity from './components/consumer/ConsumerAuthenticity';
import ConsumerReviews from './components/consumer/ConsumerReviews';
import ConsumerReportFraud from './components/consumer/ConsumerReportFraud';

// Import admin components
import AdminUserManagement from './components/AdminUserManagement';
import AdminAnalyticsDashboard from './components/AdminAnalyticsDashboard';
import AdminAIPredictions from './components/AdminAIPredictions';
import AdminSystemControl from './components/AdminSystemControl';
import AdminSecurityMonitoring from './components/AdminSecurityMonitoring';
import AdminIntegrationHub from './components/AdminIntegrationHub';
import AdminPendingApprovals from './components/AdminPendingApprovals';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c7744', // Ayurvedic green
      light: '#5a9c6b',
      dark: '#1f5130',
    },
    secondary: {
      main: '#5a3f37', // Earth brown
      light: '#8a6d65',
      dark: '#3e2c25',
    },
    background: {
      default: '#f5f7f9',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Auth context for managing user state
export const AuthContext = React.createContext();

// Main app wrapper that handles routing and page state
const AppWrapper = ({ user, onLogout, onProfileUpdate }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Page change handler
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <Routes>
      {/* Marketing Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />      {/* Legacy landing pages */}
      <Route path="/pas-landing" element={<PASLandingPage />} />
      <Route path="/home" element={<PASLandingPage />} />
      
      {/* Login and Signup routes - no layout */}
      <Route path="/login" element={<Login onLogin={onProfileUpdate} />} />
      <Route path="/signup" element={<Signup onSignup={onProfileUpdate} />} />
      
      {/* Dashboard route */}
      <Route path="/dashboard" element={user ? <RoleBasedRedirect user={user} /> : <Navigate to="/" />} />
      
      {/* Protected app routes with MainLayout */}
      <Route path="/app/*" element={
        <MainLayout 
          user={user} 
          onLogout={onLogout}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        >
          <Routes>
            <Route path="main-dashboard" element={<ModernDashboard />} />
        <Route path="collect" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer', 'processor']}>
            <CollectionForm />
          </ProtectedRoute>
        } />
        <Route path="collection" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer', 'processor']}>
            <CollectionForm />
          </ProtectedRoute>
        } />
        <Route path="consumer" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerPortal />
          </ProtectedRoute>
        } />
        <Route path="consumer-portal" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerPortal />
          </ProtectedRoute>
        } />
        <Route path="farmer-app" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerApp />
          </ProtectedRoute>
        } />
        
        {/* Farmer specific routes */}
        <Route path="farmer/crop-upload" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerCropUpload />
          </ProtectedRoute>
        } />
        <Route path="/farmer/harvest-data" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerHarvestRecords />
          </ProtectedRoute>
        } />
        <Route path="/farmer/documents" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerDocuments />
          </ProtectedRoute>
        } />
        <Route path="/farmer/supply-tracking" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerSupplyTracking />
          </ProtectedRoute>
        } />
        <Route path="/farmer/feedback" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerQualityFeedback />
          </ProtectedRoute>
        } />
        <Route path="/farmer/credits" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerTransparencyCredits />
          </ProtectedRoute>
        } />
        <Route path="/farmer/generate-qr" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerQRGeneration />
          </ProtectedRoute>
        } />
        
        {/* Processor specific routes */}
        <Route path="/processor/receive-batches" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor']}>
            <ProcessorReceiveBatches />
          </ProtectedRoute>
        } />
        <Route path="/processor/processing-steps" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor']}>
            <ProcessorRecords />
          </ProtectedRoute>
        } />
        <Route path="/processor/quality-tests" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor']}>
            <ProcessorQualityTests />
          </ProtectedRoute>
        } />
        <Route path="/processor/generate-qr" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor']}>
            <ProcessorQRGeneration />
          </ProtectedRoute>
        } />
        <Route path="/processor/chain-custody" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor']}>
            <ProcessorChainOfCustody />
          </ProtectedRoute>
        } />
        
        {/* Consumer specific routes */}
        <Route path="consumer/scanner" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerScanner />
          </ProtectedRoute>
        } />
        <Route path="consumer/compare" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerCompare />
          </ProtectedRoute>
        } />
        <Route path="consumer/authenticity" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerAuthenticity />
          </ProtectedRoute>
        } />
        <Route path="consumer/reviews" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerReviews />
          </ProtectedRoute>
        } />
        <Route path="consumer/report-fraud" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerReportFraud />
          </ProtectedRoute>
        } />
        
        {/* Admin specific routes */}
        <Route path="admin/users" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminUserManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/pending-approvals" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminPendingApprovals />
          </ProtectedRoute>
        } />
        <Route path="admin/analytics" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminAnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/ai-predictions" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminAIPredictions />
          </ProtectedRoute>
        } />
        <Route path="admin/system" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminSystemControl />
          </ProtectedRoute>
        } />
        <Route path="admin/security" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminSecurityMonitoring />
          </ProtectedRoute>
        } />
        <Route path="admin/integrations" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminIntegrationHub />
          </ProtectedRoute>
        } />
        
        <Route path="/qrscan" element={<QRScanner />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/trace/:traceId" element={<TraceViewer />} />
        <Route path="/analytics" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor', 'regulator']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/recall" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'regulator']}>
            <RecallSimulation />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'processor', 'regulator']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <UsersManagement />
          </ProtectedRoute>
        } />
            <Route path="profile" element={<UserProfile user={user} onUpdate={onProfileUpdate} />} />
            <Route path="settings" element={<Settings />} />
            <Route path="upload" element={<FileUpload />} />
            <Route path="*" element={<Navigate to="/main-dashboard" />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem('ayurvedicTraceUser', JSON.stringify(userData));
  };

  // Memoize context value to avoid unnecessary re-renders
  const authContextValue = React.useMemo(() => ({ user, setUser: handleLogin }), [user]);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('ayurvedicTraceUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem('ayurvedicTraceUser');
  };



  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          <CircularProgress size={60} thickness={4} sx={{ color: '#2c7744', mb: 2 }} />
          <Box sx={{ typography: 'h6', color: 'text.secondary' }}>
            Ayurvedic Traceability System
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <Box className="App" sx={{ minHeight: '100vh', width: '100%' }}>
            <AppWrapper user={user} onLogout={handleLogout} onProfileUpdate={handleLogin} />
          </Box>
          
          {/* Toast notifications for real-time feedback */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          
          {/* React Hot Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;