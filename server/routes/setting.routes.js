import express from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', checkPermission('settings', 'view'), settingController.getSettings);
router.patch('/', checkPermission('settings', 'edit'), settingController.updateSettings);
router.get('/backup', checkPermission('settings', 'edit'), settingController.downloadBackup);
router.post('/test-email', checkPermission('settings', 'edit'), settingController.testEmail);
router.post('/restore', checkPermission('settings', 'edit'), settingController.restoreBackup);

export default router;