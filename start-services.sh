#!/bin/bash

# ZENI Services Startup Script
echo "🚀 Starting ZENI services..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create logs directory
mkdir -p logs

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "   Attempting to install..."
    cd backend
    npm install 2>&1 | tee ../logs/backend-install.log
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        echo "   You may need to run: cd backend && npm install"
        echo "   Or fix npm permissions: sudo chown -R \$(whoami) ~/.npm"
    fi
    cd ..
fi

# Start Backend API
echo -e "${GREEN}Starting Backend API...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..
sleep 2

# Start Frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..
sleep 2

# Start AI Service
echo -e "${GREEN}Starting AI Service...${NC}"
cd ai-service
if [ -d "venv" ]; then
    source venv/bin/activate
    python main.py > ../logs/ai-service.log 2>&1 &
    AI_PID=$!
    echo "AI Service PID: $AI_PID"
    deactivate
else
    echo -e "${YELLOW}⚠️  Virtual environment not found${NC}"
    echo "   Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python main.py > ../logs/ai-service.log 2>&1 &
    AI_PID=$!
    echo "AI Service PID: $AI_PID"
    deactivate
fi
cd ..

# Save PIDs
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid
echo $AI_PID > logs/ai-service.pid

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""
echo "Services:"
echo "  - Backend API: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - AI Service: http://localhost:8000"
echo ""
echo "Logs are in the logs/ directory"
echo ""
echo "To stop services, run: ./stop-services.sh"
echo "To view logs: tail -f logs/backend.log (or frontend.log, ai-service.log)"

