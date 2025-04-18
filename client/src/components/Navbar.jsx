import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-indigo-600">Quizzify</h1>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="User" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-indigo-600 font-medium">
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <span className="font-medium">
              {currentUser?.displayName || currentUser?.email || 'User'}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 