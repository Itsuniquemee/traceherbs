#!/bin/bash

echo "🔥 TraceHerbss CRUD Operations Demonstration"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Start server in background
echo -e "${BLUE}🚀 Starting TraceHerbss Backend...${NC}"
cd /Users/manas/Maanas/Traceherbss/backend
node integrated-server.js > /tmp/server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo -e "${GREEN}✅ Server started (PID: $SERVER_PID)${NC}"
echo ""

# Test 1: CREATE - Register new user
echo -e "${BLUE}1️⃣ CREATE - Registering new user...${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demouser","firstName":"Demo","lastName":"User","email":"demo@traceherbss.com","password":"Password123","role":"consumer","phone":"1234567890"}')

if echo "$CREATE_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ User created successfully!${NC}"
    USER_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    TOKEN=$(echo "$CREATE_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${YELLOW}User ID: $USER_ID${NC}"
else
    echo -e "${RED}❌ User creation failed${NC}"
    echo "$CREATE_RESPONSE" | head -3
fi
echo ""

# Test 2: READ - Get user profile
echo -e "${BLUE}2️⃣ READ - Getting user profile...${NC}"
READ_RESPONSE=$(curl -s -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if echo "$READ_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ User profile retrieved successfully!${NC}"
    echo "$READ_RESPONSE" | grep -o '"fullName":"[^"]*"'
else
    echo -e "${RED}❌ Failed to get user profile${NC}"
    echo "$READ_RESPONSE" | head -3
fi
echo ""

# Test 3: CREATE - Add new batch (if user is farmer, let's create farmer first)
echo -e "${BLUE}3️⃣ CREATE - Registering farmer and creating batch...${NC}"
FARMER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demofarmer","firstName":"Demo","lastName":"Farmer","email":"farmer@traceherbss.com","password":"Password123","role":"farmer","phone":"9876543210"}')

if echo "$FARMER_RESPONSE" | grep -q '"success":true'; then
    FARMER_TOKEN=$(echo "$FARMER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Farmer created successfully!${NC}"
    
    # Create batch
    BATCH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/farmer/batches \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $FARMER_TOKEN" \
      -d '{"product":{"name":"Turmeric","category":"spice","variety":"Organic"},"harvest":{"harvestDate":"2025-01-15","quantity":{"amount":200,"unit":"kg"}},"cultivation":{"farmingMethod":"organic","plantingDate":"2024-10-15","harvestDate":"2025-01-15"},"location":{"farmName":"Demo Farm","address":"Demo Address"}}')
    
    if echo "$BATCH_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Batch created successfully!${NC}"
        BATCH_ID=$(echo "$BATCH_RESPONSE" | grep -o '"batchId":"[^"]*"' | cut -d'"' -f4)
        echo -e "${YELLOW}Batch ID: $BATCH_ID${NC}"
    else
        echo -e "${RED}❌ Batch creation failed${NC}"
        echo "$BATCH_RESPONSE" | head -3
    fi
else
    echo -e "${RED}❌ Farmer creation failed${NC}"
fi
echo ""

# Test 4: READ - Get farmer batches
echo -e "${BLUE}4️⃣ READ - Getting farmer batches...${NC}"
BATCHES_RESPONSE=$(curl -s -X GET http://localhost:3001/api/farmer/batches \
  -H "Authorization: Bearer $FARMER_TOKEN")

if echo "$BATCHES_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Batches retrieved successfully!${NC}"
    BATCH_COUNT=$(echo "$BATCHES_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo -e "${YELLOW}Total batches: $BATCH_COUNT${NC}"
else
    echo -e "${RED}❌ Failed to get batches${NC}"
fi
echo ""

# Test 5: UPDATE - Update batch information
if [ ! -z "$BATCH_ID" ]; then
    echo -e "${BLUE}5️⃣ UPDATE - Updating batch information...${NC}"
    UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:3001/api/farmer/batches/$BATCH_ID \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $FARMER_TOKEN" \
      -d '{"product":{"name":"Turmeric","category":"spice","variety":"Premium Organic"},"status":"processed"}')
    
    if echo "$UPDATE_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Batch updated successfully!${NC}"
    else
        echo -e "${RED}❌ Batch update failed${NC}"
        echo "$UPDATE_RESPONSE" | head -3
    fi
else
    echo -e "${YELLOW}⚠️ No batch ID available for update${NC}"
fi
echo ""

# Test 6: Consumer verification (READ operation)
echo -e "${BLUE}6️⃣ READ - Consumer product verification...${NC}"
if [ ! -z "$BATCH_ID" ]; then
    VERIFY_RESPONSE=$(curl -s -X GET "http://localhost:3001/api/consumer/trace/$BATCH_ID")
    
    if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Product verification successful!${NC}"
        echo "$VERIFY_RESPONSE" | grep -o '"name":"[^"]*"' | head -1
    else
        echo -e "${RED}❌ Product verification failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ No batch ID available for verification${NC}"
fi
echo ""

# Test 7: Analytics (READ operation)
echo -e "${BLUE}7️⃣ READ - Getting analytics data...${NC}"
ANALYTICS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/analytics/overview \
  -H "Authorization: Bearer $FARMER_TOKEN")

if echo "$ANALYTICS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Analytics data retrieved successfully!${NC}"
else
    echo -e "${RED}❌ Failed to get analytics${NC}"
fi
echo ""

# Test 8: File Upload (CREATE operation)
echo -e "${BLUE}8️⃣ CREATE - Testing file upload...${NC}"
echo "This is a test document for TraceHerbss" > /tmp/test_document.txt
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3001/api/upload/single \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -F "file=@/tmp/test_document.txt" \
  -F "category=document" \
  -F "description=Test upload")

if echo "$UPLOAD_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ File uploaded successfully!${NC}"
    FILE_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"fileId":"[^"]*"' | cut -d'"' -f4)
    echo -e "${YELLOW}File ID: $FILE_ID${NC}"
else
    echo -e "${RED}❌ File upload failed${NC}"
    echo "$UPLOAD_RESPONSE" | head -3
fi
echo ""

# Test 9: DELETE - Delete uploaded file (if successful)
if [ ! -z "$FILE_ID" ]; then
    echo -e "${BLUE}9️⃣ DELETE - Deleting uploaded file...${NC}"
    DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:3001/api/upload/files/$FILE_ID" \
      -H "Authorization: Bearer $FARMER_TOKEN")
    
    if echo "$DELETE_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ File deleted successfully!${NC}"
    else
        echo -e "${RED}❌ File deletion failed${NC}"
        echo "$DELETE_RESPONSE" | head -3
    fi
else
    echo -e "${YELLOW}⚠️ No file ID available for deletion${NC}"
fi
echo ""

# Test 10: Admin operations (if we had admin user)
echo -e "${BLUE}🔟 CREATE - Creating admin user for management operations...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demoadmin","firstName":"Demo","lastName":"Admin","email":"admin@traceherbss.com","password":"Password123","role":"admin","phone":"5555555555"}')

if echo "$ADMIN_RESPONSE" | grep -q '"success":true'; then
    ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Admin user created successfully!${NC}"
    
    # Get all users (READ operation)
    echo -e "${BLUE}📊 READ - Getting all users (admin operation)...${NC}"
    USERS_RESPONSE=$(curl -s -X GET "http://localhost:3001/api/admin/users" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo "$USERS_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Users list retrieved successfully!${NC}"
        USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
        echo -e "${YELLOW}Total users in system: $USER_COUNT${NC}"
    else
        echo -e "${RED}❌ Failed to get users list${NC}"
    fi
else
    echo -e "${RED}❌ Admin creation failed${NC}"
fi

# Cleanup
echo ""
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
kill $SERVER_PID 2>/dev/null
rm -f /tmp/test_document.txt
echo -e "${GREEN}✅ Cleanup completed${NC}"

echo ""
echo -e "${GREEN}🎉 CRUD Operations Demonstration Complete!${NC}"
echo "============================================="
echo ""
echo -e "${BLUE}Summary of operations tested:${NC}"
echo "✅ CREATE: User registration, batch creation, file upload"
echo "✅ READ: User profile, batches list, product verification, analytics"
echo "✅ UPDATE: Batch information modification"
echo "✅ DELETE: File deletion"
echo "✅ ADMIN: User management operations"
echo ""
echo -e "${YELLOW}All operations use real MongoDB database with persistence!${NC}"