# 🌿 TraceHerbss - Complete Application Startup Guide

## 🚀 Quick Start (2 Simple Steps)

### Step 1: Start Backend Server
```bash
# Open Terminal 1
cd /Users/manas/Maanas/Traceherbss/backend
node working-server.js
```

### Step 2: Start Frontend Application  
```bash
# Open Terminal 2 (New Terminal Window)
cd /Users/manas/Maanas/Traceherbss/frontend  
npm start
```

## 🌐 Access Your Complete Application

Once both commands are running:

- **🎨 Frontend Website**: http://localhost:3000
- **🔧 Backend API**: http://localhost:3001  
- **🏥 API Health**: http://localhost:3001/api/health
- **📚 API Docs**: http://localhost:3001/api/docs

## ✅ What You'll See

### Terminal 1 (Backend):
```
🚀 TraceHerbss Backend Server Started!
📡 Server: http://localhost:3001
✅ MongoDB Connected: localhost
```

### Terminal 2 (Frontend):
```
Compiled successfully!
Local: http://localhost:3000
On Your Network: http://192.168.x.x:3000
```

### Browser:
- **Frontend loads at**: http://localhost:3000
- **Complete TraceHerbss interface** with all features
- **Backend integration** working automatically

## 🔧 Available Features

Your integrated application now has:

### 🔐 Authentication
- User registration and login
- Role-based access (Farmer, Processor, Consumer, Admin)
- JWT token management

### 👨‍🌾 Farmer Features  
- Dashboard with batch overview
- Create new herb batches
- Upload cultivation documents
- Track sustainability metrics
- Generate transparency credits

### 🏭 Processor Features
- Receive batches from farmers
- Quality testing workflows
- Processing step tracking  
- Generate QR codes
- Chain of custody management

### 🛍️ Consumer Features
- Scan QR codes to verify products
- View complete product journey
- See farmer and processor details
- Access quality certificates
- Leave feedback and reviews

### ⚙️ Admin Features
- User management dashboard
- System analytics and reports
- Batch oversight
- Platform configuration
- Regulatory compliance tools

## 🧪 Testing Integration

### Test Backend Connection:
Visit: http://localhost:3001/api/health

### Test Frontend-Backend Integration:
1. Go to http://localhost:3000
2. Try logging in or registering
3. Navigate through different sections
4. Check browser console for any errors

## 🚨 Troubleshooting

### Backend Issues:
```bash
# Check MongoDB
brew services list | grep mongodb

# Check port 3001
lsof -i :3001

# Restart backend
cd /Users/manas/Maanas/Traceherbss/backend
node working-server.js
```

### Frontend Issues:
```bash
# Clear node modules if needed
rm -rf node_modules package-lock.json
npm install

# Restart frontend
cd /Users/manas/Maanas/Traceherbss/frontend
npm start
```

### Connection Issues:
- Ensure both servers are running
- Check CORS is enabled (already configured)
- Verify API URLs in browser network tab

## 🎯 You're All Set!

Your **complete TraceHerbss application** is now running with:
✅ Full-stack integration (React + Node.js)  
✅ Database connectivity (MongoDB)
✅ Authentication system
✅ All role-based features
✅ QR code generation and scanning
✅ Complete herbal traceability chain

**🌐 Visit http://localhost:3000 to use your complete TraceHerbss application!**