import { Category } from "../types/category";
import { Product } from "../types/product";
import apiClient from "./apiClient";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories");
    if (
      response.data.status === "success" &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products");
    if (
      response.data.status === "success" &&
      Array.isArray(response.data.data)
    ) {
      // Transform API data to match Product interface and filter only active products
      const transformedProducts = response.data.data
        .filter(
          (product: { status?: string }) =>
            product.status === "active" ||
            product.status === "out_of_stock" ||
            !product.status
        ) // Include products without status for backward compatibility
        .map(
          (product: {
            _id: string;
            name: string;
            price: number;
            originalPrice?: number;
            status?: string;
            description: string;
            image: string;
            images?: string[];
            stock: number;
            category: Category;
            createdAt: string;
            updatedAt: string;
          }) => ({
            _id: product._id,
            id: product._id, // For backward compatibility
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            status: product.status,
            description: product.description,
            image:
              product.images?.[0] || product.image || "/images/product.webp",
            images: product.images || [product.image || "/images/product.webp"],
            stock: product.stock,
            quantity: product.stock, // For backward compatibility
            category: product.category,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          })
        );
      return transformedProducts;
    }
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    if (response.data.status === "success") {
      const product = response.data.data;
      return {
        _id: product._id,
        id: product._id, // For backward compatibility
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        status: product.status,
        description: product.description,
        image: product.images?.[0] || product.image || "/images/product.webp",
        images: product.images || [product.image || "/images/product.webp"],
        stock: product.stock,
        quantity: product.stock, // For backward compatibility
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
