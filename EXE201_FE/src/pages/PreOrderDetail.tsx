import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PreOrderProduct } from "../types";
import {
  fetchPreOrders,
  updatePreOrderQuantity,
  getAvailableQuantity,
} from "../services/preorder";
import { useAuth } from "../hooks/useAuth";
import { usePreOrder } from "../hooks/usePreOrder";

const PreOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToPreOrderHistory } = usePreOrder();
  const [product, setProduct] = useState<PreOrderProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchPreOrders();
        const foundProduct = products.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setRemainingTime(foundProduct.deadline);
        } else {
          navigate("/pre-order");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        navigate("/pre-order");
      }
    };
    loadProduct();

    // Set up an interval to refresh the product data every 30 seconds
    // This ensures we see updates from other users
    const refreshInterval = setInterval(loadProduct, 30000);

    return () => clearInterval(refreshInterval);
  }, [id, navigate]);

  useEffect(() => {
    if (!product) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          return product.deadline;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);
  // Handle pre-order button click - show confirmation dialog
  const handlePreOrder = async () => {
    if (!isAuthenticated) {
      const currentPath = `/pre-order/${id}`;
      navigate("/login", { state: { from: currentPath } });
      return;
    }

    if (!product || !id) return;

    // Get the latest available quantity
    const availableQuantity = await getAvailableQuantity(id);

    if (availableQuantity <= 0) {
      alert("Đã hết số lượng đặt trước cho sản phẩm này!");
      return;
    }

    // Adjust quantity if it exceeds available quantity
    if (quantity > availableQuantity) {
      setQuantity(availableQuantity);
      alert(
        `Chỉ còn ${availableQuantity} sản phẩm có thể đặt trước. Số lượng đã được điều chỉnh.`
      );
    } // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Process the actual pre-order after confirmation
  const confirmPreOrder = async () => {
    if (!product || !id) return;

    // Prevent exceeding target quantity
    const availableQuantity = product.targetQuantity - product.currentQuantity;
    if (availableQuantity <= 0) return;

    // Adjust if selected quantity exceeds available quantity
    const actualQuantity = Math.min(quantity, availableQuantity);

    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // Call the service to update the pre-order quantity
      const { success, updatedProduct } = await updatePreOrderQuantity(
        id,
        actualQuantity
      );
      if (success && updatedProduct) {
        // Update local state
        setProduct(updatedProduct);

        // Add to pre-order history
        addToPreOrderHistory(updatedProduct, actualQuantity);

        // Show success message
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 5000);

        // Show success alert
        alert(
          `Đặt trước thành công ${actualQuantity} sản phẩm "${updatedProduct.name}"!`
        );

        // Force a refresh of product data to show the updated quantities
        const products = await fetchPreOrders();
        const refreshedProduct = products.find((p) => p.id === id);
        if (refreshedProduct) {
          setProduct(refreshedProduct);
        }
      } else {
        alert("Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error updating pre-order:", error);
      alert("Có lỗi xảy ra khi đặt trước sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Xác nhận đặt trước</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn đặt trước {quantity} sản phẩm "
              {product.name}" không?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirmPreOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-500">
        <Link to="/" className="hover:text-blue-900">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link to="/pre-order" className="hover:text-blue-900">
          Pre-order
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Product Image */}
        <div className="lg:w-2/3">
          <div className="bg-gray-100 rounded-lg mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-contain p-4"
            />
          </div>
        </div>

        {/* Right column - Product info */}
        <div className="lg:w-1/3 space-y-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>SKU: {`GD${id}${Date.now().toString().slice(-4)}`}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-900 text-2xl font-bold">
              {Number(1990000).toLocaleString("vi-VN")} VND
            </span>
          </div>
          {/* Countdown timer */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">
              Dự kiến ra mắt: {product.releaseDate}
            </div>
            <div className="flex justify-center space-x-2">
              <div className="bg-blue-900 text-white rounded px-3 py-2">
                {String(remainingTime.hours).padStart(2, "0")}
              </div>
              <span className="text-blue-900 text-xl">:</span>
              <div className="bg-blue-900 text-white rounded px-3 py-2">
                {String(remainingTime.minutes).padStart(2, "0")}
              </div>
              <span className="text-blue-900 text-xl">:</span>
              <div className="bg-blue-900 text-white rounded px-3 py-2">
                {String(remainingTime.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-600 mb-2">Mô tả</h3>
              <p className="text-gray-800">{product.description}</p>
            </div>

            <div className="flex justify-between">
              {" "}
              <div>
                <h3 className="text-gray-600 mb-2">Tình trạng</h3>
                <span className="text-blue-600">Pre-order</span>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">Mục tiêu đặt trước</h3>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">
                    {product.currentQuantity}/{product.targetQuantity}
                  </span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: `${
                          (product.currentQuantity / product.targetQuantity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Chọn Số Lượng</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>{" "}
          {orderSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <span className="block sm:inline">
                Đặt trước thành công {quantity} sản phẩm!
              </span>
            </div>
          )}{" "}
          <button
            onClick={handlePreOrder}
            disabled={
              isSubmitting || product.currentQuantity >= product.targetQuantity
            }
            className={`w-full py-3 rounded-md transition duration-300 ${
              isSubmitting
                ? "bg-blue-400 cursor-wait text-white"
                : product.currentQuantity >= product.targetQuantity
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : product.currentQuantity >= product.targetQuantity
              ? "Đã đủ số lượng đặt trước"
              : "Đăng kí đặt trước"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreOrderDetail;
