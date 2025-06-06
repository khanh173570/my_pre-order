import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import {
  customEmailValidator,
  emailValidatorMessage,
} from "../utils/customEmailValidator.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "Please provide a valid email format",
        },
        {
          validator: customEmailValidator,
          message: emailValidatorMessage,
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "staff", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
      select: false,
    },
    emailVerificationOTPExpires: {
      type: Date,
      select: false,
    },
    passwordResetOTP: {
      type: String,
      select: false,
    },
    passwordResetOTPExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification OTP
userSchema.methods.createEmailVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  this.emailVerificationOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  this.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return otp;
};

// Generate password reset OTP
userSchema.methods.createPasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  this.passwordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return otp;
};

// Verify email verification OTP
userSchema.methods.verifyEmailOTP = function (otp) {
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  return (
    this.emailVerificationOTP === hashedOTP &&
    this.emailVerificationOTPExpires > Date.now()
  );
};

// Verify password reset OTP
userSchema.methods.verifyPasswordResetOTP = function (otp) {
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  return (
    this.passwordResetOTP === hashedOTP &&
    this.passwordResetOTPExpires > Date.now()
  );
};

const User = mongoose.model("User", userSchema);
export default User;
