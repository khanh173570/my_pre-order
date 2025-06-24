import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Product, productService } from "../../services/product.service";
import { Category, categoryService } from "../../services/category.service";
import ProductCard from "../../components/ProductCard";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const BookingProducts: React.FC = () => {
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

        // Log how many products have stock > 0
        const inStockProducts = allProductsResponse.data.filter(
          (p) => p.stockQuantity > 0
        );
        console.log("Products with stock > 0:", inStockProducts.length);

        // Log how many products are not pre-order
        const nonPreOrderProducts = allProductsResponse.data.filter(
          (p) => !p.isPreOrder
        );
        console.log("Non-PreOrder products:", nonPreOrderProducts.length);

        // Log how many products match our criteria (non-preorder AND in stock)
        const availableProducts = allProductsResponse.data.filter(
          (p) => !p.isPreOrder && p.stockQuantity > 0
        );
        console.log(
          "Available products (non-preorder + in stock):",
          availableProducts.length
        );

        // Get all available products first (without pagination)
        let filteredProducts = [];

        if (selectedCategory === "all") {
          // Get all available products (not pre-order and in stock)
          filteredProducts = allProductsResponse.data.filter(
            (p) => !p.isPreOrder && p.stockQuantity > 0
          );
        } else {
          // Filter by category first, then by availability
          filteredProducts = allProductsResponse.data.filter(
            (p) =>
              p.categoryId === parseInt(selectedCategory) &&
              !p.isPreOrder &&
              p.stockQuantity > 0
          );
        }

        // Set total for pagination calculation
        setTotalProducts(filteredProducts.length);
        console.log("Total filtered products:", filteredProducts.length);

        // Apply pagination manually
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedProducts = filteredProducts.slice(start, end);
        console.log("Products on current page:", paginatedProducts.length);

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

  // Convert Product to UIProduct for use with ProductCard component
  const convertToUIProduct = (product: Product) => {
    return {
      id: product.id.toString(),
      name: product.productName || "",
      price:
        product.discountedPrice > 0 ? product.discountedPrice : product.price,
      originalPrice: product.price,
      description: product.description || "",
      image:
        product.productAssets?.[0]?.imageUrl ||
        product.image ||
        "/images/product.webp",
      images: product.productAssets?.map((asset) => asset.imageUrl) || [
        "/images/product.webp",
      ],
      quantity: product.stockQuantity || 0,
      status:
        product.stockQuantity === 0
          ? ("out_of_stock" as const)
          : ("active" as const),
    };
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sản phẩm có sẵn - Booking
          </h1>
          <p className="text-lg text-gray-600">
            Các sản phẩm đang có sẵn trong kho, có thể đặt hàng ngay
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.id.toString()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Không có sản phẩm nào trong danh mục này
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <ProductCard
                    product={convertToUIProduct(product)}
                    onViewProduct={handleProductClick}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingProducts;
