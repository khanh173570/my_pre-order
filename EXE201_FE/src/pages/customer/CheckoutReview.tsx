import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { PageTransition } from "../../components/PageTransition";
import { checkoutService } from "../../services/checkout.service";
import { useAuth } from "../../hooks/useAuth";

type PaymentMethod = "COD" | "VNBANK" | "INTCARD";

const CheckoutReview: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hadPaymentError, setHadPaymentError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  // Calculate shipping fee: 10% of total price, max 30000
  const calculateShippingFee = (totalPrice: number): number => {
    const shippingFee = Math.round(totalPrice * 0.1);
    return Math.min(shippingFee, 30000);
  };
  const shippingFee = calculateShippingFee(totalPrice);
  const amount = totalPrice + shippingFee;
  const handlePayment = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Đang xử lý đơn hàng...");

      // Prepare checkout data with calculated shipping fee
      const checkoutData = {
        items: cartItems.map((item) => ({
          id: item.id.toString(),
          name: item.name || "",
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        })),
        shippingFee: shippingFee,
        paymentMethod: paymentMethod as "COD" | "VNBANK" | "INTCARD",
        totalAmount: amount, // Include shipping fee in total
      };

      if (paymentMethod === "COD") {
        // Handle COD payment
        const result = await checkoutService.processCODOrder(checkoutData);

        if (result.success) {
          toast.success("Tạo đơn hàng COD thành công!");
          clearCart();
          navigate("/payment-return", {
            state: {
              orderId: result.orderId,
              paymentMethod: "COD",
              message: result.message,
              status: "success",
            },
          });
        } else {
          toast.error("Không thể tạo đơn hàng COD");
        }
      } else {
        // Handle VNPAY payment (VNBANK or INTCARD)
        const paymentResult = await checkoutService.processVNPAYOrder(
          checkoutData
        );

        if (paymentResult.success && paymentResult.paymentUrl) {
          toast.success("Tạo đơn hàng thành công! Chuyển hướng thanh toán...");
          clearCart();
          // Redirect to VNPay
          window.location.href = paymentResult.paymentUrl;
        } else {
          toast.error("Không thể tạo liên kết thanh toán");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xử lý đơn hàng";
      toast.error(errorMessage);
      console.error("Checkout error:", error);
      setHadPaymentError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/cart");
  };

  // Only redirect to cart if it's the initial load with empty cart
  // and there hasn't been a payment error
  if ((!cartItems || cartItems.length === 0) && !hadPaymentError) {
    navigate("/cart");
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 mt-10 text-center">
          Xác nhận đơn hàng
        </h1>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <div className="text-sm text-gray-500">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNBANK"
                    checked={paymentMethod === "VNBANK"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Thẻ ATM nội địa (VNBANK)</div>
                    <div className="text-sm text-gray-500">
                      Thanh toán qua thẻ ATM các ngân hàng Việt Nam
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="INTCARD"
                    checked={paymentMethod === "INTCARD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">
                      Thẻ thanh toán quốc tế (INTCARD)
                    </div>
                    <div className="text-sm text-gray-500">
                      Visa, Mastercard, JCB
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-3 border-b"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        {item.quantity} x {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="font-semibold">
                      {(item.quantity * item.price).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>{" "}
              <div className="border-t pt-4">
                <div className="flex justify-between py-2">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-semibold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Phí vận chuyển (10%, tối đa 30.000đ):</span>
                  <span className="font-semibold">
                    {shippingFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>{" "}
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span>{amount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutReview;
