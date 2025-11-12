# 🌐 TraceHerbss - Complete Full-Stack Application Setup

## 🚀 Running the Complete Website (Frontend + Backend)

This guide shows you how to run the integrated TraceHerbss application with both frontend and backend working together.

## 📁 Project Structure

```
/Users/manas/Maanas/Traceherbss/
├── backend/          # Node.js/Express API server
│   ├── working-server.js
│   ├── package.json
│   └── .env
└── frontend/         # React application (if exists)
    ├── src/
    ├── package.json
    └── public/
```

## 🔧 Step-by-Step Setup

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd /Users/manas/Maanas/Traceherbss/backend

# Install dependencies (if not done already)
npm install

# Start the backend server
node working-server.js
```

**Expected Output:**
```
🚀 TraceHerbss Backend Server Started!
📡 Server: http://localhost:3001
🏥 Health: http://localhost:3001/api/health
📚 Docs: http://localhost:3001/api/docs
✅ MongoDB Connected: localhost
```

### Step 2: Start the Frontend (React)

**Option A: If you have a React frontend**
```bash
# Open a new terminal window
# Navigate to frontend directory
cd /Users/manas/Maanas/Traceherbss/frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

**Option B: If no React frontend exists yet**
```bash
# Navigate to Traceherbss root
cd /Users/manas/Maanas/Traceherbss

# Create React frontend
npx create-react-app frontend
cd frontend
npm start
```

### Step 3: Configure Frontend-Backend Connection

Update your React app to connect to the backend:

**Frontend API Configuration (`src/config/api.js`):**
```javascript
const API_BASE_URL = 'http://localhost:3001/api';

export const apiEndpoints = {
  health: `${API_BASE_URL}/health`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`
  },
  farmer: {
    dashboard: `${API_BASE_URL}/farmer/dashboard`
  },
  processor: {
    dashboard: `${API_BASE_URL}/processor/dashboard`
  },
  consumer: {
    verify: (qrCode) => `${API_BASE_URL}/consumer/verify/${qrCode}`
  },
  admin: {
    users: `${API_BASE_URL}/admin/users`
  }
};

export default API_BASE_URL;
```

## 🌐 Access Your Application

Once both servers are running:

### Backend API
- **API Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **API Documentation**: http://localhost:3001/api/docs

### Frontend Website
- **React App**: http://localhost:3000
- **Main Application**: Your TraceHerbss web interface

## 🔄 Integration Testing

### Test Backend Connectivity from Frontend

**Example React Component:**
```javascript
import React, { useState, useEffect } from 'react';

function HealthCheck() {
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(response => response.json())
      .then(data => setBackendStatus(data))
      .catch(error => console.error('Backend connection failed:', error));
  }, []);

  return (
    <div>
      <h2>Backend Status</h2>
      {backendStatus ? (
        <div style={{ color: 'green' }}>
          ✅ Backend Connected: {backendStatus.message}
        </div>
      ) : (
        <div style={{ color: 'red' }}>
          ❌ Backend Not Connected
        </div>
      )}
    </div>
  );
}

export default HealthCheck;
```

## 🛠️ Quick Start Commands

### Terminal 1 (Backend):
```bash
cd /Users/manas/Maanas/Traceherbss/backend
node working-server.js
```

### Terminal 2 (Frontend):
```bash
cd /Users/manas/Maanas/Traceherbss/frontend
npm start
```

## 📱 Available Features

### Backend API Features (Ready to Use):
- ✅ User Authentication (Login/Register)
- ✅ Farmer Dashboard & Batch Management
- ✅ Processor Workflow & Quality Testing
- ✅ Consumer Product Verification
- ✅ Admin User Management
- ✅ QR Code Generation & Scanning
- ✅ Real-time Notifications
- ✅ File Upload Handling
- ✅ Analytics & Reporting

### Frontend Integration Points:
- 🔐 **Login Page** → `POST /api/auth/login`
- 📊 **Farmer Dashboard** → `GET /api/farmer/dashboard`
- 🏭 **Processor Portal** → `GET /api/processor/dashboard`
- 🔍 **QR Code Scanner** → `GET /api/consumer/verify/{qrCode}`
- ⚙️ **Admin Panel** → `GET /api/admin/users`

## 🚨 Troubleshooting

### If Backend Won't Start:
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Check if port 3001 is free
lsof -i :3001

# Kill any process using the port
lsof -ti:3001 | xargs kill -9
```

### If Frontend Can't Connect to Backend:
1. **Check CORS settings** - Backend has CORS enabled for localhost:3000
2. **Verify API URLs** - Ensure frontend uses http://localhost:3001
3. **Check browser console** - Look for network errors

### Common Issues:
- **Port conflicts**: Change ports in .env files
- **CORS errors**: Backend is configured for localhost:3000
- **MongoDB connection**: Ensure MongoDB is running locally

## 🎯 Production Deployment

For production deployment:

### Backend:
```bash
# Set environment to production
NODE_ENV=production PORT=5000 node working-server.js
```

### Frontend:
```bash
# Build for production
npm run build

# Serve build files
npx serve -s build -l 3000
```

## 📝 Environment Configuration

### Backend (.env):
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/traceherbss
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key
```

### Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

## 🎉 You're All Set!

Your complete TraceHerbss application is now running with:
- ✅ Backend API server on http://localhost:3001
- ✅ Frontend React app on http://localhost:3000
- ✅ Full integration between frontend and backend
- ✅ Database connectivity and data persistence
- ✅ Authentication and user management
- ✅ Complete herbal traceability features

**Visit http://localhost:3000 to use your complete TraceHerbss application!**