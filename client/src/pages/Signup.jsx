import React, { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, userProfile } = useAuth();

  
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName, role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {

      if (userProfile && userProfile.role) {
        navigate('/dashboard');
      }
      else if (currentUser && (!userProfile || !userProfile.role)) {
        navigate('/select-role');
      }
    }
  }, [currentUser, userProfile, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our AI-driven quiz platform
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-fadeIn" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6 animate-fadeIn" style={{ animationDelay: '100ms' }} onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="display-name" className="sr-only">
                Full Name
              </label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <input
                id="student-role"
                name="role"
                type="radio"
                checked={role === 'student'}
                onChange={() => setRole('student')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="student-role" className="ml-2 block text-sm text-gray-900">
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="teacher-role"
                name="role"
                type="radio"
                checked={role === 'teacher'}
                onChange={() => setRole('teacher')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="teacher-role" className="ml-2 block text-sm text-gray-900">
                Teacher
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign up
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4 transition-colors duration-200"
            >
              Sign up with Google
            </button>
          </div>
        </form>

        <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="text-sm">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 