import express from 'express';
import { getWeather } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather?city=... OR /api/weather?lat=...&lon=...
router.get('/', getWeather);

export default router;
