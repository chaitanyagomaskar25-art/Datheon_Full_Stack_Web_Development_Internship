import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  checkReminders,
} from '../controllers/notificationController.js';

const router = express.Router();

// Enforce authentication on all notification endpoints
router.use(protect);

router.route('/')
  .get(getNotifications)
  .delete(clearAllNotifications);

router.post('/check', checkReminders);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
