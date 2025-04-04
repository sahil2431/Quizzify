import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();

  useEffect(() => {
    if (currentUser && !userProfile) {
      fetchUserProfile();
    }
  }, [currentUser, userProfile, fetchUserProfile]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (currentUser && !userProfile) {
    return <div>Loading...</div>;
  }
  if (userProfile && (!userProfile.role || userProfile.role === '')) {
    return <Navigate to="/select-role" />;
  }

  return children;
};

export default PrivateRoute;