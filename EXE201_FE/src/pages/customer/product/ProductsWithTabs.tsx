import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
} from "../../../services/product.service";
import { Brand, Category, Product } from "../../../types";
import ProductCard from "../../../components/ProductCard";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination";

const ITEMS_PER_PAGE = 8;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Create UI versions of our types that match what ProductCard expects
interface UIProduct {
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
}

const ProductsWithTabs: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [productsPage, setProductsPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [brandsPage, setBrandsPage] = useState(1);

  // Selected items
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Starting to load products, categories and brands...");

        // Load each type of data separately to better identify any issues
        try {
          const productsData = await fetchProducts();
          console.log("Products loaded successfully:", productsData);
          // Filter out pre-order products - only show regular products (isPreOrder: false)
          const filteredProducts = productsData.filter(
            (product) => !product.isPreOrder
          );
          console.log(
            "Filtered non-preorder products:",
            filteredProducts.length
          );
          setProducts(filteredProducts);
        } catch (err) {
          console.error("Failed to load products:", err);
        }

        try {
          const categoriesData = await fetchCategories();
          console.log("Categories loaded successfully:", categoriesData);
          setCategories(categoriesData);
        } catch (err) {
          console.error("Failed to load categories:", err);
        }

        try {
          const brandsData = await fetchBrands();
          console.log("Brands loaded successfully:", brandsData);
          setBrands(brandsData);
        } catch (err) {
          console.error("Failed to load brands:", err);
        }
      } catch (err) {
        console.error("Error in loadData function:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  // Convert Product to UIProduct for use with ProductCard component
  const convertToUIProduct = (product: Product): UIProduct => {
    console.log(
      `Converting product to UI format: ID=${product.id}, Name=${product.productName}, isPreOrder=${product.isPreOrder}`
    );
    return {
      id: product.id.toString(),
      name: product.productName || product.name || "",
      price: product.price || 0,
      originalPrice: product.price, // No original price field, using regular price
      description: product.description || "",
      image:
        product.productAssets?.[0]?.imageUrl ||
        product.image ||
        "/images/product.webp",
      images: product.productAssets?.map((asset) => asset.imageUrl) ||
        product.images || ["/images/product.webp"],
      quantity: product.stockQuantity || product.quantity || 0,
      status: product.isActive ? "active" : "inactive",
      isPreOrder: product.isPreOrder || false,
    };
  };

  // Filter products by category
  const getProductsByCategory = (categoryId: number | null) => {
    if (categoryId === null) return products;
    return products.filter((product) => product.categoryId === categoryId);
  };

  // Filter products by brand
  const getProductsByBrand = (brandId: number | null) => {
    if (brandId === null) return products;
    return products.filter((product) => product.brandId === brandId);
  };

  // Calculate pagination for products tab
  const filteredProducts = products;
  const productsTotalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );
  const productsStartIndex = (productsPage - 1) * ITEMS_PER_PAGE;
  const productsEndIndex = productsStartIndex + ITEMS_PER_PAGE;
  const currentPageProducts = filteredProducts.slice(
    productsStartIndex,
    productsEndIndex
  );

  // Calculate pagination for category filtered products
  const filteredCategoryProducts = getProductsByCategory(selectedCategoryId);
  const categoryProductsTotalPages = Math.ceil(
    filteredCategoryProducts.length / ITEMS_PER_PAGE
  );
  const categoryProductsStartIndex = (categoriesPage - 1) * ITEMS_PER_PAGE;
  const categoryProductsEndIndex = categoryProductsStartIndex + ITEMS_PER_PAGE;
  const currentCategoryProducts = filteredCategoryProducts.slice(
    categoryProductsStartIndex,
    categoryProductsEndIndex
  );

  // Calculate pagination for brand filtered products
  const filteredBrandProducts = getProductsByBrand(selectedBrandId);
  const brandProductsTotalPages = Math.ceil(
    filteredBrandProducts.length / ITEMS_PER_PAGE
  );
  const brandProductsStartIndex = (brandsPage - 1) * ITEMS_PER_PAGE;
  const brandProductsEndIndex = brandProductsStartIndex + ITEMS_PER_PAGE;
  const currentBrandProducts = filteredBrandProducts.slice(
    brandProductsStartIndex,
    brandProductsEndIndex
  );
  const handleProductClick = (productId: string) => {
    console.log(`Navigating to product with ID: ${productId}`);
    navigate(`/product/${productId}`);
  };

  // Debug rendering
  console.log("Rendering ProductsWithTabs with state:", {
    productsCount: products.length,
    categoriesCount: categories.length,
    brandsCount: brands.length,
    isLoading,
    error,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tất cả sản phẩm
          </h1>
          <p className="text-lg text-gray-600">
            Tất cả sản phẩm có sẵn (bao gồm cả sản phẩm hết hàng)
          </p>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 mb-8">
            <Tab
              className={({ selected }: { selected: boolean }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-900 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-900"
                )
              }
            >
              Sản phẩm
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-900 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-900"
                )
              }
            >
              Danh mục
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-900 shadow"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-900"
                )
              }
            >
              Thương hiệu
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            {" "}
            {/* Products Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
              {currentPageProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    Không có sản phẩm nào trong danh mục này
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {currentPageProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          console.log(
                            `Clicked on product with ID: ${product.id}`
                          );
                          handleProductClick(product.id.toString());
                        }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <ProductCard product={convertToUIProduct(product)} />
                      </div>
                    ))}
                  </div>

                  {productsTotalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={productsPage}
                        totalPages={productsTotalPages}
                        onPageChange={setProductsPage}
                      />
                    </div>
                  )}
                </>
              )}
            </Tab.Panel>{" "}
            {/* Categories Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Danh mục sản phẩm
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedCategoryId === null
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategoryId(
                          selectedCategoryId === category.id
                            ? null
                            : category.id
                        )
                      }
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedCategoryId === category.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedCategoryId === null
                    ? "Tất cả sản phẩm"
                    : `Sản phẩm trong danh mục: ${
                        categories.find((c) => c.id === selectedCategoryId)
                          ?.categoryName
                      }`}
                </h3>

                {currentCategoryProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                      Không có sản phẩm nào trong danh mục này
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                      {currentCategoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          onClick={() => {
                            console.log(
                              `Clicked on category product with ID: ${product.id}`
                            );
                            handleProductClick(product.id.toString());
                          }}
                        >
                          <ProductCard product={convertToUIProduct(product)} />
                        </div>
                      ))}
                    </div>

                    {categoryProductsTotalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={categoriesPage}
                          totalPages={categoryProductsTotalPages}
                          onPageChange={setCategoriesPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Tab.Panel>{" "}
            {/* Brands Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Thương hiệu</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedBrandId(null)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedBrandId === null
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Tất cả
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() =>
                        setSelectedBrandId(
                          selectedBrandId === brand.id ? null : brand.id
                        )
                      }
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedBrandId === brand.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedBrandId === null
                    ? "Tất cả sản phẩm"
                    : `Sản phẩm của thương hiệu: ${
                        brands.find((b) => b.id === selectedBrandId)?.name
                      }`}
                </h3>

                {currentBrandProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                      Không có sản phẩm nào của thương hiệu này
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                      {currentBrandProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          onClick={() => {
                            console.log(
                              `Clicked on brand product with ID: ${product.id}`
                            );
                            handleProductClick(product.id.toString());
                          }}
                        >
                          <ProductCard product={convertToUIProduct(product)} />
                        </div>
                      ))}
                    </div>

                    {brandProductsTotalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={brandsPage}
                          totalPages={brandProductsTotalPages}
                          onPageChange={setBrandsPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProductsWithTabs;
