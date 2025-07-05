import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../../types";
import {
  fetchProductById,
  fetchBrands,
  fetchCategories,
} from "../../../services/product.service";
import { useCart } from "../../../hooks/useCart";
import { toast } from "react-toastify";
import ImageGallery from "../../../components/ImageGallery";
import { PageTransition } from "../../../components/PageTransition";
import { Brand, Category } from "../../../types";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Get category and brand names
  const categoryName = product?.categoryId
    ? categories.find((cat) => cat.id === product.categoryId)?.categoryName
    : "Chưa phân loại";

  const brandName = product?.brandId
    ? brands.find((brand) => brand.id === product.brandId)?.name
    : "Chưa phân loại";
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        navigate("/products");
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Loading product with ID: ${id}`);

        // Load product, categories, and brands in parallel
        const [productData, categoriesData, brandsData] = await Promise.all([
          fetchProductById(id),
          fetchCategories(),
          fetchBrands(),
        ]);

        console.log("Received product data:", productData);
        console.log("Categories:", categoriesData);
        console.log("Brands:", brandsData);

        if (productData) {
          setProduct(productData);
          setCategories(categoriesData);
          setBrands(brandsData);
        } else {
          console.error("Product data is null or undefined");
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

    loadData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    // Create a product object that satisfies the Product interface requirements
    const productForCart: Product = {
      id: product.id,
      productCode: product.productCode || "",
      productName: product.productName || "",
      description: product.description || "",
      categoryId: product.categoryId || 0,
      brandId: product.brandId || null,
      type: product.type || "",
      size: product.size || "",
      stockQuantity: product.stockQuantity || 0,
      productDetails: product.productDetails || "",
      price: product.price,
      openedAt: product.openedAt,
      isPreOrder: product.isPreOrder || false,
      version: product.version || 0,
      isActive: product.isActive || true,
      createdAt: product.createdAt || Date.now(),
      updatedAt: product.updatedAt || Date.now(),
      productAssets: product.productAssets || [],

      // Backward compatibility fields
      name: product.productName || "",
      image: product.productAssets?.[0]?.imageUrl || "/images/product.webp",
      images: product.productAssets?.map((asset) => asset.imageUrl) || [
        "/images/product.webp",
      ],
      quantity: product.stockQuantity || 0,
    };

    addToCart(productForCart, quantity);
    toast.success(
      `Đã thêm ${quantity} ${product.productName || product.name} vào giỏ hàng`
    );
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stockQuantity || 0)) {
      setQuantity(value);
    }
  };

  const getStockStatusDisplay = () => {
    if (!product)
      return { text: "Không có thông tin", className: "text-gray-600" };

    const stock = product.stockQuantity || 0;

    if (stock > 10) {
      return { text: `Còn hàng (${stock})`, className: "text-green-600" };
    } else if (stock > 0) {
      return {
        text: `Sắp hết hàng (còn ${stock})`,
        className: "text-orange-500",
      };
    } else {
      return { text: "Hết hàng", className: "text-red-600" };
    }
  };

  const stockStatus = getStockStatusDisplay();

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
            onClick={() => navigate("/product-all")}
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
              {" "}
              <button
                onClick={() => navigate("/products")}
                className="hover:text-blue-600"
              >
                Sản phẩm
              </button>
            </li>
            {categoryName && (
              <>
                <li>/</li>
                <li className="hover:text-blue-600">{categoryName}</li>
              </>
            )}
            <li>/</li>
            <li className="text-blue-600 font-medium">
              {product.productName || product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ImageGallery
              images={
                product.images ||
                product.productAssets?.map((asset) => asset.imageUrl) || [
                  product.image || "/images/product.webp",
                ]
              }
              productName={product.productName || product.name || "Sản phẩm"}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productName || product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {product.price.toLocaleString("vi-VN")} VND
                </span>
              </div>

              {/* Stock status */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-600">Tình trạng:</span>
                <span className={`font-medium ${stockStatus.className}`}>
                  {stockStatus.text}
                </span>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="ml-2 font-medium">{categoryName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="ml-2 font-medium">{brandName}</span>
                </div>
              </div>

              {/* Product code */}
              {product.productCode && (
                <div className="mb-4">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="ml-2 font-medium">
                    {product.productCode}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            {(product.stockQuantity || 0) > 0 && (
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
                      max={product.stockQuantity || 0}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-20 h-10 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stockQuantity || 0)}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>{" "}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={() => navigate("/product-all")}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium transition-all duration-300"
                  >
                    Quay lại danh sách sản phẩm
                  </button>
                </div>
              </div>
            )}

            {/* Out of stock */}
            {(product.stockQuantity || 0) === 0 && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 font-medium">
                    Sản phẩm hiện tại đã hết hàng
                  </p>
                </div>
                <button
                  onClick={() => navigate("/product-all")}
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
              {product.type && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Loại sản phẩm
                  </h4>
                  <p className="text-gray-700">{product.type}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Kích thước</h4>
                  <p className="text-gray-700">{product.size}</p>
                </div>
              )}
              {product.productDetails && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Chi tiết sản phẩm
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.productDetails}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Số lượng ảnh</h4>
                <p className="text-gray-700">
                  {(product.productAssets?.length ||
                    product.images?.length ||
                    1) + " ảnh"}
                </p>
              </div>
              {product.isPreOrder && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Loại đặt hàng
                  </h4>
                  <p className="font-semibold text-blue-600">Pre-Order</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
