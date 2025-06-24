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
      className="bg-white rounded-lg shadow-md overflow-hidden product-card border-2 border-gray-400 flex flex-col"
    >
      {/* Single Image Display */}
      <div
        className="w-full h-56 bg-gray-50 overflow-hidden cursor-pointer relative"
        onClick={handleViewProduct}
      >
        <img
          src={product.images?.[0] || product.image || "/images/product.webp"}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
        {isOutOfStock() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-red-600 text-white font-bold py-2 px-4 rounded-full transform rotate-12 shadow-lg border-2 border-white uppercase text-lg">
              SOLD OUT
            </div>
          </div>
        )}
        {product.isPreOrder && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              PRE-ORDER
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h1 className="text-lg text-center font-semibold mb-8 h-8 transition-colors duration-300 hover:text-blue-700">
          {product.name}
        </h1>
        <div className="flex flex-col items-center mb-2">
          <span className="text-sm font-bold text-blue-900">Giá bán lẻ:</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through">
              {product.originalPrice.toLocaleString("vi-VN")} VND
            </span>
          )}
          <span className="text-blue-900 text-2xl font-semibold transition-all duration-300 hover:text-red-600 hover:scale-110">
            {product.price.toLocaleString("vi-VN")} VND
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {product.isPreOrder ? (
              <span className="font-semibold text-sm">Nhận đặt trước</span>
            ) : !isOutOfStock() ? (
              <>
                Còn lại:{" "}
                <span className="font-semibold text-sm">
                  {product.quantity} sản phẩm
                </span>
              </>
            ) : (
              <span className="text-red-600 font-semibold">Hết hàng</span>
            )}
          </span>
          {!product.isPreOrder && !isOutOfStock() && product.quantity <= 10 && (
            <span className="text-sm text-red-500 font-medium animate-pulse">
              Sắp hết hàng!
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={handleViewProduct}
          className={`w-full py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
            product.isPreOrder
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : isOutOfStock()
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
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
