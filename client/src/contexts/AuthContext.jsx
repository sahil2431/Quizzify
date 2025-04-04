import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, registerUser as apiRegisterUser } from '../services/api';
import { verifyToken } from '../services/api';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName, role) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      if (role) {
        await apiRegisterUser({ role, displayName });
      }
      
      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Login with Google
  async function loginWithGoogle(role) {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      await verifyToken();
    
      if (role) {
        await apiRegisterUser({ role });
      }
      
      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }
  
  // Register user with role (for existing auth users)
  async function registerUserRole(role) {
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      console.log('Registering role for user:', currentUser.uid, 'Role:', role);
      
      const result = await apiRegisterUser({ role });
      console.log('Registration result:', result);
      
      // Force a fresh profile fetch
      const profile = await fetchUserProfile(); 
      console.log('Updated profile:', profile);
      
      return result;
    } catch (error) {
      console.error('Error registering user role:', error);
      throw error;
    }
  }
  
  // Logout
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  function updateUserProfile(displayName, photoURL) {
    return updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: photoURL || auth.currentUser.photoURL
    });
  }

  // Fetch user profile from backend
  async function fetchUserProfile() {
    if (currentUser) {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        return profile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      } else {
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserProfile,
    registerUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 