import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'staff'), createProduct);

router
  .route('/:id')
  .put(protect, authorize('admin', 'staff'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;