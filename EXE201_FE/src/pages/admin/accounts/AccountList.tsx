import React, { useState, useEffect } from "react";
import {
  accountService,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "../../../services/admin/account.service";
import { showError, showSuccess } from "../../../utils/notifications";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 10;

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
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    role: "Customer",
  });

  const fetchAccounts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await accountService.getAllAccounts(
        page,
        ITEMS_PER_PAGE
      );
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
          id: editingAccount.id,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          role: formData.role,
        };
        await accountService.updateAccount(
          editingAccount.id.toString(),
          updateData
        );
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
          ? "Không thể cập nhật tài khoản "
          : "Không thể thêm tài khoản"
      );
      console.error("Error saving account:", error);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      email: account.email,
      password: "", // Don't show password
      fullName: account.fullName,
      phoneNumber: account.phoneNumber || "",
      address: account.address || "",
      role: account.role,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (accountId: number) => {
    try {
      const account = accounts.find((acc) => acc.id === accountId);
      const action = account?.isActive ? "khóa" : "mở khóa";

      await accountService.toggleAccountStatus(accountId.toString());
      showSuccess(`Đã ${action} tài khoản thành công`);
      fetchAccounts(currentPage);
    } catch (error) {
      showError("Không thể cập nhật trạng thái tài khoản");
      console.error("Error toggling account status:", error);
    }
  };

  const handleDelete = async (accountId: number) => {
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
      await accountService.deleteAccount(accountId.toString());
      showSuccess("Xóa tài khoản thành công");
      fetchAccounts(currentPage);
    } catch (error) {
      showError("Không thể xóa tài khoản");
      console.error("Error deleting account:", error);
    }
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      address: "",
      role: "Customer",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Staff":
        return "bg-blue-100 text-blue-800";
      case "Customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "Admin":
        return "Quản trị viên";
      case "Staff":
        return "Nhân viên";
      case "Customer":
        return "Khách hàng";
      default:
        return role;
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
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Thêm tài khoản
        </button>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {account.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {account.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{account.username}
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
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {account.isActive ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(account.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowDetailsModal(true);
                      }}
                      className="min-w-[80px] px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleEdit(account)}
                      className="min-w-[80px] px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(account.id)}
                      className={`min-w-[110px] px-3 py-1 rounded ${
                        account.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {account.isActive ? "Khóa" : "Mở khóa"}
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="min-w-[80px] px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có tài khoản nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingAccount ? "Sửa tài khoản" : "Thêm tài khoản"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {!editingAccount && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={!editingAccount}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "Admin" | "Staff" | "Customer",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Customer">Khách hàng</option>
                    <option value="Staff">Nhân viên</option>
                    <option value="Admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingAccount ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết tài khoản</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.fullName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.phoneNumber || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.address || "Chưa cập nhật"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {getRoleText(selectedAccount.role)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAccount.isActive ? "Hoạt động" : "Đã khóa"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày tạo
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedAccount.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cập nhật lần cuối
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedAccount.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
