const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'herbaltrace-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: process.env.LOG_FILE_MAX_SIZE || 20971520, // 20MB
      maxFiles: process.env.LOG_FILE_MAX_FILES || 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: process.env.LOG_FILE_MAX_SIZE || 20971520, // 20MB
      maxFiles: process.env.LOG_FILE_MAX_FILES || 5
    })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// HTTP request logging middleware
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const userId = req.user ? req.user._id : 'anonymous';
  
  // Log request
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId,
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    // Log response
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0,
      userId,
      timestamp: new Date().toISOString()
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = loggerMiddleware;