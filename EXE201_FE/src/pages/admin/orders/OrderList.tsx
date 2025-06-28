import React, { useState, useEffect } from "react";
import {
  orderService,
  Order,
  UpdateOrderStatusRequest,
} from "../../../services/admin/order.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PAGE_SIZE = 10; // Số đơn hàng mỗi trang, có thể chỉnh theo ý muốn

const OrderList: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Lưu toàn bộ đơn hàng
  const [orders, setOrders] = useState<Order[]>([]); // Đơn hàng hiển thị trên trang hiện tại
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    status: "",
    paymentStatus: "",
    transactionId: "",
    paymentDate: "",
  });

  // Lấy toàn bộ đơn hàng 1 lần, sau đó chia trang ở frontend
  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAllOrders(1, 9999); // Lấy hết
      setAllOrders(response.data || []);
      // Tính số trang
      const total = response.data ? response.data.length : 0;
      setTotalPages(Math.ceil(total / PAGE_SIZE));
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Khi allOrders hoặc currentPage thay đổi, cập nhật orders hiển thị
  useEffect(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    setOrders(allOrders.slice(startIdx, endIdx));
  }, [allOrders, currentPage]);

  useEffect(() => {
    fetchAllOrders();
  }, []);
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const updateData: UpdateOrderStatusRequest = {};
      if (statusData.status) {
        updateData.status = statusData.status as
          | "pending"
          | "processing"
          | "shipped"
          | "delivered"
          | "cancelled";
      }
      if (statusData.paymentStatus) {
        updateData.paymentStatus = statusData.paymentStatus as
          | "pending"
          | "completed"
          | "failed"
          | "refunded";
      }
      if (statusData.transactionId)
        updateData.transactionId = statusData.transactionId;
      if (statusData.paymentDate)
        updateData.paymentDate = statusData.paymentDate;

      await orderService.updateOrderStatus(selectedOrder._id, updateData);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setShowStatusModal(false);
      fetchAllOrders();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.error("Error updating order status:", error);
    }
  };
  const handleDeleteOrder = async (orderId: string) => {
    // Use SweetAlert2 instead of window.confirm
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await orderService.deleteOrder(orderId);
      toast.success("Xóa đơn hàng thành công");
      fetchAllOrders();
    } catch (error) {
      toast.error("Không thể xóa đơn hàng");
      console.error("Error deleting order:", error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 py-8 shadow-lg">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            🚚 Quản lý đơn hàng của hệ thống
          </h1>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-center">
                    #{order._id.slice(-8)}
                  </td>{" "}
                  <td className="w-[15%] px-6 py-4 whitespace-nowrap  text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email || "N/A"}
                    </div>
                  </td>
                  <td className=" w-[10%]  px-6 py-4 whitespace-nowrap text-sm  text-center">
                    {(order.totalAmount || 0).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap ">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className=" w-[10%] px-6 py-4 whitespace-nowrap text-sm  text-center">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        className="min-w-[90px] px-4 py-2 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition duration-200"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusData({
                            status: order.status,
                            paymentStatus: order.paymentStatus,
                            transactionId: order.transactionId || "",
                            paymentDate: order.paymentDate || "",
                          });
                          setShowStatusModal(true);
                        }}
                        className="min-w-[90px] px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition duration-200"
                      >
                        Cập nhật
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="min-w-[90px] px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition duration-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-900 text-white hover:bg-blue-800"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded flex items-center justify-center ${
                currentPage === page
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-900 text-white hover:bg-blue-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
      {/* Detail Modal */}
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
                      Khách hàng
                    </p>{" "}
                    <p className="text-sm text-gray-900">
                      {selectedOrder.user?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Thông tin giao hàng
                    </p>{" "}
                    <p className="text-sm text-gray-900">
                      {selectedOrder.shippingInfo?.fullName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.shippingInfo?.address || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.shippingInfo?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Sản phẩm
                  </p>{" "}
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {item.product?.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity || 0}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {(
                            (item.price || 0) * (item.quantity || 0)
                          ).toLocaleString("vi-VN")}{" "}
                          ₫
                        </p>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500">Không có sản phẩm</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-500">
                      Phí giao hàng:
                    </p>{" "}
                    <p className="text-sm text-gray-900">
                      {(selectedOrder.shippingFee || 0).toLocaleString("vi-VN")}{" "}
                      ₫
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-lg font-medium">
                    <p>Tổng cộng:</p>
                    <p>
                      {(selectedOrder.totalAmount || 0).toLocaleString("vi-VN")}{" "}
                      ₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Cập nhật trạng thái
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    value={statusData.status}
                    onChange={(e) =>
                      setStatusData({ ...statusData, status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã gửi hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái thanh toán
                  </label>
                  <select
                    value={statusData.paymentStatus}
                    onChange={(e) =>
                      setStatusData({
                        ...statusData,
                        paymentStatus: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Chờ thanh toán</option>
                    <option value="completed">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã giao dịch
                  </label>
                  <input
                    type="text"
                    value={statusData.transactionId}
                    onChange={(e) =>
                      setStatusData({
                        ...statusData,
                        transactionId: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mã giao dịch (nếu có)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày thanh toán
                  </label>
                  <input
                    type="text"
                    value={statusData.paymentDate}
                    onChange={(e) =>
                      setStatusData({
                        ...statusData,
                        paymentDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YYYYMMDDHHmmss"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
