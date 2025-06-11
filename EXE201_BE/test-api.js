// Using built-in fetch (Node.js 18+)
const BASE_URL = "http://localhost:5000/api";

const testEndpoints = async () => {
  console.log("Testing API Endpoints...\n");

  try {
    // Test get all products
    console.log("1. Testing GET /products");
    const allProducts = await fetch(`${BASE_URL}/products`);
    const allProductsData = await allProducts.json();
    console.log(`Status: ${allProducts.status}`);
    console.log(`Total products: ${allProductsData.data?.length || 0}\n`);

    if (allProductsData.data?.length > 0) {
      console.log("First product:");
      const firstProduct = allProductsData.data[0];
      console.log(`- Name: ${firstProduct.name}`);
      console.log(`- Images: ${firstProduct.images?.length || 0} images`);
      console.log(`- Price: ${firstProduct.price}`);
      console.log(`- Stock: ${firstProduct.stock}`);
    }

    // Test get single product
    if (allProductsData.data?.length > 0) {
      const productId = allProductsData.data[0]._id;
      console.log(`\n2. Testing GET /products/${productId}`);
      const singleProduct = await fetch(`${BASE_URL}/products/${productId}`);
      const singleProductData = await singleProduct.json();
      console.log(`Status: ${singleProduct.status}`);
      if (singleProductData.data) {
        console.log(`Product: ${singleProductData.data.name}`);
        console.log(
          `Images: ${singleProductData.data.images?.length || 0} images`
        );
        console.log(
          `Images array: ${JSON.stringify(singleProductData.data.images)}`
        );
      }
    }
  } catch (error) {
    console.error("Error testing endpoints:", error);
  }
};

testEndpoints();
