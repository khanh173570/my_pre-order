import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Ensure we have valid images
  const safeImages =
    !images || images.length === 0 ? ["/images/product.webp"] : images;

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const handleToggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setZoom(1); // Reset zoom when toggling fullscreen
  };

  const handleZoomIn = () => {
    if (zoom < 3) setZoom((prev) => prev + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom((prev) => prev - 0.5);
  };

  return (
    <>
      <div className="w-full">
        {/* Main Image */}
        <div
          className="w-full h-96 bg-gray-50 overflow-hidden cursor-pointer mb-4 relative rounded-lg"
          onClick={handleToggleFullscreen}
        >
          <img
            src={safeImages[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className="w-full h-full object-contain transition-transform duration-300"
          />

          {/* Navigation arrows */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Zoom icon indicator */}
          <div className="absolute top-2 right-2 bg-white/70 rounded-full p-2">
            <ZoomIn size={20} className="text-gray-700" />
          </div>
        </div>

        {/* Thumbnail Images */}
        {safeImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {safeImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
                  selectedImage === index
                    ? "border-blue-500 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {safeImages.length > 1 && (
          <div className="text-center mt-2 text-sm text-gray-500">
            {selectedImage + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          {/* Top controls */}
          <div className="p-4 flex justify-between">
            <div className="text-white text-lg">
              {productName} - {selectedImage + 1} / {safeImages.length}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleZoomOut}
                className="text-white hover:text-blue-300 disabled:opacity-50"
                disabled={zoom <= 1}
              >
                <ZoomOut size={24} />
              </button>
              <button
                onClick={handleZoomIn}
                className="text-white hover:text-blue-300 disabled:opacity-50"
                disabled={zoom >= 3}
              >
                <ZoomIn size={24} />
              </button>
              <button
                onClick={handleToggleFullscreen}
                className="text-white hover:text-blue-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center relative overflow-auto">
            <img
              src={safeImages[selectedImage]}
              alt={`${productName} - Enlarged Image`}
              className="max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />

            {/* Navigation arrows */}
            {safeImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3"
                >
                  <ChevronLeft size={32} className="text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3"
                >
                  <ChevronRight size={32} className="text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="p-4">
            <div className="flex justify-center space-x-2 overflow-x-auto">
              {safeImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
