const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to make API calls with fallback
const apiCall = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  try {
    // Only use proxy in development
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    console.log(`API Call: ${API_BASE_URL}${endpoint}`, {
      status: response.status,
    });
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export interface Payment {
  id: number;
  paymentCode: string;
  paymentType: string;
  content: string;
  amount: number;
  paymentStatus: string;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  email: string;
  phone: string;
  userAddressId: number;
  address: string;
  status: string;
  depositPrice: number;
  shippingFee: number;
  totalPrice: number;
  isPreorder: boolean;
  payments: Payment[];
  shipping: object | null;
}

export interface OrderResponse {
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: Order[];
}

export interface CreateOrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderData {
  shippingFee: number;
  items: CreateOrderItem[];
  paymentType: "COD" | "VNPAY";
}

export interface CreateOrderResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: {
    orderId: number;
    vnpayData: object | null;
  };
}

export interface CreatePreOrderData {
  shippingFee: number;
  items: CreateOrderItem[];
}

export interface PreOrderResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: {
    tempOrderId: number;
    userId: number;
    userAddressId: number;
    isPreorder: boolean;
    depositPrice: number;
    shippingFee: number;
    totalPrice: number;
    items: Array<{
      productId: number;
      productName: string | null;
      price: number;
      quantity: number;
      totalPrice: number;
    }>;
  };
}

export interface PaymentUrlResponse {
  paymentUrl: string;
}

export interface PaymentVerificationResponse {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: {
    orderId: number;
    paymentStatus: string;
    transactionId: string;
    amount: number;
  } | null;
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

export const orderService = {
  // Get all orders
  getAllOrders: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<OrderResponse> => {
    try {
      const response = await apiCall(
        `/Order?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },
  // Get order by ID
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      const response = await apiCall(`/Order/${orderId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch order");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Get orders by user ID
  getOrdersByUserId: async (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<OrderResponse> => {
    try {
      const response = await apiCall(
        `/Order/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user orders");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },
  // Create regular order
  createOrder: async (
    orderData: CreateOrderData
  ): Promise<CreateOrderResponse> => {
    try {
      const response = await apiCall("/Order", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  // Create pre-order
  createPreOrder: async (
    preOrderData: CreatePreOrderData
  ): Promise<PreOrderResponse> => {
    try {
      const response = await apiCall("/PreOrder", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(preOrderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create pre-order");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating pre-order:", error);
      throw error;
    }
  },

  // Create VNPAY payment URL
  createPaymentUrl: async (
    amount: number,
    orderDescription: string,
    orderId: number,
    bankCode: string = "VNPAYQR"
  ): Promise<PaymentUrlResponse> => {
    try {
      // Ensure orderDescription is not empty
      const description = orderDescription || `Thanh toan don hang #${orderId}`;

      // Use POST method with query parameters and empty body (as required by backend)
      const params = new URLSearchParams({
        amount: amount.toString(),
        orderDescription: description,
        orderId: orderId.toString(),
        bankCode: bankCode,
      });

      console.log("Creating payment URL with POST params:", {
        amount: amount,
        orderDescription: description,
        orderId: orderId,
        bankCode: bankCode,
      });

      const response = await apiCall(`/Vnpay/create-payment-url?${params}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: "", // Empty body as required by backend
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment URL API error response:", errorText);
        console.error("Response status:", response.status);
        console.error("Request URL:", `/Vnpay/create-payment-url?${params}`);
        throw new Error(
          `Failed to create payment URL: ${response.status} - ${errorText}`
        );
      }
      const data = await response.json();
      console.log("Payment URL created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      throw error;
    }
  },

  // Verify payment callback from VNPay
  verifyPayment: async (
    queryParams: Record<string, string>
  ): Promise<PaymentVerificationResponse> => {
    try {
      const params = new URLSearchParams(queryParams);

      const response = await apiCall(`/Vnpay/payment-callback?${params}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify payment");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },
};
