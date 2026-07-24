import express from 'express';
const router = express.Router();
import { protect, checkPermission } from './auth.middleware.js';

router.use(protect);
import * as contractController from '../controllers/contract.controller.js';

router.post('/', checkPermission('contracts', 'create'), contractController.createContract);
router.get('/', checkPermission('contracts', 'view'), contractController.getContracts);
router.get('/:id', checkPermission('contracts', 'view'), contractController.getContractById);
router.patch('/:id', checkPermission('contracts', 'edit'), contractController.updateContract);
router.delete('/:id', checkPermission('contracts', 'delete'), contractController.deleteContract);

export default router;
