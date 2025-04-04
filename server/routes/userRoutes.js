import { Router } from 'express';
import { getCurrentUser, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Get current user (requires authentication)
router.get('/me', authMiddleware, getCurrentUser);

// Update user profile (requires authentication)
router.put('/me', authMiddleware, updateUserProfile);

// Get all users (admin only)
router.get('/', authMiddleware, getAllUsers);

export default router; 