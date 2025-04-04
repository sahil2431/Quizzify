import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleSelection() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { registerUserRole, currentUser, userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Check if user already has a role
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!userProfile) {
        await fetchUserProfile();
      }
      
      // If user already has a role, redirect to dashboard
      if (userProfile && userProfile.role) {
        navigate('/dashboard');
      }
    };
    
    checkUserProfile();
  }, [userProfile, fetchUserProfile, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Log for debugging
      console.log('Registering role:', role);
      
      const result = await registerUserRole(role);
      console.log('Role registration result:', result);
      
      await fetchUserProfile(); // Force refresh the profile
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Role selection error:', error);
      setError('Failed to set user role. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  console.log('Current user:', currentUser);
console.log('User profile:', userProfile);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome {currentUser?.displayName || 'to QuizAI'}! Please select your role to continue.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-fadeIn" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6 animate-fadeIn" style={{ animationDelay: '100ms' }} onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="student-role"
                  name="role"
                  type="radio"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="student-role" className="ml-3 block text-sm font-medium text-gray-700">
                  <div className="text-lg font-semibold">Student</div>
                  <p className="text-gray-500 text-sm">Take quizzes, compete with others, and get AI-generated feedback.</p>
                </label>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  id="teacher-role"
                  name="role"
                  type="radio"
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="teacher-role" className="ml-3 block text-sm font-medium text-gray-700">
                  <div className="text-lg font-semibold">Teacher</div>
                  <p className="text-gray-500 text-sm">Create quizzes, monitor student progress, and analyze results.</p>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 