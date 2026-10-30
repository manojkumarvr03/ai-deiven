import express from 'express';
import { getEducationPaths, getCourses, getCourseByCodeOrId } from '../controllers/educationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/paths', getEducationPaths);
router.get('/courses', getCourses);
router.get('/course/:idOrCode', protect, getCourseByCodeOrId);

export default router;
