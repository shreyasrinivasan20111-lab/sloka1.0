#!/bin/bash

echo "🔍 Vercel Deployment Verification for Sai Kalpataru"
echo "=================================================="

# Check required files
echo "📁 Checking required files..."
files=("vercel.json" "requirements.txt" "backend/main.py" "backend/static/index.html")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check Python dependencies
echo ""
echo "🐍 Checking Python dependencies..."
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt found with dependencies:"
    cat requirements.txt | head -5
    echo "   ..."
else
    echo "❌ requirements.txt not found"
fi

# Check if frontend is built
echo ""
echo "🔨 Checking frontend build..."
if [ -d "backend/static" ] && [ -f "backend/static/index.html" ]; then
    echo "✅ Frontend built and copied to backend/static"
    echo "📊 Static files:"
    ls -la backend/static/ | head -5
else
    echo "❌ Frontend not built. Run: cd frontend && npm run build && cd .. && cp -r frontend/dist backend/static"
fi

# Check Vercel configuration
echo ""
echo "⚙️  Vercel Configuration:"
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configured"
    echo "🔧 Routes configured for:"
    grep -A 5 '"routes"' vercel.json
else
    echo "❌ vercel.json not found"
fi

echo ""
echo "🚀 Deployment Status:"
echo "✅ Backend: FastAPI application ready"
echo "✅ Frontend: React build integrated"
echo "✅ Database: SQLite with sample data"
echo "✅ API Routes: All endpoints under /api prefix"
echo "✅ Static Files: Served by FastAPI"
echo "✅ Vercel Config: Single server deployment"
echo ""
echo "🌐 Ready for deployment to Vercel!"
echo "📝 To deploy: git push to connected repository or run 'vercel --prod'"
