import mongoose from "mongoose";
import Product from "./src/models/product.model.js";
import Category from "./src/models/category.model.js";
import dotenv from "dotenv";

dotenv.config();

const sampleProducts = [
  {
    name: "Celestial Dragon Gundam",
    description:
      "Gundam mang trọn kiểng phong cách, với màu sắc mạnh mẽ hoàn thiện",
    price: 15500000,
    originalPrice: 19000000,
    stock: 10,
    images: [
      "/images/product.webp",
      "/images/gundam.png",
      "/images/bango.jpg",
      "/images/bango02.jpg",
    ],
  },
  {
    name: "Phantom Vortex Gundam",
    description:
      "Mẫu cao độc từ nhà, thiết mạo đầy tinh thành cho bạn trong mùa mới",
    price: 16000000,
    originalPrice: 19900000,
    stock: 15,
    images: ["/images/product.webp", "/images/gundam.png", "/images/bango.jpg"],
  },
  {
    name: "Stormbringer Gundam",
    description:
      "Kit thân vận động cao, với những đặc điểm thiết kế mang tính công năng",
    price: 19000000,
    originalPrice: 22000000,
    stock: 8,
    images: ["/images/product.webp", "/images/gundam.png"],
  },
  {
    name: "Infinity Edge Gundam",
    description:
      "SD Nu-UniCorn phiên bản đặc biệt, với set chất nhất trong mùa 7/9",
    price: 12000000,
    originalPrice: 15900000,
    stock: 20,
    images: [
      "/images/bango.jpg",
      "/images/bango02.jpg",
      "/images/product.webp",
    ],
  },
  {
    name: "Shadow Fang Gundam",
    description: "Chiến binh bóng đêm, họ gọi nó là trí kì trong đông tới",
    price: 18000000,
    originalPrice: 20000000,
    stock: 12,
    images: [
      "/images/gundam.png",
      "/images/product.webp",
      "/images/bango.jpg",
      "/images/bango02.jpg",
    ],
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find a default category (assuming you have at least one category)
    const defaultCategory = await Category.findOne();
    if (!defaultCategory) {
      console.error(
        "No categories found. Please create at least one category first."
      );
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Add category to all products
    const productsWithCategory = sampleProducts.map((product) => ({
      ...product,
      category: defaultCategory._id,
    }));

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithCategory);
    console.log(
      `Created ${createdProducts.length} products with multiple images`
    );

    console.log("Sample data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedProducts();
