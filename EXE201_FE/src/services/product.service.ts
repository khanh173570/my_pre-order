const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ProductAsset {
  id: number;
  mediaKey: string;
  publicId: string;
  imageUrl: string;
  version: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  description: string;
  categoryId: number;
  brandId: number | null;
  type: string;
  size: string;
  stockQuantity: number;
  productDetails: string;
  price: number;
  discount: number;
  discountedPrice: number;
  openedAt: number | null;
  isPreOrder: boolean;
  version: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  productAssets: ProductAsset[];
  // Backward compatibility fields
  name?: string;
  image?: string;
  images?: string[];
  quantity?: number;
}

export interface ProductResponse {
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: Product[];
}

export interface ProductCreateResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: number;
}

export interface CreateProductData {
  productCode: string;
  productName: string;
  description: string;
  categoryId: number;
  brandId?: number;
  type: string;
  size: string;
  stockQuantity: number;
  productDetails: string;
  price: number;
  discount?: number;
  isPreOrder: boolean;
}

export interface UpdateProductData {
  id: number;
  productCode: string;
  productName: string;
  description: string;
  categoryId: number;
  brandId?: number;
  type: string;
  size: string;
  stockQuantity: number;
  productDetails: string;
  price: number;
  discount?: number;
  isPreOrder: boolean;
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

const transformProduct = (product: Product): Product => {
  return {
    ...product,
    name: product.productName,
    image: product.productAssets?.[0]?.imageUrl || "/images/product.webp",
    images: product.productAssets?.map((asset) => asset.imageUrl) || [
      "/images/product.webp",
    ],
    quantity: product.stockQuantity,
  };
};

export const productService = {
  // Get all products
  getAllProducts: async (
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Product?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();

      // Transform products for backward compatibility
      const transformedData = {
        ...data,
        data: data.data.map((product: Product) => transformProduct(product)),
      };

      return transformedData;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get booking products (isPreOrder: false)
  getBookingProducts: async (
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await productService.getAllProducts(
        pageNumber,
        pageSize
      );

      // Filter products where isPreOrder is false
      const bookingProducts = response.data.filter(
        (product) => !product.isPreOrder
      );

      return {
        ...response,
        data: bookingProducts,
      };
    } catch (error) {
      console.error("Error fetching booking products:", error);
      throw error;
    }
  },

  // Get available products (isPreOrder: false and stockQuantity > 0)
  getAvailableProducts: async (
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await productService.getAllProducts(
        pageNumber,
        pageSize
      );

      // Filter products where isPreOrder is false AND stockQuantity > 0
      const availableProducts = response.data.filter(
        (product) => !product.isPreOrder && product.stockQuantity > 0
      );

      return {
        ...response,
        data: availableProducts,
      };
    } catch (error) {
      console.error("Error fetching available products:", error);
      throw error;
    }
  },

  // Get pre-order products (isPreOrder: true)
  getPreOrderProducts: async (
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await productService.getAllProducts(
        pageNumber,
        pageSize
      );

      // Filter products where isPreOrder is true
      const preOrderProducts = response.data.filter(
        (product) => product.isPreOrder
      );

      return {
        ...response,
        data: preOrderProducts,
      };
    } catch (error) {
      console.error("Error fetching pre-order products:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (
    categoryId: number,
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await productService.getAllProducts(
        pageNumber,
        pageSize
      );

      // Filter products by category
      const categoryProducts = response.data.filter(
        (product) => product.categoryId === categoryId
      );

      return {
        ...response,
        data: categoryProducts,
      };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  // Get products by brand
  getProductsByBrand: async (
    brandId: number,
    pageNumber: number = 1,
    pageSize: number = 99
  ): Promise<ProductResponse> => {
    try {
      const response = await productService.getAllProducts(
        pageNumber,
        pageSize
      );

      // Filter products by brand
      const brandProducts = response.data.filter(
        (product) => product.brandId === brandId
      );

      return {
        ...response,
        data: brandProducts,
      };
    } catch (error) {
      console.error("Error fetching products by brand:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId: number): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Product/${productId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product");
      }

      const data = await response.json();
      return transformProduct(data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create product
  createProduct: async (
    productData: CreateProductData
  ): Promise<ProductCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Product`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (
    productData: UpdateProductData
  ): Promise<ProductCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Product`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: number): Promise<ProductCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Product/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

// Backward compatibility exports
export const fetchBrands = async () => {
  const { brandService } = await import("./brand.service");
  const response = await brandService.getAllBrands();
  return response.data;
};

export const fetchCategories = async () => {
  const { categoryService } = await import("./category.service");
  const response = await categoryService.getAllCategories();
  return response.data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await productService.getAllProducts();
  return response.data.filter((product: Product) => product.isActive);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await productService.getProductById(parseInt(id));
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
