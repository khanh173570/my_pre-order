import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { PageTransition } from "../../components/PageTransition";
import { PaymentService } from "../../services/payment.service";

// Define interfaces for the component
interface ShippingInfo {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  note: string;
}

const CheckoutReview: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [hadPaymentError, setHadPaymentError] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    note: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    // Validate input fields
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.phone ||
      !shippingInfo.email
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    // Phone number validation
    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error(
        "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng số 0)"
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    try {
      setIsLoading(true);

      // Transform cart items to match the expected format for the service
      const transformedItems = cartItems.map((item) => ({
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
        quantity: item.quantity,
      })); // Process payment with shipping info
      toast.info("Đang xử lý thanh toán...");
      console.log("Payment request data:", {
        items: transformedItems,
        amount: totalPrice,
        shippingInfo,
      });

      const response = await PaymentService.createPaymentUrl({
        items: transformedItems,
        amount: totalPrice,
        shippingInfo,
      });

      // Log the response including SecureHash if available
      console.log("Payment response:", response);
      if (response.paymentUrl) {
        // Extract parameters from paymentUrl to see the secureHash
        const urlParams = new URL(response.paymentUrl).searchParams;
        const secureHash = urlParams.get("vnp_SecureHash");
        console.log("VNPay SecureHash:", secureHash);
      }

      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.error("Không thể tạo đường dẫn thanh toán");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xử lý thanh toán";
      toast.error(errorMessage);
      console.error("Payment error:", error);
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
        <h1 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="note"
                  value={shippingInfo.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
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
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between py-2">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-semibold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold">0đ</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
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
