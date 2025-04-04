import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [error, setError] = useState('');
  

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {/* <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        
      </div> */}
    </div>
  );
};

export default Dashboard; 