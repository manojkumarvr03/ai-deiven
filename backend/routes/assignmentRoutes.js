import express from 'express';
import {
  getAssignments,
  getAssignmentById,
  submitAssignment
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAssignments);

router.route('/:id')
  .get(getAssignmentById);

router.route('/:id/submit')
  .post(submitAssignment);

export default router;
