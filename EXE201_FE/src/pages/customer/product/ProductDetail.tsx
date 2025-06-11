import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../../types/product";
import { fetchProductById } from "../../../services/product.service";
import { useCart } from "../../../hooks/useCart";
import { toast } from "react-toastify";
import ImageGallery from "../../../components/ImageGallery";
import { PageTransition } from "../../../components/PageTransition";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/products");
        return;
      }

      setIsLoading(true);
      try {
        const productData = await fetchProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          toast.error("Không tìm thấy sản phẩm");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Lỗi khi tải thông tin sản phẩm");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      image: product.image,
      images: product.images,
      quantity: quantity,
    };

    addToCart(cartItem, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Đang tải thông tin sản phẩm...
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-blue-600"
              >
                Trang chủ
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => navigate("/products")}
                className="hover:text-blue-600"
              >
                Sản phẩm
              </button>
            </li>
            <li>/</li>
            <li className="text-blue-600 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ImageGallery
              images={product.images || [product.image]}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")} VND
                  </span>
                )}
                <span className="text-3xl font-bold text-blue-600">
                  {product.price.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-600">Tình trạng:</span>
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `Còn ${product.stock} sản phẩm`
                    : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-20 h-10 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium transition-all duration-300"
                  >
                    Quay lại danh sách sản phẩm
                  </button>
                </div>
              </div>
            )}

            {/* Out of stock */}
            {product.stock === 0 && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 font-medium">
                    Sản phẩm hiện tại đã hết hàng
                  </p>
                </div>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium transition-all duration-300"
                >
                  Quay lại danh sách sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin chi tiết
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Danh mục</h4>
                <p className="text-gray-700">
                  {product.category?.name || "Chưa phân loại"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Số lượng ảnh</h4>
                <p className="text-gray-700">
                  {product.images?.length || 1} ảnh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
