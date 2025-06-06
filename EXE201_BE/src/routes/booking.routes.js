import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createBooking,
  getBookings,
  updateBookingStatus
} from '../controllers/booking.controller.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router
  .route('/:id/status')
  .put(protect, authorize('admin', 'staff'), updateBookingStatus);

export default router;