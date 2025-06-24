import {
  brandService as baseBrandService,
  Brand,
  CreateBrandData,
  UpdateBrandData,
  BrandResponse,
  BrandCreateResponse,
} from "../brand.service";

// Export types for admin use
export type CreateBrandRequest = CreateBrandData;
export type UpdateBrandRequest = UpdateBrandData;

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

export const adminBrandService = {
  // Get all brands
  getAllBrands: async (): Promise<ApiResponse<Brand[]>> => {
    const response = await baseBrandService.getAllBrands();

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

  // Create brand
  createBrand: async (
    brandData: CreateBrandRequest
  ): Promise<ApiResponse<Brand>> => {
    const response = await baseBrandService.createBrand(brandData);

    if (response.succeeded) {
      // For now, return a mock brand object since API only returns ID
      const newBrand: Brand = {
        id: response.data,
        name: brandData.name,
        description: brandData.description,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return {
        status: "success",
        message: response.message,
        data: newBrand,
      };
    } else {
      throw new Error(response.message);
    }
  },

  // Update brand
  updateBrand: async (
    brandId: string,
    brandData: UpdateBrandRequest
  ): Promise<ApiResponse<Brand>> => {
    const updateData: UpdateBrandData = {
      ...brandData,
      id: parseInt(brandId),
    };

    const response = await baseBrandService.updateBrand(updateData);

    if (response.succeeded) {
      // Return updated brand object
      const updatedBrand: Brand = {
        id: response.data,
        name: updateData.name,
        description: updateData.description,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return {
        status: "success",
        message: response.message,
        data: updatedBrand,
      };
    } else {
      throw new Error(response.message);
    }
  },

  // Delete brand
  deleteBrand: async (brandId: string): Promise<ApiResponse<null>> => {
    const response = await baseBrandService.deleteBrand(parseInt(brandId));

    return {
      status: response.succeeded ? "success" : "error",
      message: response.message,
      data: null,
    };
  },
};

// Export the service as brandService for backward compatibility
export const brandService = adminBrandService;
export type { Brand };
