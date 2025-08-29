import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  logout,
  getUserStats
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getPlatformStats } from '../controllers/statsController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/stats', getPlatformStats);

// Protected routes
router.use(protect); // Apply protection to all routes below

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);
router.get('/user-stats', getUserStats);

export default router;
