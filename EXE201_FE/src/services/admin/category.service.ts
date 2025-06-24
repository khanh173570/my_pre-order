import {
  categoryService as baseCategoryService,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryResponse,
  CategoryCreateResponse,
} from "../category.service";

// Export types for admin use
export type CreateCategoryRequest = CreateCategoryData;
export type UpdateCategoryRequest = UpdateCategoryData;

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export const adminCategoryService = {
  // Get all categories
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await baseCategoryService.getAllCategories();

    return {
      status: "success",
      message: response.message || undefined,
      data: response.data,
      pagination: {
        currentPage: response.pageNumber,
        totalPages: 1,
        totalItems: response.data.length,
        limit: response.pageSize,
      },
    };
  },

  // Create category
  createCategory: async (
    categoryData: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await baseCategoryService.createCategory(categoryData);

    if (response.succeeded) {
      // For now, return a mock category object since API only returns ID
      const newCategory: Category = {
        id: response.data,
        categoryName: categoryData.categoryName,
        description: categoryData.description,
      };

      return {
        status: "success",
        message: response.message,
        data: newCategory,
      };
    } else {
      throw new Error(response.message);
    }
  },

  // Update category
  updateCategory: async (
    categoryId: string,
    categoryData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const updateData: UpdateCategoryData = {
      ...categoryData,
      id: parseInt(categoryId),
    };

    const response = await baseCategoryService.updateCategory(updateData);

    if (response.succeeded) {
      // Return updated category object
      const updatedCategory: Category = {
        id: response.data,
        categoryName: updateData.categoryName,
        description: updateData.description,
      };

      return {
        status: "success",
        message: response.message,
        data: updatedCategory,
      };
    } else {
      throw new Error(response.message);
    }
  },

  // Delete category
  deleteCategory: async (categoryId: string): Promise<ApiResponse<null>> => {
    const response = await baseCategoryService.deleteCategory(
      parseInt(categoryId)
    );

    return {
      status: response.succeeded ? "success" : "error",
      message: response.message,
      data: null,
    };
  },
};

// Export the service as categoryService for backward compatibility
export const categoryService = adminCategoryService;
export type { Category };
