import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    images?: string[];
    quantity: number;
    status?: "active" | "inactive" | "out_of_stock" | "discontinued";
    isPreOrder?: boolean;
  };
  onViewProduct?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
}) => {
  const navigate = useNavigate();

  // Helper function to check if a product is out of stock
  const isOutOfStock = () => {
    // Pre-order products are never considered out of stock
    if (product.isPreOrder) return false;
    return product.quantity === 0 || product.status === "out_of_stock";
  };

  const handleViewProduct = () => {
    console.log(`View product clicked for ID: ${product.id}`);
    if (onViewProduct) {
      onViewProduct(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      key={product.id}
      className="bg-white rounded-2xl shadow-xl overflow-hidden product-card border border-gray-200 flex flex-col transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Single Image Display */}
      <div
        className="w-full h-60 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden cursor-pointer relative transition-all duration-300"
        onClick={handleViewProduct}
      >
        <img
          src={product.images?.[0] || product.image || "/images/product.webp"}
          alt={product.name}
          className="w-full h-full  transition-transform duration-300 hover:scale-105"
        />
        {isOutOfStock() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg border-2 border-white uppercase text-lg tracking-widest animate-bounce">
              SOLD OUT
            </div>
          </div>
        )}
        {product.isPreOrder && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md tracking-wider animate-pulse">
              PRE-ORDER
            </span>
          </div>
        )}

        {/* Discount Badge - Large and Prominent */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 right-3 z-30">
            <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12 animate-bounce">
              <span className="text-lg font-black tracking-wider">
                -
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h1 className="text-base text-center font-bold mb-3 h-8 text-black transition-colors duration-300 truncate">
          {product.name}
        </h1>
        <div className="flex flex-col items-center mb-2">
          <span className="text-xs font-semibold text-blue-900 mb-1">
            Giá bán lẻ:
          </span>
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-lg line-through mb-1">
                {product.originalPrice.toLocaleString("vi-VN")} VND
              </span>
              <span className="text-red-600 text-xl font-bold transition-all duration-300 hover:text-red-700 hover:scale-110">
                {product.price.toLocaleString("vi-VN")} VND
              </span>
              {product.isPreOrder && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold mt-1">
                  Đã được đặt: {product.quantity}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-blue-900 text-xl font-bold transition-all duration-300 hover:text-red-600 hover:scale-110">
                {product.price.toLocaleString("vi-VN")} VND
              </span>
              {product.isPreOrder && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold mt-2">
                  Còn lại: {product.quantity}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="text-gray-600">
            {product.isPreOrder ? (
              <span className="font-semibold">Nhận đặt trước</span>
            ) : !isOutOfStock() ? (
              <>
                Còn lại:{" "}
                <span className="font-semibold text-green-700">
                  {product.quantity} sản phẩm
                </span>
              </>
            ) : (
              <span className="text-red-600 font-semibold">Hết hàng</span>
            )}
          </span>
          {!product.isPreOrder && !isOutOfStock() && product.quantity <= 10 && (
            <span className="text-xs text-red-500 font-medium animate-pulse ml-2">
              Sắp hết hàng!
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 min-h-[24px]">
          {product.description}
        </p>
        <button
          onClick={handleViewProduct}
          className={`w-full py-2 px-4 rounded-lg font-semibold mt-auto transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            ${
              product.isPreOrder
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : isOutOfStock()
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          disabled={isOutOfStock()}
        >
          {product.isPreOrder
            ? "Đặt Pre-Order"
            : isOutOfStock()
            ? "Xem Chi Tiết (Hết Hàng)"
            : "Xem Chi Tiết"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
