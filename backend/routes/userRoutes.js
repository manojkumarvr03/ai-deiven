import express from 'express';
import { updateStudyRole, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/study-role', updateStudyRole);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;
