import apiClient from "../apiClient";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class CustomerProfileService {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.put("/auth/profile", profileData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.put("/auth/change-password", passwordData);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
}

export const customerProfileService = new CustomerProfileService();
