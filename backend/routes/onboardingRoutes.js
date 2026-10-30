import express from 'express';
import { getOnboardingStatus, completeOnboarding } from '../controllers/onboardingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', protect, getOnboardingStatus);
router.post('/complete', protect, completeOnboarding);

export default router;
