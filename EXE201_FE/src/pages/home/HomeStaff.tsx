import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Users, ShoppingBag, BarChart2, Settings, LogOut } from "lucide-react";

const HomeStaff: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex-grow flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:block">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold">Quản lý Nhieuthuay</h2>
          <p className="text-blue-300 text-sm mt-1">Nhân viên</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition ${
                  activeTab === "dashboard" ? "bg-blue-800" : ""
                }`}
              >
                <BarChart2 size={20} />
                <span>Tổng quan</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition ${
                  activeTab === "products" ? "bg-blue-800" : ""
                }`}
              >
                <ShoppingBag size={20} />
                <span>Sản phẩm</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition ${
                  activeTab === "customers" ? "bg-blue-800" : ""
                }`}
              >
                <Users size={20} />
                <span>Khách hàng</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-blue-800 transition ${
                  activeTab === "settings" ? "bg-blue-800" : ""
                }`}
              >
                <Settings size={20} />
                <span>Cài đặt</span>
              </button>
            </li>
            <li className="mt-8">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 p-3 rounded hover:bg-red-700 transition text-red-300 hover:text-white"
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Xin chào, {currentUser?.user.userName || "Nhân viên"}!
          </h1>
          <p className="text-gray-600">
            Truy cập trang quản lý dành cho nhân viên Nhieuthuay.
          </p>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 font-medium mb-2">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold">126</p>
              <p className="text-green-600 text-sm mt-2">+12% từ tháng trước</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 font-medium mb-2">Doanh thu</h3>
              <p className="text-3xl font-bold">45.2M₫</p>
              <p className="text-green-600 text-sm mt-2">+8% từ tháng trước</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 font-medium mb-2">Khách hàng mới</h3>
              <p className="text-3xl font-bold">42</p>
              <p className="text-green-600 text-sm mt-2">+18% từ tháng trước</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 font-medium mb-2">
                Tỷ lệ chuyển đổi
              </h3>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-red-600 text-sm mt-2">-0.5% từ tháng trước</p>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Quản lý sản phẩm</h2>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                  Thêm sản phẩm mới
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Tên sản phẩm
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Danh mục
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Giá
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Tồn kho
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "SP001",
                        name: "Gundam RX-78-2",
                        category: "Mô hình",
                        price: "1,250,000₫",
                        stock: 24,
                        status: "Đang bán",
                      },
                      {
                        id: "SP002",
                        name: "Zaku II MS-06S",
                        category: "Mô hình",
                        price: "980,000₫",
                        stock: 15,
                        status: "Đang bán",
                      },
                      {
                        id: "SP003",
                        name: "MG Unicorn Gundam",
                        category: "Mô hình",
                        price: "2,450,000₫",
                        stock: 8,
                        status: "Đang bán",
                      },
                      {
                        id: "SP004",
                        name: "RG Strike Freedom",
                        category: "Mô hình",
                        price: "1,680,000₫",
                        stock: 0,
                        status: "Hết hàng",
                      },
                      {
                        id: "SP005",
                        name: "PG Gundam Exia",
                        category: "Mô hình",
                        price: "4,200,000₫",
                        stock: 5,
                        status: "Đang bán",
                      },
                    ].map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{product.id}</td>
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.price}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.status === "Đang bán"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Quản lý khách hàng</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Quản lý thông tin khách hàng và lịch sử đặt hàng.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Tính năng này chỉ có sẵn cho nhân viên cấp cao. Liên hệ
                      quản trị viên để được cấp quyền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Cài đặt tài khoản</h2>
            </div>

            <div className="p-6">
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="userName"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={
                      currentUser?.user?.name ||
                      currentUser?.userName ||
                      "staff"
                    }
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="staff@nhieuthuay.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="role"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Vai trò
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={currentUser?.roleName || "staff"}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStaff;
