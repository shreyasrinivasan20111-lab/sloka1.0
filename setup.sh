#!/bin/bash

# Development setup script for Sai Kalpataru Management System

echo "🏫 Setting up Sai Kalpataru Student Management System..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Create virtual environment for backend
echo "🐍 Setting up Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Go back to root
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Make scripts executable
chmod +x deploy.sh

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start development:"
echo "1. Start backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "2. Start frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "👤 Admin credentials:"
echo "   Email: shreya.srinivasan2011@gmail.com, Password: Bo142315"
echo "   Email: jayab2021@gmail.com, Password: Admin@123"
echo ""
echo "📚 Available courses:"
echo "   - śravaṇaṃ"
echo "   - Kirtanam" 
echo "   - Smaranam"
echo "   - Pada Sevanam"
echo "   - Archanam"
echo "   - Vandanam"
echo ""
echo "🎉 Happy coding!"
