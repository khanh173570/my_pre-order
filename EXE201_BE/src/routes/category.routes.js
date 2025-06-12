import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/category.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin", "staff"), createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, authorize("admin", "staff"), updateCategory)
  .delete(protect, authorize("admin", "staff"), deleteCategory);

// Route to toggle category status
router
  .route("/:id/toggle-status")
  .patch(protect, authorize("admin", "staff"), toggleCategoryStatus);

export default router;
