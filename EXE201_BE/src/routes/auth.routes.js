import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// Email verification routes
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationOTP);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile routes (protected)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
