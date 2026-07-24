import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/financial', checkPermission('financial_reports', 'view'), reportController.getFinancialReport);
router.get('/dashboard', reportController.getDashboardStats);

export default router;
