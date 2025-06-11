import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Types for Order
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
  _id: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingFee: number;
  shippingInfo: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    note?: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  transactionId?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingInfo: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    note?: string;
  };
  shippingFee: number;
}

export interface UpdateOrderStatusRequest {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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

export const orderService = {
  // Get all orders (Admin/Staff)
  getAllOrders: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Order[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `/orders/all?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get user orders (Customer)
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get("/orders/my-orders");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    const apiClient = createApiClient();
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create new order
  createOrder: async (
    orderData: CreateOrderRequest
  ): Promise<ApiResponse<Order>> => {
    const apiClient = createApiClient();
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  },

  // Update order status (Admin/Staff)
  updateOrderStatus: async (
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<ApiResponse<Order>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(
      `/orders/${orderId}/status`,
      statusData
    );
    return response.data;
  },

  // Cancel order (Customer)
  cancelOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const apiClient = createApiClient();
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Delete order (Admin only)
  deleteOrder: async (orderId: string): Promise<ApiResponse<null>> => {
    const apiClient = createApiClient();
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  },
};
