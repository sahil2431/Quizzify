import { Router } from 'express';
import { verifyToken, registerUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Verify token and get user
router.get('/verify-token', authMiddleware, verifyToken);

// Register a new user with role
router.post('/register', authMiddleware, registerUser);

export default router; 