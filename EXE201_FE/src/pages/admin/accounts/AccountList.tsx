import React, { useState, useEffect } from "react";
import {
  accountService,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "../../../services/admin/account.service";
import { AlertService } from "../../../services/AlertService";

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<CreateAccountRequest>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchAccounts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await accountService.getAllAccounts(page, 10);
      setAccounts(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      showError("Không thể tải danh sách tài khoản");
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAccount) {
        const updateData: UpdateAccountRequest = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        await accountService.updateAccount(editingAccount._id, updateData);
        showSuccess("Cập nhật tài khoản thành công");
      } else {
        await accountService.createAccount(formData);
        showSuccess("Thêm tài khoản thành công");
      }

      setShowModal(false);
      resetForm();
      fetchAccounts(currentPage);
    } catch (error) {
      showError(
        editingAccount
          ? "Không thể cập nhật tài khoản"
          : "Không thể thêm tài khoản"
      );
      console.error("Error saving account:", error);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      email: account.email,
      password: "", // Don't show password
      role: account.role,
    });
    setShowModal(true);
  };
  const handleToggleStatus = async (accountId: string) => {
    try {
      const account = accounts.find((acc) => acc._id === accountId);
      const action = account?.isActive ? "khóa" : "mở khóa";

      await accountService.toggleAccountStatus(accountId);
      showSuccess(`Đã ${action} tài khoản thành công`);
      fetchAccounts(currentPage);
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        showError(
          axiosError.response?.data?.message ||
            "Không thể cập nhật trạng thái tài khoản"
        );
      } else {
        showError("Không thể cập nhật trạng thái tài khoản");
      }
      console.error("Error toggling account status:", error);
    }
  };
  const handleDelete = async (accountId: string) => {
    // Use SweetAlert2 instead of window.confirm
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa tài khoản này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await accountService.deleteAccount(accountId);
      showSuccess("Xóa tài khoản thành công");
      fetchAccounts(currentPage);
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        showError(
          axiosError.response?.data?.message || "Không thể xóa tài khoản"
        );
      } else {
        showError("Không thể xóa tài khoản");
      }
      console.error("Error deleting account:", error);
    }
  };
  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "staff":
        return "Nhân viên";
      case "user":
        return "Khách hàng";
      default:
        return role;
    }
  };

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600 mt-2">
            Danh sách tất cả tài khoản trong hệ thống
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Thêm tài khoản</span>
        </button>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xác thực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {account.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {account.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        account.role
                      )}`}
                    >
                      {getRoleText(account.role)}
                    </span>{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        account.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      title={
                        account.isActive
                          ? "Tài khoản đang hoạt động bình thường"
                          : "Tài khoản đã bị khóa và không thể đăng nhập"
                      }
                    >
                      {account.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        account.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {account.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.createdAt).toLocaleDateString("vi-VN")}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap justify-start gap-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="min-w-[80px] px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleToggleStatus(account._id)}
                        className={`min-w-[110px] px-3 py-1 rounded ${
                          account.isActive
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        title={
                          account.isActive
                            ? "Khóa tài khoản này"
                            : "Mở khóa tài khoản này"
                        }
                      >
                        {account.isActive ? "Khóa tài khoản" : "Mở khóa"}
                      </button>
                      <button
                        onClick={() => handleDelete(account._id)}
                        className="min-w-[80px] px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        disabled={!account.isActive}
                        title={
                          !account.isActive
                            ? "Không thể xóa tài khoản đã bị khóa"
                            : ""
                        }
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => handleViewDetails(account)}
                        className="min-w-[110px] px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Trang <span className="font-medium">{currentPage}</span> của{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAccount ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email"
                  />
                </div>

                {!editingAccount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mật khẩu"
                      minLength={6}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "user" | "staff" | "admin",
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">Khách hàng</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {editingAccount ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết tài khoản
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Họ và tên:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {selectedAccount.name}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Email:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {selectedAccount.email}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Vai trò:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {getRoleText(selectedAccount.role)}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Trạng thái:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {selectedAccount.isActive ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Địa chỉ:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {selectedAccount.address || "Chưa cập nhật"}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Số điện thoại:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {selectedAccount.phone || "Chưa cập nhật"}
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Ngày tạo:
                  </span>
                  <span className="block text-sm text-gray-900">
                    {new Date(selectedAccount.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
