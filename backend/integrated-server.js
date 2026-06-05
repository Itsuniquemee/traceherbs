require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

console.log('🚀 Initializing TraceHerbss Backend with Full Integration...');

const app = express();
const PORT = process.env.PORT || 3001;

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import route modules
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');
const processorRoutes = require('./routes/processor');
const consumerRoutes = require('./routes/consumer');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const qrRoutes = require('./routes/qr');
const traceRoutes = require('./routes/trace');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const collectionRoutes = require('./routes/collection');
const fhirRoutes = require('./routes/fhir');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 ${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Database connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traceherbss', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      
      // Set up database event listeners
      mongoose.connection.on('error', (err) => {
        console.error('📊 MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('📊 MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('📊 MongoDB reconnected');
      });

      return conn;
    } catch (error) {
      retries++;
      console.error(`❌ Database connection attempt ${retries} failed:`, error.message);
      
      if (retries === maxRetries) {
        if (process.env.NODE_ENV === 'production') {
          console.error('💥 Could not connect to MongoDB. Exiting...');
          process.exit(1);
        } else {
          console.log('⚠️ Continuing without database in development mode');
          break;
        }
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Initialize database connection
connectDB();

// Health check endpoint (enhanced)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };

  const healthData = {
    success: true,
    message: 'TraceHerbss Backend is running with full integration!',
    timestamp: new Date().toISOString(),
    server: {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      cpu: process.cpuUsage()
    },
    database: {
      status: dbStates[dbStatus] || 'unknown',
      name: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0
    },
    features: {
      authentication: true,
      fileUpload: true,
      qrGeneration: true,
      notifications: true,
      analytics: true,
      reporting: true
    },
    endpoints: {
      total: 150,
      modules: [
        'Authentication',
        'Farmer Management', 
        'Processor Operations',
        'Consumer Portal',
        'Admin Dashboard',
        'Analytics & Reports',
        'QR Code System',
        'Product Tracing',
        'Notifications',
        'File Upload',
        'User Management'
      ]
    }
  };

  // Set appropriate status code based on database connection
  const statusCode = dbStatus === 1 ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// API routes (Full Integration)
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/processor', processorRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/trace', traceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/fhir', fhirRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    title: 'TraceHerbss API - Complete Integration',
    version: '2.0.0',
    description: 'Full-featured herbal traceability platform API with real data storage',
    baseUrl: `http://localhost:${PORT}/api`,
    authentication: 'JWT Bearer Token',
    modules: {
      auth: {
        description: 'User authentication and authorization',
        endpoints: [
          'POST /api/auth/register - User registration',
          'POST /api/auth/login - User authentication', 
          'GET /api/auth/me - Get current user',
          'POST /api/auth/logout - User logout',
          'POST /api/auth/forgot-password - Password reset request',
          'POST /api/auth/reset-password - Reset password',
          'PUT /api/auth/change-password - Change password'
        ]
      },
      farmer: {
        description: 'Farmer portal and batch management',
        endpoints: [
          'GET /api/farmer/dashboard - Farmer dashboard',
          'GET /api/farmer/batches - List farmer batches',
          'POST /api/farmer/batches - Create new batch',
          'GET /api/farmer/batches/:id - Get batch details',
          'PUT /api/farmer/batches/:id - Update batch',
          'POST /api/farmer/cultivation - Add cultivation data',
          'POST /api/farmer/harvest - Record harvest',
          'POST /api/farmer/documents - Upload documents',
          'GET /api/farmer/sustainability - Sustainability metrics'
        ]
      },
      processor: {
        description: 'Processing operations and quality control',
        endpoints: [
          'GET /api/processor/dashboard - Processor dashboard',
          'POST /api/processor/receive - Receive batch',
          'GET /api/processor/batches - Processing batches',
          'POST /api/processor/quality-tests - Quality testing',
          'POST /api/processor/generate-qr - Generate QR codes',
          'POST /api/processor/transfer - Transfer batches'
        ]
      },
      consumer: {
        description: 'Product verification and traceability',
        endpoints: [
          'GET /api/consumer/trace/:batchId - Product traceability',
          'GET /api/consumer/verify/:qrCode - QR verification',
          'GET /api/consumer/search - Search products',
          'POST /api/consumer/feedback - Submit feedback',
          'POST /api/consumer/reviews - Product reviews'
        ]
      },
      admin: {
        description: 'Administrative functions and system management',
        endpoints: [
          'GET /api/admin/dashboard - Admin dashboard',
          'GET /api/admin/users - User management',
          'GET /api/admin/batches - All system batches',
          'GET /api/admin/analytics - Platform analytics',
          'GET /api/admin/reports - System reports'
        ]
      },
      collection: {
        description: 'Geo-tagged collection events and FHIR bundles',
        endpoints: [
          'POST /api/collection - record a geo-tagged collection event',
          'GET /api/collection?batchId=... - list collection events',
          'GET /api/fhir/bundle/:batchId - FHIR-style provenance bundle'
        ]
      }
    },
    examples: {
      authentication: `curl -X POST ${req.protocol}://${req.get('host')}/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'`,
      createBatch: `curl -X POST ${req.protocol}://${req.get('host')}/api/farmer/batches -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"product":{"name":"Organic Turmeric","category":"Spices"}}'`,
      verifyProduct: `curl ${req.protocol}://${req.get('host')}/api/consumer/verify/QR123456`
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TraceHerbss API - Full Integration Active',
    version: '2.0.0',
    features: [
      'Real database storage',
      'Complete authentication system', 
      'Full traceability chain',
      'Advanced analytics',
      'QR code generation',
      'File upload system',
      'Notification system',
      'Report generation'
    ],
    endpoints: {
      health: '/api/health',
      documentation: '/api/docs',
      authentication: '/api/auth/*',
      farmer: '/api/farmer/*',
      processor: '/api/processor/*', 
      consumer: '/api/consumer/*',
      admin: '/api/admin/*'
    },
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'
  });
});

// 404 handler for API routes
app.use('/api/*', notFound);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎯═══════════════════════════════════════════════════════════════🎯');
  console.log('🌿            TraceHerbss Backend - FULL INTEGRATION             🌿');
  console.log('🎯═══════════════════════════════════════════════════════════════🎯');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📚 Docs:   http://localhost:${PORT}/api/docs`);
  console.log(`🌍 Env:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 DB:     ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🔧 APIs:   150+ endpoints across 12 modules`);
  console.log(`💾 Storage: Real MongoDB database with persistence`);
  console.log('🎯═══════════════════════════════════════════════════════════════🎯');
  console.log('');
  console.log('✨ Features Active:');
  console.log('   ✅ Authentication & Authorization');
  console.log('   ✅ Farmer Batch Management');
  console.log('   ✅ Processor Quality Control');
  console.log('   ✅ Consumer Product Verification');
  console.log('   ✅ Admin System Management');
  console.log('   ✅ Analytics & Reporting');
  console.log('   ✅ QR Code Generation');
  console.log('   ✅ File Upload & Storage');
  console.log('   ✅ Real-time Notifications');
  console.log('   ✅ Complete Traceability Chain');
  console.log('');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received`);
  console.log('🔄 Graceful shutdown initiated...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    } catch (err) {
      console.error('❌ Error closing MongoDB:', err.message);
    }
    
    console.log('👋 Shutdown complete');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Force closing server...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('💥 Unhandled Promise Rejection:');
  console.log('Error:', err.message);
  console.log('Stack:', err.stack);
  
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('Unhandled Rejection');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('💥 Uncaught Exception:');
  console.log('Error:', err.message);
  console.log('Stack:', err.stack);
  
  gracefulShutdown('Uncaught Exception');
});

console.log('✨ TraceHerbss Backend - Full Integration Ready');

module.exports = { app, server };