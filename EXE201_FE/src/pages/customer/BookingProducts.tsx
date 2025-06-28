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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải dữ liệu danh mục");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load all products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProductsResponse = await productService.getAllProducts(
          1,
          9999
        );
        console.log(
          "Total products from API:",
          allProductsResponse.data.length
        );
        setAllProducts(allProductsResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and paginate products when category or page changes
  useEffect(() => {
    // Filter products based on category and availability
    let filtered: Product[] = [];

    if (selectedCategory === "all") {
      filtered = allProducts.filter(
        (p) => !p.isPreOrder && p.stockQuantity > 0 && p.isActive === true
      );
    } else {
      filtered = allProducts.filter(
        (p) =>
          p.categoryId === parseInt(selectedCategory) &&
          !p.isPreOrder &&
          p.stockQuantity > 0 &&
          p.isActive === true
      );
    }

    console.log("Total filtered products:", filtered.length);
    setTotalProducts(filtered.length);
    setFilteredProducts(filtered);

    // Apply pagination
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedProducts = filtered.slice(start, end);
    console.log("Products on current page:", paginatedProducts.length);
    setDisplayedProducts(paginatedProducts);
  }, [allProducts, selectedCategory, currentPage]);

  // Convert Product to UIProduct for ProductCard
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
      isPreOrder: product.isPreOrder || false,
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
        <div className="mb-8 mt-12 px-4">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-center relative overflow-hidden">
            <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">
              🎯 Sản phẩm có sẵn - Booking
            </h1>
            <p className="text-white text-sm opacity-90">
              Đặt trước ngay hôm nay để sở hữu những mẫu hot nhất!
            </p>
            {/* Decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-20 rounded-bl-xl rounded-br-xl"></div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label
            htmlFor="categorySelect"
            className="block text-sm font-medium text-gray-700"
          >
            Chọn danh mục
          </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="mt-1 block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Không có sản phẩm nào trong danh mục này
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {displayedProducts.map((product) => (
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
