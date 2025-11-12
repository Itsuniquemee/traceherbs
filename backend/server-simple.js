require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traceherbss';

// Basic middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({
    success: true,
    message: 'TraceHerbss Backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test authentication endpoint
app.post('/api/auth/test', (req, res) => {
  console.log('🔐 Auth test requested');
  res.json({
    success: true,
    message: 'Authentication endpoint working',
    receivedData: req.body
  });
});

// List all routes
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        method: Object.keys(middleware.route.methods)[0].toUpperCase()
      });
    }
  });
  res.json({ routes });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/test', 
      'GET /api/routes'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎯═══════════════════════════════════════🎯');
  console.log('🚀 TraceHerbss Backend Server STARTED!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Routes list: http://localhost:${PORT}/api/routes`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🎯═══════════════════════════════════════🎯');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`💥 Unhandled Promise Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;