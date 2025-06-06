import dotenv from "dotenv";
import { sendVerificationOTP } from "./src/utils/email.js";

// Load environment variables
dotenv.config();

console.log("🔧 Testing Email Configuration...");
console.log("Environment variables:");
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log(
  "EMAIL_PASSWORD:",
  process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Not set"
);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

// Test sending email
const testEmail = async () => {
  try {
    console.log("\n📧 Testing email sending...");

    const testData = {
      email: "khanhtranphuong2003@gmail.com",
      name: "Test User",
      otp: "123456",
    };

    const result = await sendVerificationOTP(
      testData.email,
      testData.name,
      testData.otp
    );

    if (result) {
      console.log("✅ Email test successful!");
      console.log("Please check your inbox for the test email.");
    } else {
      console.log("❌ Email test failed!");
      console.log("Please check your email configuration.");
    }
  } catch (error) {
    console.error("❌ Email test error:", error);
  }
};

testEmail();
