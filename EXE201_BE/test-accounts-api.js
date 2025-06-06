// Test Accounts API với Authentication
import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/api";

// Test data
const adminData = {
  name: "Admin User",
  email: "admin@gmail.com",
  password: "admin123456",
  role: "admin",
};

const userTest = async () => {
  try {
    console.log("🚀 Testing Accounts API...\n");

    // Step 1: Register admin user
    console.log("1. 📝 Registering admin user...");
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });

    const registerData = await registerRes.json();
    console.log("Register response:", registerData);

    if (!registerRes.ok) {
      if (registerData.message.includes("already registered")) {
        console.log("✅ Admin already exists, proceeding to login...");
      } else {
        throw new Error(registerData.message);
      }
    }

    // Step 2: Verify email (simulated - in real test, you'd get OTP from email)
    console.log("\n2. ✉️ Verifying email...");
    // For testing, you'd need to check email for OTP
    // Since this is automated test, we'll skip to login attempt

    // Step 3: Try login (will fail if email not verified)
    console.log("\n3. 🔐 Attempting login...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminData.email,
        password: adminData.password,
      }),
    });

    const loginData = await loginRes.json();
    console.log("Login response:", loginData);

    if (!loginRes.ok) {
      if (loginData.message.includes("verify your email")) {
        console.log("\n❌ Email not verified yet!");
        console.log("📧 Please check your email for OTP and verify first:");
        console.log(`POST ${BASE_URL}/auth/verify-email`);
        console.log('Body: { "email": "admin@gmail.com", "otp": "123456" }');
        return;
      }
      throw new Error(loginData.message);
    }

    const token = loginData.token;
    console.log("✅ Login successful! Token received.");

    // Step 4: Test GET accounts with token
    console.log("\n4. 👥 Testing GET /api/accounts...");
    const accountsRes = await fetch(`${BASE_URL}/accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const accountsData = await accountsRes.json();
    console.log("Accounts response:", accountsData);

    if (accountsRes.ok) {
      console.log("✅ GET accounts successful!");
      console.log(`📊 Total users: ${accountsData.total}`);
    } else {
      console.log("❌ GET accounts failed:", accountsData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

// Run test
userTest();
