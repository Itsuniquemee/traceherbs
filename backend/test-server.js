require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    success: true,
    message: 'TraceHerbss Backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint requested');
  res.json({
    success: true,
    message: 'Test endpoint working!',
    data: {
      server: 'TraceHerbss Backend',
      version: '1.0.0',
      endpoints: [
        '/api/health',
        '/api/test'
      ]
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TraceHerbss Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;