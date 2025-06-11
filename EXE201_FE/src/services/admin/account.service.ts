import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Types for Account
export interface Account {
  _id: string;
  name: string;
  email: string;
  role: "user" | "staff" | "admin";
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string;
  email: string;
  password: string;
  role: "user" | "staff" | "admin";
}

export interface UpdateAccountRequest {
  name?: string;
  email?: string;
  role?: "user" | "staff" | "admin";
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  total?: number;
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

export const accountService = {
  // Get all accounts (Admin only)
  getAllAccounts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Account[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/accounts?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get account by ID
  getAccountById: async (accountId: string): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(`/accounts/${accountId}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get("/accounts/profile");
    return response.data;
  },

  // Create new account (Admin only)
  createAccount: async (
    accountData: CreateAccountRequest
  ): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.post("/accounts", accountData);
    return response.data;
  },

  // Update account (Admin only)
  updateAccount: async (
    accountId: string,
    accountData: UpdateAccountRequest
  ): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(`/accounts/${accountId}`, accountData);
    return response.data;
  },

  // Update profile (Current user)
  updateProfile: async (
    profileData: UpdateAccountRequest
  ): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put("/accounts/profile", profileData);
    return response.data;
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(
      "/accounts/change-password",
      passwordData
    );
    return response.data;
  },

  // Toggle account status (Admin only)
  toggleAccountStatus: async (
    accountId: string
  ): Promise<ApiResponse<Account>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(
      `/accounts/${accountId}/toggle-status`
    );
    return response.data;
  },

  // Delete account (Admin only)
  deleteAccount: async (accountId: string): Promise<ApiResponse<null>> => {
    const apiClient = createApiClient();
    const response = await apiClient.delete(`/accounts/${accountId}`);
    return response.data;
  },
};
