#!/usr/bin/env node

// TraceHerbss Backend Server - Complete Working Version

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import models
const User = require('./models/User');

console.log('🚀 Initializing TraceHerbss Backend...');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for approvals (in production, use database)
let approvedUsers = new Set();
let rejectedUsers = new Set();

// Basic middleware
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 ${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traceherbss');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Don't exit in development, continue without DB for basic testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Initialize DB connection
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,
    message: 'TraceHerbss Backend is running!',
    timestamp: new Date().toISOString(),
    server: {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    },
    database: {
      status: dbStates[dbStatus] || 'unknown',
      uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'Not configured'
    },
    apis: {
      available: [
        'GET /api/health',
        'GET /api/status',
        'POST /api/auth/login',
        'POST /api/auth/register',
        'GET /api/farmer/dashboard',
        'GET /api/processor/dashboard',
        'GET /api/consumer/verify/:qrCode',
        'GET /api/admin/users'
      ]
    }
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mock authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate user using the User model
    const result = await User.getAuthenticated(email, password);

    if (result.reason) {
      let message = 'Invalid credentials';
      let statusCode = 401;

      switch (result.reason) {
        case 'User not found':
          message = 'No account found with this email';
          statusCode = 404;
          break;
        case 'Account locked':
          message = 'Account temporarily locked due to too many failed login attempts';
          statusCode = 423;
          break;
        case 'Invalid credentials':
          message = 'Invalid email or password';
          statusCode = 401;
          break;
      }

      return res.status(statusCode).json({
        success: false,
        message
      });
    }

    const { user } = result;

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check if user is approved by admin (for non-consumer roles)
    if (typeof user.isApproved !== 'undefined' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is awaiting admin approval. You will be notified once approved.'
      });
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        profilePicture: user.profilePicture,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role, phone } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields (username, email, password, firstName, lastName) are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user (will be pending approval by default)
    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'farmer',
      phone: phone || '',
      isApproved: false, // New users require approval
      isVerified: false,
      isActive: true
    };

    const newUser = new User(userData);
    await newUser.save();

    console.log(`📝 New user registered: ${email} (${role || 'farmer'}) - Pending Approval`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        status: 'pending_approval'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Mock dashboard endpoints
app.get('/api/farmer/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalBatches: 25,
      activeCrops: 8,
      pendingTests: 3,
      recentActivity: [
        { id: 1, action: 'Batch created', batch: 'HERB-2024-001', timestamp: new Date() },
        { id: 2, action: 'Quality test completed', batch: 'HERB-2024-002', timestamp: new Date() }
      ]
    }
  });
});

// Farmer QR Generation Endpoints

// Get farmer batches
app.get('/api/farmer/batches', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'FB_TUL_2024_001',
        cropName: 'Tulsi (Holy Basil)',
        variety: 'Krishna Tulsi',
        harvestDate: '2024-01-15',
        quantity: '500 kg',
        farmLocation: 'Bulandsahar, UP',
        organicCertified: true,
        qualityGrade: 'A+',
        moistureContent: '8.5%',
        status: 'harvested',
        createdAt: new Date('2024-01-15').toISOString(),
        qrGenerated: false
      },
      {
        id: 'FB_GIN_2024_002',
        cropName: 'Ginger',
        variety: 'Dry Ginger',
        harvestDate: '2024-02-10',
        quantity: '750 kg',
        farmLocation: 'Bulandsahar, UP',
        organicCertified: true,
        qualityGrade: 'A',
        moistureContent: '12%',
        status: 'processed',
        createdAt: new Date('2024-02-10').toISOString(),
        qrGenerated: true,
        qrCode: 'QR_FB_GIN_2024_002'
      }
    ]
  });
});

// Generate QR for farmer batch
app.post('/api/farmer/generate-qr', (req, res) => {
  const { batchId, qrData } = req.body;
  
  if (!batchId) {
    return res.status(400).json({
      success: false,
      message: 'Batch ID is required'
    });
  }

  const qrCode = `QR_${batchId}_${Date.now()}`;
  
  console.log(`🔗 Generated QR code for farmer batch ${batchId}: ${qrCode}`);
  
  res.json({
    success: true,
    message: 'QR code generated successfully',
    data: {
      qrCode: qrCode,
      batchId: batchId,
      qrUrl: `https://traceherbss.com/verify/${qrCode}`,
      generatedAt: new Date().toISOString(),
      farmerName: 'Tanvi Farmer',
      farmLocation: 'Bulandsahar, UP'
    }
  });
});

// Get farmer QR codes
app.get('/api/farmer/qr-codes', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'QR_FB_TUL_2024_001',
        batchId: 'FB_TUL_2024_001',
        cropName: 'Tulsi (Holy Basil)',
        qrCode: 'QR_FB_TUL_2024_001',
        qrUrl: 'https://traceherbss.com/verify/QR_FB_TUL_2024_001',
        generatedAt: '2024-01-15T10:30:00Z',
        status: 'active',
        scanCount: 15,
        lastScanned: '2024-01-20T14:22:00Z'
      },
      {
        id: 'QR_FB_GIN_2024_002',
        batchId: 'FB_GIN_2024_002',
        cropName: 'Ginger',
        qrCode: 'QR_FB_GIN_2024_002',
        qrUrl: 'https://traceherbss.com/verify/QR_FB_GIN_2024_002',
        generatedAt: '2024-02-10T09:15:00Z',
        status: 'active',
        scanCount: 8,
        lastScanned: '2024-02-15T11:45:00Z'
      }
    ]
  });
});

app.get('/api/processor/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      batchesReceived: 45,
      processingQueue: 12,
      completedProcessing: 33,
      qualityTests: {
        passed: 28,
        failed: 2,
        pending: 3
      }
    }
  });
});

app.get('/api/consumer/verify/:qrCode', (req, res) => {
  const { qrCode } = req.params;
  
  res.json({
    success: true,
    data: {
      batchId: qrCode,
      product: {
        name: 'Organic Turmeric',
        category: 'Spices',
        origin: 'Karnataka, India'
      },
      farmer: {
        name: 'Rajesh Kumar',
        farmName: 'Green Valley Farm',
        location: 'Mysore, Karnataka'
      },
      journey: [
        { stage: 'Cultivation', date: '2024-01-15', location: 'Green Valley Farm' },
        { stage: 'Harvest', date: '2024-06-20', location: 'Green Valley Farm' },
        { stage: 'Processing', date: '2024-06-25', location: 'Spice Processing Unit' },
        { stage: 'Quality Test', date: '2024-06-27', status: 'Passed' },
        { stage: 'Packaging', date: '2024-06-30', location: 'Packaging Facility' }
      ],
      certificates: ['Organic', 'Quality Tested', 'Traceable'],
      verified: true
    }
  });
});

// Real pending users endpoint for admin approval
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = { isApproved: false };
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { username: new RegExp(search, 'i') }
      ];
    }

    const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip(startIndex);

    res.json({ 
      success: true, 
      count: users.length, 
      total, 
      data: users 
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending users' });
  }
});

// Real approve user endpoint
app.put('/api/admin/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isApproved) {
      return res.json({ success: true, message: 'User already approved', data: user });
    }

    user.isApproved = true;
    await user.save();

    console.log(`✅ User ${user._id} (${user.email}) approved successfully`);

    res.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: user._id,
        status: 'approved',
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ success: false, message: 'Error approving user' });
  }
});

// Mock reject user endpoint  
app.put('/api/admin/users/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  // Add to rejected users
  rejectedUsers.add(id);
  
  // Remove from approved if it was there
  approvedUsers.delete(id);
  
  console.log(`❌ User ${id} rejected. Rejected users:`, Array.from(rejectedUsers));
  
  res.json({
    success: true,
    message: 'User rejected successfully',
    user: {
      id: id,
      status: 'rejected',
      reason: reason || 'No reason provided'
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 150,
      users: [
        { id: 1, email: 'farmer1@example.com', role: 'farmer', status: 'active' },
        { id: 2, email: 'processor1@example.com', role: 'processor', status: 'active' },
        { id: 3, email: 'consumer1@example.com', role: 'consumer', status: 'active' }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 150,
        pages: 15
      }
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    title: 'TraceHerbss API Documentation',
    version: '1.0.0',
    description: 'Complete herbal traceability platform API',
    endpoints: {
      health: 'GET /api/health - Server health check',
      status: 'GET /api/status - System status',
      auth: {
        login: 'POST /api/auth/login - User login',
        register: 'POST /api/auth/register - User registration'
      },
      farmer: {
        dashboard: 'GET /api/farmer/dashboard - Farmer dashboard data'
      },
      processor: {
        dashboard: 'GET /api/processor/dashboard - Processor dashboard data'
      },
      consumer: {
        verify: 'GET /api/consumer/verify/:qrCode - Verify product by QR code'
      },
      admin: {
        users: 'GET /api/admin/users - List all users'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TraceHerbss API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    suggestion: 'Check /api/docs for available endpoints'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎯═══════════════════════════════════════════════════════🎯');
  console.log('🌿         TraceHerbss Backend Server Started!          🌿');
  console.log('🎯═══════════════════════════════════════════════════════🎯');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📚 Docs:   http://localhost:${PORT}/api/docs`);
  console.log(`🌍 Env:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 DB:     ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log('🎯═══════════════════════════════════════════════════════🎯');
  console.log('');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
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
  console.log('Promise:', promise);
  
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

console.log('✨ TraceHerbss Backend initialized');

module.exports = { app, server };