import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPayment,
  vnpayReturn,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create payment URL - requires authentication
router.post("/create", protect, createPayment);

// VNPay return URL - public endpoint
router.get("/payment-return", vnpayReturn);

export default router;
