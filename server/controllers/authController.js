import User from '../models/User.js';
import admin from '../config/firebase-config.js';

// Verify token and create user if not exists
export const verifyToken = async (req, res) => {
  try {
    // User is already verified and set in req.user by middleware
    const { uid, email, name, picture } = req.user;
    
    // Check if user exists in our database
    let user = await User.findOne({ uid });
    
    if (!user && email) {
      // Create a new user if not exists
      user = new User({
        uid,
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
      });
      
      await user.save();
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register a new user with role
export const registerUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, role } = req.body;
    
    console.log('Register user request:', { uid, email, role });
    
    // Validate role
    if (role && !['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either "student" or "teacher"' });
    }
    
    // Check if user already exists
    let existingUser = await User.findOne({ uid });
    
    if (existingUser) {
      console.log('Existing user found:', existingUser);
      
      // Always update role if provided (change this logic)
      if (role) {
        existingUser.role = role;
        const savedUser = await existingUser.save();
        console.log('User updated with role:', savedUser);
        return res.status(200).json({ 
          user: savedUser, 
          message: 'User role updated successfully' 
        });
      }
      
      return res.status(200).json({ user: existingUser, message: 'User already exists' });
    }
    
    // Create new user
    const newUser = new User({
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: photoURL || '',
      role: role || 'student' // Default to student if no role provided
    });
    
    const savedUser = await newUser.save();
    console.log('New user created:', savedUser);
    
    res.status(201).json({ user: savedUser, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 