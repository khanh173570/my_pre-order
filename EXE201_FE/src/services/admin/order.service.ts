import {
  orderService as baseOrderService,
  Order as BaseOrder,
  OrderResponse,
  CreateOrderData,
  CreateOrderResponse,
  CreatePreOrderData,
  PreOrderResponse,
  PaymentUrlResponse,
  Payment,
} from "../order.service";

// Transform function to convert new API format to old format
const transformOrder = (newOrder: BaseOrder): Order => {
  return {
    _id: newOrder.id.toString(),
    user: {
      _id: newOrder.userId.toString(),
      name: newOrder.customerName,
      email: newOrder.email,
    },
    items: [], // Items are not included in the new API response, would need separate endpoint
    totalAmount: newOrder.totalPrice,
    paymentStatus: transformPaymentStatus(
      newOrder.payments[0]?.paymentStatus || "PENDING"
    ),
    paymentMethod: newOrder.payments[0]?.paymentType || "COD",
    status: transformOrderStatus(newOrder.status),
    shippingFee: newOrder.shippingFee,
    shippingInfo: {
      fullName: newOrder.customerName,
      address: newOrder.address,
      phone: newOrder.phone,
      email: newOrder.email,
    },
    shippingAddress: {
      address: newOrder.address,
      city: "",
      postalCode: "",
      country: "Vietnam",
    },
    transactionId: newOrder.payments[0]?.paymentCode,
    paymentDate: "",
    createdAt: new Date().toISOString(), // API doesn't provide this
    updatedAt: new Date().toISOString(), // API doesn't provide this
  };
};

const transformOrderStatus = (
  status: string
): "pending" | "processing" | "shipped" | "delivered" | "cancelled" => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "CONFIRM":
      return "processing";
    case "SHIPPING":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
};

const transformPaymentStatus = (
  status: string
): "pending" | "completed" | "failed" | "refunded" => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "SUCCESS":
      return "completed";
    case "FAILED":
      return "failed";
    case "REFUNDED":
      return "refunded";
    default:
      return "pending";
  }
};

// Export types for admin use, adapting to match existing interface
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

export const adminOrderService = {
  // Get all orders (Admin/Staff)
  getAllOrders: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Order[]>> => {
    try {
      const response = await baseOrderService.getAllOrders(page, limit);

      const transformedOrders = response.data.map(transformOrder);

      return {
        status: "success",
        message: response.message || undefined,
        data: transformedOrders,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / limit),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Get user orders (Customer)
  getUserOrders: async (userId?: number): Promise<ApiResponse<Order[]>> => {
    try {
      if (!userId) {
        // If no userId provided, get from auth context
        const authData = localStorage.getItem("auth");
        if (authData) {
          const auth = JSON.parse(authData);
          userId = auth.data?.user?.id;
        }
      }

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await baseOrderService.getOrdersByUserId(userId);

      const transformedOrders = response.data.map(transformOrder);

      return {
        status: "success",
        message: response.message || undefined,
        data: transformedOrders,
        pagination: {
          currentPage: response.pageNumber,
          totalPages: Math.ceil(response.data.length / 10),
          totalItems: response.data.length,
          limit: response.pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    try {
      const order = await baseOrderService.getOrderById(parseInt(orderId));
      const transformedOrder = transformOrder(order);

      return {
        status: "success",
        data: transformedOrder,
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new order
  createOrder: async (
    orderData: CreateOrderRequest
  ): Promise<ApiResponse<Order>> => {
    try {
      const newOrderData: CreateOrderData = {
        shippingFee: orderData.shippingFee,
        items: orderData.items.map((item) => ({
          productId: parseInt(item.product),
          productName: "", // Would need product name from frontend
          price: item.price,
          quantity: item.quantity,
        })),
        paymentType: orderData.paymentMethod as "COD" | "VNPAY",
      };

      const response = await baseOrderService.createOrder(newOrderData);

      if (response.succeeded) {
        // Get the created order
        const createdOrder = await baseOrderService.getOrderById(
          response.data.orderId
        );
        const transformedOrder = transformOrder(createdOrder);

        return {
          status: "success",
          message: response.message,
          data: transformedOrder,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  },

  // Update order status (Admin/Staff) - Note: New API doesn't have this endpoint
  updateOrderStatus: async (
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<ApiResponse<Order>> => {
    // This functionality is not available in the new API
    // Would need to implement in backend or return current order
    try {
      const order = await baseOrderService.getOrderById(parseInt(orderId));
      const transformedOrder = transformOrder(order);

      return {
        status: "success",
        message: "Order status update not implemented in new API",
        data: transformedOrder,
      };
    } catch (error) {
      throw error;
    }
  },

  // Cancel order (Customer) - Note: New API doesn't have this endpoint
  cancelOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    // This functionality is not available in the new API
    try {
      const order = await baseOrderService.getOrderById(parseInt(orderId));
      const transformedOrder = transformOrder(order);

      return {
        status: "success",
        message: "Order cancellation not implemented in new API",
        data: transformedOrder,
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete order (Admin only) - Note: New API doesn't have this endpoint
  deleteOrder: async (orderId: string): Promise<ApiResponse<null>> => {
    // This functionality is not available in the new API
    return {
      status: "error",
      message: "Order deletion not implemented in new API",
      data: null,
    };
  },

  // Create payment URL
  createPaymentUrl: async (
    amount: number,
    orderDescription: string,
    orderId: number,
    bankCode: string = "VNPAYQR"
  ): Promise<PaymentUrlResponse> => {
    return await baseOrderService.createPaymentUrl(
      amount,
      orderDescription,
      orderId,
      bankCode
    );
  },

  // Create pre-order
  createPreOrder: async (
    preOrderData: CreatePreOrderData
  ): Promise<PreOrderResponse> => {
    return await baseOrderService.createPreOrder(preOrderData);
  },
};

// Export the service as orderService for backward compatibility
export const orderService = adminOrderService;
