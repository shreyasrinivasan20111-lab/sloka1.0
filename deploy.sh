#!/bin/bash

# Deployment script for Sai Kalpataru Management System

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "📋 Deployment Instructions:"
echo "1. Deploy backend to Vercel:"
echo "   cd backend && vercel"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   cd frontend && vercel"
echo ""
echo "3. Update frontend/vercel.json with your backend domain"
echo "4. Update frontend/.env with production API URL"
echo ""
echo "🎉 Ready for deployment!"
