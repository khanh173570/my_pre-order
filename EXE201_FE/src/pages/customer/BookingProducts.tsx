import React, { useState, useEffect } from "react";
import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { brandService } from "../../services/brand.service";

const ITEMS_PER_PAGE = 8;

const BookingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

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
        let productsData;

        if (selectedCategory === "all") {
          productsData = await productService.getBookingProducts(
            currentPage,
            ITEMS_PER_PAGE
          );
        } else {
          // Get products by category first, then filter for booking
          const categoryProducts = await productService.getProductsByCategory(
            parseInt(selectedCategory),
            currentPage,
            ITEMS_PER_PAGE
          );
          productsData = {
            ...categoryProducts,
            data: categoryProducts.data.filter((p) => !p.isPreOrder),
          };
        }

        setProducts(productsData.data);
        setTotalProducts(productsData.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        id: product.id.toString(),
        name: product.productName,
        price:
          product.discountedPrice > 0 ? product.discountedPrice : product.price,
        image: product.image || "/images/product.webp",
        quantity: 1,
        maxQuantity: product.stockQuantity,
      });
      toast.success(`Đã thêm ${product.productName} vào giỏ hàng`);
    } catch (error) {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-48 w-full object-cover object-center group-hover:opacity-75"
                      onError={(e) => {
                        e.currentTarget.src = "/images/product.webp";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.productName}
                    </h3>

                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Có sẵn
                      </span>
                      <span className="text-sm text-gray-500">
                        Còn: {product.stockQuantity}
                      </span>
                    </div>

                    <div className="mb-3">
                      {product.discount > 0 ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(product.discountedPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            -{product.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        product.stockQuantity === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {product.stockQuantity === 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ"}
                    </button>
                  </div>
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
