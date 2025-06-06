import {
  AuthResponse,
  LoginFormData,
  RegisterResponse,
  PreOrderProduct,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (
  credentials: LoginFormData
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    console.log("Login API Response:", data);

    if (data.status !== "success") {
      throw new Error(data.message || "Login failed");
    }

    // Transform the response to match our AuthResponse interface
    const authResponse: AuthResponse = {
      status: data.status,
      message: data.message,
      token: data.token,
      user: data.user,
      // Add backward compatibility fields
      id: data.user.id,
      userName: data.user.name,
      roleName: data.user.role,
    };

    // Save auth data to localStorage
    localStorage.setItem("auth", JSON.stringify(authResponse));
    console.log("Login successful:", authResponse);

    return authResponse;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (
  userData: FormData
): Promise<RegisterResponse> => {
  try {
    // Create registration payload
    const registrationData = {
      name: userData.get("userName") as string,
      email: userData.get("email") as string,
      password: userData.get("password") as string,
      phone: (userData.get("phone") as string) || "",
      address: (userData.get("address") as string) || "",
      role: (userData.get("role") as string) || "user", // Default to "user" if not specified
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    console.log("Registration API Response:", data);

    if (data.status !== "success") {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Registration failed"
    );
  }
};

export const verifyEmail = async (
  email: string,
  otp: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "OTP verification failed");
    }

    const data = await response.json();
    console.log("OTP verification API Response:", data);

    if (!data.succeeded) {
      throw new Error(data.message || "OTP verification failed");
    }

    // Transform the response to match our AuthResponse interface
    const authResponse: AuthResponse = {
      status: "success",
      message: data.message,
      token: data.data.accessToken,
      user: data.data.user,
      // Add backward compatibility fields
      id: data.data.user.id,
      userName: data.data.user.name,
      roleName: data.data.user.role,
    };

    // Save auth data to localStorage
    localStorage.setItem("auth", JSON.stringify(authResponse));
    console.log("OTP verification successful:", authResponse);

    return authResponse;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};

export const resendOTP = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to resend OTP");
    }

    const data = await response.json();
    console.log("Resend OTP API Response:", data);

    if (!data.succeeded) {
      throw new Error(data.message || "Failed to resend OTP");
    }

    return { message: data.message };
  } catch (error) {
    console.error("Resend OTP error:", error);
    throw error;
  }
};

export const updatePreOrderInApi = async (
  productId: string,
  quantityToAdd: number
): Promise<PreOrderProduct> => {
  try {
    // In a real application, this would be an API call to the backend
    // For this demo, we'll simulate the API call with a delay

    // First, fetch the current preorders
    const response = await fetch("/data/preorders.json");
    if (!response.ok) {
      throw new Error("Failed to fetch pre-orders data");
    }

    const data = await response.json();
    const preorders: PreOrderProduct[] = data.preorders;

    // Find the target product
    const productIndex = preorders.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    // Update the product quantity
    const product = preorders[productIndex];
    const newQuantity = Math.min(
      product.currentQuantity + quantityToAdd,
      product.targetQuantity
    );

    const updatedProduct = {
      ...product,
      currentQuantity: newQuantity,
    };

    // Simulate an API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real application, this would call the backend API
        // For now, we just return the updated product
        resolve(updatedProduct);
      }, 1000); // Simulate 1s network delay
    });
  } catch (error) {
    console.error("Error updating pre-order in API:", error);
    throw error;
  }
};
