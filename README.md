# Sai Kalpataru Vidyalaya - Combined Student Course Management System

A comprehensive web application for managing student courses with time tracking, similar to Google Classroom. **Frontend and Backend are now combined into a single deployable application!**

## ✨ Features

- **🔐 User Authentication**: JWT-based login system with role-based access
- **📚 Course Management**: Create, assign, and manage courses
- **⏱️ Time Tracking**: Track student learning time per course
- **📁 File Upload**: Upload and manage course materials
- **👨‍💼 Admin Dashboard**: Complete administrative controls
- **🎓 Student Dashboard**: Personalized learning interface
- **📊 Progress Analytics**: Track learning progress and performance
- **🚀 Single Server**: Combined frontend + backend in one application

## 🛠️ Tech Stack

- **Backend**: FastAPI + SQLite + JWT Authentication
- **Frontend**: React + Vite + Tailwind CSS (served by FastAPI)
- **Database**: SQLite with pre-populated data
- **Deployment**: Vercel-ready with single server configuration

## 🚀 Quick Start (Combined Application)

### Prerequisites
- Python 3.8+
- Node.js 16+ (for building frontend)

### Installation & Running

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd Sloka1.0
   chmod +x setup.sh start.sh
   ./setup.sh
   ```

2. **Start the combined application**:
   ```bash
   ./start.sh
   ```
   
   **OR manually**:
   ```bash
   # Build frontend
   cd frontend && npm run build && cd ..
   cp -r frontend/dist backend/static
   
   # Start combined server
   source .venv/bin/activate
   cd backend && python main.py
   ```

3. **Access the application**:
   - **Complete App**: http://localhost:8000 (Frontend + Backend combined!)
   - **API Documentation**: http://localhost:8000/docs
   - **API Endpoints**: http://localhost:8000/api/*

### 🔑 Default Admin Login
- Email: `admin@saikalpataru.edu`
- Password: `admin123`

## 📁 Project Structure (Combined)

```
Sloka1.0/
├── backend/
│   ├── main.py              # FastAPI app (serves frontend + API)
│   ├── static/              # Built React app files
│   ├── database.db          # SQLite database
│   └── uploads/             # File uploads
├── frontend/
│   ├── src/                 # React source code
│   ├── dist/                # Built files (copied to backend/static)
│   └── package.json
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel deployment config
├── start.sh                # Combined startup script
└── README.md               # This file
```

## 🌐 Deployment to Vercel

The application is **perfectly configured for Vercel deployment**:

### Option 1: Automatic Deployment
1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically (uses `vercel.json` config)

### Option 2: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Vercel Configuration Features:
- ✅ Single server architecture
- ✅ Python runtime configured
- ✅ API routes properly routed
- ✅ Static file serving optimized
- ✅ Environment variables support

## 🛣️ API Routes

All API endpoints are now under `/api` prefix:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/token` - OAuth2 token endpoint
- `GET /api/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `POST /api/assign-course` - Assign course to student
- `DELETE /api/unassign-course` - Remove course assignment

### Time Tracking
- `POST /api/time-tracking/start` - Start learning session
- `POST /api/time-tracking/stop` - Stop learning session
- `GET /api/progress` - Get learning progress

### Admin (Admin access required)
- `GET /api/students` - List all students
- `POST /api/upload-material` - Upload course materials

## 🎯 Key Benefits of Combined Architecture

1. **Single Deployment**: Deploy both frontend and backend as one unit
2. **Simplified CORS**: No cross-origin issues
3. **Cost Effective**: Single server for everything
4. **Easy Maintenance**: One codebase to manage
5. **Vercel Optimized**: Perfect for serverless deployment
6. **Fast Loading**: Static files served directly by FastAPI

## 🔧 Development vs Production

### Development Mode
```bash
# Separate servers for hot reloading during development
cd frontend && npm run dev    # Frontend: localhost:5173
cd backend && python main.py  # Backend: localhost:8000
```

### Production Mode (Combined)
```bash
# Single server serving everything
./start.sh                    # Combined: localhost:8000
```

## 📱 Application Screenshots & Features

- **🏠 Home Page**: Welcome page with school branding
- **🔐 Authentication**: Login/Register with JWT tokens
- **📊 Student Dashboard**: Course enrollment and progress tracking
- **👨‍💼 Admin Dashboard**: User management and analytics
- **📚 Course Pages**: Interactive course content and materials
- **⏱️ Time Tracking**: Automatic learning time monitoring
- **📁 File Management**: Course material upload and download

## 🚀 Production Ready Features

- **🔒 Security**: JWT authentication, password hashing
- **🌐 CORS**: Properly configured for production
- **📁 File Upload**: Secure file handling
- **🗄️ Database**: SQLite with proper schema
- **📊 Logging**: Comprehensive error logging
- **🛡️ Error Handling**: Global exception handlers
- **📱 Responsive**: Mobile-friendly design

## 📞 Support

The application is fully functional and ready for production use! For support:
- Check the API documentation at `/docs`
- Review the application logs
- Test all features with the admin account

**Deployment Status**: ✅ Ready for Vercel deployment!
