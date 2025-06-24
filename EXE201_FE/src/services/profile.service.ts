import apiClient from "./apiClient";
import { User } from "../types";

// Interface for the profile response
interface ProfileResponse {
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: User;
}

/**
 * Fetches the current user's profile
 * @returns The user profile data
 */
export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    console.log("Fetching user profile");

    // Check if we have auth token in localStorage
    const authData = localStorage.getItem("auth");
    if (!authData) {
      console.warn("No auth data found when trying to fetch profile");
      return null;
    }

    // Log the request details
    console.log("Making request to /api/Auth/profile");

    const response = await apiClient.get<ProfileResponse>("/api/Auth/profile");
    console.log("Profile response status:", response.status);
    console.log("Profile response:", response.data);

    if (response.data.succeeded && response.data.data) {
      console.log("Profile data successfully extracted:", response.data.data);
      return response.data.data;
    } else {
      console.warn(
        "Profile API returned success=false or no data",
        response.data
      );
      throw new Error(response.data.message || "Failed to fetch profile data");
    }
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; data: unknown };
      };
      if (axiosError.response) {
        console.error("Response status:", axiosError.response.status);
        console.error("Response data:", axiosError.response.data);
      }
    }
    return null;
  }
};
