import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Users,
  ShoppingBag,
  BarChart2,
  Settings,
  User,
  Server,
  Shield,
  LogOut,
} from "lucide-react";

const HomeAdmin: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex-grow flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Quản trị Nhieuthuay</h2>
          <p className="text-gray-400 text-sm mt-1">Quản trị viên</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition ${
                  activeTab === "dashboard" ? "bg-gray-800" : ""
                }`}
              >
                <BarChart2 size={20} />
                <span>Tổng quan</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition ${
                  activeTab === "users" ? "bg-gray-800" : ""
                }`}
              >
                <Users size={20} />
                <span>Quản lý người dùng</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition ${
                  activeTab === "products" ? "bg-gray-800" : ""
                }`}
              >
                <ShoppingBag size={20} />
                <span>Sản phẩm</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("permissions")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition ${
                  activeTab === "permissions" ? "bg-gray-800" : ""
                }`}
              >
                <Shield size={20} />
                <span>Phân quyền</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition ${
                  activeTab === "settings" ? "bg-gray-800" : ""
                }`}
              >
                <Settings size={20} />
                <span>Cài đặt hệ thống</span>
              </button>
            </li>
            <li className="mt-8">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 p-3 rounded hover:bg-red-700 transition text-red-400 hover:text-white"
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
            Xin chào, {currentUser?.user.userName || "Quản trị viên"}!
          </h1>
          <p className="text-gray-600">
            Truy cập bảng điều khiển quản trị Nhieuthuay.
          </p>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 font-medium mb-2">
                  Tổng doanh thu
                </h3>
                <p className="text-3xl font-bold">350.6M₫</p>
                <p className="text-green-600 text-sm mt-2">
                  +15% từ tháng trước
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 font-medium mb-2">
                  Người dùng mới
                </h3>
                <p className="text-3xl font-bold">264</p>
                <p className="text-green-600 text-sm mt-2">
                  +32% từ tháng trước
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 font-medium mb-2">Đơn hàng mới</h3>
                <p className="text-3xl font-bold">384</p>
                <p className="text-green-600 text-sm mt-2">
                  +12% từ tháng trước
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-500 font-medium mb-2">
                  Tỷ lệ hoàn thành
                </h3>
                <p className="text-3xl font-bold">98.2%</p>
                <p className="text-green-600 text-sm mt-2">
                  +2.1% từ tháng trước
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Báo cáo doanh thu</h2>
                </div>

                <div className="p-6">
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">
                      Biểu đồ doanh thu theo thời gian
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Trạng thái hệ thống</h2>
                </div>

                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Server size={18} className="text-gray-500 mr-2" />
                        <span>Máy chủ chính</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Hoạt động
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Server size={18} className="text-gray-500 mr-2" />
                        <span>Máy chủ dự phòng</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Hoạt động
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-500 mr-2"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Cơ sở dữ liệu</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Hoạt động
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-500 mr-2"
                        >
                          <path
                            d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>API Gateway</span>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Chậm
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Quản lý người dùng</h2>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
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
                  Thêm người dùng mới
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
                        Tên đăng nhập
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Vai trò
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Ngày tạo
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Trạng thái
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "1",
                        username: "admin",
                        role: "Admin",
                        created: "05/06/2025",
                        status: "Active",
                      },
                      {
                        id: "2",
                        username: "customer",
                        role: "Customer",
                        created: "12/05/2025",
                        status: "Active",
                      },
                      {
                        id: "3",
                        username: "staff1",
                        role: "Staff",
                        created: "01/04/2025",
                        status: "Active",
                      },
                      {
                        id: "4",
                        username: "customer2",
                        role: "Customer",
                        created: "22/03/2025",
                        status: "Inactive",
                      },
                      {
                        id: "5",
                        username: "staff2",
                        role: "Staff",
                        created: "15/02/2025",
                        status: "Active",
                      },
                    ].map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "Staff"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.created}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              Sửa
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Quản lý phân quyền</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Quản lý các vai trò và quyền truy cập trong hệ thống.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <User size={20} className="text-purple-700" />
                    </div>
                    <h3 className="font-bold">Quản trị viên</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Có toàn quyền truy cập và quản lý hệ thống.
                  </p>
                  <button className="text-purple-700 hover:text-purple-900 text-sm font-medium">
                    Chỉnh sửa quyền
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User size={20} className="text-blue-700" />
                    </div>
                    <h3 className="font-bold">Nhân viên</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Quản lý sản phẩm, đơn hàng và hỗ trợ khách hàng.
                  </p>
                  <button className="text-blue-700 hover:text-blue-900 text-sm font-medium">
                    Chỉnh sửa quyền
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <User size={20} className="text-gray-700" />
                    </div>
                    <h3 className="font-bold">Khách hàng</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Xem sản phẩm, mua hàng và quản lý tài khoản cá nhân.
                  </p>
                  <button className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                    Chỉnh sửa quyền
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" ||
          (activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">
                  {activeTab === "products"
                    ? "Quản lý sản phẩm"
                    : "Cài đặt hệ thống"}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {activeTab === "products"
                        ? "Không có sản phẩm"
                        : "Cài đặt nâng cao"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeTab === "products"
                        ? "Bắt đầu bằng cách thêm sản phẩm mới vào hệ thống."
                        : "Chức năng này đang được phát triển."}
                    </p>
                    <div className="mt-6">
                      <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                        {activeTab === "products"
                          ? "Thêm sản phẩm mới"
                          : "Cài đặt nâng cao"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomeAdmin;
