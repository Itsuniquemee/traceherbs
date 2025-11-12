# User Approval System for HerbalTrace

## Overview

This document describes the implementation of a comprehensive user approval system for the HerbalTrace application. The system ensures that users with roles other than 'consumer' require administrator approval before they can access the platform.

## System Architecture

### Backend Components

#### User Model (`/backend/models/User.js`)
- **`isApproved`** field: Boolean flag indicating whether the user has been approved by an admin
- **Auto-approval logic**: Consumer users are automatically approved (`isApproved: true`)
- **Manual approval**: All other roles (farmer, processor, regulator, admin) require manual approval

#### Authentication Routes (`/backend/routes/auth.js`)

##### Registration (`POST /api/auth/register`)
```javascript
// Auto-approve consumers, require approval for other roles
const requiresApproval = role && role !== 'consumer';
const user = await User.create({
  // ... user data
  isApproved: !requiresApproval
});
```

##### Login (`POST /api/auth/login`)
```javascript
// Check approval status during login
if (typeof user.isApproved !== 'undefined' && !user.isApproved) {
  return res.status(403).json({
    success: false,
    message: 'Account awaiting admin approval. You will be notified once approved.'
  });
}
```

#### Admin Routes (`/backend/routes/admin.js`)

##### Get Pending Users (`GET /api/admin/pending-users`)
- Fetches all users with `isApproved: false`
- Supports pagination, search, and role filtering
- Returns user details including role-specific profiles

##### Approve User (`PUT /api/admin/users/:id/approve`)
- Sets `isApproved: true` for the specified user
- Creates a notification informing the user of approval
- Returns updated user data

##### Reject User (`PUT /api/admin/users/:id/status`)
- Sets `isActive: false` to deactivate the rejected user
- Effectively prevents login without deleting the account

### Frontend Components

#### Registration Component (`/frontend/src/components/Signup.js`)
```javascript
// Enhanced registration with backend API integration
const onSubmit = async (data) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: data.email.split('@')[0],
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone,
      // ... other fields
    })
  });

  const result = await response.json();
  
  if (response.ok) {
    const requiresApproval = data.role !== 'consumer';
    
    if (requiresApproval) {
      // Show approval pending message
      alert(`Registration successful! Your ${data.role} account is pending admin approval.`);
    } else {
      // Auto-login for consumers
      onSignup(result.user);
    }
  }
};
```

#### Login Component (`/frontend/src/components/Login.js`)
```javascript
// Enhanced login with approval status handling
const onSubmit = async (data) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password
    })
  });

  const result = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', result.token);
    onLogin(result.user);
  } else {
    // Handle specific approval-related errors
    switch (response.status) {
      case 403:
        setLoginError('Account awaiting admin approval. You will be notified once approved.');
        break;
      // ... other error cases
    }
  }
};
```

#### Admin Pending Approvals Component (`/frontend/src/components/AdminPendingApprovals.js`)

**Features:**
- **Real-time data**: Fetches pending users from backend API
- **Search and filtering**: By name, email, username, and role
- **Detailed user view**: Modal showing complete user information
- **Batch actions**: Approve or reject individual users
- **Role-specific profiles**: Displays farmer/processor profile information
- **Statistics dashboard**: Shows pending counts by role
- **Responsive design**: Works on desktop and mobile devices

**Key Functions:**
```javascript
// Fetch pending users
const fetchPendingUsers = async () => {
  const response = await fetch('/api/admin/pending-users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  setPendingUsers(data.data || []);
};

// Approve user
const handleApprove = async (userId) => {
  const response = await fetch(`/api/admin/users/${userId}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    toast.success('User approved successfully');
    setPendingUsers(prev => prev.filter(user => user._id !== userId));
  }
};

// Reject user
const handleReject = async (userId) => {
  const response = await fetch(`/api/admin/users/${userId}/status`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ isActive: false })
  });
  
  if (response.ok) {
    toast.success('User rejected and deactivated');
    setPendingUsers(prev => prev.filter(user => user._id !== userId));
  }
};
```

### Navigation Integration

#### Main Layout (`/frontend/src/components/MainLayout.js`)
```javascript
// Added pending approvals navigation item for admins
const allNavigationItems = [
  // ... other items
  { 
    id: 'pending-approvals', 
    label: 'Pending Approvals', 
    icon: Clock, 
    path: '/admin/pending-approvals', 
    roles: ['admin'] 
  },
  // ... other items
];
```

#### App Routing (`/frontend/src/App.js`)
```javascript
// Added protected route for pending approvals
<Route path="/admin/pending-approvals" element={
  <ProtectedRoute user={user} requiredRoles={['admin']}>
    <AdminPendingApprovals />
  </ProtectedRoute>
} />
```

## User Flow

### For Non-Consumer Registration

1. **User Registration**:
   - User fills out registration form with role selection
   - Frontend sends registration data to `/api/auth/register`
   - Backend creates user with `isApproved: false`
   - System creates notification for all admin users
   - User receives confirmation message about pending approval

2. **Admin Notification**:
   - All admin users receive in-app notification
   - Notification includes user details and role information
   - Admins can access pending approvals via navigation menu

3. **Admin Review**:
   - Admin navigates to "Pending Approvals" page
   - Reviews user details including role-specific profiles
   - Can search and filter pending users
   - Views complete user information in detailed modal

4. **Approval Decision**:
   - **Approve**: Sets `isApproved: true`, sends notification to user
   - **Reject**: Sets `isActive: false`, prevents future login attempts

5. **User Login**:
   - **Approved users**: Can login normally
   - **Pending users**: Receive "awaiting approval" message
   - **Rejected users**: Cannot login (account deactivated)

### For Consumer Registration

1. **Automatic Approval**:
   - Consumer registrations are automatically approved
   - `isApproved: true` set during registration
   - User can login immediately after registration
   - No admin intervention required

## Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected admin routes
- Token validation on all API requests

### Account Security
- Password hashing with bcrypt
- Account lockout after failed login attempts
- Email verification support
- Password reset functionality

### Data Validation
- Input validation on both frontend and backend
- SQL injection prevention
- XSS protection
- CSRF protection

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Admin Management
- `GET /api/admin/pending-users` - Get pending approval users
- `PUT /api/admin/users/:id/approve` - Approve pending user
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/users` - Get all users (with pagination)

### Notifications
- In-app notifications for approval status changes
- Email notifications (configurable)
- Real-time updates via WebSocket (planned)

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  firstName: String,
  lastName: String,
  role: String, // 'farmer', 'processor', 'consumer', 'admin', 'regulator'
  isActive: Boolean, // default: true
  isVerified: Boolean, // default: false
  isApproved: Boolean, // default: false for non-consumers
  farmerProfile: {
    farmName: String,
    farmSize: Number,
    farmingType: String,
    certifications: [String],
    // ... other fields
  },
  processorProfile: {
    companyName: String,
    facilityType: String,
    capacity: Number,
    // ... other fields
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  _id: ObjectId,
  recipient: ObjectId, // User ID
  sender: ObjectId, // User ID
  title: String,
  message: String,
  type: String, // 'system_update', 'approval', etc.
  priority: String, // 'low', 'medium', 'high'
  status: String, // 'pending', 'read', 'archived'
  relatedEntity: {
    entityType: String, // 'user', 'batch', etc.
    entityId: ObjectId
  },
  channels: {
    inApp: Boolean,
    email: Boolean,
    sms: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Environment Variables
```bash
# Backend (.env)
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend Configuration
```javascript
// API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
```

## Testing

### Backend Tests
```bash
# Run backend tests
cd backend
npm test

# Test specific endpoints
npm run test:auth
npm run test:admin
```

### Frontend Tests
```bash
# Run frontend tests
cd frontend
npm test

# Test specific components
npm test AdminPendingApprovals
npm test Login
```

## Deployment Considerations

### Production Setup
1. **Environment Variables**: Configure production environment variables
2. **HTTPS**: Ensure all API calls use HTTPS in production
3. **Rate Limiting**: Implement API rate limiting
4. **Monitoring**: Set up logging and monitoring for approval workflows
5. **Backup**: Regular database backups including user approval states

### Scalability
- **Caching**: Implement Redis caching for pending users list
- **Pagination**: Efficient pagination for large user datasets
- **Search Indexing**: Database indexes on email, username, role fields
- **Load Balancing**: Support for multiple backend instances

## Future Enhancements

### Planned Features
1. **Bulk Approval**: Select and approve multiple users at once
2. **Approval Workflows**: Multi-step approval process with different admin levels
3. **Email Notifications**: Automated email notifications for approval status
4. **Audit Trail**: Complete audit log of all approval/rejection actions
5. **Role-based Approvals**: Different admins for different user roles
6. **Self-service**: Allow users to update their profile information while pending
7. **Analytics**: Dashboard showing approval metrics and trends

### Integration Options
1. **LDAP/AD Integration**: Corporate directory integration
2. **SSO Support**: Single sign-on with enterprise systems
3. **Mobile App**: Native mobile app with approval management
4. **API Keys**: Programmatic access to approval system
5. **Webhooks**: External system integration via webhooks

## Troubleshooting

### Common Issues

1. **Users stuck in pending state**:
   - Check `isApproved` field in database
   - Verify admin notifications are being created
   - Check admin user permissions

2. **Login fails after approval**:
   - Verify `isActive: true` and `isApproved: true`
   - Check JWT token generation
   - Verify user role permissions

3. **Admin cannot see pending users**:
   - Check admin role assignment
   - Verify API endpoint permissions
   - Check database indexes

### Debug Commands
```bash
# Check pending users in database
db.users.find({ isApproved: false })

# Check user approval status
db.users.findOne({ email: "user@example.com" }, { isApproved: 1, isActive: 1, role: 1 })

# List admin users
db.users.find({ role: "admin" }, { email: 1, isActive: 1 })
```

## Support

For technical support or questions about the user approval system:
1. Check this documentation first
2. Review the API error messages and status codes
3. Check the browser console for frontend errors
4. Review backend logs for detailed error information
5. Contact the development team with specific error details

---

**Last Updated**: November 11, 2024  
**Version**: 1.0.0  
**Author**: HerbalTrace Development Team