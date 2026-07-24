import express from 'express';
import {
  registerCompany,
  getCurrentCompany,
  updateCompanyProfile
} from '../controllers/company.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

// Public route to register new SaaS company
router.post('/register', registerCompany);

// Protected tenant company routes
router.get('/current', protect, getCurrentCompany);
router.put('/current', protect, updateCompanyProfile);

export default router;
