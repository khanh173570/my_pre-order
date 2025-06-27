import {
  productService as baseProductService,
  CreateProductData,
  UpdateProductData,
  Product as BaseProduct,
  ProductResponse,
  ProductCreateResponse,
} from "../product.service";

// Export types for admin use
export type Product = BaseProduct;
export type CreateProductRequest = CreateProductData;
export type UpdateProductRequest = UpdateProductData;

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

export const adminProductService = {
  // Get all products for admin (includes both booking and pre-order)
  getAllProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await baseProductService.getAllProducts(page, limit);

      // Transform to match expected ApiResponse format
      return {
        status: "success",
        message: response.message,
        data: response.data,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / limit),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<ApiResponse<Product>> => {
    try {
      const product = await baseProductService.getProductById(
        parseInt(productId)
      );

      return {
        status: "success",
        data: product,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await baseProductService.getProductsByCategory(
        parseInt(categoryId),
        page,
        limit
      );

      return {
        status: "success",
        message: response.message,
        data: response.data,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / limit),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Search products - for now just return all products
  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await baseProductService.getAllProducts(page, limit);

      // Simple search by product name
      const filteredProducts = response.data.filter(
        (product) =>
          product.productName.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
      );

      return {
        status: "success",
        message: response.message,
        data: filteredProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalItems: filteredProducts.length,
          limit: limit,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new product (Admin/Staff)
  createProduct: async (
    productData: CreateProductRequest
  ): Promise<ApiResponse<Product>> => {
    try {
      const response = await baseProductService.createProduct(productData);

      if (response.succeeded) {
        // Get the created product
        const createdProduct = await baseProductService.getProductById(
          response.data
        );

        return {
          status: "success",
          message: response.message,
          data: createdProduct,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  },

  // Update product (Admin/Staff)
  updateProduct: async (
    productId: string,
    productData: UpdateProductRequest
  ): Promise<ApiResponse<Product>> => {
    try {
      const updateData: UpdateProductData = {
        ...productData,
        id: parseInt(productId),
      };

      const response = await baseProductService.updateProduct(updateData);

      if (response.succeeded) {
        // Get the updated product
        const updatedProduct = await baseProductService.getProductById(
          parseInt(productId)
        );

        return {
          status: "success",
          message: response.message,
          data: updatedProduct,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  },

  // Toggle product status (Admin/Staff)
  toggleProductStatus: async (
    productId: string
  ): Promise<ApiResponse<Product>> => {
    try {
      // Get current product first
      const currentProduct = await baseProductService.getProductById(
        parseInt(productId)
      );

      // Update with toggled status (note: API doesn't have isActive field, so we'll keep the same data)
      const updateData: UpdateProductData = {
        id: parseInt(productId),
        productCode: currentProduct.productCode,
        productName: currentProduct.productName,
        description: currentProduct.description,
        categoryId: currentProduct.categoryId,
        brandId: currentProduct.brandId || undefined,
        type: currentProduct.type,
        size: currentProduct.size,
        stockQuantity: currentProduct.stockQuantity,
        productDetails: currentProduct.productDetails,
        price: currentProduct.price,
        discount: currentProduct.discount,
        isPreOrder: currentProduct.isPreOrder,
      };

      const response = await baseProductService.updateProduct(updateData);

      if (response.succeeded) {
        const updatedProduct = await baseProductService.getProductById(
          parseInt(productId)
        );

        return {
          status: "success",
          message: response.message,
          data: updatedProduct,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await baseProductService.deleteProduct(
        parseInt(productId)
      );

      return {
        status: response.succeeded ? "success" : "error",
        message: response.message,
        data: null,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get booking products only
  getBookingProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await baseProductService.getBookingProducts(page, limit);

      return {
        status: "success",
        message: response.message,
        data: response.data,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / limit),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Get pre-order products only
  getPreOrderProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await baseProductService.getPreOrderProducts(
        page,
        limit
      );

      return {
        status: "success",
        message: response.message,
        data: response.data,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / limit),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Image management functions - placeholder for now
  addProductImage: async (
    productId: string,
    imageUrl: string
  ): Promise<ApiResponse<Product>> => {
    // This would need to be implemented in the backend API
    throw new Error("Image management not implemented in the new API yet");
  },

  removeProductImage: async (
    productId: string,
    imageUrl: string
  ): Promise<ApiResponse<Product>> => {
    // This would need to be implemented in the backend API
    throw new Error("Image management not implemented in the new API yet");
  },
};

// Export the service as productService for backward compatibility
export const productService = adminProductService;
