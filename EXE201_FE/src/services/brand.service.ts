const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Brand {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BrandResponse {
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: Brand[];
}

export interface BrandCreateResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: number;
}

export interface CreateBrandData {
  name: string;
  description: string;
}

export interface UpdateBrandData {
  id: number;
  name: string;
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

export const brandService = {
  // Get all brands
  getAllBrands: async (): Promise<BrandResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Brand`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch brands");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  },

  // Create brand
  createBrand: async (
    brandData: CreateBrandData
  ): Promise<BrandCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Brand`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(brandData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create brand");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating brand:", error);
      throw error;
    }
  },

  // Update brand
  updateBrand: async (
    brandData: UpdateBrandData
  ): Promise<BrandCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Brand`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(brandData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update brand");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  },

  // Delete brand
  deleteBrand: async (brandId: number): Promise<BrandCreateResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Brand/${brandId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete brand");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw error;
    }
  },
};
