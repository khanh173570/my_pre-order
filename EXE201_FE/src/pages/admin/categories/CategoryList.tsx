import React, { useState, useEffect } from "react";
import {
  adminCategoryService,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../../services/admin/category.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 10; // Hiển thị 10 danh mục mỗi trang

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    categoryName: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await adminCategoryService.getAllCategories();
      const allCategories = response.data || [];
      console.log("Số lượng danh mục từ API: ", allCategories.length); // Debug
      console.log("Full categories data: ", allCategories); // Debug chi tiết
      setCategories(allCategories);
      setTotalPages(Math.ceil(allCategories.length / ITEMS_PER_PAGE));
      updateFilteredCategories(allCategories, 1);
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilteredCategories = (data: Category[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const filtered = data.slice(startIndex, endIndex);
    console.log("Filtered categories for page", page, ": ", filtered); // Debug
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    updateFilteredCategories(categories, currentPage);
    setTotalPages(Math.ceil(categories.length / ITEMS_PER_PAGE));
    console.log("Current page: ", currentPage, "Total pages: ", totalPages); // Debug
  }, [currentPage, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updateData: UpdateCategoryRequest = {
          ...formData,
          id: editingCategory.id,
        };
        await adminCategoryService.updateCategory(
          editingCategory.id.toString(),
          updateData
        );
        toast.success("Cập nhật danh mục thành công");
      } else {
        await adminCategoryService.createCategory(formData);
        toast.success("Thêm danh mục thành công");
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(
        editingCategory
          ? "Không thể cập nhật danh mục"
          : "Không thể thêm danh mục"
      );
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await adminCategoryService.deleteCategory(categoryId);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      toast.error("Không thể xóa danh mục");
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: "",
      description: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
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
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 py-8 shadow-lg">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            🚚 Quản lý danh mục của hệ thống
          </h1>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="flex justify-end gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
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
          <span>Thêm danh mục</span>
        </button>
      </div>
      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          {" "}
          {/* Thêm scroll nếu cần */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
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
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="min-w-[80px] px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(category.id.toString())}
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
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
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
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Nhập mô tả danh mục"
                />
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
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
