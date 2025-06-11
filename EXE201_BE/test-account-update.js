import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE = "http://localhost:5000/api";

// Test function to update account role
async function testAccountRoleUpdate() {
  try {
    // Step 1: Login as admin to get token
    console.log("🔐 Step 1: Login as admin...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test-admin@gmail.com",
      password: "admin123456",
    });

    const adminToken = loginResponse.data.token;
    console.log("✅ Admin login successful");

    // Step 2: Get all users to find a staff account
    console.log("\n👥 Step 2: Getting all accounts...");
    const accountsResponse = await axios.get(`${API_BASE}/accounts`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const accounts = accountsResponse.data.data;
    console.log(`📋 Found ${accounts.length} accounts`);

    // Find a staff account
    const staffAccount = accounts.find((acc) => acc.role === "staff");
    if (!staffAccount) {
      console.log("❌ No staff account found. Creating one...");

      // Create a staff account for testing
      const createResponse = await axios.post(
        `${API_BASE}/accounts`,
        {
          name: "Test Staff",
          email: "test-staff@gmail.com",
          password: "staff123456",
          role: "staff",
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log("✅ Staff account created:", createResponse.data.data.email);
      const newStaffAccount = createResponse.data.data;

      // Now test updating this staff to user
      console.log("\n🔄 Step 3: Testing role update from staff to user...");
      const updateResponse = await axios.put(
        `${API_BASE}/accounts/${newStaffAccount._id}`,
        {
          name: newStaffAccount.name,
          email: newStaffAccount.email,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log("✅ Role update successful:");
      console.log("- Before:", newStaffAccount.role);
      console.log("- After:", updateResponse.data.data.role);
    } else {
      console.log(`👤 Found staff account: ${staffAccount.email}`);

      // Test updating staff to user
      console.log("\n🔄 Step 3: Testing role update from staff to user...");
      const updateResponse = await axios.put(
        `${API_BASE}/accounts/${staffAccount._id}`,
        {
          name: staffAccount.name,
          email: staffAccount.email,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log("✅ Role update successful:");
      console.log("- Before:", staffAccount.role);
      console.log("- After:", updateResponse.data.data.role);
    }
  } catch (error) {
    console.error("❌ Error occurred:", error.response?.data || error.message);

    if (error.response?.status === 400) {
      console.log(
        "🔍 This is a 400 Bad Request error - checking validation issues..."
      );
    } else if (error.response?.status === 403) {
      console.log("🔍 This is a 403 Forbidden error - checking permissions...");
    } else if (error.response?.status === 404) {
      console.log(
        "🔍 This is a 404 Not Found error - checking if account exists..."
      );
    }
  }
}

// Run the test
console.log("🧪 Testing Account Role Update from Staff to User\n");
testAccountRoleUpdate();
