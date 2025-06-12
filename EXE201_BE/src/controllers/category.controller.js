import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation input
    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Please provide name and description",
      });
    } // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category name already exists. Please use a different name",
      });
    }

    // Ensure isActive is set to false when creating a new category
    const categoryData = {
      ...req.body,
      isActive: false,
    };

    const category = await Category.create(categoryData);
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
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

    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Check if this is for admin view or public view
    const query = {};

    // If activeOnly is specified, filter by isActive
    if (req.query.activeOnly === "true") {
      query.isActive = true;
    }

    const categories = await Category.find(query);
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Check if category has products
    const productsInCategory = await Product.find({ category: id });
    if (productsInCategory.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Cannot delete category. This category has ${productsInCategory.length} product(s). Please remove all products from this category first.`,
      });
    }

    // Delete category if no products exist
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
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

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get category details
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Get all products belonging to this category
    const products = await Product.find({ category: id }).populate("category");

    res.status(200).json({
      status: "success",
      data: {
        category: {
          _id: category._id,
          name: category.name,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
        products: products,
        totalProducts: products.length,
      },
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
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

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Toggle the isActive status
    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      status: "success",
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully`,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
