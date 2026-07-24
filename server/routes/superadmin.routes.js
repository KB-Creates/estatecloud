import express from 'express';
import {
  getPlatformStats,
  getAllCompanies,
  updateCompanyStatus,
  updateCompanyPlan,
  getAllPlans,
  createPlan,
  updatePlan
} from '../controllers/superadmin.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

// Middleware to ensure user is Super Admin
const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
};

router.use(protect);
router.use(requireSuperAdmin);

router.get('/stats', getPlatformStats);
router.get('/companies', getAllCompanies);
router.patch('/companies/:id/status', updateCompanyStatus);
router.patch('/companies/:id/plan', updateCompanyPlan);

router.get('/plans', getAllPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);

export default router;
