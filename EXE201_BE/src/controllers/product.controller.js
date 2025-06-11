import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      status,
      category,
      stock,
      image,
      images,
    } = req.body;

    // Validation input - allow either image or images
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !stock ||
      (!image && (!images || images.length === 0))
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide name, description, price, category, stock, and at least one image",
      });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Product name already exists. Please use a different name",
      });
    } // Validate price and stock are positive numbers
    if (price < 0) {
      return res.status(400).json({
        status: "error",
        message: "Price must be a positive number",
      });
    }

    if (originalPrice && originalPrice < 0) {
      return res.status(400).json({
        status: "error",
        message: "Original price must be a positive number",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Stock must be a positive number",
      });
    }

    // Validate status if provided
    const validStatuses = [
      "active",
      "inactive",
      "out_of_stock",
      "discontinued",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid status. Must be one of: active, inactive, out_of_stock, discontinued",
      });
    }

    // Handle images - if only single image provided, convert to array
    let productData = { ...req.body };
    if (image && !images) {
      productData.images = [image];
    } else if (images && images.length > 0) {
      productData.images = images;
      // Set first image as main image for backward compatibility
      productData.image = images[0];
    }

    const product = await Product.create(productData);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(". "),
      });
    }

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "error",
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    // Handle invalid ObjectId for category
    if (error.name === "CastError" && error.path === "category") {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    // Get products with pagination
    const products = await Product.find()
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      status: "success",
      data: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalProducts,
        limit: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      status,
      category,
      stock,
      image,
      images,
    } = req.body;

    // Validate positive numbers if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        status: "error",
        message: "Price must be a positive number",
      });
    }

    if (originalPrice !== undefined && originalPrice < 0) {
      return res.status(400).json({
        status: "error",
        message: "Original price must be a positive number",
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Stock must be a positive number",
      });
    }

    // Validate status if provided
    const validStatuses = [
      "active",
      "inactive",
      "out_of_stock",
      "discontinued",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid status. Must be one of: active, inactive, out_of_stock, discontinued",
      });
    }

    // Handle images update - if only single image provided, convert to array
    let updateData = { ...req.body };
    if (image && !images) {
      updateData.images = [image];
      updateData.image = image; // Keep backward compatibility
    } else if (images && images.length > 0) {
      updateData.images = images;
      // Set first image as main image for backward compatibility
      updateData.image = images[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(". "),
      });
    }

    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "error",
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    // Handle invalid ObjectId for category
    if (error.name === "CastError" && error.path === "category") {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all preorder products
export const getPreOrderProducts = async (req, res) => {
  try {
    const preorderProducts = await Product.find({
      isPreOrder: true,
    }).populate("category");

    res.status(200).json({
      status: "success",
      data: preorderProducts,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get regular products (non-preorder)
export const getRegularProducts = async (req, res) => {
  try {
    const regularProducts = await Product.find({
      $or: [{ isPreOrder: false }, { isPreOrder: { $exists: false } }],
    }).populate("category");

    res.status(200).json({
      status: "success",
      data: regularProducts,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update preorder quantity
export const updatePreOrderQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid quantity provided",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (!product.isPreOrder) {
      return res.status(400).json({
        status: "error",
        message: "Product is not a preorder item",
      });
    }

    product.currentQuantity = (product.currentQuantity || 0) + quantity;
    await product.save();

    res.status(200).json({
      status: "success",
      message: "Preorder quantity updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Add image to existing product
export const addProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Initialize images array if it doesn't exist
    if (!product.images) {
      product.images = [];
    }

    // Check if image already exists
    if (product.images.includes(imageUrl)) {
      return res.status(400).json({
        status: "error",
        message: "Image already exists for this product",
      });
    }

    // Add new image
    product.images.push(imageUrl);

    // If this is the first image, set it as the main image
    if (!product.image || product.images.length === 1) {
      product.image = imageUrl;
    }

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Image added successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Remove image from product
export const removeProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (!product.images || product.images.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Product has no images to remove",
      });
    }

    // Check if trying to remove the last image
    if (product.images.length === 1) {
      return res.status(400).json({
        status: "error",
        message:
          "Cannot remove the last image. Product must have at least one image.",
      });
    }

    // Remove the image
    product.images = product.images.filter((img) => img !== imageUrl);

    // If removed image was the main image, set first image as main
    if (product.image === imageUrl && product.images.length > 0) {
      product.image = product.images[0];
    }

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Image removed successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Reorder product images
export const reorderProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Valid image URLs array is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Validate that all provided URLs exist in current images
    const currentImages = product.images || [];
    const validUrls = imageUrls.every((url) => currentImages.includes(url));

    if (!validUrls || imageUrls.length !== currentImages.length) {
      return res.status(400).json({
        status: "error",
        message: "Invalid image URLs provided or missing images",
      });
    }

    // Update images order
    product.images = imageUrls;
    product.image = imageUrls[0]; // Set first image as main

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Images reordered successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Set main product image
export const setMainProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if image exists in product images
    if (!product.images || !product.images.includes(imageUrl)) {
      return res.status(400).json({
        status: "error",
        message: "Image URL not found in product images",
      });
    }

    // Set as main image and move to first position
    product.image = imageUrl;

    // Remove from current position and add to beginning
    product.images = product.images.filter((img) => img !== imageUrl);
    product.images.unshift(imageUrl);

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Main image updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Toggle product status
export const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Toggle between active and inactive
    product.status = product.status === "active" ? "inactive" : "active";
    await product.save();

    res.status(200).json({
      status: "success",
      message: `Product ${
        product.status === "active" ? "activated" : "deactivated"
      } successfully`,
      data: product,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID",
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
