import express from 'express';
const router = express.Router();
import { protect, checkPermission } from './auth.middleware.js';

import * as inquiryController from '../controllers/inquiry.controller.js';

router.post('/public', inquiryController.createPublicInquiry);

router.use(protect);

router.post('/', checkPermission('inquiries', 'create'), inquiryController.createInquiry);
router.post('/bulk', checkPermission('inquiries', 'create'), inquiryController.bulkCreateInquiries);
router.get('/', checkPermission('inquiries', 'view'), inquiryController.getInquiries);
router.patch('/:id', checkPermission('inquiries', 'edit'), inquiryController.updateInquiry);
router.delete('/:id', checkPermission('inquiries', 'delete'), inquiryController.deleteInquiry);

export default router;

