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

app = FastAPI(title="Sai Kalpataru Student Management System")

# Create API router
api_router = APIRouter(prefix="/api")

# Mount static files for frontend
static_path = "static/assets" if os.path.exists("static/assets") else "../frontend/dist/assets"
if os.path.exists(static_path):
    app.mount("/assets", StaticFiles(directory=static_path), name="static")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "sai_kalpataru_secret_key_2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

# Database setup
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database tables
def init_db():
    conn = get_db_connection()
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS user_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS time_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            duration_seconds INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS course_materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER,
            material_type TEXT, -- 'lyrics' or 'recordings'
            filename TEXT,
            file_path TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    """)
    
    # Insert admin users
    admin_users = [
        ("Shreya", "Srinivasan", "shreya.srinivasan2011@gmail.com", "Bo142315"),
        ("Jaya", "B", "jayab2021@gmail.com", "Admin@123")
    ]
    
    for first_name, last_name, email, password in admin_users:
        password_hash = get_password_hash(password)
        try:
            conn.execute(
                "INSERT INTO users (first_name, last_name, email, password_hash, is_admin) VALUES (?, ?, ?, ?, ?)",
                (first_name, last_name, email, password_hash, True)
            )
        except sqlite3.IntegrityError:
            pass  # User already exists
    
    # Insert default courses
    courses = ["śravaṇaṃ", "Kirtanam", "Smaranam", "Pada Sevanam", "Archanam", "Vandanam"]
    for course in courses:
        try:
            conn.execute("INSERT INTO courses (name) VALUES (?)", (course,))
        except sqlite3.IntegrityError:
            pass  # Course already exists
    
    conn.commit()
    conn.close()

# Pydantic models
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    is_admin: bool

class Course(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class TimeEntry(BaseModel):
    user_id: int
    course_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = None

# Error notification function
async def send_error_notification(error_details: str):
    try:
        # Send SMS notification (you'll need to implement with Twilio or similar service)
        # For now, just log the error
        logger.error(f"Error notification: {error_details}")
        
        # You can implement email notification here using SMTP
        # or SMS notification using Twilio API
        
    except Exception as e:
        logger.error(f"Failed to send error notification: {str(e)}")

# Utility functions
def verify_password(plain_password, hashed_password):
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    conn = get_db_connection()
    result = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    
    if result:
        return {
            "id": result["id"],
            "first_name": result["first_name"],
            "last_name": result["last_name"],
            "email": result["email"],
            "password_hash": result["password_hash"],
            "is_admin": bool(result["is_admin"])
        }
    return None

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
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# API Routes
@api_router.post("/register", response_model=dict)
async def register(user: UserCreate):
    try:
        # Check if user already exists
        existing_user = get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        password_hash = get_password_hash(user.password)
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
            (user.first_name, user.last_name, user.email, password_hash)
        )
        conn.commit()
        conn.close()
        
        return {"message": "User registered successfully"}
    
    except Exception as e:
        error_msg = f"Registration error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Registration failed")

@api_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token endpoint"""
    try:
        db_user = get_user_by_email(form_data.username)  # OAuth2 uses username field for email
        if not db_user or not verify_password(form_data.password, db_user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user["email"]}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.post("/login", response_model=Token)
async def login(user: UserLogin):
    try:
        db_user = get_user_by_email(user.email)
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user["email"]}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Login error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

@api_router.get("/courses")
async def get_courses(current_user: dict = Depends(get_current_user)):
    try:
        conn = get_db_connection()
        
        if current_user["is_admin"]:
            # Admin sees all courses
            courses = conn.execute("SELECT * FROM courses").fetchall()
        else:
            # Students see only assigned courses
            courses = conn.execute("""
                SELECT c.* FROM courses c
                JOIN user_courses uc ON c.id = uc.course_id
                WHERE uc.user_id = ?
            """, (current_user["id"],)).fetchall()
        
        conn.close()
        return [{"id": c["id"], "name": c["name"], "description": c["description"]} for c in courses]
    
    except Exception as e:
        error_msg = f"Get courses error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

@api_router.post("/assign-course")
async def assign_course(user_id: int, course_id: int, admin: dict = Depends(get_current_admin)):
    try:
        conn = get_db_connection()
        
        # Check if assignment already exists
        existing = conn.execute(
            "SELECT * FROM user_courses WHERE user_id = ? AND course_id = ?",
            (user_id, course_id)
        ).fetchone()
        
        if existing:
            conn.close()
            raise HTTPException(status_code=400, detail="Course already assigned to user")
        
        conn.execute(
            "INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)",
            (user_id, course_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Course assigned successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Course assignment error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to assign course")

@api_router.delete("/unassign-course")
async def unassign_course(user_id: int, course_id: int, admin: dict = Depends(get_current_admin)):
    try:
        conn = get_db_connection()
        conn.execute(
            "DELETE FROM user_courses WHERE user_id = ? AND course_id = ?",
            (user_id, course_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Course unassigned successfully"}
    
    except Exception as e:
        error_msg = f"Course unassignment error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to unassign course")

@api_router.get("/students")
async def get_students(admin: dict = Depends(get_current_admin)):
    try:
        conn = get_db_connection()
        students = conn.execute(
            "SELECT id, first_name, last_name, email FROM users WHERE is_admin = 0"
        ).fetchall()
        conn.close()
        
        return [
            {
                "id": s["id"],
                "first_name": s["first_name"],
                "last_name": s["last_name"],
                "email": s["email"]
            } for s in students
        ]
    
    except Exception as e:
        error_msg = f"Get students error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch students")

@api_router.post("/time-tracking/start")
async def start_time_tracking(course_id: int, current_user: dict = Depends(get_current_user)):
    try:
        conn = get_db_connection()
        
        # Check if user has access to this course
        if not current_user["is_admin"]:
            assigned = conn.execute(
                "SELECT * FROM user_courses WHERE user_id = ? AND course_id = ?",
                (current_user["id"], course_id)
            ).fetchone()
            
            if not assigned:
                conn.close()
                raise HTTPException(status_code=403, detail="Course not assigned to user")
        
        # End any existing active session
        conn.execute(
            "UPDATE time_tracking SET end_time = CURRENT_TIMESTAMP WHERE user_id = ? AND end_time IS NULL",
            (current_user["id"],)
        )
        
        # Start new session
        conn.execute(
            "INSERT INTO time_tracking (user_id, course_id, start_time) VALUES (?, ?, CURRENT_TIMESTAMP)",
            (current_user["id"], course_id)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Time tracking started"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Start time tracking error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to start time tracking")

@api_router.post("/time-tracking/stop")
async def stop_time_tracking(current_user: dict = Depends(get_current_user)):
    try:
        conn = get_db_connection()
        
        # Find active session
        active_session = conn.execute(
            "SELECT * FROM time_tracking WHERE user_id = ? AND end_time IS NULL ORDER BY start_time DESC LIMIT 1",
            (current_user["id"],)
        ).fetchone()
        
        if not active_session:
            conn.close()
            raise HTTPException(status_code=404, detail="No active time tracking session")
        
        # Calculate duration and update
        conn.execute("""
            UPDATE time_tracking 
            SET end_time = CURRENT_TIMESTAMP,
                duration_seconds = (strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', start_time))
            WHERE id = ?
        """, (active_session["id"],))
        conn.commit()
        conn.close()
        
        return {"message": "Time tracking stopped"}
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Stop time tracking error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to stop time tracking")

@api_router.get("/progress")
async def get_progress(admin: dict = Depends(get_current_admin)):
    try:
        conn = get_db_connection()
        progress = conn.execute("""
            SELECT 
                u.first_name, u.last_name, u.email,
                c.name as course_name,
                SUM(t.duration_seconds) as total_seconds,
                COUNT(t.id) as session_count
            FROM users u
            JOIN time_tracking t ON u.id = t.user_id
            JOIN courses c ON t.course_id = c.id
            WHERE t.duration_seconds IS NOT NULL
            GROUP BY u.id, c.id
            ORDER BY u.last_name, u.first_name, c.name
        """).fetchall()
        conn.close()
        
        return [
            {
                "student_name": f"{p['first_name']} {p['last_name']}",
                "email": p["email"],
                "course_name": p["course_name"],
                "total_seconds": p["total_seconds"] or 0,
                "session_count": p["session_count"]
            } for p in progress
        ]
    
    except Exception as e:
        error_msg = f"Get progress error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch progress")

@api_router.post("/upload-material")
async def upload_material(
    course_id: int = Form(...),
    material_type: str = Form(...),
    file: UploadFile = File(...),
    admin: dict = Depends(get_current_admin)
):
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = f"{upload_dir}/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Save to database
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO course_materials (course_id, material_type, filename, file_path) VALUES (?, ?, ?, ?)",
            (course_id, material_type, file.filename, file_path)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Material uploaded successfully"}
    
    except Exception as e:
        error_msg = f"Upload material error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to upload material")

@api_router.get("/course-materials/{course_id}")
async def get_course_materials(course_id: int, current_user: dict = Depends(get_current_user)):
    try:
        conn = get_db_connection()
        
        # Check access
        if not current_user["is_admin"]:
            assigned = conn.execute(
                "SELECT * FROM user_courses WHERE user_id = ? AND course_id = ?",
                (current_user["id"], course_id)
            ).fetchone()
            
            if not assigned:
                conn.close()
                raise HTTPException(status_code=403, detail="Course not assigned to user")
        
        materials = conn.execute(
            "SELECT * FROM course_materials WHERE course_id = ?",
            (course_id,)
        ).fetchall()
        conn.close()
        
        return [
            {
                "id": m["id"],
                "material_type": m["material_type"],
                "filename": m["filename"],
                "file_path": m["file_path"]
            } for m in materials
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get course materials error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch course materials")

@api_router.get("/student-assignments")
async def get_student_assignments(admin: dict = Depends(get_current_admin)):
    """Get all student-course assignments"""
    try:
        conn = get_db_connection()
        
        assignments = conn.execute("""
            SELECT 
                u.id as user_id,
                u.first_name,
                u.last_name,
                u.email,
                c.id as course_id,
                c.name as course_name,
                uc.assigned_at
            FROM user_courses uc
            JOIN users u ON uc.user_id = u.id
            JOIN courses c ON uc.course_id = c.id
            WHERE u.is_admin = FALSE
            ORDER BY u.first_name, u.last_name, c.name
        """).fetchall()
        
        conn.close()
        
        return [
            {
                "user_id": assignment["user_id"],
                "student_name": f"{assignment['first_name']} {assignment['last_name']}",
                "email": assignment["email"],
                "course_id": assignment["course_id"],
                "course_name": assignment["course_name"],
                "assigned_at": assignment["assigned_at"]
            } for assignment in assignments
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Get student assignments error: {str(e)}"
        await send_error_notification(error_msg)
        raise HTTPException(status_code=500, detail="Failed to fetch student assignments")

# Include API router
app.include_router(api_router)

# Serve React app
@app.get("/{path:path}")
async def serve_react_app(path: str):
    # Serve API routes normally
    if path.startswith("api/") or path in ["docs", "redoc", "openapi.json"]:
        raise HTTPException(status_code=404, detail="Not Found")
    
    # Serve React app for all other routes
    index_path = "static/index.html" if os.path.exists("static/index.html") else "../frontend/dist/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    else:
        return {"message": "Frontend not built. Run 'npm run build' in frontend directory."}

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
