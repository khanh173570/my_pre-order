import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status");
  const code = searchParams.get("code");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    if (status === "success" && code === "Code_00") {
      toast.success("Thanh toán thành công!");
      clearCart();
    }
    if (status === "fail") {
      toast.error("Thanh toán thất bại!");
    }
    // eslint-disable-next-line
  }, [status, code]);

  if (status === "success" && code === "Code_00") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-green-700">
          Thanh toán thành công!
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 mb-4">
            Cảm ơn bạn đã mua hàng.
            <br />
            Mã giao dịch: <span className="font-semibold">{transactionId}</span>
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-700">
          Thanh toán thất bại!
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 mb-4">
            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc liên
            hệ hỗ trợ.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  // Nếu không có trạng thái hợp lệ, có thể redirect về trang chủ hoặc trang giỏ hàng
  useEffect(() => {
    if (!status) {
      navigate("/cart");
    }
  }, [status, navigate]);

  // Trang này sẽ tự động hiển thị khi backend redirect về /payment-result với các query params phù hợp
  // Không cần thay đổi gì thêm, chỉ cần đảm bảo backend redirect đúng URL

  return null;
};

export default PaymentResult;
