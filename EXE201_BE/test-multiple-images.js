// Test script to verify multiple images functionality
const BASE_URL = "http://localhost:5000/api";

const testMultipleImagesFunctionality = async () => {
  console.log("🧪 Testing Multiple Images Functionality...\n");

  try {
    // 1. Test getting all products
    console.log("1️⃣ Testing GET /products (all products)");
    const allProductsResponse = await fetch(`${BASE_URL}/products`);
    const allProductsData = await allProductsResponse.json();
    
    if (allProductsResponse.status === 200 && allProductsData.data) {
      console.log(`✅ Success: Found ${allProductsData.data.length} products`);
      
      // Check if products have multiple images
      const productsWithMultipleImages = allProductsData.data.filter(p => 
        p.images && p.images.length > 1
      );
      
      console.log(`📸 Products with multiple images: ${productsWithMultipleImages.length}`);
      
      if (productsWithMultipleImages.length > 0) {
        const firstProduct = productsWithMultipleImages[0];
        console.log(`   📋 Example: "${firstProduct.name}" has ${firstProduct.images.length} images`);
        console.log(`   🖼️  Images: ${firstProduct.images.join(', ')}`);
      }
    } else {
      console.log(`❌ Failed: ${allProductsData.message || 'Unknown error'}`);
    }

    console.log();

    // 2. Test getting single product with multiple images
    if (allProductsData.data && allProductsData.data.length > 0) {
      const testProductId = allProductsData.data[0]._id;
      console.log(`2️⃣ Testing GET /products/${testProductId} (single product)`);
      
      const singleProductResponse = await fetch(`${BASE_URL}/products/${testProductId}`);
      const singleProductData = await singleProductResponse.json();
      
      if (singleProductResponse.status === 200 && singleProductData.data) {
        const product = singleProductData.data;
        console.log(`✅ Success: Retrieved product "${product.name}"`);
        console.log(`   📸 Images count: ${product.images ? product.images.length : 0}`);
        console.log(`   🖼️  Main image: ${product.image}`);
        console.log(`   🖼️  All images: ${product.images ? product.images.join(', ') : 'None'}`);
        console.log(`   💰 Price: ${product.price.toLocaleString('vi-VN')} VND`);
        console.log(`   📦 Stock: ${product.stock}`);
      } else {
        console.log(`❌ Failed: ${singleProductData.message || 'Unknown error'}`);
      }
    }

    console.log();

    // 3. Test product structure consistency
    console.log("3️⃣ Testing product data structure consistency");
    let structureValid = true;
    
    if (allProductsData.data) {
      for (const product of allProductsData.data) {
        // Check required fields
        if (!product._id || !product.name || !product.price || !product.images) {
          console.log(`❌ Product "${product.name || 'Unknown'}" missing required fields`);
          structureValid = false;
        }
        
        // Check images array
        if (!Array.isArray(product.images) || product.images.length === 0) {
          console.log(`❌ Product "${product.name}" has invalid images array`);
          structureValid = false;
        }
        
        // Check main image is in images array
        if (product.image && product.images && !product.images.includes(product.image)) {
          console.log(`⚠️  Product "${product.name}" main image not in images array`);
        }
      }
    }
    
    if (structureValid) {
      console.log("✅ All products have valid structure");
    }

    console.log();

    // 4. Summary
    console.log("📊 SUMMARY:");
    console.log(`   • Total products: ${allProductsData.data?.length || 0}`);
    console.log(`   • Products with multiple images: ${allProductsData.data?.filter(p => p.images?.length > 1).length || 0}`);
    console.log(`   • API Response: ${allProductsResponse.status === 200 ? '✅ Working' : '❌ Failed'}`);
    console.log(`   • Data structure: ${structureValid ? '✅ Valid' : '❌ Invalid'}`);

  } catch (error) {
    console.error("❌ Error during testing:", error.message);
  }
};

testMultipleImagesFunctionality();
