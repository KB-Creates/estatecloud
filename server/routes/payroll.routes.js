import express from 'express';
import {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
  getPayrollStats
} from '../controllers/payroll.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getPayrollStats);
router.post('/', createPayroll);
router.get('/', getAllPayrolls);
router.get('/:id', getPayrollById);
router.patch('/:id', updatePayroll);
router.delete('/:id', deletePayroll);

export default router;
