import React, { useState, useEffect } from "react";
import {
  brandService,
  Brand,
  CreateBrandData,
  UpdateBrandData,
} from "../../../services/brand.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BrandList: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandData>({
    name: "",
    description: "",
  });
  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await brandService.getAllBrands();
      setBrands(response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách thương hiệu");
      console.error("Error fetching brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBrand) {
        const updateData: UpdateBrandData = {
          ...formData,
          id: editingBrand.id,
        };
        const response = await brandService.updateBrand(updateData);

        if (response.succeeded) {
          toast.success("Cập nhật thương hiệu thành công");
        } else {
          throw new Error(response.message);
        }
      } else {
        const response = await brandService.createBrand(formData);

        if (response.succeeded) {
          toast.success("Thêm thương hiệu thành công");
        } else {
          throw new Error(response.message);
        }
      }

      setShowModal(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : editingBrand
          ? "Không thể cập nhật thương hiệu"
          : "Không thể thêm thương hiệu";
      toast.error(errorMessage);
      console.error("Error saving brand:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingBrand(null);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (brandId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await brandService.deleteBrand(parseInt(brandId));

      if (response.succeeded) {
        toast.success("Xóa thương hiệu thành công");
        fetchBrands();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể xóa thương hiệu";
      toast.error(errorMessage);
      console.error("Error deleting brand:", error);
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
            Quản lý thương hiệu
          </h1>
          <p className="text-gray-600 mt-2">
            Danh sách tất cả thương hiệu trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Thêm thương hiệu
        </button>
      </div>

      {/* Brand Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thương hiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {brand.id}
                </td>{" "}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {brand.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {brand.description || "Không có mô tả"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="min-w-[80px] px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id.toString())}
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

        {brands.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có thương hiệu nào</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thương hiệu *
                </label>{" "}
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  {editingBrand ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
