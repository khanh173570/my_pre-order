// Simple test to verify pagination endpoint without external dependencies
const http = require("http");

const testPagination = () => {
  console.log("🧪 Testing pagination with 10 products per page...\n");

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/products?page=1&limit=10",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);

        if (response.status === "success") {
          console.log(`✅ Got ${response.data.length} products`);

          if (response.pagination) {
            console.log("📊 Pagination info:");
            console.log(
              `   - Current page: ${response.pagination.currentPage}`
            );
            console.log(`   - Total pages: ${response.pagination.totalPages}`);
            console.log(`   - Total items: ${response.pagination.totalItems}`);
            console.log(`   - Limit per page: ${response.pagination.limit}`);
          }

          console.log("\n📋 Sample products:");
          response.data.slice(0, 3).forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name}`);
            console.log(`      - Price: ${product.price || "Not set"} VND`);
            console.log(`      - Status: ${product.status || "Not set"}`);
          });

          console.log("\n✅ Pagination test completed successfully!");
        } else {
          console.log("❌ Error response:", response);
        }
      } catch (error) {
        console.error("❌ Error parsing response:", error.message);
        console.log("Raw response:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  req.end();
};

// Run the test
testPagination();
