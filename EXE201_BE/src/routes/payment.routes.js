import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createPayment,
  vnpayReturn,
  vnpayIPN,
  getPaymentStatus,
  getUserPayments
} from '../controllers/payment.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create', protect, createPayment);
router.get('/status/:orderId', protect, getPaymentStatus);
router.get('/user-payments', protect, getUserPayments);

// Public routes (for VNPay callbacks)
router.get('/vnpay-return', vnpayReturn);
router.get('/vnpay-ipn', vnpayIPN);

export default router;