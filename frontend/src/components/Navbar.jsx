import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, User, Home, Award, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Hamburger Menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-saffron focus:outline-none focus:text-saffron transition-colors duration-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-saffron hover:text-white transition-colors duration-200"
                  >
                    <Home className="mr-2" size={16} />
                    Home
                  </Link>
                  <Link
                    to="/winners"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-saffron hover:text-white transition-colors duration-200"
                  >
                    <Award className="mr-2" size={16} />
                    Winners
                  </Link>
                  <Link
                    to="/sai-sacharitra"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-saffron hover:text-white transition-colors duration-200"
                  >
                    <BookOpen className="mr-2" size={16} />
                    Sai Sacharitra
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-2xl font-limelight text-saffron hover:text-orange-600 transition-colors duration-200">
              Sai Kalpataru Vidyalaya
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.first_name}
                </span>
                
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center bg-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <User className="mr-2" size={16} />
                    Admin
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center bg-saffron text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                  >
                    <User className="mr-2" size={16} />
                    Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="mr-2" size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
