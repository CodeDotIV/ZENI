#!/bin/bash

# ZENI Services Stop Script
echo "🛑 Stopping ZENI services..."

if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "✅ Stopped Backend (PID: $BACKEND_PID)"
    fi
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo "✅ Stopped Frontend (PID: $FRONTEND_PID)"
    fi
    rm logs/frontend.pid
fi

if [ -f "logs/ai-service.pid" ]; then
    AI_PID=$(cat logs/ai-service.pid)
    if ps -p $AI_PID > /dev/null 2>&1; then
        kill $AI_PID
        echo "✅ Stopped AI Service (PID: $AI_PID)"
    fi
    rm logs/ai-service.pid
fi

# Also kill any remaining node/python processes for this project
pkill -f "next dev" 2>/dev/null
pkill -f "node.*backend" 2>/dev/null
pkill -f "python.*main.py" 2>/dev/null

echo "✅ All services stopped"

