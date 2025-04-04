import admin from '../config/firebase-config.js';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    
    // Set the user in the request object
    req.user = decodedToken;
    
    // Check if user exists in our database
    const userExists = await User.findOne({ uid: decodedToken.uid });
    
    // Set the database user in the request object if it exists
    req.dbUser = userExists || null;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

export default authMiddleware; 