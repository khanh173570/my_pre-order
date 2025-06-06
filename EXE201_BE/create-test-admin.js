// Quick test script - bypasses email verification for testing
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createTestAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/preorder"
    );
    console.log("✅ Connected to MongoDB");

    // Check if test admin already exists
    let admin = await User.findOne({ email: "test-admin@gmail.com" });

    if (!admin) {
      // Create new test admin
      admin = await User.create({
        name: "Test Admin",
        email: "test-admin@gmail.com",
        password: "admin123456",
        role: "admin",
        isVerified: true, // Bypass verification for testing
        phone: "0123456789",
        address: "Test Address",
      });
      console.log("✅ Test admin created:", admin.email);
    } else {
      // Update existing admin to be verified
      admin.isVerified = true;
      await admin.save();
      console.log("✅ Test admin updated:", admin.email);
    }

    // Generate token
    const token = signToken(admin._id);

    console.log("\n🔑 Login Details:");
    console.log("Email:", admin.email);
    console.log("Password: admin123456");
    console.log("Role:", admin.role);
    console.log("Verified:", admin.isVerified);

    console.log("\n🎫 JWT Token:");
    console.log(token);

    console.log("\n🧪 Test Commands:");
    console.log("1. Login:");
    console.log(`   POST http://localhost:5000/api/auth/login`);
    console.log(
      `   Body: {"email":"test-admin@gmail.com","password":"admin123456"}`
    );

    console.log("\n2. Get Accounts:");
    console.log(`   GET http://localhost:5000/api/accounts`);
    console.log(`   Authorization: Bearer ${token}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestAdmin();
