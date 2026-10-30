import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  getAllUsers,
  deleteUserByAdmin
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.delete('/admin/users/:id', protect, authorize('admin'), deleteUserByAdmin);

export default router;

