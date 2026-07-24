import express from 'express';
import { 
    createMaintenance, 
    getMaintenances, 
    updateMaintenance, 
    deleteMaintenance 
} from '../controllers/maintenance.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', checkPermission('maintenance', 'create'), createMaintenance);
router.get('/', checkPermission('maintenance', 'view'), getMaintenances);
router.put('/:id', checkPermission('maintenance', 'edit'), updateMaintenance);
router.patch('/:id', checkPermission('maintenance', 'edit'), updateMaintenance);
router.delete('/:id', checkPermission('maintenance', 'delete'), deleteMaintenance);

export default router;
