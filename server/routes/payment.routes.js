import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('payments', 'create'), paymentController.createPayment);
router.get('/', checkPermission('payments', 'view'), paymentController.getPayments);
router.get('/stats', checkPermission('payments', 'view'), paymentController.getPaymentStats);
router.get('/:id', checkPermission('payments', 'view'), paymentController.getPaymentById);
router.put('/:id', checkPermission('payments', 'edit'), paymentController.updatePayment);
router.patch('/:id', checkPermission('payments', 'edit'), paymentController.updatePayment);
router.delete('/:id', checkPermission('payments', 'delete'), paymentController.deletePayment);

export default router;
