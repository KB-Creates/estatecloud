import express from 'express';
import { getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty } from '../controllers/property.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/', checkPermission('properties', 'view'), getAllProperties);
router.post('/', checkPermission('properties', 'create'), createProperty);
router.get('/:id', checkPermission('properties', 'view'), getPropertyById);
router.put('/:id', checkPermission('properties', 'edit'), updateProperty);
router.patch('/:id', checkPermission('properties', 'edit'), updateProperty);
router.delete('/:id', checkPermission('properties', 'delete'), deleteProperty);

export default router;