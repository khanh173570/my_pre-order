import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PageTransition } from "../../components/PageTransition";
import { adminOrderService, Order } from "../../services/admin/order.service";
import { toast } from "react-toastify";

const History: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminOrderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error("Không thể tải lịch sử đơn hàng");
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      await adminOrderService.cancelOrder(orderId);
      toast.success("Hủy đơn hàng thành công");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error("Không thể hủy đơn hàng");
      console.error("Error cancelling order:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã gửi hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "completed":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600 text-center">
            Xem lại các đơn hàng bạn ({currentUser?.userName}) đã đặt
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentItems.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order._id.slice(-30)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {getPaymentStatusText(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Sản phẩm ({order.items?.length || 0} món):
                    </p>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {order.items?.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2"
                        >
                          <img
                            src={item.product?.image || "/images/product.webp"}
                            alt={item.product?.name || "Product"}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/product.webp";
                            }}
                          />
                          <span className="text-xs text-gray-600 flex-1">
                            {item.product?.name || "N/A"} x {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} sản phẩm khác
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Tổng tiền:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {(order.totalAmount || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
                    >
                      Chi tiết
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-sm"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </nav>
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chi tiết đơn hàng #{selectedOrder._id.slice(-8)}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Trạng thái đơn hàng
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Trạng thái thanh toán
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                          selectedOrder.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(selectedOrder.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Thông tin giao hàng
                    </p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Tên:</strong>{" "}
                        {selectedOrder.shippingInfo?.fullName || "N/A"}
                      </p>
                      <p className="text-sm">
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.shippingInfo?.address || "N/A"}
                      </p>
                      <p className="text-sm">
                        <strong>Điện thoại:</strong>{" "}
                        {selectedOrder.shippingInfo?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Sản phẩm
                    </p>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                item.product?.image || "/images/product.webp"
                              }
                              alt={item.product?.name}
                              className="w-12 h-12 rounded object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/product.webp";
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {item.product?.name || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Số lượng: {item.quantity || 0}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">
                            {(
                              (item.price || 0) * (item.quantity || 0)
                            ).toLocaleString("vi-VN")}{" "}
                            ₫
                          </p>
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500">
                          Không có sản phẩm
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-500">
                        Phí giao hàng:
                      </p>
                      <p className="text-sm text-gray-900">
                        {(selectedOrder.shippingFee || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        ₫
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-lg font-medium">
                      <p>Tổng cộng:</p>
                      <p className="text-blue-600">
                        {(selectedOrder.totalAmount || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default History;
