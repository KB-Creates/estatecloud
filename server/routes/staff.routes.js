import express from 'express';
import * as staffController from '../controllers/staff.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('staff', 'create'), staffController.createStaff);
router.get('/', checkPermission('staff', 'view'), staffController.getStaff);
router.put('/:id', checkPermission('staff', 'edit'), staffController.updateStaff);
router.patch('/:id', checkPermission('staff', 'edit'), staffController.updateStaff);
router.delete('/:id', checkPermission('staff', 'delete'), staffController.deleteStaff);

export default router;
