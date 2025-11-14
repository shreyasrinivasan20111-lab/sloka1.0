from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import hashlib
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import sqlite3
import os
import json
import httpx
from pydantic import BaseModel, EmailStr
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Error notification configuration
NOTIFICATION_EMAIL = "shreya.srinivasan2011@gmail.com"
NOTIFICATION_PHONE = "+17324076946"
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")

# Error notification functions
async def send_error_notification(error_details: str):
    """Send error notification via SMS and email"""
    try:
        # Send SMS notification
        if TWILIO_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE:
            client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Sai Kalpataru App Error: {error_details[:100]}...",
                from_=TWILIO_PHONE,
                to=NOTIFICATION_PHONE
            )
            logger.info(f"SMS notification sent: {message.sid}")
        
        # Send email notification (you can configure SMTP settings)
        # For now, just log the error
        logger.error(f"Application Error for notification: {error_details}")
        
    except Exception as e:
        logger.error(f"Failed to send error notification: {str(e)}")

# Database path
DATABASE_PATH = "sai_kalpataru.db"

# Secret key for JWT - in production, use environment variable
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# FastAPI app
app = FastAPI(title="Sai Kalpataru API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# API Router
api_router = APIRouter(prefix="/api")

# Database initialization
def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create courses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create student_courses table for assignments
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS student_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (course_id) REFERENCES courses (id),
            UNIQUE(user_id, course_id)
        )
    ''')
    
    # Create time_tracking table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS time_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            session_end TIMESTAMP,
            duration_minutes INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str

class Course(BaseModel):
    name: str
    description: Optional[str] = None

class StudentAssignment(BaseModel):
    user_id: int
    course_id: int

class TimeTrackingStart(BaseModel):
    course_id: int

class TimeTrackingEnd(BaseModel):
    session_id: int

# Password hashing
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# JWT functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (token_data.email,))
    user = cursor.fetchone()
    conn.close()
    
    if user is None:
        raise credentials_exception
    
    return User(
        id=user[0],
        email=user[1],
        first_name=user[2],
        last_name=user[3],
        role=user[5]
    )

# Authentication endpoints
@api_router.post("/register", response_model=dict)
async def register(user: UserCreate):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT email FROM users WHERE email = ?", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        hashed_password = hash_password(user.password)
        cursor.execute(
            "INSERT INTO users (email, first_name, last_name, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            (user.email, user.first_name, user.last_name, hashed_password, user.role)
        )
        conn.commit()
        conn.close()
        
        return {"message": "User registered successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Registration error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Registration failed")

@api_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (form_data.username,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or not verify_password(form_data.password, user[4]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user[1]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Login error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (user_login.email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or not verify_password(user_login.password, user[4]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user[1]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Login error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Course management endpoints
@api_router.post("/courses")
async def create_course(course: Course, current_user: User = Depends(get_current_user)):
    try:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can create courses")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO courses (name, description) VALUES (?, ?)",
            (course.name, course.description)
        )
        course_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {"id": course_id, "name": course.name, "description": course.description}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Create course error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to create course")

@api_router.get("/courses")
async def get_courses(current_user: User = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        if current_user.role == "admin":
            # Admin can see all courses
            cursor.execute("SELECT * FROM courses")
        else:
            # Students see only assigned courses
            cursor.execute("""
                SELECT c.* FROM courses c
                JOIN student_courses sc ON c.id = sc.course_id
                WHERE sc.user_id = ?
            """, (current_user.id,))
        
        courses = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": course[0],
                "name": course[1],
                "description": course[2],
                "created_at": course[3]
            } for course in courses
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get courses error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

@api_router.get("/courses/{course_id}")
async def get_course(course_id: int, current_user: User = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user has access to this course
        if current_user.role != "admin":
            cursor.execute(
                "SELECT 1 FROM student_courses WHERE user_id = ? AND course_id = ?",
                (current_user.id, course_id)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=403, detail="Access denied to this course")
        
        cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
        course = cursor.fetchone()
        conn.close()
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        return {
            "id": course[0],
            "name": course[1],
            "description": course[2],
            "created_at": course[3]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get course error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch course")

# Student assignment endpoints
@api_router.post("/assign-student")
async def assign_student_to_course(assignment: StudentAssignment, current_user: User = Depends(get_current_user)):
    try:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can assign students")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user and course exist
        cursor.execute("SELECT id FROM users WHERE id = ?", (assignment.user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        cursor.execute("SELECT id FROM courses WHERE id = ?", (assignment.course_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Assign student to course
        try:
            cursor.execute(
                "INSERT INTO student_courses (user_id, course_id) VALUES (?, ?)",
                (assignment.user_id, assignment.course_id)
            )
            conn.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="Student already assigned to this course")
        
        conn.close()
        return {"message": "Student assigned successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Assign student error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to assign student")

@api_router.get("/users")
async def get_users(current_user: User = Depends(get_current_user)):
    try:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can view users")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, first_name, last_name, role FROM users")
        users = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": user[0],
                "email": user[1],
                "first_name": user[2],
                "last_name": user[3],
                "role": user[4]
            } for user in users
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get users error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch users")

# Time tracking endpoints
@api_router.post("/time-tracking/start")
async def start_time_tracking(tracking: TimeTrackingStart, current_user: User = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check if user has access to this course
        if current_user.role != "admin":
            cursor.execute(
                "SELECT 1 FROM student_courses WHERE user_id = ? AND course_id = ?",
                (current_user.id, tracking.course_id)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=403, detail="Access denied to this course")
        
        # Start new time tracking session
        cursor.execute(
            "INSERT INTO time_tracking (user_id, course_id, session_start) VALUES (?, ?, ?)",
            (current_user.id, tracking.course_id, datetime.utcnow())
        )
        session_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {"session_id": session_id, "message": "Time tracking started"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Start time tracking error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to start time tracking")

@api_router.post("/time-tracking/end")
async def end_time_tracking(tracking: TimeTrackingEnd, current_user: User = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Get the session
        cursor.execute(
            "SELECT session_start FROM time_tracking WHERE id = ? AND user_id = ? AND session_end IS NULL",
            (tracking.session_id, current_user.id)
        )
        session = cursor.fetchone()
        
        if not session:
            raise HTTPException(status_code=404, detail="Active session not found")
        
        # Calculate duration
        session_start = datetime.fromisoformat(session[0].replace('Z', '+00:00'))
        session_end = datetime.utcnow()
        duration_minutes = int((session_end - session_start).total_seconds() / 60)
        
        # Update session
        cursor.execute(
            "UPDATE time_tracking SET session_end = ?, duration_minutes = ? WHERE id = ?",
            (session_end, duration_minutes, tracking.session_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Time tracking ended", "duration_minutes": duration_minutes}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"End time tracking error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to end time tracking")

@api_router.get("/time-tracking/user/{user_id}")
async def get_user_time_tracking(user_id: int, current_user: User = Depends(get_current_user)):
    try:
        # Users can only see their own data, admins can see any user's data
        if current_user.role != "admin" and current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT tt.*, c.name as course_name FROM time_tracking tt
            JOIN courses c ON tt.course_id = c.id
            WHERE tt.user_id = ? AND tt.session_end IS NOT NULL
            ORDER BY tt.session_start DESC
        """, (user_id,))
        sessions = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": session[0],
                "course_id": session[2],
                "course_name": session[6],
                "session_start": session[3],
                "session_end": session[4],
                "duration_minutes": session[5]
            } for session in sessions
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get time tracking error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch time tracking data")

# File upload endpoint
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {"filename": file.filename, "message": "File uploaded successfully"}
    
    except Exception as e:
        error_msg = f"File upload error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to upload file")

# Get student assignments endpoint
@api_router.get("/student-assignments")
async def get_student_assignments(current_user: User = Depends(get_current_user)):
    try:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can view student assignments")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                sc.user_id,
                u.first_name,
                u.last_name,
                u.email,
                sc.course_id,
                c.name as course_name,
                sc.assigned_at
            FROM student_courses sc
            JOIN users u ON sc.user_id = u.id
            JOIN courses c ON sc.course_id = c.id
            ORDER BY sc.assigned_at DESC
        """)
        assignments = cursor.fetchall()
        conn.close()
        
        return [
            {
                "user_id": assignment[0],
                "student_name": f"{assignment[1]} {assignment[2]}",
                "email": assignment[3],
                "course_id": assignment[4],
                "course_name": assignment[5],
                "assigned_at": assignment[6]
            } for assignment in assignments
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get student assignments error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch student assignments")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Sai Kalpataru API is running"}

# Include API router
app.include_router(api_router)

# Serve React app
@app.get("/{path:path}")
async def serve_react_app(path: str):
    # Serve API routes normally
    if path.startswith("api/") or path in ["docs", "redoc", "openapi.json"]:
        raise HTTPException(status_code=404, detail="Not Found")
    
    # For Vercel, we don't serve static files, just return a simple response
    return {"message": "Sai Kalpataru API is running"}

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    error_msg = f"Global error in {request.url}: {str(exc)}"
    await send_error_notification(error_msg)
    logger.error(error_msg)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Support has been notified."}
    )

# Export app for Vercel
handler = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
