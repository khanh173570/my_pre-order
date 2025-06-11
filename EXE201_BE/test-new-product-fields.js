// Test script for new product fields: originalPrice and status
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Test creating a product with originalPrice and status
const testCreateProductWithNewFields = async () => {
  try {
    console.log("Testing product creation with new fields...");

    const productData = {
      name: "Test Product with New Fields",
      description:
        "This is a test product with originalPrice and status fields",
      price: 99000,
      originalPrice: 150000,
      status: "active",
      category: "6759b0ee59d09bc7ee1ba8e1", // You might need to change this to a valid category ID
      stock: 50,
      images: ["https://example.com/test-image.jpg"],
    };

    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        Authorization: "Bearer YOUR_ADMIN_TOKEN_HERE", // You'll need to replace this
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Product created successfully:");
    console.log("Product ID:", response.data.data._id);
    console.log("Name:", response.data.data.name);
    console.log("Price:", response.data.data.price);
    console.log("Original Price:", response.data.data.originalPrice);
    console.log("Status:", response.data.data.status);

    return response.data.data._id;
  } catch (error) {
    console.error(
      "❌ Error creating product:",
      error.response?.data || error.message
    );
    return null;
  }
};

// Test updating a product with new fields
const testUpdateProductWithNewFields = async (productId) => {
  try {
    console.log("\nTesting product update with new fields...");

    const updateData = {
      originalPrice: 180000,
      status: "out_of_stock",
    };

    const response = await axios.put(
      `${API_BASE_URL}/products/${productId}`,
      updateData,
      {
        headers: {
          Authorization: "Bearer YOUR_ADMIN_TOKEN_HERE", // You'll need to replace this
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Product updated successfully:");
    console.log("Original Price:", response.data.data.originalPrice);
    console.log("Status:", response.data.data.status);
  } catch (error) {
    console.error(
      "❌ Error updating product:",
      error.response?.data || error.message
    );
  }
};

// Test the toggle status endpoint
const testToggleProductStatus = async (productId) => {
  try {
    console.log("\nTesting product status toggle...");

    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/toggle-status`,
      {},
      {
        headers: {
          Authorization: "Bearer YOUR_ADMIN_TOKEN_HERE", // You'll need to replace this
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Product status toggled successfully:");
    console.log("New Status:", response.data.data.status);
  } catch (error) {
    console.error(
      "❌ Error toggling product status:",
      error.response?.data || error.message
    );
  }
};

// Test fetching products to see new fields
const testFetchProducts = async () => {
  try {
    console.log("\nTesting product fetch with new fields...");

    const response = await axios.get(`${API_BASE_URL}/products`);

    console.log("✅ Products fetched successfully:");
    if (response.data.data.length > 0) {
      const product = response.data.data[0];
      console.log("Sample product:");
      console.log("- Name:", product.name);
      console.log("- Price:", product.price);
      console.log("- Original Price:", product.originalPrice || "Not set");
      console.log("- Status:", product.status || "Not set");
    }
  } catch (error) {
    console.error(
      "❌ Error fetching products:",
      error.response?.data || error.message
    );
  }
};

// Run all tests
const runTests = async () => {
  console.log("🚀 Starting product field tests...\n");

  // First test fetching existing products
  await testFetchProducts();

  // Test creating product (you'll need valid auth token and category ID)
  // const productId = await testCreateProductWithNewFields();

  // if (productId) {
  //   await testUpdateProductWithNewFields(productId);
  //   await testToggleProductStatus(productId);
  // }

  console.log("\n✨ Tests completed!");
  console.log("\n📝 To test create/update operations:");
  console.log("1. Replace YOUR_ADMIN_TOKEN_HERE with a valid admin JWT token");
  console.log("2. Replace the category ID with a valid one from your database");
  console.log("3. Uncomment the create/update test lines");
};

runTests();
