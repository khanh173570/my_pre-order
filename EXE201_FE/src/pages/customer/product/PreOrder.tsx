import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PreOrderProduct } from "../../../types";
import { fetchPreOrders } from "../../../services/preorder";
import Pagination from "../../../components/Pagination";
import { PageTransition } from "../../../components/PageTransition";

const ITEMS_PER_PAGE = 10; // Display 8 products per page (2 rows of 4 products)

interface TimerState {
  [key: string]: { hours: number; minutes: number; seconds: number };
}

const PreOrder: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pre-order");
  const [products, setProducts] = useState<PreOrderProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingTimes, setRemainingTimes] = useState<TimerState>({});
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch pre-order products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPreOrders();
        setProducts(data);
        // Initialize countdown timers for each product
        const initialTimers = data.reduce<TimerState>((acc, product) => {
          if (product.id && product.deadline) {
            acc[product.id] = product.deadline;
          }
          return acc;
        }, {});
        setRemainingTimes(initialTimers);
      } catch (error) {
        console.error("Error loading pre-order products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Fetch product images for gallery
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await fetch("/data/products.json");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          // Get 5 random products for the gallery
          const shuffled = [...data.products].sort(() => 0.5 - Math.random());
          const selectedProducts = shuffled.slice(0, 5);
          const images = selectedProducts.map((product) => product.image);
          setGalleryImages(images);
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };
    fetchProductImages();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);
  // Update countdown timers
  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      setRemainingTimes((prev: TimerState) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id: string) => {
          const currentTimer = updated[id];
          if (!currentTimer) return;

          let { hours, minutes, seconds } = currentTimer;

          seconds -= 1;
          if (seconds < 0) {
            seconds = 59;
            minutes -= 1;
          }
          if (minutes < 0) {
            minutes = 59;
            hours -= 1;
          }
          if (hours < 0) {
            // Reset to product's original deadline
            const product = products.find((p: PreOrderProduct) => p.id === id);
            if (product && product.deadline) {
              hours = product.deadline.hours;
              minutes = product.deadline.minutes;
              seconds = product.deadline.seconds;
            }
          }

          updated[id] = { hours, minutes, seconds };
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleViewDetail = (productId: string) => {
    navigate(`/pre-order/${productId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Đang tải sản phẩm pre-order...
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20">
        {/* Tab Navigation */}
        <h1 className="text-center py-8 font-bold text-4xl italic drop-shadow-lg">
          Chương trình Preorder bất đầu từ ngày 11/6/2025 đến hết ngày 11/7/2025
        </h1>
        {/* Pre-order Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden product-card border-2 border-gray-400 flex flex-col"
            >
              <div
                className="w-full h-56 bg-gray-50 overflow-hidden cursor-pointer"
                onClick={() => handleViewDetail(product.id)}
              >
                {" "}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full transition-transform duration-300 hover:scale-105 hover:rotate-2"
                />
              </div>{" "}
              <div className="p-4">
                {" "}
                <h3 className="text-lg text-center font-semibold mb-2 transition-colors duration-300 hover:text-blue-700">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 text-sm transition-colors duration-300 hover:text-gray-800">
                  {product.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dự kiến ra mắt:</span>
                    <span className="font-medium">{product.releaseDate}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Số lượng đặt trước:</span>
                      <span className="font-medium">
                        {product.currentQuantity}/{product.targetQuantity}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          product.currentQuantity >= product.targetQuantity
                            ? "bg-green-500"
                            : "bg-blue-600"
                        }`}
                        style={{
                          width: `${
                            (product.currentQuantity / product.targetQuantity) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Countdown Timer */}
                  {remainingTimes[product.id] && (
                    <div className="flex justify-center space-x-2 my-2">
                      <div className="bg-blue-900 text-white rounded px-3 py-2 text-sm transition-all duration-300 hover:bg-blue-800">
                        {String(remainingTimes[product.id].hours).padStart(
                          2,
                          "0"
                        )}
                      </div>
                      <span className="text-blue-900 text-xl">:</span>
                      <div className="bg-blue-900 text-white rounded px-3 py-2 text-sm transition-all duration-300 hover:bg-blue-800">
                        {String(remainingTimes[product.id].minutes).padStart(
                          2,
                          "0"
                        )}
                      </div>
                      <span className="text-blue-900 text-xl">:</span>
                      <div className="bg-blue-900 text-white rounded px-3 py-2 text-sm transition-all duration-300 hover:bg-blue-800">
                        {String(remainingTimes[product.id].seconds).padStart(
                          2,
                          "0"
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(product.id);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <span>XEM CHI TIẾT</span>
                  </button>
                </div>
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
        )}{" "}
        {/* Product Gallery Section */}
        <div className="mt-16 mb-8">
          <h1 className="text-2xl font-bold text-center text-white mb-8">
            Hình ảnh sản phẩm thực tế khi nhận hàng
          </h1>

          {galleryImages.length >= 5 && (
            <div className="grid grid-cols-4 gap-4">
              {/* Left column images */}
              <div className="grid grid-rows-2 gap-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
                  <img
                    src={galleryImages[0]}
                    alt="Gundam thực tế"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
                  <img
                    src={galleryImages[1]}
                    alt="Gundam thực tế"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Center large image */}
              <div className="col-span-2 bg-gray-100 rounded-lg overflow-hidden h-full flex items-center">
                <img
                  src={galleryImages[2]}
                  alt="Gundam thực tế"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Right column images */}
              <div className="grid grid-rows-2 gap-4">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
                  <img
                    src={galleryImages[3]}
                    alt="Gundam thực tế"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
                  <img
                    src={galleryImages[4]}
                    alt="Gundam thực tế"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PreOrder;
