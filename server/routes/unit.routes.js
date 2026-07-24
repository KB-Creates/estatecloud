import express from 'express';
import { createUnit, getAllUnits, getUnitById, getUnitsByProperty, updateUnit, deleteUnit } from '../controllers/unit.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();
router.use(protect);

router.post('/', checkPermission('units', 'create'), createUnit);
router.get('/', checkPermission('units', 'view'), getAllUnits);
router.get('/:id', checkPermission('units', 'view'), getUnitById);
router.get('/property/:propertyId', checkPermission('units', 'view'), getUnitsByProperty);
router.patch('/:id', checkPermission('units', 'edit'), updateUnit);
router.delete('/:id', checkPermission('units', 'delete'), deleteUnit);

export default router;
