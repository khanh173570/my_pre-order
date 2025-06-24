// Types for Account
export interface Account {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  role: "Admin" | "Staff" | "Customer";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  role: "Admin" | "Staff" | "Customer";
}

export interface UpdateAccountRequest {
  id: number;
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  role?: "Admin" | "Staff" | "Customer";
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

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

export const accountService = {
  // Get all accounts (Admin only)
  getAllAccounts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Account[]>> => {
    try {
      const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: result.data || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((result.data?.length || 0) / limit),
          totalItems: result.data?.length || 0,
          limit: limit,
        },
      };
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  // Get account by ID
  getAccountById: async (accountId: string): Promise<ApiResponse<Account>> => {
    try {
      const response = await fetch(`/api/users/${accountId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },

  // Create new account (Admin only)
  createAccount: async (
    accountData: CreateAccountRequest
  ): Promise<ApiResponse<Account>> => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

  // Update account (Admin only)
  updateAccount: async (
    accountId: string,
    accountData: UpdateAccountRequest
  ): Promise<ApiResponse<Account>> => {
    try {
      const response = await fetch(`/api/users/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  },

  // Toggle account status (Admin only)
  toggleAccountStatus: async (
    accountId: string
  ): Promise<ApiResponse<Account>> => {
    try {
      const response = await fetch(`/api/users/${accountId}/toggle-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error toggling account status:", error);
      throw error;
    }
  },

  // Delete account (Admin only)
  deleteAccount: async (accountId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`/api/users/${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: "success",
        message: result.message,
        data: null,
      };
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
};
