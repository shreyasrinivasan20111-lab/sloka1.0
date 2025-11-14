import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BookOpen, Clock, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: '#ceaca4',
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(170, 113, 99, 0.3) 40px,
            rgba(170, 113, 99, 0.3) 80px
          )`
        }}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#7e5a40' }}></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8"
      style={{
        backgroundColor: '#ceaca4',
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 40px,
          rgba(170, 113, 99, 0.3) 40px,
          rgba(170, 113, 99, 0.3) 80px
        )`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-limelight" style={{ color: '#7e5a40' }}>
                Welcome, {user?.first_name} {user?.last_name}
              </h1>
              <p className="mt-2" style={{ color: '#7e5a40' }}>
                Continue your spiritual journey with Sanskrit education
              </p>
            </div>
                        <div className="flex items-center text-white px-4 py-2 rounded-lg" style={{ backgroundColor: '#7e5a40' }}>
              <User className="mr-2" size={20} />
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center" style={{ color: '#7e5a40' }}>
            <BookOpen className="mr-3" style={{ color: '#7e5a40' }} size={24} />
            Your Assigned Courses
          </h2>

          {courses.length === 0 ? (
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-12 text-center">
              <BookOpen className="mx-auto mb-4" style={{ color: '#7e5a40' }} size={64} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#7e5a40' }}>
                No Courses Assigned Yet
              </h3>
              <p style={{ color: '#7e5a40' }}>
                Please wait for an administrator to assign courses to your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white bg-opacity-80 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold" style={{ color: '#7e5a40' }}>
                        {course.name}
                      </h3>
                      <div className="text-white p-2 rounded-full" style={{ backgroundColor: '#7e5a40' }}>
                        <BookOpen size={20} />
                      </div>
                    </div>
                    
                    {course.description && (
                      <p className="mb-4" style={{ color: '#7e5a40' }}>{course.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center" style={{ color: '#7e5a40' }}>
                        <Clock className="mr-2" size={16} />
                        <span className="text-sm">Track your progress</span>
                      </div>
                      
                      <Link
                        to={`/course/${course.id}`}
                        className="text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
                        style={{ backgroundColor: '#7e5a40' }}
                      >
                        Enter Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#7e5a40' }}>
            How to Use Your Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Access Your Courses</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Click on any assigned course to access learning materials and resources.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Track Your Time</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Your study time is automatically tracked when you're active in a course.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <span className="font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Learn Sanskrit</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Study shlokas, listen to recordings, and immerse yourself in Vedic knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
