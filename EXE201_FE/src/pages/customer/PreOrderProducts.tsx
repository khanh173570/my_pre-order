import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import { productService, Product } from "../../services/product.service";
import { categoryService, Category } from "../../services/category.service";

const ITEMS_PER_PAGE = 8;

const PreOrderProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories and products
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData] = await Promise.all([
          categoryService.getAllCategories(),
        ]);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải dữ liệu danh mục");
      }
    };

    loadData();
  }, []);

  // Load products when page or category changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);

        // First get ALL products to see what's available
        const allProductsResponse = await productService.getAllProducts(1, 99);
        console.log(
          "Total products from API:",
          allProductsResponse.data.length
        );

        // Get all pre-order products first (without pagination)
        let filteredProducts = [];

        if (selectedCategory === "all") {
          // Get all pre-order products
          filteredProducts = allProductsResponse.data.filter(
            (p) => p.isPreOrder
          );
          console.log("All pre-order products:", filteredProducts.length);
        } else {
          // Filter by category first, then by pre-order status
          filteredProducts = allProductsResponse.data.filter(
            (p) => p.categoryId === parseInt(selectedCategory) && p.isPreOrder
          );
          console.log(
            "Pre-order products in category:",
            filteredProducts.length
          );
        }

        // Set total for pagination calculation
        setTotalProducts(filteredProducts.length);

        // Apply pagination manually
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedProducts = filteredProducts.slice(start, end);
        console.log(
          "Pre-order products on current page:",
          paginatedProducts.length
        );

        setProducts(paginatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm Pre-Order
          </h1>
          <p className="text-xl text-gray-600">
            Đặt trước những sản phẩm mới nhất với giá ưu đãi
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id.toString());
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category.id.toString()
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không có sản phẩm pre-order
            </h3>
            <p className="text-gray-500">
              Hiện tại không có sản phẩm pre-order nào trong danh mục này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ProductCard
                  product={{
                    id: product.id.toString(),
                    name: product.productName || "",
                    price:
                      product.discountedPrice > 0
                        ? product.discountedPrice
                        : product.price,
                    originalPrice: product.price,
                    description: product.description || "",
                    image:
                      product.productAssets?.[0]?.imageUrl ||
                      product.image ||
                      "/images/product.webp",
                    images: product.productAssets?.map(
                      (asset) => asset.imageUrl
                    ) || ["/images/product.webp"],
                    quantity: product.stockQuantity || 0,
                    status: "active" as const,
                    isPreOrder: true,
                  }}
                  onViewProduct={(id) => navigate(`/product/${id}`)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreOrderProducts;
