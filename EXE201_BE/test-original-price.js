// Test script to verify originalPrice is fetched from database
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const testOriginalPrice = async () => {
  try {
    console.log("🧪 Testing originalPrice from database...\n");

    // Test 1: Get all products and check originalPrice
    console.log("1. Fetching products from API:");
    const response = await axios.get(`${API_BASE_URL}/products`);

    if (response.data.status === "success") {
      const products = response.data.data;
      console.log(`✅ Found ${products.length} products\n`);

      console.log("📋 Products with originalPrice:");
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(
          `   - Price: ${
            product.price ? product.price.toLocaleString("vi-VN") : "Not set"
          } VND`
        );
        console.log(
          `   - Original Price: ${
            product.originalPrice
              ? product.originalPrice.toLocaleString("vi-VN")
              : "Not set"
          } VND`
        );
        console.log(`   - Status: ${product.status || "Not set"}`);

        if (product.originalPrice && product.price) {
          const discount = (
            ((product.originalPrice - product.price) / product.originalPrice) *
            100
          ).toFixed(1);
          console.log(`   - Discount: ${discount}%`);
        }
        console.log("");
      });

      // Test 2: Check if any products have originalPrice set
      const productsWithOriginalPrice = products.filter((p) => p.originalPrice);
      console.log(`📊 Summary:`);
      console.log(`   - Total products: ${products.length}`);
      console.log(
        `   - Products with originalPrice: ${productsWithOriginalPrice.length}`
      );
      console.log(
        `   - Products without originalPrice: ${
          products.length - productsWithOriginalPrice.length
        }`
      );

      if (productsWithOriginalPrice.length === 0) {
        console.log("\n⚠️  No products have originalPrice set in database");
        console.log(
          "   You may need to update some products to include originalPrice"
        );
      } else {
        console.log("\n✅ originalPrice is properly configured in database");
      }
    }
  } catch (error) {
    console.error(
      "❌ Error testing originalPrice:",
      error.response?.data || error.message
    );
  }
};

// Run the test
testOriginalPrice();
