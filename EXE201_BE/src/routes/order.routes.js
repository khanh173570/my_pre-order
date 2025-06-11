import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// CREATE - Tạo đơn hàng mới (Customer)
router.post("/", protect, createOrder);

// READ - Lấy tất cả đơn hàng (Admin/Staff)
router.get("/all", protect, authorize("admin", "staff"), getAllOrders);

// READ - Lấy đơn hàng của user hiện tại (Customer)
router.get("/my-orders", protect, getUserOrders);

// UPDATE - Hủy đơn hàng (Customer)
router.put("/:id/cancel", protect, cancelOrder);

// READ - Lấy đơn hàng theo ID
router.get("/:id", protect, getOrderById);

// UPDATE - Cập nhật trạng thái đơn hàng (Admin/Staff)
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus
);

// DELETE - Xóa đơn hàng (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteOrder);

export default router;
