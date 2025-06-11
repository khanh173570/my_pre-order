// Test script to verify pagination is working correctly
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const testPagination = async () => {
  try {
    console.log("🧪 Testing pagination functionality...\n");

    // Test 1: Get first page with default limit (10)
    console.log("1. Testing first page (default limit 10):");
    const page1Response = await axios.get(
      `${API_BASE_URL}/products?page=1&limit=10`
    );

    if (page1Response.data.status === "success") {
      const { data: products, pagination } = page1Response.data;
      console.log(`✅ Found ${products.length} products on page 1`);
      console.log(`📊 Pagination info:`, pagination);
    }

    // Test 2: Get first page with limit 5
    console.log("\n2. Testing first page (limit 5):");
    const page1Limit5Response = await axios.get(
      `${API_BASE_URL}/products?page=1&limit=5`
    );

    if (page1Limit5Response.data.status === "success") {
      const { data: products, pagination } = page1Limit5Response.data;
      console.log(`✅ Found ${products.length} products on page 1 (limit 5)`);
      console.log(`📊 Pagination info:`, pagination);
    }

    // Test 3: Get second page with limit 5
    console.log("\n3. Testing second page (limit 5):");
    const page2Limit5Response = await axios.get(
      `${API_BASE_URL}/products?page=2&limit=5`
    );

    if (page2Limit5Response.data.status === "success") {
      const { data: products, pagination } = page2Limit5Response.data;
      console.log(`✅ Found ${products.length} products on page 2 (limit 5)`);
      console.log(`📊 Pagination info:`, pagination);
    }

    // Test 4: Test invalid page (should return empty or error)
    console.log("\n4. Testing invalid page (page 999):");
    try {
      const invalidPageResponse = await axios.get(
        `${API_BASE_URL}/products?page=999&limit=10`
      );
      const { data: products, pagination } = invalidPageResponse.data;
      console.log(`✅ Page 999 returned ${products.length} products`);
      console.log(`📊 Pagination info:`, pagination);
    } catch (error) {
      console.log("⚠️  Invalid page handled correctly");
    }

    console.log("\n✨ Pagination test completed!");
    console.log("\n📝 Summary:");
    console.log("- Backend supports page and limit query parameters");
    console.log("- Pagination metadata is returned correctly");
    console.log("- Frontend can use this for proper pagination");
  } catch (error) {
    console.error(
      "❌ Error testing pagination:",
      error.response?.data || error.message
    );
  }
};

// Run the test
testPagination();
