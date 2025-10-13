 #!/bin/bash

# Nefol Beauty Brand - Complete System Startup Script
# This script starts all services: Backend API, Admin Panel, and User Panel

echo "🚀 Starting Nefol Beauty Brand Complete System..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -e "${BLUE}   Attempt $attempt/$max_attempts - $service_name not ready yet${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start within timeout${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Please install pnpm first.${NC}"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${RED}❌ PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are met${NC}"

# Check ports
echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 4000 || exit 1  # Backend API
check_port 5173 || exit 1  # Admin Panel
check_port 5174 || exit 1  # User Panel

# Install dependencies if needed
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Create .env files if they don't exist
echo -e "${BLUE}⚙️ Setting up environment files...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️ Creating backend/.env from template${NC}"
    cp backend/env.example backend/.env
fi

if [ ! -f "admin-panel/.env" ]; then
    echo -e "${YELLOW}⚠️ Creating admin-panel/.env from template${NC}"
    cp admin-panel/env.example admin-panel/.env
fi

if [ ! -f "user-panel/.env" ]; then
    echo -e "${YELLOW}⚠️ Creating user-panel/.env from template${NC}"
    cp user-panel/env.example user-panel/.env
fi

# Start Backend API
echo -e "${BLUE}🔧 Starting Backend API Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
wait_for_service "http://localhost:4000/api/products" "Backend API"

# Start Admin Panel
echo -e "${BLUE}👨‍💼 Starting Admin Panel...${NC}"
cd admin-panel
npm run dev &
ADMIN_PID=$!
cd ..

# Wait for admin panel to be ready
wait_for_service "http://localhost:5173" "Admin Panel"

# Start User Panel
echo -e "${BLUE}🛍️ Starting User Panel...${NC}"
cd user-panel
npm run dev &
USER_PID=$!
cd ..

# Wait for user panel to be ready
wait_for_service "http://localhost:5174" "User Panel"

# Success message
echo ""
echo -e "${GREEN}🎉 All services are running successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}📊 Admin Panel:${NC} http://localhost:5173"
echo -e "${BLUE}🛍️ User Panel:${NC} http://localhost:5174"
echo -e "${BLUE}🔧 API Server:${NC} http://localhost:4000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:4000/api-docs"
echo "=================================================="
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• Use Ctrl+C to stop all services"
echo "• Check logs in individual terminal windows"
echo "• Visit the API Manager in admin panel to configure integrations"
echo "• Use the Setup Guide (SETUP_GUIDE.md) for detailed configuration"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    kill $USER_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo -e "${GREEN}🔄 Services are running. Press Ctrl+C to stop all services.${NC}"
wait




