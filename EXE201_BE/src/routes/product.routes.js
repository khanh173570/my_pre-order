import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  addProductImage,
  removeProductImage,
  reorderProductImages,
  setMainProductImage,
} from "../controllers/product.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin", "staff"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("admin", "staff"), updateProduct)
  .delete(protect, authorize("admin", "staff"), deleteProduct);

// Toggle product status
router
  .route("/:id/toggle-status")
  .patch(protect, authorize("admin", "staff"), toggleProductStatus);

// Image management routes
router
  .route("/:productId/images/add")
  .post(protect, authorize("admin", "staff"), addProductImage);

router
  .route("/:productId/images/remove")
  .post(protect, authorize("admin", "staff"), removeProductImage);

router
  .route("/:productId/images/reorder")
  .post(protect, authorize("admin", "staff"), reorderProductImages);

router
  .route("/:productId/images/set-main")
  .post(protect, authorize("admin", "staff"), setMainProductImage);

export default router;
