# TraceHerbss - Complete Full-Stack Herbal Traceability System

## 🌿 Real Backend Integration Complete

### Overview
TraceHerbss is now a **complete full-stack application** with real backend integration, database persistence, and production-ready features. All dummy data has been replaced with actual database operations and real-time functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Start Complete Application
```bash
# Make script executable (first time only)
chmod +x start-fullstack.sh

# Start both backend and frontend with real data integration
./start-fullstack.sh
```

### 2. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 📊 Real Backend Integration Features

### ✅ Completed Implementation

#### 🔐 Authentication System
- **Real JWT Authentication** with database user management
- **Role-based Access Control**: Farmer, Processor, Consumer, Admin, Regulator
- **Secure Password Hashing** with bcrypt
- **Token Refresh** mechanism
- **Session Management** with persistent storage

#### 🗄️ Database Integration
- **MongoDB Integration** with Mongoose ODM
- **Real Data Persistence** - no more dummy data
- **Comprehensive Schemas** for all entities
- **Database Relationships** and references
- **Data Validation** and constraints

#### 🚜 Farmer Features (Real Backend)
- **Batch Management**: Create, update, delete batches with database storage
- **Cultivation Records**: Real farming data with timestamps
- **Harvest Tracking**: Actual harvest records with quantities and quality data
- **Document Upload**: File management with cloud storage support
- **Sustainability Metrics**: Environmental impact tracking
- **Analytics Dashboard**: Real-time insights from database

#### 🏭 Processor Features (Real Backend)
- **Batch Reception**: Real batch handover from farmers
- **Processing Steps**: Detailed processing records with timestamps
- **Quality Testing**: Lab results and quality control data
- **QR Code Generation**: Unique codes linked to database records
- **Transfer Management**: Chain of custody with blockchain-like traceability
- **Inventory Management**: Real-time stock levels

#### 🛒 Consumer Features (Real Backend)
- **Product Verification**: Scan QR codes for authentic product information
- **Traceability**: Complete supply chain journey from database
- **Product Search**: Real-time search across all products
- **Reviews & Feedback**: User-generated content with moderation
- **Favorites**: Personal product collections
- **Purchase History**: Order tracking and history

#### 👨‍💼 Admin Features (Real Backend)
- **User Management**: CRUD operations for all user types
- **System Analytics**: Real-time dashboard with database insights
- **Batch Oversight**: Complete visibility across all operations
- **Report Generation**: Automated reports with data export
- **System Configuration**: Dynamic settings management
- **Audit Logging**: Complete activity tracking

#### 📊 Analytics & Reporting (Real Backend)
- **Supply Chain Analytics**: Real-time metrics from database
- **Quality Trends**: Historical quality analysis
- **Performance Metrics**: Farmer and processor performance tracking
- **Market Intelligence**: Consumer behavior insights
- **Compliance Reporting**: Regulatory compliance tracking
- **Export Functionality**: CSV, PDF, Excel export

#### 🔔 Real-time Features
- **Live Notifications**: Real-time updates across the system
- **WebSocket Integration**: Instant updates for critical events
- **Email Notifications**: Automated alerts and summaries
- **System Health Monitoring**: Real-time status checks
- **Activity Feeds**: Live updates on system activities

#### 📄 File Management
- **Document Upload**: Secure file handling
- **Cloud Storage**: AWS S3 and Google Cloud integration
- **Image Processing**: Automatic resizing and optimization
- **File Validation**: Type and size restrictions
- **Version Control**: Document versioning and history

## 🏗️ Architecture Overview

### Backend Structure
```
backend/
├── integrated-server.js          # Main server with all routes integrated
├── routes/                       # 12 route modules (150+ endpoints)
│   ├── auth.js                  # Authentication & authorization
│   ├── farmer.js                # Farmer operations
│   ├── processor.js             # Processor operations  
│   ├── consumer.js              # Consumer operations
│   ├── admin.js                 # Admin operations
│   ├── analytics.js             # Analytics & reporting
│   ├── qr.js                    # QR code operations
│   ├── trace.js                 # Traceability
│   ├── notifications.js         # Real-time notifications
│   ├── upload.js                # File upload
│   ├── users.js                 # User management
│   └── reports.js               # Report generation
├── models/                       # Database models
├── middleware/                   # Authentication, validation, security
├── controllers/                  # Business logic
├── services/                     # External integrations
└── utils/                        # Helper functions
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks for backend integration
│   │   └── useTraceHerbs.js    # Main hook for all backend operations
│   ├── services/                # API services
│   │   ├── api.js              # Complete API service functions
│   │   └── dataManager.js      # Data management with caching
│   └── config/
│       └── api.js              # Axios configuration with interceptors
```

## 🔧 Configuration

### Backend Configuration (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/traceherbss
DB_NAME=traceherbss

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration (.env)
```env
# API
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_API_TIMEOUT=10000

# App
REACT_APP_NAME=TraceHerbss
REACT_APP_VERSION=1.0.0

# Features
REACT_APP_ENABLE_QR_SCANNER=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## 🛠️ Development Workflow

### 1. Backend Development
```bash
cd backend
npm install
node integrated-server.js
```

### 2. Frontend Development
```bash
cd frontend  
npm install
npm start
```

### 3. Full Stack Development
```bash
./start-fullstack.sh
```

## 📱 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/change-password` - Change password

### Farmer Endpoints
- `GET /farmer/dashboard` - Farmer dashboard data
- `GET /farmer/batches` - Get farmer batches
- `POST /farmer/batches` - Create new batch
- `PUT /farmer/batches/:id` - Update batch
- `DELETE /farmer/batches/:id` - Delete batch
- `POST /farmer/cultivation` - Add cultivation data
- `POST /farmer/harvest` - Add harvest data

### Processor Endpoints
- `GET /processor/dashboard` - Processor dashboard
- `POST /processor/receive` - Receive batch from farmer
- `GET /processor/batches` - Get processing batches
- `PUT /processor/processing/:id` - Update processing
- `POST /processor/quality-tests` - Create quality test
- `POST /processor/generate-qr` - Generate QR code
- `POST /processor/transfer` - Transfer batch

### Consumer Endpoints
- `GET /consumer/verify/:qrCode` - Verify product
- `GET /consumer/trace/:batchId` - Trace product
- `GET /consumer/search` - Search products
- `POST /consumer/feedback` - Submit feedback
- `GET /consumer/favorites` - Get favorites
- `POST /consumer/favorites` - Add to favorites

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/analytics` - System analytics
- `GET /admin/reports` - Generate reports

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Register user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"farmer"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Production Deployment
1. **Environment Variables**: Set production environment variables
2. **Database**: Configure production MongoDB
3. **File Storage**: Set up cloud storage (AWS S3/Google Cloud)
4. **SSL**: Configure HTTPS
5. **Process Manager**: Use PM2 for process management
6. **Load Balancing**: Configure nginx for load balancing

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

## 🔒 Security Features

### Implemented Security
- **JWT Authentication** with secure token handling
- **Password Hashing** with bcrypt (12 rounds)
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **File Upload Security** with type and size validation
- **SQL Injection Prevention** with Mongoose
- **XSS Protection** with helmet middleware

## 📈 Performance Features

### Optimization
- **Database Indexing** for fast queries
- **Response Caching** for frequently accessed data
- **File Compression** for faster transfers
- **Connection Pooling** for database connections
- **Lazy Loading** for frontend components
- **Image Optimization** for faster loading

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port is in use
lsof -i :3001

# Check backend logs
tail -f backend/backend.log

# Verify MongoDB connection
mongosh
```

#### Frontend Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Clear npm cache
npm cache clean --force

# Check frontend logs
tail -f frontend/frontend.log
```

#### Database Connection Issues
```bash
# Start MongoDB
brew services start mongodb-community

# Check MongoDB status
brew services list | grep mongodb

# Test connection
mongosh mongodb://localhost:27017/traceherbss
```

## 📞 Support

### Getting Help
- **Documentation**: Check API docs at `/api/docs`
- **Logs**: Check backend.log and frontend.log
- **Database**: Use MongoDB Compass for database inspection
- **Network**: Use browser dev tools for API debugging

## 🎯 Next Steps

### Immediate Actions
1. **Run the Application**: Execute `./start-fullstack.sh`
2. **Test Registration**: Create user accounts for different roles
3. **Explore Features**: Test batch creation, QR scanning, traceability
4. **Check Analytics**: View real-time dashboard data
5. **Upload Files**: Test document management features

### Future Enhancements
- **Mobile App**: React Native implementation
- **Blockchain Integration**: Immutable record keeping
- **IoT Integration**: Sensor data integration
- **Machine Learning**: Predictive analytics
- **Multi-language Support**: Internationalization

---

## 🏆 Achievement Summary

✅ **Complete Backend Integration** - 150+ API endpoints across 12 modules  
✅ **Real Database Storage** - All dummy data replaced with MongoDB persistence  
✅ **Authentication System** - JWT-based with role management  
✅ **File Upload System** - Document management with cloud storage  
✅ **QR Code System** - Generation, scanning, and verification  
✅ **Analytics System** - Real-time insights and reporting  
✅ **Notification System** - Real-time alerts and updates  
✅ **Supply Chain Tracking** - Complete traceability from farm to consumer  
✅ **User Management** - Full CRUD operations for all user types  
✅ **Production Ready** - Security, validation, error handling, logging

🚀 **Ready to Deploy**: The application is fully functional with real backend integration and can be deployed to production environments.

---

*TraceHerbss - Bringing transparency and trust to the herbal supply chain through technology.* 🌿