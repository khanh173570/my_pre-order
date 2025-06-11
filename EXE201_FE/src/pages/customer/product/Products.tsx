import React, { useState } from "react";
import { Product } from "../../../types/product";
import { useProducts } from "../../../hooks/useProducts";
import Pagination from "../../../components/Pagination";
import { PageTransition } from "../../../components/PageTransition";
import ProductCard from "../../../components/ProductCard";
import { useNavigate } from "react-router-dom";

// Frontend product type that extends backend Product type
interface UIProduct extends Product {
  id: string;
  quantity: number;
  originalPrice?: number;
}

const ITEMS_PER_PAGE = 10;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products: contextProducts, categories: contextCategories } =
    useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeView, setActiveView] = useState<"all" | "category">("all");

  // Separate states for pagination of each section
  const [allProductsPage, setAllProductsPage] = useState(1);
  const [categoryProductsPage, setCategoryProductsPage] = useState(1);
  // Transform products to match our frontend model
  const products: UIProduct[] = contextProducts.map((p) => ({
    ...p,
    id: p._id,
    quantity: p.stock,
    originalPrice: p.originalPrice, // Use original price from database
  }));

  const categories = contextCategories;

  // Calculate pagination for all products section
  const allProductsTotalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const allProductsStartIndex = (allProductsPage - 1) * ITEMS_PER_PAGE;
  const allProductsEndIndex = allProductsStartIndex + ITEMS_PER_PAGE;
  const currentAllProducts = products.slice(
    allProductsStartIndex,
    allProductsEndIndex
  );

  // Calculate pagination for category filtered products
  const filteredProducts = products.filter(
    (p) => p.category._id === selectedCategory
  );
  const categoryTotalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );
  const categoryStartIndex = (categoryProductsPage - 1) * ITEMS_PER_PAGE;
  const categoryEndIndex = categoryStartIndex + ITEMS_PER_PAGE;
  const currentCategoryProducts = filteredProducts.slice(
    categoryStartIndex,
    categoryEndIndex
  );
  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const renderProductCard = (product: UIProduct) => (
    <ProductCard
      key={product.id}
      product={product}
      onViewProduct={handleViewProduct}
    />
  );

  // Handle page change
  const handleAllProductsPageChange = (page: number) => {
    setAllProductsPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryProductsPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Loading state - chỉ hiển thị khi thực sự đang loading và chưa có dữ liệu
  if (contextProducts.length === 0) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center items-center mb-8 mt-8 border-b border-gray-200 text-center">
          <button
            onClick={() => setActiveView("all")}
            className={`px-4 py-2 font-semibold text-lg transition-all duration-200 border-b-2 ${
              activeView === "all"
                ? "text-blue-900 border-blue-900"
                : "text-gray-500 border-transparent hover:text-blue-700 hover:border-blue-700"
            }`}
          >
            Sản phẩm đang bán
          </button>{" "}
          <button
            onClick={() => {
              setActiveView("category");
              // Tự động chọn danh mục đầu tiên khi chuyển sang category view
              if (selectedCategory === "all" && categories.length > 0) {
                setSelectedCategory(categories[0]._id);
                setCategoryProductsPage(1);
              }
            }}
            className={`px-4 py-2 font-semibold text-lg transition-all duration-200 border-b-2 ${
              activeView === "category"
                ? "text-blue-900 border-blue-900"
                : "text-gray-500 border-transparent hover:text-blue-700 hover:border-blue-700"
            }`}
          >
            Lựa chọn theo danh mục
          </button>
        </div>
        {/* All Products View */}
        {activeView === "all" && (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {currentAllProducts.map(renderProductCard)}
            </div>
            {allProductsTotalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={allProductsPage}
                  totalPages={allProductsTotalPages}
                  onPageChange={handleAllProductsPageChange}
                />
              </div>
            )}
          </div>
        )}{" "}
        {/* Category View */}
        {activeView === "category" && (
          <div className="w-full">
            <div className="mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCategoryProductsPage(1);
                }}
                className="w-full max-w-xs px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white shadow-sm text-gray-700 cursor-pointer hover:border-blue-400 transition-colors duration-200"
              >
                <option value="all">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory !== "all" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentCategoryProducts.map(renderProductCard)}
                </div>
                {categoryTotalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={categoryProductsPage}
                      totalPages={categoryTotalPages}
                      onPageChange={handleCategoryPageChange}
                    />
                  </div>
                )}
              </>
            )}

            {selectedCategory === "all" && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Vui lòng chọn một danh mục để xem sản phẩm
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Products;
