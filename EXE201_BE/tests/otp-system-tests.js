// OTP System Test Suite
// Test these endpoints using Postman or any REST client

/**
 * COMPLETE OTP TESTING WORKFLOW
 * =============================
 *
 * Prerequisites:
 * 1. Server running on http://localhost:5000
 * 2. MongoDB connected
 * 3. Email credentials configured in .env
 * 4. Gmail app password set up
 */

const BASE_URL = "http://localhost:5000/api";

// Test Data
const testUser = {
  name: "John Doe",
  email: "test@example.com", // Replace with your actual email for testing
  password: "password123",
  phone: "1234567890",
  address: "123 Test Street",
};

/**
 * TEST 1: USER REGISTRATION WITH OTP
 * ==================================
 */
const registrationTest = {
  method: "POST",
  url: `${BASE_URL}/auth/register`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testUser),
};

// Expected Response:
const registrationResponse = {
  status: "success",
  message:
    "Registration successful! Please check your email for verification OTP.",
  data: {
    userId: "generated_user_id",
    email: "test@example.com",
    message: "Please verify your email before logging in",
  },
};

/**
 * TEST 2: LOGIN WITHOUT EMAIL VERIFICATION (Should Fail)
 * =====================================================
 */
const loginWithoutVerificationTest = {
  method: "POST",
  url: `${BASE_URL}/auth/login`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    password: testUser.password,
  }),
};

// Expected Response:
const loginWithoutVerificationResponse = {
  status: "error",
  message:
    "Please verify your email before logging in. Check your inbox for verification OTP.",
  data: {
    needsVerification: true,
    userId: "user_id",
  },
};

/**
 * TEST 3: EMAIL VERIFICATION
 * =========================
 */
const emailVerificationTest = {
  method: "POST",
  url: `${BASE_URL}/auth/verify-email`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    otp: "123456", // Replace with actual OTP from email
  }),
};

// Expected Response:
const emailVerificationResponse = {
  status: "success",
  message: "Email verified successfully! You can now log in.",
  token: "jwt_token",
  user: {
    id: "user_id",
    name: "John Doe",
    email: "test@example.com",
    role: "user",
  },
};

/**
 * TEST 4: RESEND VERIFICATION OTP
 * ==============================
 */
const resendOTPTest = {
  method: "POST",
  url: `${BASE_URL}/auth/resend-verification`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
  }),
};

// Expected Response:
const resendOTPResponse = {
  status: "success",
  message: "Verification OTP resent successfully. Please check your email.",
};

/**
 * TEST 5: SUCCESSFUL LOGIN AFTER VERIFICATION
 * ==========================================
 */
const successfulLoginTest = {
  method: "POST",
  url: `${BASE_URL}/auth/login`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    password: testUser.password,
  }),
};

// Expected Response:
const successfulLoginResponse = {
  status: "success",
  message: "Login successful",
  token: "jwt_token",
  user: {
    id: "user_id",
    name: "John Doe",
    email: "test@example.com",
    role: "user",
  },
};

/**
 * TEST 6: FORGOT PASSWORD REQUEST
 * ==============================
 */
const forgotPasswordTest = {
  method: "POST",
  url: `${BASE_URL}/auth/forgot-password`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
  }),
};

// Expected Response:
const forgotPasswordResponse = {
  status: "success",
  message: "Password reset OTP sent to your email. Please check your inbox.",
};

/**
 * TEST 7: RESET PASSWORD WITH OTP
 * ==============================
 */
const resetPasswordTest = {
  method: "POST",
  url: `${BASE_URL}/auth/reset-password`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    otp: "654321", // Replace with actual OTP from email
    newPassword: "newpassword123",
  }),
};

// Expected Response:
const resetPasswordResponse = {
  status: "success",
  message:
    "Password reset successfully! You can now log in with your new password.",
};

/**
 * TEST 8: LOGIN WITH NEW PASSWORD
 * ==============================
 */
const loginWithNewPasswordTest = {
  method: "POST",
  url: `${BASE_URL}/auth/login`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    password: "newpassword123",
  }),
};

/**
 * ERROR SCENARIOS TO TEST
 * ======================
 */

// Test 1: Invalid OTP
const invalidOTPTest = {
  method: "POST",
  url: `${BASE_URL}/auth/verify-email`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    otp: "000000", // Invalid OTP
  }),
};

// Expected Response:
const invalidOTPResponse = {
  status: "error",
  message: "Invalid or expired OTP",
};

// Test 2: Expired OTP (wait 10+ minutes after receiving OTP)
const expiredOTPTest = {
  method: "POST",
  url: `${BASE_URL}/auth/verify-email`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    otp: "123456", // Valid format but expired
  }),
};

// Test 3: Non-existent email
const nonExistentEmailTest = {
  method: "POST",
  url: `${BASE_URL}/auth/verify-email`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "nonexistent@example.com",
    otp: "123456",
  }),
};

// Expected Response:
const nonExistentEmailResponse = {
  status: "error",
  message: "User not found",
};

// Test 4: Already verified email
const alreadyVerifiedTest = {
  method: "POST",
  url: `${BASE_URL}/auth/verify-email`,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: testUser.email,
    otp: "123456",
  }),
};

// Expected Response (if email already verified):
const alreadyVerifiedResponse = {
  status: "error",
  message: "Email is already verified",
};

/**
 * TESTING INSTRUCTIONS
 * ===================
 *
 * 1. SETUP:
 *    - Start your server: npm run dev
 *    - Ensure MongoDB is running
 *    - Configure email credentials in .env
 *    - Replace test@example.com with your actual email
 *
 * 2. REGISTRATION FLOW:
 *    - Execute registrationTest
 *    - Check your email for 6-digit OTP
 *    - Execute emailVerificationTest with the received OTP
 *    - Execute successfulLoginTest
 *
 * 3. PASSWORD RESET FLOW:
 *    - Execute forgotPasswordTest
 *    - Check your email for password reset OTP
 *    - Execute resetPasswordTest with the received OTP
 *    - Execute loginWithNewPasswordTest
 *
 * 4. ERROR TESTING:
 *    - Test all error scenarios listed above
 *    - Verify proper error messages are returned
 *
 * 5. TIMING TESTS:
 *    - Test OTP expiration (wait 10+ minutes)
 *    - Test resend functionality
 *
 * 6. EDGE CASES:
 *    - Test with malformed email addresses
 *    - Test with very short/long passwords
 *    - Test rate limiting if implemented
 */

/**
 * POSTMAN COLLECTION EXPORT
 * ========================
 *
 * You can import these test cases into Postman:
 * 1. Create a new collection
 * 2. Add environment variables:
 *    - baseUrl: http://localhost:5000/api
 *    - testEmail: your_test_email@example.com
 * 3. Create requests for each test case above
 * 4. Set up test scripts to validate responses
 */

/**
 * COMMON ISSUES & SOLUTIONS
 * ========================
 *
 * Issue: "Failed to send verification email"
 * Solution: Check EMAIL_FROM and EMAIL_PASSWORD in .env
 *
 * Issue: "Invalid or expired OTP"
 * Solution: Ensure OTP is entered within 10 minutes
 *
 * Issue: "User not found"
 * Solution: Ensure user registration was successful
 *
 * Issue: "Email is already verified"
 * Solution: This is expected after successful verification
 *
 * Issue: Gmail authentication errors
 * Solution: Use App Password, not regular Gmail password
 */

export {
  registrationTest,
  emailVerificationTest,
  successfulLoginTest,
  forgotPasswordTest,
  resetPasswordTest,
  // ... all other test cases
};
