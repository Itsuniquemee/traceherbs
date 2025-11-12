# 🔧 TraceHerbss Backend API - Complete Function Reference

## 📊 Overview

The TraceHerbss backend provides a comprehensive REST API with 150+ endpoints organized into 12 main modules. Here's the complete function reference:

## 🚀 Currently Available in Working Server

### Core System Endpoints

#### 🏥 Health & Status
- `GET /api/health` - Server health check with full system status
- `GET /api/status` - System operational status
- `GET /api/docs` - API documentation and endpoint list
- `GET /` - Root endpoint with welcome message

#### 🔐 Authentication (Mock Implementation)
- `POST /api/auth/login` - User authentication with JWT
- `POST /api/auth/register` - New user registration

#### 📊 Dashboard Endpoints (Mock Data)
- `GET /api/farmer/dashboard` - Farmer dashboard with batch statistics
- `GET /api/processor/dashboard` - Processor overview with quality metrics
- `GET /api/consumer/verify/:qrCode` - Product verification via QR code
- `GET /api/admin/users` - User management with pagination

---

## 🗂️ Complete API Module Reference

### 1. 🔐 Authentication Module (`/api/auth`)

#### Available Functions:
```javascript
// User Authentication
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // User login with JWT
POST   /api/auth/logout            // User logout
GET    /api/auth/me                // Get current user profile
POST   /api/auth/refresh-token     // Refresh JWT token

// Password Management
POST   /api/auth/forgot-password   // Request password reset
POST   /api/auth/reset-password    // Reset password with token
PUT    /api/auth/change-password   // Change current password

// Email Verification
POST   /api/auth/send-verification // Send email verification
POST   /api/auth/verify-email      // Verify email with token
POST   /api/auth/resend-verification // Resend verification email
```

#### Key Features:
- JWT token authentication
- Role-based access control (farmer, processor, consumer, admin, regulator)
- Password hashing with bcrypt
- Email verification system
- Account lockout protection
- Token refresh mechanism

---

### 2. 👨‍🌾 Farmer Module (`/api/farmer`)

#### Available Functions:
```javascript
// Dashboard & Analytics
GET    /api/farmer/dashboard       // Farmer dashboard overview
GET    /api/farmer/analytics       // Farm performance analytics
GET    /api/farmer/profile         // Farmer profile details
PUT    /api/farmer/profile         // Update farmer profile

// Batch Management
GET    /api/farmer/batches         // List all batches
POST   /api/farmer/batches         // Create new batch
GET    /api/farmer/batches/:id     // Get specific batch
PUT    /api/farmer/batches/:id     // Update batch details
DELETE /api/farmer/batches/:id     // Delete batch

// Crop & Cultivation
GET    /api/farmer/crops           // List crop varieties
POST   /api/farmer/crops           // Add new crop type
GET    /api/farmer/cultivation/:batchId // Get cultivation details
PUT    /api/farmer/cultivation/:batchId // Update cultivation info

// Harvest Management
POST   /api/farmer/harvest         // Record harvest data
GET    /api/farmer/harvest/:batchId // Get harvest details
PUT    /api/farmer/harvest/:batchId // Update harvest record

// Documents & Compliance
POST   /api/farmer/documents       // Upload documents
GET    /api/farmer/documents/:batchId // Get batch documents
DELETE /api/farmer/documents/:id   // Delete document

// Sustainability
GET    /api/farmer/sustainability  // Sustainability metrics
POST   /api/farmer/sustainability  // Record sustainability data
GET    /api/farmer/transparency-credits // Transparency credit system
```

---

### 3. 🏭 Processor Module (`/api/processor`)

#### Available Functions:
```javascript
// Dashboard & Overview
GET    /api/processor/dashboard    // Processor dashboard
GET    /api/processor/analytics    // Processing analytics
GET    /api/processor/profile      // Processor profile
PUT    /api/processor/profile      // Update profile

// Batch Processing
POST   /api/processor/receive      // Receive batch from farmer
GET    /api/processor/batches      // List processing batches
GET    /api/processor/batches/:id  // Get batch details
PUT    /api/processor/processing/:id // Update processing status

// Quality Testing
GET    /api/processor/quality-tests // List quality tests
POST   /api/processor/quality-tests // Create new test
GET    /api/processor/quality-tests/:id // Get test results
PUT    /api/processor/quality-tests/:id // Update test results

// QR Code Generation
POST   /api/processor/generate-qr  // Generate QR codes
GET    /api/processor/qr-codes     // List generated QR codes
GET    /api/processor/qr-codes/:batchId // Get QR for batch

// Chain of Custody
POST   /api/processor/transfer     // Transfer batch
GET    /api/processor/transfers    // List transfers
GET    /api/processor/chain-custody/:batchId // Chain of custody

// Processing Steps
POST   /api/processor/steps        // Add processing step
GET    /api/processor/steps/:batchId // Get processing steps
PUT    /api/processor/steps/:stepId // Update step
```

---

### 4. 🛍️ Consumer Module (`/api/consumer`)

#### Available Functions:
```javascript
// Product Verification
GET    /api/consumer/verify/:qrCode // Verify product by QR
POST   /api/consumer/scan          // Scan QR code
GET    /api/consumer/product/:id   // Get product details

// Traceability
GET    /api/consumer/trace/:traceId // Complete product journey
GET    /api/consumer/timeline/:batchId // Product timeline
GET    /api/consumer/journey/:batchId // Supply chain journey

// Search & Discovery
GET    /api/consumer/search        // Search products
GET    /api/consumer/categories    // Product categories
GET    /api/consumer/filters       // Available filters

// User Interaction
POST   /api/consumer/feedback      // Submit feedback
GET    /api/consumer/feedback/:productId // Get feedback
POST   /api/consumer/favorite      // Add to favorites
GET    /api/consumer/favorites     // Get favorites list
DELETE /api/consumer/favorites/:id // Remove favorite

// Reviews & Ratings
POST   /api/consumer/reviews       // Submit review
GET    /api/consumer/reviews/:productId // Get reviews
PUT    /api/consumer/reviews/:id   // Update review
DELETE /api/consumer/reviews/:id   // Delete review
```

---

### 5. ⚙️ Admin Module (`/api/admin`)

#### Available Functions:
```javascript
// Dashboard & Analytics
GET    /api/admin/dashboard        // Admin dashboard overview
GET    /api/admin/analytics        // System analytics
GET    /api/admin/stats            // Platform statistics

// User Management
GET    /api/admin/users            // List all users
POST   /api/admin/users            // Create new user
GET    /api/admin/users/:id        // Get user details
PUT    /api/admin/users/:id        // Update user
DELETE /api/admin/users/:id        // Delete user
POST   /api/admin/users/:id/verify // Verify user account
POST   /api/admin/users/:id/suspend // Suspend user

// Batch Management
GET    /api/admin/batches          // List all batches
GET    /api/admin/batches/:id      // Get batch details
PUT    /api/admin/batches/:id      // Update batch
DELETE /api/admin/batches/:id      // Delete batch

// System Configuration
GET    /api/admin/config           // Get system config
PUT    /api/admin/config           // Update config
GET    /api/admin/settings         // Platform settings
PUT    /api/admin/settings         // Update settings

// Reports & Compliance
GET    /api/admin/reports          // Generate reports
GET    /api/admin/audit-logs       // Audit trail
GET    /api/admin/compliance       // Compliance status
POST   /api/admin/backup           // System backup

// AI & Predictions
GET    /api/admin/ai-insights      // AI-driven insights
POST   /api/admin/predict-quality  // Quality predictions
GET    /api/admin/anomaly-detection // Detect anomalies
```

---

### 6. 📊 Analytics Module (`/api/analytics`)

#### Available Functions:
```javascript
// Platform Analytics
GET    /api/analytics/overview     // Platform overview
GET    /api/analytics/supply-chain // Supply chain metrics
GET    /api/analytics/performance  // Performance metrics

// Role-based Analytics
GET    /api/analytics/farmer       // Farmer analytics
GET    /api/analytics/processor    // Processor analytics
GET    /api/analytics/consumer     // Consumer analytics

// Quality & Traceability
GET    /api/analytics/quality      // Quality analytics
GET    /api/analytics/traceability // Traceability metrics
GET    /api/analytics/sustainability // Sustainability metrics

// Business Intelligence
GET    /api/analytics/trends       // Market trends
GET    /api/analytics/predictions  // Predictive analytics
GET    /api/analytics/insights     // Business insights
```

---

### 7. 🔍 QR Code Module (`/api/qr`)

#### Available Functions:
```javascript
// QR Generation
POST   /api/qr/generate/:batchId   // Generate QR code
GET    /api/qr/:batchId            // Get existing QR code
PUT    /api/qr/:batchId            // Update QR code

// QR Scanning & Validation
POST   /api/qr/scan               // Scan QR code
POST   /api/qr/validate           // Validate QR code
GET    /api/qr/info/:qrCode       // Get QR information

// QR Management
GET    /api/qr/list               // List all QR codes
DELETE /api/qr/:qrCode           // Delete QR code
GET    /api/qr/analytics         // QR usage analytics
```

---

### 8. 🔗 Trace Module (`/api/trace`)

#### Available Functions:
```javascript
// Product Tracing
GET    /api/trace/:traceId         // Trace product journey
GET    /api/trace/product/:id      // Product trace details
GET    /api/trace/batch/:batchId   // Batch traceability

// Supply Chain Tracking
GET    /api/trace/timeline/:id     // Product timeline
GET    /api/trace/journey/:id      // Complete journey
GET    /api/trace/chain/:batchId   // Chain of custody

// Verification
POST   /api/trace/verify          // Verify trace information
GET    /api/trace/certificate/:id // Get certificates
GET    /api/trace/compliance/:id  // Compliance check
```

---

### 9. 🔔 Notifications Module (`/api/notifications`)

#### Available Functions:
```javascript
// Notification Management
GET    /api/notifications          // Get user notifications
POST   /api/notifications          // Create notification
PUT    /api/notifications/:id/read // Mark as read
DELETE /api/notifications/:id      // Delete notification

// Bulk Operations
POST   /api/notifications/mark-all-read // Mark all as read
DELETE /api/notifications/clear    // Clear all notifications
GET    /api/notifications/unread-count // Get unread count

// Notification Settings
GET    /api/notifications/settings // Get notification preferences
PUT    /api/notifications/settings // Update preferences
POST   /api/notifications/subscribe // Subscribe to topics
POST   /api/notifications/unsubscribe // Unsubscribe from topics
```

---

### 10. 📄 Reports Module (`/api/reports`)

#### Available Functions:
```javascript
// Production Reports
GET    /api/reports/production     // Production analytics
GET    /api/reports/quality        // Quality reports
GET    /api/reports/farmer-performance // Farmer performance

// Custom Reports
POST   /api/reports/generate       // Generate custom report
GET    /api/reports/templates      // Report templates
GET    /api/reports/scheduled      // Scheduled reports

// Export Functions
GET    /api/reports/export/csv     // Export as CSV
GET    /api/reports/export/pdf     // Export as PDF
GET    /api/reports/export/excel   // Export as Excel
```

---

### 11. 📁 Upload Module (`/api/upload`)

#### Available Functions:
```javascript
// File Upload
POST   /api/upload/single          // Single file upload
POST   /api/upload/multiple        // Multiple file upload
POST   /api/upload/documents       // Document upload
POST   /api/upload/images          // Image upload

// File Management
GET    /api/upload/files/:userId   // Get user files
DELETE /api/upload/files/:fileId   // Delete file
GET    /api/upload/download/:fileId // Download file

// Cloud Storage
POST   /api/upload/cloud           // Upload to cloud
GET    /api/upload/cloud/:fileId   // Get cloud file
DELETE /api/upload/cloud/:fileId   // Delete from cloud
```

---

### 12. 👥 Users Module (`/api/users`)

#### Available Functions:
```javascript
// User Profile
GET    /api/users/profile          // Get user profile
PUT    /api/users/profile          // Update profile
DELETE /api/users/profile          // Delete account

// User Management
GET    /api/users/list             // List users
GET    /api/users/:id              // Get user by ID
PUT    /api/users/:id              // Update user
GET    /api/users/search           // Search users

// Account Settings
PUT    /api/users/password         // Change password
PUT    /api/users/email            // Update email
PUT    /api/users/notifications    // Notification settings
GET    /api/users/activity         // User activity log
```

---

## 🛡️ Security & Middleware Features

### Authentication Middleware
- JWT token validation
- Role-based access control
- Session management
- Account lockout protection

### Security Features
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests/15min)
- Input validation and sanitization
- XSS protection
- SQL injection prevention

### File Upload Security
- File type validation
- Size restrictions (10MB limit)
- Virus scanning integration
- Cloud storage support (AWS S3, Google Cloud)

## 📈 Performance Features

### Caching & Optimization
- Response compression with gzip
- Database query optimization
- Index-based searching
- Pagination support

### Monitoring & Logging
- Winston logging system
- Error tracking and alerts
- Performance metrics
- Health monitoring endpoints

## 🔧 Database Integration

### MongoDB Features
- Mongoose ODM integration
- Schema validation
- Aggregation pipelines
- Full-text search
- Geospatial queries

### Data Models
- User management with roles
- Batch lifecycle tracking
- Document relationships
- Audit trail logging

---

## 🚀 How to Access These Functions

### 1. **Currently Active** (in working-server.js):
```bash
# Basic endpoints that are working now
GET  http://localhost:3001/api/health
GET  http://localhost:3001/api/docs
POST http://localhost:3001/api/auth/login
GET  http://localhost:3001/api/farmer/dashboard
```

### 2. **Complete API** (in route files):
All 150+ endpoints are implemented in the `/routes` directory and ready to be integrated into the main server.

### 3. **Full Integration**:
To activate all functions, integrate the route modules into the main server file.

**🎯 Total Functions Available: 150+ API endpoints across 12 modules providing complete herbal traceability platform functionality!**