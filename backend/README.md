# TraceHerbss Backend API

A comprehensive backend API for the TraceHerbss herbal traceability platform, providing complete supply chain tracking from farm to consumer.

## 🚀 Features

### Core Functionality
- **Complete Supply Chain Traceability**: Track herbs from cultivation to consumer
- **Multi-Role Authentication**: Farmer, Processor, Consumer, Admin, and Regulator roles
- **QR Code Integration**: Generate and scan QR codes for instant product verification
- **Real-time Notifications**: Live updates via Socket.IO
- **Document Management**: Secure file upload and storage
- **Quality Testing**: Comprehensive quality control and testing workflows

### Advanced Features
- **Analytics Dashboard**: Business intelligence and reporting
- **Blockchain Integration**: Optional blockchain recording for immutable records
- **Payment Processing**: Stripe integration for transactions
- **Email/SMS Notifications**: Multi-channel communication
- **API Rate Limiting**: DDoS protection and usage control
- **Comprehensive Logging**: Winston-based logging with rotation

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.IO for live features
- **File Upload**: Multer with cloud storage support
- **Security**: Helmet, CORS, XSS protection, rate limiting
- **Logging**: Winston with daily file rotation
- **Testing**: Jest and Supertest
- **Documentation**: Swagger/OpenAPI

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud)
- npm or yarn package manager

### Setup Steps

1. **Clone and Navigate**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
   ```

5. **Run the Application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Essential Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/traceherbss
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secure-jwt-secret
BCRYPT_SALT_ROUNDS=12

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
CORS_ORIGIN=http://localhost:3000
```

### Optional Integrations

- **AWS S3**: For cloud file storage
- **Google Cloud Storage**: Alternative cloud storage
- **Stripe**: Payment processing
- **Twilio**: SMS notifications
- **Blockchain APIs**: Immutable record keeping

## 🏗️ API Structure

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Get current user profile

### Core Modules

#### Farmer Routes (`/api/farmer`)
- Batch creation and management
- Harvest record keeping
- Quality data submission
- Document uploads
- Dashboard analytics

#### Processor Routes (`/api/processor`)
- Batch receiving and processing
- Quality testing workflows
- Supply chain transfers
- Production tracking

#### Consumer Routes (`/api/consumer`)
- Product verification via QR codes
- Detailed product history
- Feedback and reviews
- Purchase tracking

#### Admin Routes (`/api/admin`)
- User management
- System configuration
- Platform analytics
- Regulatory compliance

### Utility Services
- `POST /api/upload` - File upload handling
- `GET /api/qr/:batchId` - QR code generation
- `GET /api/trace/:code` - Product tracing
- `GET /api/analytics/*` - Analytics endpoints
- `GET /api/notifications` - User notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Configurable request throttling
- **Input Validation**: Comprehensive request validation
- **XSS Protection**: Cross-site scripting prevention
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **File Upload Security**: Type and size validation

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: ['farmer', 'processor', 'consumer', 'admin', 'regulator'],
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: Object,
    // ... additional fields
  },
  isVerified: Boolean,
  createdAt: Date
}
```

### Batch Model (Core Traceability)
```javascript
{
  batchId: String (unique),
  farmer: Object,
  product: Object,
  cultivation: Object,
  harvest: Object,
  processing: [Object],
  qualityTests: [Object],
  supplyChain: [Object],
  documents: [Object],
  sustainability: Object,
  qrCode: String,
  blockchain: Object,
  createdAt: Date
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📈 Monitoring & Logging

### Winston Logging
- Structured JSON logging
- Daily log rotation
- Configurable log levels
- Error tracking and alerts

### Health Checks
- `GET /api/health` - Application health status
- Database connectivity checks
- External service validation

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build and start
npm run build
npm start

# Using PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js
```

### Docker Support
```dockerfile
# Dockerfile included for containerized deployment
docker build -t traceherbss-backend .
docker run -p 5000:5000 traceherbss-backend
```

## 🔗 Integration Points

### Frontend Integration
- RESTful API endpoints
- Socket.IO real-time connections
- File upload handling
- Authentication token management

### Third-party Services
- **Payment Processing**: Stripe webhooks
- **Email Service**: SMTP/SendGrid integration
- **Cloud Storage**: AWS S3/Google Cloud
- **Blockchain**: Ethereum/Hyperledger integration
- **SMS**: Twilio integration

## 📚 API Documentation

Once running, access interactive API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Postman Collection**: Available in `/docs` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Changelog

See `CHANGELOG.md` for version history and updates.

---

**TraceHerbss Backend** - Providing transparent, traceable, and secure herbal supply chain management.