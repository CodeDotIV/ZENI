#!/bin/bash

# ZENI Setup Diagnostic Script
echo "🔍 Checking ZENI setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: Not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm: Not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python: Not installed"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
    
    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        echo "✅ Docker daemon: Running"
    else
        echo "❌ Docker daemon: Not running"
        echo "   → Try: colima start (if using Colima)"
        echo "   → Or start Docker Desktop"
    fi
else
    echo "❌ Docker: Not installed"
fi

# Check Colima
if command -v colima &> /dev/null; then
    echo "✅ Colima: Installed"
    if colima status &> /dev/null; then
        echo "✅ Colima: Running"
    else
        echo "❌ Colima: Not running"
        echo "   → Try: colima start"
        echo "   → If QEMU error: brew install qemu"
    fi
else
    echo "⚠️  Colima: Not installed (optional)"
fi

# Check QEMU
if command -v qemu-system-x86_64 &> /dev/null; then
    echo "✅ QEMU: Installed"
else
    echo "⚠️  QEMU: Not installed (needed for Colima)"
    echo "   → Install: brew install qemu"
fi

# Check dependencies
echo ""
echo "📦 Checking project dependencies..."

if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies: Installed"
else
    echo "❌ Backend dependencies: Not installed"
    echo "   → Run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies: Installed"
else
    echo "❌ Frontend dependencies: Not installed"
    echo "   → Run: cd frontend && npm install"
fi

if [ -d "ai-service/venv" ]; then
    echo "✅ AI service dependencies: Installed"
else
    echo "❌ AI service dependencies: Not installed"
    echo "   → Run: cd ai-service && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
fi

# Check environment files
echo ""
echo "⚙️  Checking environment files..."

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env: Exists"
else
    echo "❌ Backend .env: Missing"
    echo "   → Run: cp backend/env.example backend/.env"
fi

if [ -f "ai-service/.env" ]; then
    if grep -q "OPENAI_API_KEY=your-openai-api-key-here" ai-service/.env 2>/dev/null; then
        echo "⚠️  AI service .env: Exists but needs OpenAI API key"
    else
        echo "✅ AI service .env: Configured"
    fi
else
    echo "❌ AI service .env: Missing"
    echo "   → Run: cp ai-service/env.example ai-service/.env"
    echo "   → Then add your OPENAI_API_KEY"
fi

# Check Docker services
echo ""
echo "🐳 Checking Docker services..."

if docker ps &> /dev/null; then
    if docker ps | grep -q zeni-postgres; then
        echo "✅ PostgreSQL container: Running"
    else
        echo "⚠️  PostgreSQL container: Not running"
        echo "   → Run: docker-compose up -d"
    fi
    
    if docker ps | grep -q zeni-redis; then
        echo "✅ Redis container: Running"
    else
        echo "⚠️  Redis container: Not running"
        echo "   → Run: docker-compose up -d"
    fi
else
    echo "⚠️  Cannot check Docker services (Docker daemon not running)"
fi

echo ""
echo "📝 Next steps:"
echo "1. Fix any ❌ issues above"
echo "2. Start Docker: colima start (or Docker Desktop)"
echo "3. Start services: docker-compose up -d"
echo "4. Run migrations: cd backend && npm run migrate"
echo "5. Start all services (see MANUAL_SETUP.md)"

