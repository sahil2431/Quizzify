import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBook, FaHistory, FaPlusCircle, FaList ,FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ className, onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };
  
  // Notify parent component about initial state
  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [onToggle]);
  
  // Determine the active link
  const isActive = (path) => {
    return location.pathname === path ? 'bg-indigo-800' : '';
  };

  return (
    <aside className={`h-screen fixed top-0 left-0 z-40 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-indigo-900 text-white flex flex-col shadow-lg ${className}`}>
      {/* Toggle Button */}
      <button 
        className="absolute -right-3 top-20 bg-indigo-900 text-white p-1 rounded-full shadow-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Header with Logo/App Name */}
      <div className="p-4 border-b border-indigo-800 flex items-center">
        <span className={`font-bold text-xl ${!isOpen && 'hidden'}`}>Quizzify</span>
        <span className={`font-bold text-xl ${isOpen && 'hidden'}`}>Qf</span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {/* Account Details */}
          <li>
            <Link
               to="/dashboard"
               className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/dashboard')}`}
            >
              <FaTachometerAlt className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="ml-3 truncate">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link 
              to="/account" 
              className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/account')}`}
            >
              <FaUser className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="ml-3 truncate">Account Details</span>}
            </Link>
          </li>
          
          {/* Conditional links based on user role */}
          {userProfile?.role === 'student' ? (
            <>
              <li>
                <Link 
                  to="/join-quizz" 
                  className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/join-quizz')}`}
                >
                  <FaBook className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">Join Quizz</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/given-quizzes" 
                  className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/given-quizzes')}`}
                >
                  <FaHistory className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">Given Quizzes</span>}
                </Link>
              </li>
            </>
          ) : userProfile?.role === 'teacher' ? (
            <>
              <li>
                <Link 
                  to="/host-quiz" 
                  className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/host-quiz')}`}
                >
                  <FaPlusCircle className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">Host New Quiz</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-quizzes" 
                  className={`flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-colors ${isActive('/my-quizzes')}`}
                >
                  <FaList className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">My Quizzes</span>}
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
      
      {/* Logout Button at the bottom */}
      <div className="p-4 border-t border-indigo-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FaSignOutAlt className="w-5 h-5 flex-shrink-0 text-red-700" />
          {isOpen && <span className="ml-3 truncate text-red-700 font-bold ">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 