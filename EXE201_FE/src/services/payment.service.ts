import apiClient from "./apiClient";

export interface PaymentItem {
  product: string; // Product ID
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  note?: string;
}

export interface PaymentRequest {
  amount: number;
  orderDescription: string;
  orderType: string;
  language?: string;
  items: PaymentItem[];
  shippingInfo?: ShippingInfo;
}

export interface PaymentResponse {
  code: string;
  message?: string;
  data: string;
  orderId?: string;
}

export interface ReturnPaymentResponse {
  code: string;
  message?: string;
  data: Record<string, unknown>;
}

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export interface CreatePaymentUrlRequest {
  items: CartItem[];
  amount: number;
  shippingInfo: ShippingInfo;
}

export interface CreatePaymentUrlResponse {
  paymentUrl: string;
  orderId: string;
}

export const PaymentService = {
  createPayment: async (
    paymentData: PaymentRequest
  ): Promise<PaymentResponse> => {
    const response = await apiClient.post("/payment/create", paymentData);
    return response.data;
  },
  createPaymentUrl: async (
    data: CreatePaymentUrlRequest
  ): Promise<CreatePaymentUrlResponse> => {
    const paymentData: PaymentRequest = {
      amount: data.amount,
      orderDescription: "Thanh toan don hang",
      orderType: "other",
      language: "vn",
      items: data.items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingInfo: data.shippingInfo,
    };

    // Log the request data being sent to the backend
    console.log("Payment request to backend:", paymentData);

    const response = await apiClient.post("/payment/create", paymentData);

    // Log the complete response from the backend
    console.log("Complete backend response:", response.data);

    if (response.data.code === "00" && response.data.data) {
      // Try to extract SecureHash from response URL
      try {
        const urlObj = new URL(response.data.data);
        const secureHash = urlObj.searchParams.get("vnp_SecureHash");
        console.log("VNPay SecureHash from service:", secureHash);

        // Log all VNPay parameters
        console.log("All VNPay parameters:");
        urlObj.searchParams.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
      } catch (error) {
        console.error("Error parsing VNPay URL:", error);
      }

      return {
        paymentUrl: response.data.data,
        orderId: response.data.orderId || "",
      };
    } else {
      throw new Error(response.data.message || "Failed to create payment");
    }
  },

  handlePaymentReturn: async (
    queryParams: Record<string, string>
  ): Promise<ReturnPaymentResponse> => {
    const response = await apiClient.get("/payment/vnpay-return", {
      params: queryParams,
    });
    return response.data;
  },
};
