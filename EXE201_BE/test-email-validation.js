// Test email validation and OTP sending
import { validateEmail } from "./src/utils/customEmailValidator.js";
import { sendVerificationOTP } from "./src/utils/email.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🧪 Testing Email System with Domain Validation\n");

// Test cases for email validation
const testEmails = [
  "khanhtpse173570@fpt.edu.vn", // Valid FPT
  "student@fpt.edu.vn", // Valid FPT
  "user@gmail.com", // Valid Gmail
  "test@yahoo.com", // Invalid domain
  "user@hotmail.com", // Invalid domain
  "admin@fpt.edu.vn", // Valid FPT
  "invalid-email", // Invalid format
  "@gmail.com", // Invalid format
  "test@", // Invalid format
];

console.log("📧 Email Domain Validation Tests:");
console.log("=".repeat(50));

testEmails.forEach((email, index) => {
  const validation = validateEmail(email);
  const status = validation.isValid ? "✅ VALID" : "❌ INVALID";
  console.log(`${index + 1}. ${email.padEnd(30)} ${status}`);
  if (!validation.isValid) {
    console.log(`   Reason: ${validation.message}`);
  }
});

console.log("\n" + "=".repeat(50));

// Test email sending (only if email config is available)
async function testEmailSending() {
  console.log("\n📨 Testing Email Sending...");

  // Check environment variables
  const emailFrom = process.env.EMAIL_FROM;
  const emailPassword = process.env.EMAIL_PASSWORD;

  console.log(`Email From: ${emailFrom}`);
  console.log(`Email Password Set: ${emailPassword ? "✅ Yes" : "❌ No"}`);

  if (
    !emailFrom ||
    !emailPassword ||
    emailPassword === "your_actual_gmail_app_password"
  ) {
    console.log("\n⚠️  Email configuration incomplete!");
    console.log("Please update .env file with:");
    console.log("- EMAIL_FROM: Your Gmail address");
    console.log(
      "- EMAIL_PASSWORD: Your Gmail App Password (not regular password)"
    );
    console.log("\n📖 To get Gmail App Password:");
    console.log("1. Go to Google Account settings");
    console.log("2. Security → 2-Step Verification (must be enabled)");
    console.log("3. App passwords → Generate app password");
    console.log("4. Copy the 16-character password to .env file");
    return;
  }
  // Test sending to a valid email
  const testEmail = "khanhtpse173570@fpt.edu.vn";
  const testOTP = "123456";

  console.log(`\n🚀 Attempting to send test OTP to: ${testEmail}`);

  try {
    const result = await sendVerificationOTP(testEmail, "Test User", testOTP);

    if (result) {
      console.log("✅ Test email sent successfully!");
      console.log("📱 Check your inbox for the verification email.");
    } else {
      console.log("❌ Failed to send test email.");
      console.log("💡 Common issues:");
      console.log("   - Invalid Gmail App Password");
      console.log("   - 2-Step Verification not enabled");
      console.log("   - Less secure app access blocked");
    }
  } catch (error) {
    console.log("❌ Error sending test email:", error.message);
  }
}

// Run email sending test
testEmailSending();
