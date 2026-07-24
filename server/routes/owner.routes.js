import express from 'express';
import * as ownerController from '../controllers/owner.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('property_owners', 'create'), ownerController.createOwner);
router.get('/', checkPermission('property_owners', 'view'), ownerController.getOwners);
router.put('/:id', checkPermission('property_owners', 'edit'), ownerController.updateOwner);
router.patch('/:id', checkPermission('property_owners', 'edit'), ownerController.updateOwner);
router.delete('/:id', checkPermission('property_owners', 'delete'), ownerController.deleteOwner);

export default router;
