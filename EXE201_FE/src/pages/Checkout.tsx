import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createPayment } from "../services/payment.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Checkout: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.user?.name || "",
    email: currentUser?.user?.email || "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        amount: totalPrice,
        orderInfo: `Thanh toán đơn hàng - ${cartItems.length} sản phẩm`,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo
      };

      const response = await createPayment(paymentData);

      if (response.status === 'success') {
        // Clear cart before redirecting to payment
        clearCart();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Chuyển hướng thanh toán',
          text: 'Bạn sẽ được chuyển đến trang thanh toán VNPay',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirect to VNPay
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
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
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ giao hàng *
              </label>
              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">
                    {item.quantity} x {item.price.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div className="font-semibold">
                  {(item.quantity * item.price).toLocaleString("vi-VN")} VND
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Tổng cộng:</span>
              <span className="text-blue-900">{totalPrice.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-blue-900 mb-2">Phương thức thanh toán</h3>
              <div className="flex items-center space-x-2">
                <img
                  src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                  alt="VNPay"
                  className="h-8"
                />
                <span className="text-sm text-gray-600">
                  Thanh toán an toàn qua VNPay
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-3 rounded-md font-semibold transition-colors ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800 text-white"
              }`}
            >
              {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Bằng cách nhấn "Thanh toán ngay", bạn đồng ý với điều khoản sử dụng của chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;