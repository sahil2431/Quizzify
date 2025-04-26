import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Student from '../components/dashboard/Student';
import Teacher from '../components/dashboard/Teacher';

const Dashboard = () => {
  const [error, setError] = useState('');
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Mock data - replace with API calls later
  

  const handleJoinQuiz = () => {
    if(userProfile?.role === "student") {
      navigate("/join-quizz");
    }
    else if(userProfile?.role === "teacher") {
      navigate("/my-quizzes");
    }
  };  

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">Welcome, {userProfile.displayName}!</p>
        </div>
        <button
          onClick={handleJoinQuiz}
          className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {userProfile?.role === "student" ? "Join Quiz" : "My Quizzes"}
        </button>
      </div>

      {userProfile?.role === "student" ? <Student/> : <Teacher/>}

      
    </div>
  );
};

export default Dashboard; 