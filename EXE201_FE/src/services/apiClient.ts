import axios from "axios";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: "", // Remove /api since we're adding it to individual requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        // Support both old and new token formats
        const token =
          parsedAuth.token || (parsedAuth.data && parsedAuth.data.accessToken);

        if (token) {
          console.log("Adding auth token to request:", config.url);
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("No token found in auth data");
          console.log(
            "Auth data structure:",
            JSON.stringify(parsedAuth, null, 2)
          );
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    } else {
      console.log("No auth data found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
