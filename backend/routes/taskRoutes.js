import express from 'express';
import {
  getTasks,
  getTaskById,
  submitTask,
  getTaskHint
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks);

router.route('/:id')
  .get(getTaskById);

router.route('/:id/submit')
  .post(submitTask);

router.route('/:id/hint')
  .get(getTaskHint);

export default router;
