import express from 'express';
import { restoreItem } from '../controllers/trash.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

router.post('/restore/:id', protect, restoreItem);

export default router;
