import express from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('expenses', 'create'), expenseController.createExpense);
router.get('/', checkPermission('expenses', 'view'), expenseController.getExpenses);
router.get('/stats', checkPermission('expenses', 'view'), expenseController.getExpenseStats);
router.delete('/:id', checkPermission('expenses', 'delete'), expenseController.deleteExpense);

export default router;
