import express from 'express';
import { getHistory, clearHistory } from '../controllers/historyController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

// GET /api/history
router.get('/', getHistory);

// DELETE /api/history
router.delete('/', clearHistory);

export default router;
