import express from 'express';
import { 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
} from '../controllers/notification.controller.js';
import { protect } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/mark-all-read', markAllAsRead);
router.delete('/clear-all', clearAllNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
