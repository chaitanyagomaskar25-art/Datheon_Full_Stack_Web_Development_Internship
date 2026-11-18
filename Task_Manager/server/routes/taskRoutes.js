import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
  clearAllTasks,
} from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
} from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Enforce JWT authentication on all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateCreateTask, createTask)
  .delete(clearAllTasks);

router.post('/reorder', reorderTasks);

router.route('/:id')
  .get(validateTaskId, getTaskById)
  .put(validateTaskId, validateUpdateTask, updateTask)
  .delete(validateTaskId, deleteTask);

router.patch('/:id/toggle', validateTaskId, toggleTask);

export default router;
