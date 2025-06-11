// Test creating a new product with multiple images
const BASE_URL = "http://localhost:5000/api";

const createTestProduct = async () => {
  try {
    // Get categories first
    console.log("Getting categories...");
    const categoriesResponse = await fetch(`${BASE_URL}/categories`);
    const categoriesData = await categoriesResponse.json();

    if (!categoriesData.data || categoriesData.data.length === 0) {
      console.error("No categories found!");
      return;
    }

    const categoryId = categoriesData.data[0]._id;
    console.log(`Using category: ${categoriesData.data[0].name}`);

    // Create new product with multiple images
    const newProduct = {
      name: "Test Multi-Image Gundam",
      description:
        "Product test với nhiều ảnh để kiểm tra ImageGallery component",
      price: 25000000,
      originalPrice: 30000000,
      stock: 5,
      category: categoryId,
      images: [
        "/images/product.webp",
        "/images/gundam.png",
        "/images/bango.jpg",
        "/images/bango02.jpg",
      ],
    };

    console.log("Creating product with multiple images...");
    const createResponse = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    const createData = await createResponse.json();

    if (createResponse.status === 201) {
      console.log("✅ Product created successfully!");
      console.log(`Product ID: ${createData.data._id}`);
      console.log(`Product name: ${createData.data.name}`);
      console.log(`Images count: ${createData.data.images.length}`);
      console.log(`Images: ${JSON.stringify(createData.data.images)}`);
    } else {
      console.error("❌ Failed to create product:", createData.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

createTestProduct();
