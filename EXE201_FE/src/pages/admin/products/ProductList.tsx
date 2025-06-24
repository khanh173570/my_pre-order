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
import { brandService, Brand } from "../../../services/brand.service";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 7;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    productCode: "",
    productName: "",
    description: "",
    categoryId: 0,
    brandId: undefined,
    type: "",
    size: "",
    stockQuantity: 0,
    productDetails: "",
    price: 0,
    discount: 0,
    isPreOrder: false,
  });

  const fetchProducts = async (page: number = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      }

      const response = await productService.getAllProducts(
        page,
        ITEMS_PER_PAGE
      );
      setProducts(response.data);

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      } else {
        const calculatedTotalPages = Math.ceil(
          response.data.length / ITEMS_PER_PAGE
        );
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error("Error fetching products:", error);
    } finally {
      if (page === 1) {
        setIsLoading(false);
      }
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAllBrands();
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.description ||
      formData.categoryId === 0
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    try {
      if (editingProduct) {
        const updateData: UpdateProductRequest = {
          ...formData,
          id: editingProduct.id,
        };
        await productService.updateProduct(
          editingProduct.id.toString(),
          updateData
        );
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(formData);
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

  const handleToggleStatus = async (productId: number) => {
    try {
      await productService.toggleProductStatus(productId.toString());
      toast.success("Cập nhật trạng thái sản phẩm thành công");
      fetchProducts(currentPage);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái sản phẩm");
      console.error("Error toggling product status:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await productService.deleteProduct(productId.toString());
      toast.success("Xóa sản phẩm thành công");
      fetchProducts(currentPage);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
      console.error("Error deleting product:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      productCode: "",
      productName: "",
      description: "",
      categoryId: 0,
      brandId: undefined,
      type: "",
      size: "",
      stockQuantity: 0,
      productDetails: "",
      price: 0,
      discount: 0,
      isPreOrder: false,
    });
    setEditingProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productCode: product.productCode,
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId || undefined,
      type: product.type,
      size: product.size,
      stockQuantity: product.stockQuantity,
      productDetails: product.productDetails,
      price: product.price,
      discount: product.discount,
      isPreOrder: product.isPreOrder,
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-2">
            Danh sách tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>{" "}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thương hiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá sau giảm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-md object-cover"
                      src={
                        product.productAssets?.[0]?.imageUrl ||
                        "/images/product.webp"
                      }
                      alt={product.productName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/product.webp";
                      }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {product.productName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>{" "}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {categories.find((cat) => cat.id === product.categoryId)
                    ?.categoryName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {brands.find((brand) => brand.id === product.brandId)?.name ||
                    "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.discountedPrice !== product.price
                    ? `${product.discountedPrice.toLocaleString("vi-VN")} ₫`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stockQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isPreOrder
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {product.isPreOrder ? "Pre-order" : "Booking"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="min-w-[80px] px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product.id)}
                      className={`min-w-[110px] px-3 py-1 rounded ${
                        product.isActive
                          ? "bg-yellow-100 text-yellow-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {product.isActive ? "Tạm dừng" : "Kích hoạt"}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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

        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={(e) =>
                      setFormData({ ...formData, productCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>{" "}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu
                  </label>
                  <select
                    value={formData.brandId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandId: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn kho *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi tiết sản phẩm
                </label>
                <textarea
                  value={formData.productDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, productDetails: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPreOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, isPreOrder: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Sản phẩm Pre-order
                  </span>
                </label>
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
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
