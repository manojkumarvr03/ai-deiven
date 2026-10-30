import express from 'express';
import {
  getAllProgress,
  getProgressByCourse,
  startLevel,
  completeAssessmentAndUnlock,
  resetProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllProgress);
router.post('/reset', resetProgress);
router.get('/:courseId', getProgressByCourse);
router.post('/start', startLevel);
router.post('/complete', completeAssessmentAndUnlock);

export default router;
