import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Mail, Phone } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
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
      <div className="max-w-md w-full text-center">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
          </div>
          
          <h1 className="text-3xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
            Oops! Something went wrong
          </h1>
          
          <p className="mb-6" style={{ color: '#7e5a40' }}>
            We apologize for the inconvenience. An error has occurred and our team has been notified.
          </p>
          
          <div className="bg-white bg-opacity-50 border rounded-lg p-4 mb-6" style={{ borderColor: '#7e5a40' }}>
            <p className="text-sm" style={{ color: '#7e5a40' }}>
              <strong>Error reported to:</strong>
            </p>
            <div className="flex items-center justify-center space-x-4 mt-2 text-sm" style={{ color: '#7e5a40' }}>
              <div className="flex items-center">
                <Phone className="mr-1" size={14} />
                732-407-6946
              </div>
              <div className="flex items-center">
                <Mail className="mr-1" size={14} />
                shreya.srinivasan2011@gmail.com
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
              style={{ backgroundColor: '#7e5a40' }}
            >
              <Home className="mr-2" size={16} />
              Return to Home
            </Link>
            
            <div className="text-sm" style={{ color: '#7e5a40' }}>
              <p>Error ID: {Date.now()}</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
