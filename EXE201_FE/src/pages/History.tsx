import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePreOrder } from "../hooks/usePreOrder";
import { PageTransition } from "../components/PageTransition";
import { useAuth } from "../hooks/useAuth";

const History: React.FC = () => {
  const { preOrderHistory } = usePreOrder();
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = preOrderHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(preOrderHistory.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
            Lịch sử đặt hàng
          </h1>
          <p className="text-gray-600">
            Xem lại các sản phẩm bạn ({currentUser?.userName}) đã đặt trước
          </p>
        </div>

        {preOrderHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">Bạn chưa có đơn đặt trước nào.</p>
            <Link
              to="/pre-order"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Xem sản phẩm đặt trước
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="text-white text-xs font-medium">
                      Đặt ngày: {item.orderDate}
                    </span>
                  </div>
                </div>{" "}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.currentQuantity >= item.targetQuantity
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.currentQuantity >= item.targetQuantity
                        ? "Đã đủ số lượng"
                        : "Đang thu thập"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>
                      Số lượng đặt:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p>
                      Dự kiến ra mắt:{" "}
                      <span className="font-medium">{item.releaseDate}</span>
                    </p>
                    <div className="mt-2">
                      <span className="text-sm text-blue-600">
                        Tiến độ đặt trước:{" "}
                      </span>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${
                              (item.currentQuantity / item.targetQuantity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          {item.currentQuantity}
                        </span>
                        <span className="text-xs text-gray-600">
                          {item.targetQuantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Mã đơn: #{index + indexOfFirstItem + 1000}
                    </p>
                    <Link
                      to={`/pre-order/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {preOrderHistory.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium
                  ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-700 hover:bg-gray-50"
                  }`}
              >
                &laquo; Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium
                    ${
                      currentPage === i + 1
                        ? "bg-blue-50 text-blue-700 z-10"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium
                  ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-700 hover:bg-gray-50"
                  }`}
              >
                Tiếp &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default History;
