import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import AdminDashboard from './pages/AdminDashboard';
import ErrorPage from './pages/ErrorPage';
import Winners from './pages/Winners';
import SaiSacharitra from './pages/SaiSacharitra';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div 
          className="min-h-screen scroll-container high-dpi-text" 
          style={{ backgroundColor: '#ceaca4' }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/sai-sacharitra" element={<SaiSacharitra />} />
            <Route path="/error" element={<ErrorPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/course/:courseId" 
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
