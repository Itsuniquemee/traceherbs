#!/bin/bash

# Demo Script for User Approval System
# This script demonstrates the user approval workflow

echo "🌿 HerbalTrace User Approval System Demo"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3001/api"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}Step 1: Starting the demo...${NC}"
echo "Backend API: $BACKEND_URL"
echo "Frontend App: $FRONTEND_URL"
echo ""

# Function to check if server is running
check_server() {
    local url=$1
    local name=$2
    
    if curl -s --head --request GET "$url" | grep -q "200\|404"; then
        echo -e "${GREEN}✅ $name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not running${NC}"
        return 1
    fi
}

# Check if backend is running
echo -e "${BLUE}Step 2: Checking backend server...${NC}"
if ! check_server "$BACKEND_URL/auth/me" "Backend Server"; then
    echo -e "${YELLOW}⚠️  Please start the backend server first:${NC}"
    echo "   cd backend && npm start"
    echo ""
fi

# Check if frontend is running
echo -e "${BLUE}Step 3: Checking frontend server...${NC}"
if ! check_server "$FRONTEND_URL" "Frontend Server"; then
    echo -e "${YELLOW}⚠️  Please start the frontend server first:${NC}"
    echo "   cd frontend && npm start"
    echo ""
fi

echo -e "${BLUE}Step 4: Demo user accounts${NC}"
echo "The system includes the following demo accounts:"
echo ""
echo -e "${GREEN}Consumer (Auto-approved):${NC}"
echo "  Email: consumer@herbaltrace.com"
echo "  Password: consumer123"
echo "  Status: ✅ Auto-approved (can login immediately)"
echo ""
echo -e "${YELLOW}Farmer (Requires approval):${NC}"
echo "  Email: farmer@herbaltrace.com"  
echo "  Password: farmer123"
echo "  Status: ⏳ Requires admin approval"
echo ""
echo -e "${YELLOW}Processor (Requires approval):${NC}"
echo "  Email: processor@herbaltrace.com"
echo "  Password: processor123"
echo "  Status: ⏳ Requires admin approval"
echo ""
echo -e "${RED}Admin (For approvals):${NC}"
echo "  Email: admin@herbaltrace.com"
echo "  Password: admin123"
echo "  Status: ✅ Can approve pending users"
echo ""

echo -e "${BLUE}Step 5: Testing the approval workflow${NC}"
echo ""
echo "1. 📝 Register a new farmer/processor account:"
echo "   → Go to $FRONTEND_URL"
echo "   → Click 'Sign up'"
echo "   → Choose role: Farmer/Processor"
echo "   → Complete registration"
echo "   → See 'Pending approval' message"
echo ""

echo "2. 🔐 Try to login with the new account:"
echo "   → See 'Account awaiting admin approval' message"
echo ""

echo "3. 👤 Login as admin to approve users:"
echo "   → Login with admin credentials above"
echo "   → Navigate to 'Pending Approvals' in sidebar"
echo "   → Review pending user details"
echo "   → Approve or reject users"
echo ""

echo "4. ✅ Login with approved account:"
echo "   → Try logging in with the newly approved account"
echo "   → Should work successfully"
echo ""

echo -e "${BLUE}Step 6: API Testing with curl${NC}"
echo ""
echo "You can also test the API directly with curl:"
echo ""

# Test registration
echo -e "${GREEN}Register a test farmer:${NC}"
cat << 'EOF'
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testfarmer",
    "email": "test.farmer@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "Farmer",
    "role": "farmer",
    "phone": "+1-555-0123"
  }'
EOF
echo ""

echo -e "${GREEN}Try to login (should fail with 403):${NC}"
cat << 'EOF'
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.farmer@example.com",
    "password": "TestPass123"
  }'
EOF
echo ""

echo -e "${GREEN}Login as admin first:${NC}"
cat << 'EOF'
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@herbaltrace.com",
    "password": "admin123"
  }'
EOF
echo ""

echo -e "${GREEN}Get pending users (replace TOKEN with admin token):${NC}"
cat << 'EOF'
curl -X GET http://localhost:3001/api/admin/pending-users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
EOF
echo ""

echo -e "${GREEN}Approve user (replace USER_ID and TOKEN):${NC}"
cat << 'EOF'
curl -X PUT http://localhost:3001/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
EOF
echo ""

echo -e "${BLUE}Step 7: Database queries for debugging${NC}"
echo ""
echo "If you have MongoDB shell access, you can run these queries:"
echo ""

echo -e "${GREEN}Find all pending users:${NC}"
echo "  db.users.find({ isApproved: false }, { email: 1, role: 1, firstName: 1, lastName: 1 })"
echo ""

echo -e "${GREEN}Find all admin users:${NC}"
echo "  db.users.find({ role: 'admin' }, { email: 1, isActive: 1 })"
echo ""

echo -e "${GREEN}Check specific user approval status:${NC}"
echo "  db.users.findOne({ email: 'test.farmer@example.com' }, { isApproved: 1, isActive: 1, role: 1 })"
echo ""

echo -e "${GREEN}Find notifications for admins:${NC}"
echo "  db.notifications.find({ type: 'system_update' }).sort({ createdAt: -1 })"
echo ""

echo -e "${BLUE}Step 8: Troubleshooting${NC}"
echo ""
echo -e "${YELLOW}Common Issues:${NC}"
echo ""
echo "1. 🚫 CORS errors:"
echo "   → Check backend CORS configuration"
echo "   → Ensure frontend URL matches CORS whitelist"
echo ""
echo "2. 🔑 Authentication errors:"
echo "   → Verify JWT_SECRET in backend .env"
echo "   → Check token storage in localStorage"
echo ""
echo "3. 🗄️  Database connection:"
echo "   → Ensure MongoDB is running"
echo "   → Check MONGODB_URI in backend .env"
echo ""
echo "4. ❌ API not responding:"
echo "   → Check if backend server is running on port 3001"
echo "   → Verify no other services using the same port"
echo ""

echo -e "${BLUE}Step 9: Next Steps${NC}"
echo ""
echo "For production deployment:"
echo "1. 🔒 Configure proper JWT secrets"
echo "2. 📧 Set up email notifications" 
echo "3. 🛡️  Enable HTTPS"
echo "4. 📊 Set up monitoring and logging"
echo "5. 🔄 Configure database backups"
echo ""

echo -e "${GREEN}🎉 Demo setup complete!${NC}"
echo ""
echo "Visit $FRONTEND_URL to start testing the user approval system."
echo ""
echo "📚 For detailed documentation, see:"
echo "   USER_APPROVAL_SYSTEM.md"
echo ""

# Optional: Run a quick connectivity test
echo -e "${BLUE}Running connectivity test...${NC}"
if command -v curl &> /dev/null; then
    echo ""
    echo "Testing backend API connection..."
    
    # Test basic API endpoint
    if curl -s -f "$BACKEND_URL/auth/me" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend API is accessible${NC}"
    else
        echo -e "${RED}❌ Cannot connect to backend API${NC}"
        echo "   Make sure the backend server is running on port 3001"
    fi
    
    # Test frontend
    if curl -s -f "$FRONTEND_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${RED}❌ Cannot connect to frontend${NC}"
        echo "   Make sure the frontend server is running on port 3000"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping connectivity test${NC}"
fi

echo ""
echo -e "${GREEN}Happy testing! 🚀${NC}"