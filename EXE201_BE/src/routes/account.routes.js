import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from "../controllers/account.controller.js";

const router = express.Router();

// Profile routes (authenticated users)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin only routes
router
  .route("/")
  .get(protect, authorize("admin"), getUsers)
  .post(protect, authorize("admin"), createUser);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUserById)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

export default router;
