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
    isPreOrder: false,
  },
  {
    name: "Phantom Vortex Gundam",
    description:
      "Mẫu cao độc từ nhà, thiết mạo đầy tinh thành cho bạn trong mùa mới",
    price: 16000000,
    originalPrice: 19900000,
    stock: 15,
    images: ["/images/product.webp", "/images/gundam.png", "/images/bango.jpg"],
    isPreOrder: false,
  },
  {
    name: "Stormbringer Gundam",
    description:
      "Kit thân vận động cao, với những đặc điểm thiết kế mang tính công năng",
    price: 19000000,
    originalPrice: 22000000,
    stock: 8,
    images: ["/images/product.webp", "/images/gundam.png"],
    isPreOrder: false,
  },
];

const samplePreOrders = [
  {
    name: "Gundam Model RX-78-2 PreOrder",
    description:
      "Mô tả mẫu Gundam số 1 với tính năng đặc biệt và sức mạnh vô song.",
    price: 18000000,
    originalPrice: 22000000,
    stock: 0,
    images: [
      "/images/product.webp",
      "/images/gundam.png",
      "/images/bango.jpg",
      "/images/bango02.jpg",
    ],
    isPreOrder: true,
    releaseDate: "07/07/2025",
    deadline: {
      hours: 8,
      minutes: 59,
      seconds: 32,
    },
    currentQuantity: 159,
    targetQuantity: 252,
  },
  {
    name: "Gundam Strike Freedom PreOrder",
    description:
      "Mô tả mẫu Gundam số 2 với tính năng đặc biệt và sức mạnh vô song.",
    price: 20000000,
    originalPrice: 25000000,
    stock: 0,
    images: ["/images/product.webp", "/images/gundam.png", "/images/bango.jpg"],
    isPreOrder: true,
    releaseDate: "27/11/2025",
    deadline: {
      hours: 12,
      minutes: 50,
      seconds: 53,
    },
    currentQuantity: 172,
    targetQuantity: 204,
  },
  {
    name: "Gundam Barbatos PreOrder",
    description:
      "Mô tả mẫu Gundam số 3 với tính năng đặc biệt và sức mạnh vô song.",
    price: 17500000,
    originalPrice: 21000000,
    stock: 0,
    images: [
      "/images/product.webp",
      "/images/gundam.png",
      "/images/bango02.jpg",
    ],
    isPreOrder: true,
    releaseDate: "18/11/2025",
    deadline: {
      hours: 10,
      minutes: 25,
      seconds: 33,
    },
    currentQuantity: 83,
    targetQuantity: 210,
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

    const preOrdersWithCategory = samplePreOrders.map((product) => ({
      ...product,
      category: defaultCategory._id,
    }));

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithCategory);
    console.log(`Created ${createdProducts.length} regular products`);

    // Insert sample preorder products
    const createdPreOrders = await Product.insertMany(preOrdersWithCategory);
    console.log(`Created ${createdPreOrders.length} preorder products`);

    console.log("Sample data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedProducts();
