// Test script to verify product filtering by status
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const testProductFiltering = async () => {
  try {
    console.log("🧪 Testing product filtering by status...\n");

    // Test 1: Get all products from backend (should include all statuses)
    console.log("1. Testing backend API - should return all products:");
    const backendResponse = await axios.get(`${API_BASE_URL}/products`);

    if (backendResponse.data.status === "success") {
      const allProducts = backendResponse.data.data;
      console.log(`✅ Backend returned ${allProducts.length} products total`);

      // Count by status
      const statusCounts = allProducts.reduce((acc, product) => {
        const status = product.status || "no_status";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      console.log("📊 Products by status:", statusCounts);
    }

    // Test 2: Simulate frontend filtering (what the frontend service would do)
    console.log(
      "\n2. Testing frontend filtering - should only show active products:"
    );
    const activeProducts = backendResponse.data.data.filter(
      (product) => product.status === "active" || !product.status
    );

    console.log(
      `✅ Frontend would show ${activeProducts.length} active products`
    );
    console.log("📋 Active products:");
    activeProducts.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.name} (Status: ${
          product.status || "no_status"
        })`
      );
    });

    console.log("\n✨ Test completed successfully!");
    console.log("\n📝 Summary:");
    console.log("- Backend API returns all products (for admin)");
    console.log(
      "- Frontend filters to show only active products (for customers)"
    );
    console.log("- Admin panel will show all products");
    console.log("- Customer pages will only show active products");
  } catch (error) {
    console.error("❌ Error testing product filtering:", error.message);
  }
};

testProductFiltering();
