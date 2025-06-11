import apiClient from "../apiClient";

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  phone: string;
  email?: string;
}

export interface CustomerOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  paymentDate?: string;
  shippingInfo: ShippingInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  totalAmount: number;
  shippingFee: number;
}

class CustomerOrderService {
  async getMyOrders(): Promise<CustomerOrder[]> {
    try {
      const response = await apiClient.get("/orders/my-orders");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<CustomerOrder> {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CustomerOrder> {
    try {
      const response = await apiClient.post("/orders", orderData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await apiClient.put(`/orders/${orderId}/cancel`);
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }
}

export const customerOrderService = new CustomerOrderService();
