import React, { useState, useEffect } from "react";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { fetchProducts, fetchCategories } from "../services/product.service";

// Frontend product type that extends backend Product type
interface UIProduct extends Product {
  id: string;
  quantity: number;
  originalPrice?: number;
}

const ITEMS_PER_PAGE = 8;

const Products: React.FC = () => {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeView, setActiveView] = useState<"all" | "category">("all");
  const { addToCart } = useCart();

  // Load both categories and products
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]); // Transform products to match our frontend model
        const adaptedProducts = productsData.map((p) => ({
          ...p,
          id: p._id,
          quantity: p.stock,
          originalPrice: p.originalPrice, // Use original price from database
        }));

        setCategories(categoriesData);
        setProducts(adaptedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      }
    };

    loadData();
  }, []);

  // Separate states for pagination of each section
  const [allProductsPage, setAllProductsPage] = useState(1);
  const [categoryProductsPage, setCategoryProductsPage] = useState(1);

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

  const renderProductCard = (product: UIProduct) => (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-md overflow-hidden product-card border-2 border-gray-400 flex flex-col"
    >
      <div className="w-full h-56 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 hover:rotate-2"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg text-center font-semibold mb-2 transition-colors duration-300 hover:text-blue-700">
          {product.name}
        </h3>
        <div className="flex flex-col items-center mb-2">
          <span className="text-sm font-bold text-blue-900">Giá bán lẻ:</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through">
              {product.originalPrice.toLocaleString("vi-VN")} VNDs
            </span>
          )}
          <span className="text-blue-900 text-xl font-semibold transition-all duration-300 hover:text-red-600 hover:scale-110">
            {product.price.toLocaleString("vi-VN")} VND
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Còn lại: {product.quantity} sản phẩm
          </span>
          {product.quantity < 10 && (
            <span className="text-sm text-red-500 font-medium animate-pulse">
              Sắp hết hàng!
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={(e) => handleAddToCart(product, e)}
          className={`w-full py-2 rounded-md transition-all duration-300 ${
            product.quantity > 0
              ? "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={product.quantity === 0}
        >
          {product.quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
        </button>
      </div>
    </div>
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

  const handleAddToCart = (
    product: UIProduct,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = e.currentTarget;
    const card = button.closest(".product-card");
    const img = card?.querySelector("img");

    if (img) {
      const imgClone = img.cloneNode(true) as HTMLImageElement;
      const imgRect = img.getBoundingClientRect();
      const cartIcon = document.querySelector(".cart-icon");

      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();

        imgClone.style.cssText = `
          position: fixed;
          top: ${imgRect.top}px;
          left: ${imgRect.left}px;
          width: ${imgRect.width}px;
          height: ${imgRect.height}px;
          z-index: 1000;
          pointer-events: none;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        `;
        document.body.appendChild(imgClone);

        // Animation
        requestAnimationFrame(() => {
          imgClone.style.cssText = `
            position: fixed;
            top: ${cartRect.top}px;
            left: ${cartRect.left}px;
            width: 30px;
            height: 30px;
            z-index: 1000;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(0.5);
            opacity: 0;
          `;
        });

        // Add to cart
        setTimeout(() => {
          imgClone.remove();
          addToCart(product);
          toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        }, 800);
      }
    }
  };

  return (
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
        </button>
        <button
          onClick={() => setActiveView("category")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      )}

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
        </div>
      )}
    </div>
  );
};

export default Products;
