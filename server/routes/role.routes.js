import express from 'express';
import * as roleController from '../controllers/role.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('roles', 'create'), roleController.createRole);
router.get('/', checkPermission('roles', 'view'), roleController.getRoles);
router.get('/:id', checkPermission('roles', 'view'), roleController.getRoleById);
router.put('/:id', checkPermission('roles', 'edit'), roleController.updateRole);
router.patch('/:id', checkPermission('roles', 'edit'), roleController.updateRole);
router.delete('/:id', checkPermission('roles', 'delete'), roleController.deleteRole);

export default router;
