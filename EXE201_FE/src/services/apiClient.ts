import axios from "axios";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
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
        if (parsedAuth && parsedAuth.token) {
          config.headers.Authorization = `Bearer ${parsedAuth.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
