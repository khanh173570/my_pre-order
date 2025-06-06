import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8; // Display 8 products per page (2 rows of 4 products)

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"deal" | "flash">("deal");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data/products.json");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          console.log("Fetched products:", data.products); // Debug log
          setProducts(data.products);
        } else {
          throw new Error("Invalid products data format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      }
    };

    fetchProducts();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log("Adding product to cart:", product); // Debug log
    const button = e.currentTarget;
    const card = button.closest(".product-card");
    const img = card?.querySelector("img");

    if (img) {
      // Tạo ảnh clone để làm hiệu ứng
      const imgClone = img.cloneNode(true) as HTMLImageElement;
      const imgRect = img.getBoundingClientRect();
      const cartIcon = document.querySelector(".cart-icon");

      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();

        // Style cho ảnh clone
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

        // Trigger animation
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

        // Thêm sản phẩm vào giỏ và hiển thị thông báo
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
      {/* Tabs */}
      <div className="flex justify-center mb-8 border-b">
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "deal"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("deal")}
        >
          Deal nổi bật
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "flash"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("flash")}
        >
          Flash sale 24h
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden product-card border-2 border-gray-400 flex flex-col"
          >
            <div className="w-full h-56 bg-gray-50 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                // className="w-full h-full object-contain transition-transform duration-300 hover:rotate-3"
                className="w-full h-full  transition-transform duration-300 hover:scale-105 hover:rotate-2"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg text-center font-semibold mb-2 transition-colors duration-300 hover:text-blue-700">
                {product.name}
              </h3>
              <div className="flex flex-col items-center mb-2">
                <span className="text-sm font-bold text-blue-900">
                  Giá bán lẻ khi có hàng sẵn:
                </span>
                {product.originalPrice && (
                  <span className=" text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")} VND
                  </span>
                )}
                <span className="text-blue-900 text-xl font-semibold transition-all duration-300 hover:text-red-600 hover:scale-110">
                  {product.price.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-800 hover:font-medium">
                  Còn lại: {product.quantity} sản phẩm
                </span>
                {product.quantity < 5 && (
                  <span className="text-sm text-red-500 font-medium transition-all duration-300 hover:text-red-700 hover:font-bold hover:animate-pulse">
                    Sắp hết hàng!
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4 transition-colors duration-300 hover:text-gray-800">
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
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Products;
