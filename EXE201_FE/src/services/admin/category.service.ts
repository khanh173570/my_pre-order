import {
  categoryService as baseCategoryService,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../category.service";

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
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await baseCategoryService.getAllCategories(1, 99); // Gọi một lần với PageSize=99
      console.log("Response from baseCategoryService:", response); // Debug
      const allCategories = response.data || [];

      return {
        status: "success",
        message: undefined,
        data: allCategories,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: allCategories.length,
          limit: allCategories.length,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Không thể lấy danh sách danh mục");
    }
  },

  createCategory: async (
    categoryData: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await baseCategoryService.createCategory(categoryData);

    if (response.succeeded) {
      const newCategory: Category = {
        id: response.data.id || response.data,
        categoryName: categoryData.categoryName,
        description: categoryData.description,
      };

      return {
        status: "success",
        message: response.message,
        data: newCategory,
      };
    }

    throw new Error(response.message || "Không thể tạo danh mục");
  },

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
      const updatedCategory: Category = {
        id: response.data.id || response.data,
        categoryName: updateData.categoryName,
        description: updateData.description,
      };

      return {
        status: "success",
        message: response.message,
        data: updatedCategory,
      };
    }

    throw new Error(response.message || "Không thể cập nhật danh mục");
  },

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

export const categoryService = adminCategoryService;
export type { Category };
