const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export interface CategoryResponse {
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: Category[];
}

export interface CategoryCreateResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: number;
}

export interface CreateCategoryData {
  categoryName: string;
  description: string;
}

export interface UpdateCategoryData {
  id: number;
  categoryName: string;
  description: string;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const categoryService = {
  // Get all categories
  getAllCategories: async (
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<CategoryResponse> => {
    try {
      console.log("Request params sent to API:", { pageNumber, pageSize }); // Debug
      const response = await fetch(
        `${API_BASE_URL}/Category?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      const data = await response.json();
      console.log("API response received:", data); // Debug
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Create category
  createCategory: async (
    categoryData: CreateCategoryData
  ): Promise<CategoryCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (
    categoryData: UpdateCategoryData
  ): Promise<CategoryCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (
    categoryId: number
  ): Promise<CategoryCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category/${categoryId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
