import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin,
} from '../controllers/auth.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);

export default router;
