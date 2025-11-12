#!/bin/bash

echo "🚀 Starting TraceHerbss Backend Server..."
echo "📂 Working directory: $(pwd)"

# Set environment variables
export NODE_ENV=development
export PORT=3001

# Kill any existing processes on port 3001
echo "🔍 Checking for existing processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start the server
echo "🌟 Starting server on port $PORT..."
node server.js

echo "✅ Server startup script completed"