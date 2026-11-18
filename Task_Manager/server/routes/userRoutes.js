import express from 'express';
import {
  getCurrentUser,
  updateUserPreferences,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/me', getCurrentUser);
router.put('/preferences', updateUserPreferences);

export default router;
