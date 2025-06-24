import React, { useState, useEffect } from "react";
import { Product } from "../../services/product.service";
import { Category } from "../../services/category.service";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { orderService } from "../../services/order.service";
import { useAuth } from "../../hooks/useAuth";

const ITEMS_PER_PAGE = 8;

const PreOrderProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

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
          productsData = await productService.getPreOrderProducts(
            currentPage,
            ITEMS_PER_PAGE
          );
        } else {
          // Get products by category first, then filter for pre-order
          const categoryProducts = await productService.getProductsByCategory(
            parseInt(selectedCategory),
            currentPage,
            ITEMS_PER_PAGE
          );
          productsData = {
            ...categoryProducts,
            data: categoryProducts.data.filter((p) => p.isPreOrder),
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
  const handlePreOrder = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đặt pre-order");
      return;
    }

    try {
      const preOrderData = {
        shippingFee: 50000, // Default shipping fee
        items: [
          {
            productId: product.id,
            productName: product.productName,
            price:
              product.discountedPrice > 0
                ? product.discountedPrice
                : product.price,
            quantity: 1,
          },
        ],
      };

      const response = await orderService.createPreOrder(preOrderData);

      if (response.succeeded) {
        // Calculate deposit amount (30% of total)
        const depositAmount = response.data.depositPrice;

        // Create payment URL for deposit
        const paymentResponse = await orderService.createPaymentUrl(
          depositAmount,
          `Deposit for pre-order ${product.productName}`,
          response.data.tempOrderId,
          "VNPAYQR"
        );

        // Redirect to payment
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error(response.message || "Không thể tạo pre-order");
      }
    } catch (error) {
      console.error("Error creating pre-order:", error);
      toast.error("Không thể tạo pre-order");
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
                <div className="relative">
                  <img
                    src={product.image || "/images/product.webp"}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      PRE-ORDER
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    {product.discountedPrice > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.discountedPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>Size: {product.size}</div>
                    <div>Type: {product.type}</div>
                    <div>Stock: {product.stockQuantity}</div>
                  </div>

                  <button
                    onClick={() => handlePreOrder(product)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Đặt Pre-Order
                  </button>
                </div>
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
