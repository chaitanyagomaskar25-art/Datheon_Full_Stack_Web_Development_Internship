import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoriteController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All favorites routes support both authenticated users and guests seamlessly
router.use(optionalAuth);

// GET /api/favorites
router.get('/', getFavorites);

// POST /api/favorites
router.post('/', addFavorite);

// DELETE /api/favorites/:id
router.delete('/:id', removeFavorite);

export default router;
