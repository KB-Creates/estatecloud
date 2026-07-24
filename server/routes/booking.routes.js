import express from 'express';
import { protect, checkPermission } from './auth.middleware.js';

const router = express.Router();
router.use(protect);
import * as bookingController from '../controllers/booking.controller.js';

router.post('/', checkPermission('bookings', 'create'), bookingController.createBooking);
router.get('/', checkPermission('bookings', 'view'), bookingController.getBookings);
router.patch('/:id', checkPermission('bookings', 'edit'), bookingController.updateBooking);
router.delete('/:id', checkPermission('bookings', 'delete'), bookingController.deleteBooking);

export default router;
