import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Types for Category
export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
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

export const categoryService = {
  // Get all categories
  getAllCategories: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Category[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/categories?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (
    categoryId: string
  ): Promise<ApiResponse<Category>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },

  // Create new category (Admin/Staff)
  createCategory: async (
    categoryData: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const apiClient = createApiClient();
    const response = await apiClient.post("/categories", categoryData);
    return response.data;
  },

  // Update category (Admin/Staff)
  updateCategory: async (
    categoryId: string,
    categoryData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(
      `/categories/${categoryId}`,
      categoryData
    );
    return response.data;
  },
  // Toggle category status (Admin/Staff)
  toggleCategoryStatus: async (
    categoryId: string
  ): Promise<ApiResponse<Category>> => {
    const apiClient = createApiClient();
    const response = await apiClient.patch(
      `/categories/${categoryId}/toggle-status`
    );
    return response.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (categoryId: string): Promise<ApiResponse<null>> => {
    const apiClient = createApiClient();
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};
