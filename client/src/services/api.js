import axios from 'axios';
import { auth } from '../firebase';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add authorization token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Authorization Header:', config.headers.Authorization);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await api.put('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not authenticated');

    const userDataWithUid = {
      ...userData,
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName || user.displayName,
      photoURL: userData.photoURL || user.photoURL
    };

    const response = await api.post('/auth/register', userDataWithUid);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const saveQuizAttempt = async (quizId, answers, totalScore, isAIGenerated = false) => {
  try {
    const response = await api.post('/quiz-attempts', {
      quizId,
      answers,
      totalScore,
      isAIGenerated
    });
    return response.data;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
};

export const getQuizByCode = async (code) => {
  try {
    console.log("code", code); 
    const response = await api.get(`/quizzes/${code}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

export const getUserQuizzes = async () => {
  console.log("Getting user quizzes");
  try {
    const response = await api.get('/quizzes/getAll');
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user quizzes:', error.response);
    throw error;
  }
}

export default api; 