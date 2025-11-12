# TraceHerbss Demo Credentials

This document contains all the demo login credentials for testing the TraceHerbss application.

## 🚀 Quick Start

1. **Backend Server**: `http://localhost:3001`
2. **Frontend Application**: `http://localhost:3000`
3. **Admin Dashboard**: `http://localhost:3000/admin`

## 👥 Demo User Accounts

### 🔑 Admin Account
- **Email**: `admin@traceherbss.com`
- **Password**: `Admin123!`
- **Role**: Administrator
- **Status**: ✅ Approved
- **Access**: Full system access, user approval management

### 🌾 Farmer Accounts

#### Tanvi (Main Demo Farmer)
- **Email**: `tanvi@traceherbss.com`
- **Password**: `Tanvi123!`
- **Role**: Farmer
- **Status**: ✅ Approved
- **Farm**: Tanvi Organic Farms (25 acres, Organic)
- **Location**: Bulandshahr, UP, India

#### Demo Farmer
- **Email**: `farmer@traceherbss.com`
- **Password**: `Farmer123!`
- **Role**: Farmer
- **Status**: ✅ Approved
- **Farm**: Green Valley Farms (40 acres, Sustainable)
- **Location**: Meerut, UP, India

### 🏭 Processor Account
- **Email**: `processor@traceherbss.com`
- **Password**: `Processor123!`
- **Role**: Processor
- **Status**: ✅ Approved
- **Company**: HerbalTech Processing Ltd
- **Location**: Ghaziabad, UP, India

### 👤 Consumer Account
- **Email**: `consumer@traceherbss.com`
- **Password**: `Consumer123!`
- **Role**: Consumer
- **Status**: ✅ Approved (Auto-approved)
- **Location**: Delhi, India

### 🏛️ Regulator Account
- **Email**: `regulator@traceherbss.com`
- **Password**: `Regulator123!`
- **Role**: Regulatory Officer
- **Status**: ✅ Approved
- **Location**: New Delhi, India

## 📋 Pending Approval Demo Accounts
*These accounts are intentionally pending approval to test the admin approval workflow*

### Pending Farmer
- **Email**: `pending.farmer@example.com`
- **Password**: `Pending123!`
- **Role**: Farmer
- **Status**: ⏳ Pending Approval
- **Farm**: Pending Approval Farms (15 acres)
- **Location**: Agra, UP, India

### Pending Processor
- **Email**: `pending.processor@example.com`
- **Password**: `Pending123!`
- **Role**: Processor
- **Status**: ⏳ Pending Approval
- **Company**: Pending Processing Co.
- **Location**: Noida, UP, India

## 🧪 Testing Workflows

### 1. Admin Approval Workflow
1. Login as admin: `admin@traceherbss.com` / `Admin123!`
2. Navigate to `/admin/pending-approvals`
3. View and approve pending users
4. Test login with newly approved users

### 2. Farmer Dashboard
1. Login as farmer: `tanvi@traceherbss.com` / `Tanvi123!`
2. Access farmer-specific features
3. Create batches, generate QR codes

### 3. Consumer Verification
1. Login as consumer: `consumer@traceherbss.com` / `Consumer123!`
2. Scan QR codes to verify products
3. View product traceability information

### 4. Processor Operations
1. Login as processor: `processor@traceherbss.com` / `Processor123!`
2. Access processing features
3. Update batch processing status

## 🔧 API Testing

### Login Endpoint
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tanvi@traceherbss.com",
    "password": "Tanvi123!"
  }'
```

### Admin Approval Endpoint
```bash
# Get pending users
curl -X GET http://localhost:3001/api/admin/pending-users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Approve a user
curl -X PUT http://localhost:3001/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Database Statistics
After running the demo seeding script:
- **Total Users**: 11
- **Approved Users**: 9
- **Pending Approval**: 2
- **User Roles**: Admin (1), Farmer (4), Processor (2), Consumer (1), Regulator (1)

## 🚨 Important Notes

1. **Password Requirements**: All passwords follow the format `RoleXXX!` (e.g., `Tanvi123!`)
2. **Email Verification**: Demo users have `isVerified: true` for testing convenience
3. **Approval Status**: Most users are pre-approved except the "pending" demo accounts
4. **Development Only**: These are demo credentials for development/testing purposes only

## 🔄 Regenerating Demo Data

To regenerate or update demo users:
```bash
cd backend
node seed-demo-users.js
```

This script will:
- Create new demo users if they don't exist
- Update existing users (preserving passwords)
- Show current database statistics

## 🐛 Troubleshooting

### Login Issues
- Ensure backend server is running on port 3001
- Check that MongoDB is connected
- Verify user exists and is approved: use admin panel or database query

### Approval Issues
- Login as admin to access approval interface
- Check user's `isApproved` status in database
- Verify admin token is valid and not expired

### Database Issues
- Ensure MongoDB is running: `brew services list | grep mongodb`
- Check database connection: `mongosh mongodb://localhost:27017/traceherbss`
- Verify collection exists: `db.users.find().count()`

---

**Last Updated**: November 11, 2025  
**Version**: 1.0.0  
**Environment**: Development