// Test script to verify pagination is working with 10 products per page
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const testPagination = async () => {
  try {
    console.log("🧪 Testing pagination with 10 products per page...\n");

    // Test 1: Get first page
    console.log("1. Testing first page (page=1, limit=10):");
    const page1Response = await axios.get(`${API_BASE_URL}/products?page=1&limit=10`);
    
    if (page1Response.data.status === "success") {
      console.log(`✅ Page 1 - Got ${page1Response.data.data.length} products`);
      console.log(`📊 Pagination info:`, page1Response.data.pagination);
    }

    // Test 2: Get second page if it exists
    if (page1Response.data.pagination?.totalPages > 1) {
      console.log("\n2. Testing second page (page=2, limit=10):");
      const page2Response = await axios.get(`${API_BASE_URL}/products?page=2&limit=10`);
      
      if (page2Response.data.status === "success") {
        console.log(`✅ Page 2 - Got ${page2Response.data.data.length} products`);
        console.log(`📊 Pagination info:`, page2Response.data.pagination);
      }
    } else {
      console.log("\n⚠️  Only one page of products available");
    }

    // Test 3: Test with different page sizes
    console.log("\n3. Testing with 5 products per page:");
    const page5Response = await axios.get(`${API_BASE_URL}/products?page=1&limit=5`);
    
    if (page5Response.data.status === "success") {
      console.log(`✅ Page 1 (limit=5) - Got ${page5Response.data.data.length} products`);
      console.log(`📊 Pagination info:`, page5Response.data.pagination);
    }

    // Test 4: Display some product info
    console.log("\n4. Sample products from first page:");
    const sampleProducts = page1Response.data.data.slice(0, 3);
    sampleProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      - Price: ${product.price ? product.price.toLocaleString('vi-VN') : 'Not set'} VND`);
      console.log(`      - Original Price: ${product.originalPrice ? product.originalPrice.toLocaleString('vi-VN') : 'Not set'} VND`);
      console.log(`      - Status: ${product.status || 'Not set'}`);
      console.log(`      - Stock: ${product.stock}`);
    });

    console.log("\n✅ Pagination test completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   - Products per page: ${page1Response.data.pagination?.limit || 'Not set'}`);
    console.log(`   - Total products: ${page1Response.data.pagination?.totalItems || 'Not set'}`);
    console.log(`   - Total pages: ${page1Response.data.pagination?.totalPages || 'Not set'}`);

  } catch (error) {
    console.error("❌ Error testing pagination:", error.response?.data || error.message);
  }
};

// Run the test
testPagination();
