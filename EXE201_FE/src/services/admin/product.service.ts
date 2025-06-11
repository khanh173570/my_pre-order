import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Types for Product
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

// Create axios instance with auth header
const createApiClient = () => {
  const authData = localStorage.getItem("auth");
  let token = "";

  if (authData) {
    try {
      const auth = JSON.parse(authData);
      token = auth.token || "";
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const productService = {
  // Get all products
  getAllProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/products?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<ApiResponse<Product>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/products/category/${categoryId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/products/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Create new product (Admin/Staff)
  createProduct: async (
    productData: CreateProductRequest
  ): Promise<ApiResponse<Product>> => {
    const apiClient = createApiClient();
    const response = await apiClient.post("/products", productData);
    return response.data;
  },

  // Update product (Admin/Staff)
  updateProduct: async (
    productId: string,
    productData: UpdateProductRequest
  ): Promise<ApiResponse<Product>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Toggle product status (Admin/Staff)
  toggleProductStatus: async (
    productId: string
  ): Promise<ApiResponse<Product>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(
      `/products/${productId}/toggle-status`
    );
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    const apiClient = createApiClient();
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  },
};
