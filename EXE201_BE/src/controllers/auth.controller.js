import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendVerificationOTP, sendPasswordResetOTP } from "../utils/email.js";
import { validateEmail } from "../utils/customEmailValidator.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide name, email and password",
      });
    }

    // Validate email domain
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        status: "error",
        message: emailValidation.message,
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

    // Create user data with default role
    const userData = {
      ...req.body,
      role: req.body.role || "user",
      isVerified: false, // Set to false initially
    };

    const user = await User.create(userData);

    // Generate email verification OTP
    const otp = user.createEmailVerificationOTP();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const emailSent = await sendVerificationOTP(user.email, user.name, otp);

    if (!emailSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      status: "success",
      message:
        "Registration successful! Please check your email for verification OTP.",
      data: {
        userId: user._id,
        email: user.email,
        message: "Please verify your email before logging in",
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        status: "error",
        message:
          "Please verify your email before logging in. Check your inbox for verification OTP.",
        data: {
          needsVerification: true,
          userId: user._id,
        },
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and OTP",
      });
    }

    const user = await User.findOne({ email }).select(
      "+emailVerificationOTP +emailVerificationOTPExpires"
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    if (!user.verifyEmailOTP(otp)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully! You can now log in.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Resend email verification OTP
export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = user.createEmailVerificationOTP();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const emailSent = await sendVerificationOTP(user.email, user.name, otp);

    if (!emailSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Verification OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Forgot password - send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found with this email address",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Please verify your email first before resetting password",
      });
    }

    // Generate password reset OTP
    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send password reset email
    const emailSent = await sendPasswordResetOTP(user.email, user.name, otp);

    if (!emailSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to send password reset email. Please try again.",
      });
    }

    res.status(200).json({
      status: "success",
      message:
        "Password reset OTP sent to your email. Please check your inbox.",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Reset password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email, OTP and new password",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await User.findOne({ email }).select(
      "+passwordResetOTP +passwordResetOTPExpires"
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!user.verifyPasswordResetOTP(otp)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    // Update password and clear OTP fields
    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message:
        "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
