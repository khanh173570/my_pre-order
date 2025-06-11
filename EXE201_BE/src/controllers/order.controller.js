import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// CREATE - Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id,
    });
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price image");

    res.status(201).json({
      success: true,
      message: "Đơn hàng được tạo thành công",
      data: populatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy tất cả đơn hàng (Admin/Staff)
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy đơn hàng của user hiện tại
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - Lấy một đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Check if user can access this order
    if (
      req.user.role === "customer" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn hàng này",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE - Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, transactionId, paymentDate } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (transactionId) updateData.transactionId = transactionId;
    if (paymentDate) updateData.paymentDate = paymentDate;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE - Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Chỉ cho phép xóa đơn hàng pending hoặc cancelled
    if (!["pending", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể xóa đơn hàng đang chờ xử lý hoặc đã hủy",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE - Hủy đơn hàng (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hủy đơn hàng này",
      });
    }

    // Chỉ cho phép hủy đơn hàng pending
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể hủy đơn hàng đang chờ xử lý",
      });
    }

    order.status = "cancelled";
    await order.save();

    // Hoàn trả stock cho các sản phẩm
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
