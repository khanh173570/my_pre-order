import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// GET all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      data: users,
      total: users.length,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// CREATE new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Validation input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide name, email and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered. Please use a different email",
      });
    }

    // Set default role as 'user' if not provided
    const userData = {
      ...req.body,
      role: role || "user",
    };

    const user = await User.create(userData);
    const token = signToken(user._id);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(". "),
      });
    }

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "error",
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    } // Check if email is being updated and not duplicate
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists. Please use a different email",
        });
      }
    }

    // Check if role is being changed for a user with existing orders
    if (updateData.role) {
      const currentUser = await User.findById(id);
      if (
        currentUser &&
        currentUser.role === "user" &&
        updateData.role !== "user"
      ) {
        // Check if user has any orders
        const userOrders = await Order.findOne({ user: id });
        if (userOrders) {
          return res.status(400).json({
            status: "error",
            message: "Không thể thay đổi vai trò của người dùng đã có đơn hàng",
          });
        }
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(". "),
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot delete your own account",
      });
    }

    // Check if user has orders
    const userOrders = await Order.findOne({ user: id });
    if (userOrders) {
      return res.status(400).json({
        status: "error",
        message:
          "Không thể xóa tài khoản đã có đơn hàng. Vui lòng vô hiệu hóa tài khoản thay vì xóa.",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE current user profile
export const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Remove sensitive fields that users shouldn't update themselves
    delete updateData.role;
    delete updateData._id;

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Check if email is being updated and not duplicate
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists. Please use a different email",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(". "),
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Toggle account status (Admin only)
export const toggleAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        status: "error",
        message: "Không thể thay đổi trạng thái tài khoản của chính mình",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy tài khoản",
      });
    }

    // Check if it's the last admin account and trying to deactivate it
    if (user.role === "admin" && user.isActive) {
      const adminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });
      if (adminCount <= 1) {
        return res.status(400).json({
          status: "error",
          message: "Không thể khóa tài khoản admin cuối cùng trong hệ thống",
        });
      }
    }

    // Toggle the status
    user.isActive = !user.isActive;
    await user.save();

    const statusMessage = user.isActive ? "mở khóa" : "khóa";

    res.status(200).json({
      status: "success",
      message: `Tài khoản đã được ${statusMessage} thành công`,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
