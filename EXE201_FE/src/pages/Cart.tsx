import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Giỏ hàng của bạn đang trống");
        return;
      }

      if (totalPrice <= 0) {
        toast.error("Số tiền không hợp lệ");
        return;
      }

      // Redirect to checkout review page using React Router
      navigate("/checkout-review");
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Đã xảy ra lỗi khi chuyển hướng");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          <a
            href="/products"
            className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 mt-7 text-center text-white">
        Giỏ hàng của bạn
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-grow ml-6">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-blue-600 font-semibold mt-1">
                    {item.price.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-500 hover:text-blue-900"
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-500 hover:text-blue-900"
                  >
                    <PlusCircle size={20} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Tổng giỏ hàng</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span className="text-blue-900">
                  {totalPrice.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>{" "}
            <button
              onClick={handlePayment}
              className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Thanh toán với VNPay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
