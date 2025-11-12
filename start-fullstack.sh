#!/bin/bash

# TraceHerbss Full-Stack Application Startup Script

echo "🌿 =============================================="
echo "🚀 Starting TraceHerbss Full-Stack Application"
echo "🌿 =============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️ Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Check if MongoDB is running
echo -e "${BLUE}📊 Checking MongoDB status...${NC}"
if brew services list | grep mongodb-community | grep started > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️ Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 3
fi

# Navigate to project root
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}📁 Project root: $PROJECT_ROOT${NC}"

# Kill any existing processes on our ports
echo -e "${BLUE}🔍 Checking for existing processes...${NC}"
kill_port 3001  # Backend port
kill_port 3000  # Frontend port

# Start Backend
echo ""
echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
cd "$PROJECT_ROOT/backend"

if [ ! -f "integrated-server.js" ]; then
    echo -e "${RED}❌ Backend server file not found!${NC}"
    echo -e "${RED}Expected: $PROJECT_ROOT/backend/integrated-server.js${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Installing backend dependencies...${NC}"
npm install > /dev/null 2>&1

echo -e "${GREEN}🔧 Starting integrated backend server on port 3001...${NC}"
# Start integrated backend in background
nohup node integrated-server.js > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to initialize...${NC}"
sleep 5

# Check if backend is running
if check_port 3001; then
    echo -e "${GREEN}✅ Backend server started successfully (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}📡 Backend URL: http://localhost:3001${NC}"
    echo -e "${GREEN}🏥 Health Check: http://localhost:3001/api/health${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo -e "${RED}Check backend.log for errors${NC}"
    exit 1
fi

# Start Frontend
echo ""
echo -e "${BLUE}🎨 Starting Frontend Application...${NC}"
cd "$PROJECT_ROOT/frontend"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Frontend package.json not found!${NC}"
    echo -e "${RED}Expected: $PROJECT_ROOT/frontend/package.json${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1

echo -e "${GREEN}🔧 Starting frontend on port 3000...${NC}"
# Start frontend in background
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}⏳ Waiting for frontend to initialize...${NC}"
sleep 10

# Check if frontend is running
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend application started successfully (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}🌐 Frontend URL: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo -e "${RED}Check frontend.log for errors${NC}"
    exit 1
fi

# Success message
echo ""
echo -e "${GREEN}🎉 =============================================="
echo -e "✅ TraceHerbss Application Started Successfully!"
echo -e "🎉 ==============================================${NC}"
echo ""
echo -e "${BLUE}🌐 Access your application:${NC}"
echo -e "${GREEN}   Frontend (React):  http://localhost:3000${NC}"
echo -e "${GREEN}   Backend API:       http://localhost:3001${NC}"
echo -e "${GREEN}   API Health:        http://localhost:3001/api/health${NC}"
echo -e "${GREEN}   API Docs:          http://localhost:3001/api/docs${NC}"
echo ""
echo -e "${BLUE}📊 Process Information:${NC}"
echo -e "   Backend PID:  $BACKEND_PID"
echo -e "   Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${BLUE}📝 Log Files:${NC}"
echo -e "   Backend:  $PROJECT_ROOT/backend/backend.log"
echo -e "   Frontend: $PROJECT_ROOT/frontend/frontend.log"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   - Press Ctrl+C to stop this script"
echo -e "   - Use 'kill $BACKEND_PID $FRONTEND_PID' to stop servers"
echo -e "   - Check log files if you encounter issues"
echo -e "   - Frontend will auto-reload on code changes"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down TraceHerbss application...${NC}"
    
    echo -e "${BLUE}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null || true
    
    echo -e "${BLUE}Stopping backend (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Force kill if still running
    kill -9 $FRONTEND_PID 2>/dev/null || true
    kill -9 $BACKEND_PID 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep the script running
echo -e "${BLUE}🔄 Application is running... Press Ctrl+C to stop${NC}"
while true; do
    sleep 30
    
    # Health check
    if ! check_port 3001; then
        echo -e "${RED}❌ Backend server stopped unexpectedly${NC}"
        break
    fi
    
    if ! check_port 3000; then
        echo -e "${RED}❌ Frontend server stopped unexpectedly${NC}"
        break
    fi
done

# If we get here, something went wrong
cleanup