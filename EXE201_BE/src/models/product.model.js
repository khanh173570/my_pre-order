import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock", "discontinued"],
      default: "active",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    // Keep the old image field for backward compatibility
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to set the first image as the main image for backward compatibility
productSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0];
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
