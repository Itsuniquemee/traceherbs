const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const winston = require('winston');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const farmerRoutes = require('./routes/farmer');
const processorRoutes = require('./routes/processor');
const consumerRoutes = require('./routes/consumer');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const traceRoutes = require('./routes/trace');
const qrRoutes = require('./routes/qr');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Winston logger configuration
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'herbaltrace-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization middleware
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'https://traceherbs.vercel.app'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging middleware
app.use(logger);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbaltrace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  winstonLogger.info('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  winstonLogger.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/processor', processorRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trace', traceRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Herbal Traceability Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      farmer: '/api/farmer',
      processor: '/api/processor',
      consumer: '/api/consumer',
      admin: '/api/admin',
      analytics: '/api/analytics',
      trace: '/api/trace',
      qr: '/api/qr',
      reports: '/api/reports',
      notifications: '/api/notifications',
      upload: '/api/upload'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  winstonLogger.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  winstonLogger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  winstonLogger.info(`Server started on port ${PORT}`);
});
