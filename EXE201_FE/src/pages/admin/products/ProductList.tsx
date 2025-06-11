import React, { useState, useEffect } from "react";
import {
  productService,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../../services/admin/product.service";
import {
  categoryService,
  Category,
} from "../../../services/admin/category.service";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 10;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    status: "active",
    category: "",
    stock: 0,
    images: [""],
  });
  // State for managing multiple image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const fetchProducts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await productService.getAllProducts(
        page,
        ITEMS_PER_PAGE
      );
      console.log("Response from productService:", response);
      console.log("Response pagination:", response.pagination);

      setProducts(response.data);
      if (response.pagination) {
        console.log("Setting totalPages to:", response.pagination.totalPages);
        setTotalPages(response.pagination.totalPages);
      } else {
        console.log("No pagination found in response, calculating manually");
        // If no pagination info, calculate from data length
        const calculatedTotalPages = Math.ceil(
          response.data.length / ITEMS_PER_PAGE
        );
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(1, 100);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty image URLs
    const validImages = imageUrls.filter((url) => url.trim() !== "");

    if (validImages.length === 0) {
      toast.error("Vui lòng thêm ít nhất một hình ảnh");
      return;
    }

    const submitData = { ...formData, images: validImages };

    try {
      if (editingProduct) {
        const updateData: UpdateProductRequest = { ...submitData };
        await productService.updateProduct(editingProduct._id, updateData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(submitData);
        toast.success("Thêm sản phẩm thành công");
      }

      setShowModal(false);
      resetForm();
      fetchProducts(currentPage);
    } catch (error) {
      toast.error(
        editingProduct
          ? "Không thể cập nhật sản phẩm"
          : "Không thể thêm sản phẩm"
      );
      console.error("Error saving product:", error);
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      await productService.toggleProductStatus(productId);
      toast.success("Cập nhật trạng thái sản phẩm thành công");
      fetchProducts(currentPage);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái sản phẩm");
      console.error("Error toggling product status:", error);
    }
  };
  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete._id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts(currentPage);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
      console.error("Error deleting product:", error);
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };
  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      status: "active",
      category: "",
      stock: 0,
      images: [""],
    });
    setImageUrls([""]);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      status: product.status || "active",
      category: product.category._id,
      stock: product.stock,
      images: product.images || [product.image || ""],
    });
    setImageUrls(product.images || [product.image || ""]);
    setShowModal(true);
  };

  // Handle multiple image URLs
  const addImageUrl = () => {
    const newUrls = [...imageUrls, ""];
    setImageUrls(newUrls);
    setFormData({ ...formData, images: newUrls });
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
      setFormData({ ...formData, images: newUrls });
    }
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData({ ...formData, images: newUrls });
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-2">
            Danh sách tất cả sản phẩm trong hệ thống
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
          <span>Thêm sản phẩm</span>
        </button>
      </div>
      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>{" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá gốc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/product.webp";
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category.name}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.originalPrice
                      ? `${product.originalPrice.toLocaleString("vi-VN")} ₫`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : product.status === "discontinued"
                          ? "bg-yellow-100 text-yellow-800"
                          : product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status === "active"
                        ? "Hoạt động"
                        : product.status === "inactive"
                        ? "Không hoạt động"
                        : product.status === "out_of_stock"
                        ? "Hết hàng"
                        : product.status === "discontinued"
                        ? "Ngừng kinh doanh"
                        : product.isActive
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">
                    {" "}
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {product.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{" "}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-700">
                  Trang <span className="font-medium">{currentPage}</span> của{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
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
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  />
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giá (₫)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giá gốc (₫)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "active"
                            | "inactive"
                            | "out_of_stock"
                            | "discontinued",
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="out_of_stock">Hết hàng</option>
                      <option value="discontinued">Ngừng kinh doanh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tồn kho
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>{" "}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL hình ảnh
                  </label>
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Thêm ảnh
                  </button>
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
                    {editingProduct ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>{" "}
          </div>
        </div>
      )}{" "}
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous={true}
      />
    </div>
  );
};

export default ProductList;
