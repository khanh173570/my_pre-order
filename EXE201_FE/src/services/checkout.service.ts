import { orderService, CreateOrderData } from "./order.service";

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
}

export interface CheckoutData {
  items: CheckoutItem[];
  shippingFee: number;
  paymentMethod: "COD" | "VNBANK" | "INTCARD";
  totalAmount: number;
}

export const checkoutService = {
  // Create order for booking products (normal order)
  createBookingOrder: async (checkoutData: CheckoutData) => {
    try {
      const orderData: CreateOrderData = {
        shippingFee: checkoutData.shippingFee,
        items: checkoutData.items.map((item) => ({
          productId: parseInt(item.id),
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentType: checkoutData.paymentMethod === "COD" ? "COD" : "VNPAY",
      };

      console.log("Creating order with data:", orderData);
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error) {
      console.error("Error creating booking order:", error);
      throw error;
    }
  },

  // Create payment URL for VNPAY
  createPaymentUrl: async (
    amount: number,
    orderId: number,
    description: string = "Payment for order",
    bankCode: string = "VNPAYQR"
  ) => {
    try {
      const response = await orderService.createPaymentUrl(
        amount,
        description,
        orderId,
        bankCode
      );
      return response;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      throw error;
    }
  },

  // Process COD order
  processCODOrder: async (checkoutData: CheckoutData) => {
    try {
      const response = await checkoutService.createBookingOrder(checkoutData);

      if (response.succeeded) {
        return {
          success: true,
          orderId: response.data.orderId,
          message: response.message,
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error processing COD order:", error);
      throw error;
    }
  },
  // Process VNPAY order
  processVNPAYOrder: async (checkoutData: CheckoutData) => {
    try {
      // First create the order
      const orderResponse = await checkoutService.createBookingOrder(
        checkoutData
      );
      if (orderResponse.succeeded) {
        // Create order description from product names (keep it short for VNPay)
        let orderDescription = "";
        if (checkoutData.items.length > 0) {
          // Use first product name, limit to 50 characters
          const firstProduct = checkoutData.items[0].name;
          if (checkoutData.items.length === 1) {
            orderDescription = firstProduct.substring(0, 50);
          } else {
            orderDescription = `${firstProduct.substring(0, 30)} va ${
              checkoutData.items.length - 1
            } sp khac`;
          }
        } else {
          orderDescription = `Don hang #${orderResponse.data.orderId}`;
        }

        console.log("Order description:", orderDescription);

        // Determine bank code based on payment method
        let bankCode = "VNPAYQR"; // Default
        if (checkoutData.paymentMethod === "VNBANK") {
          bankCode = "VNBANK";
        } else if (checkoutData.paymentMethod === "INTCARD") {
          bankCode = "INTCARD";
        }

        // Then create payment URL
        const paymentResponse = await checkoutService.createPaymentUrl(
          checkoutData.totalAmount,
          orderResponse.data.orderId,
          orderDescription,
          bankCode
        );

        return {
          success: true,
          orderId: orderResponse.data.orderId,
          paymentUrl: paymentResponse.paymentUrl,
          message: orderResponse.message,
        };
      } else {
        throw new Error(orderResponse.message);
      }
    } catch (error) {
      console.error("Error processing VNPAY order:", error);
      throw error;
    }
  },
};
