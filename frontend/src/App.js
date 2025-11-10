import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, CircularProgress } from '@mui/material';
import './App.css';

// Import components
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

// Import farmer components
import FarmerCropUpload from './components/farmer/FarmerCropUpload';
import FarmerHarvestRecords from './components/farmer/FarmerHarvestRecords';
import FarmerDocuments from './components/farmer/FarmerDocuments';
import FarmerSupplyTracking from './components/farmer/FarmerSupplyTracking';
import FarmerQualityFeedback from './components/farmer/FarmerQualityFeedback';
import FarmerTransparencyCredits from './components/farmer/FarmerTransparencyCredits';

// Import processor components
import ProcessorReceiveBatches from './components/processor/ProcessorReceiveBatches';
import ProcessorRecords from './components/processor/ProcessorRecords';
import ProcessorQualityTests from './components/processor/ProcessorQualityTests';
import ProcessorQRGeneration from './components/processor/ProcessorQRGeneration';
import ProcessorChainOfCustody from './components/processor/ProcessorChainOfCustody';

// Import admin components
import AdminUserManagement from './components/AdminUserManagement';
import AdminAnalyticsDashboard from './components/AdminAnalyticsDashboard';
import AdminAIPredictions from './components/AdminAIPredictions';
import AdminSystemControl from './components/AdminSystemControl';
import AdminSecurityMonitoring from './components/AdminSecurityMonitoring';
import AdminIntegrationHub from './components/AdminIntegrationHub';

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
    <MainLayout 
      user={user} 
      onLogout={onLogout}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      <Routes>
        <Route path="/" element={<ModernDashboard />} />
        <Route path="/dashboard" element={<ModernDashboard />} />
        <Route path="/collect" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer', 'processor']}>
            <CollectionForm />
          </ProtectedRoute>
        } />
        <Route path="/collection" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer', 'processor']}>
            <CollectionForm />
          </ProtectedRoute>
        } />
        <Route path="/consumer" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerPortal />
          </ProtectedRoute>
        } />
        <Route path="/consumer-portal" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'consumer']}>
            <ConsumerPortal />
          </ProtectedRoute>
        } />
        <Route path="/farmer-app" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'farmer']}>
            <FarmerApp />
          </ProtectedRoute>
        } />
        
        {/* Farmer specific routes */}
        <Route path="/farmer/crop-upload" element={
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
        
        {/* Admin specific routes */}
        <Route path="/admin/users" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminUserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminAnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/ai-predictions" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminAIPredictions />
          </ProtectedRoute>
        } />
        <Route path="/admin/system" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminSystemControl />
          </ProtectedRoute>
        } />
        <Route path="/admin/security" element={
          <ProtectedRoute user={user} requiredRoles={['admin']}>
            <AdminSecurityMonitoring />
          </ProtectedRoute>
        } />
        <Route path="/admin/integrations" element={
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
        <Route path="/profile" element={<UserProfile user={user} onUpdate={onProfileUpdate} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

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

  // Handle user profile update
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ayurvedicTraceUser', JSON.stringify(updatedUser));
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

  // Extract main content logic for clarity
  let mainContent;
  if (user) {
    mainContent = <AppWrapper user={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
  } else if (showSignup) {
    mainContent = (
      <Signup 
        onSignup={(userData) => {
          handleLogin(userData);
          setShowSignup(false);
        }} 
        onBackToLogin={() => setShowSignup(false)}
      />
    );
  } else {
    mainContent = (
      <>
        <Login onLogin={handleLogin} />
        <Box sx={{ textAlign: 'center', mt: 2, p: 2 }}>
          <Button 
            variant="text" 
            onClick={() => setShowSignup(true)}
            sx={{ textTransform: 'none' }}
          >
            Don't have an account? Sign up
          </Button>
        </Box>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <Box className="App" sx={{ minHeight: '100vh', width: '100%' }}>
            {mainContent}
          </Box>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;