#!/bin/bash

# ZENI Project Setup Script
echo "🚀 Setting up ZENI project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.10+ first.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Database services will need to be started manually.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo ""

# Install AI service dependencies
echo "📦 Installing AI service dependencies..."
cd ai-service
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo ""

# Set up environment files
echo "⚙️  Setting up environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

if [ ! -f "ai-service/.env" ]; then
    cp ai-service/env.example ai-service/.env
    echo -e "${YELLOW}⚠️  Please add your OPENAI_API_KEY to ai-service/.env${NC}"
else
    echo -e "${YELLOW}⚠️  ai-service/.env already exists${NC}"
fi
echo ""

# Start Docker services
if command -v docker &> /dev/null; then
    echo "🐳 Starting Docker services (PostgreSQL & Redis)..."
    docker-compose up -d
    echo "Waiting for services to be ready..."
    sleep 5
    echo -e "${GREEN}✅ Docker services started${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Please start PostgreSQL and Redis manually${NC}"
    echo ""
fi

# Run database migrations
echo "🗄️  Running database migrations..."
cd backend
npm run migrate
cd ..
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Add your OpenAI API key to ai-service/.env"
echo "2. Start all services with: npm run dev"
echo "   Or start individually:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - AI Service: cd ai-service && source venv/bin/activate && python main.py"
echo ""
echo "🌐 Access the app at: http://localhost:3000"

