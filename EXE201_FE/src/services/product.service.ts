import { Category } from "../types/category";
import { Product } from "../types/product";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      return data.data;
    }
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      return data.data;
    }
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
