import User from '../models/User.js';

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.dbUser;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    const updates = {};
    
    if (displayName) updates.displayName = displayName;
    if (photoURL) updates.photoURL = photoURL;
    
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: updates },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.dbUser?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    
    const users = await User.find().select('-__v');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 