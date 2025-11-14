#!/bin/bash

# Combined Frontend + Backend Startup Script for Sai Kalpataru
echo "🚀 Starting Sai Kalpataru Combined Application..."

# Check if we're in development or production
if [ "$NODE_ENV" = "production" ] || [ "$VERCEL" = "1" ]; then
    echo "📦 Production mode detected"
    
    # Build frontend if in development
    if [ ! -d "backend/static" ]; then
        echo "🔨 Building frontend..."
        cd frontend && npm run build && cd ..
        cp -r frontend/dist backend/static
    fi
    
    # Start backend server
    echo "🐍 Starting FastAPI server..."
    cd backend && python main.py
else
    echo "🛠️  Development mode"
    
    # Build frontend
    echo "🔨 Building frontend..."
    cd frontend && npm run build && cd ..
    cp -r frontend/dist backend/static
    
    # Start backend server
    echo "🐍 Starting combined server on http://localhost:8000"
    cd backend && python main.py
fi
