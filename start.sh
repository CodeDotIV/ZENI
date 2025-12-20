#!/bin/bash

# ZENI Project Start Script
echo "🚀 Starting ZENI services..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if services are running
check_service() {
    if curl -s http://localhost:$1 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Service on port $1 is running${NC}"
        return 0
    else
        return 1
    fi
}

# Start Docker services if not running
if command -v docker &> /dev/null; then
    if ! docker ps | grep -q zeni-postgres; then
        echo "🐳 Starting Docker services..."
        docker-compose up -d
        sleep 3
    fi
fi

# Start services in background
echo "Starting Backend API..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

sleep 2

echo "Starting Frontend..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

sleep 2

echo "Starting AI Service..."
cd ai-service
if [ -d "venv" ]; then
    source venv/bin/activate
    python main.py > ../logs/ai-service.log 2>&1 &
    AI_PID=$!
    echo "AI Service PID: $AI_PID"
    deactivate
else
    echo -e "${YELLOW}⚠️  Virtual environment not found. Run setup.sh first.${NC}"
fi
cd ..

# Save PIDs
mkdir -p logs
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid
echo $AI_PID > logs/ai-service.pid

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "Services:"
echo "  - Backend API: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - AI Service: http://localhost:8000"
echo ""
echo "Logs are in the logs/ directory"
echo "To stop services, run: ./stop.sh"

