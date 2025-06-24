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

const ITEMS_PER_PAGE = 12;

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
          setProducts(productsData);
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
      `Converting product to UI format: ID=${product.id}, Name=${product.productName}`
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
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900 border-solid"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
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
          {/* Products Tab */}
          <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {" "}
              {currentPageProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    console.log(`Clicked on product with ID: ${product.id}`);
                    handleProductClick(product.id.toString());
                  }}
                  className="hover:shadow-lg transition-shadow duration-300"
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
          </Tab.Panel>

          {/* Categories Tab */}
          <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Danh mục sản phẩm</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {" "}
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow transition-shadow duration-300 ${
                      selectedCategoryId === category.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      setSelectedCategoryId(
                        selectedCategoryId === category.id ? null : category.id
                      )
                    }
                  >
                    <p className="font-medium text-center">
                      {category.categoryName}
                    </p>
                  </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {" "}
                {currentCategoryProducts.length > 0 ? (
                  currentCategoryProducts.map((product) => (
                    <div
                      key={product.id}
                      className="hover:shadow-lg transition-shadow duration-300"
                      onClick={() => {
                        console.log(
                          `Clicked on category product with ID: ${product.id}`
                        );
                        handleProductClick(product.id.toString());
                      }}
                    >
                      <ProductCard product={convertToUIProduct(product)} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">
                      Không có sản phẩm nào trong danh mục này
                    </p>
                  </div>
                )}
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
            </div>
          </Tab.Panel>

          {/* Brands Tab */}
          <Tab.Panel className={classNames("rounded-xl bg-white p-3")}>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Thương hiệu</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {" "}
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow transition-shadow duration-300 ${
                      selectedBrandId === brand.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      setSelectedBrandId(
                        selectedBrandId === brand.id ? null : brand.id
                      )
                    }
                  >
                    <p className="font-medium text-center">{brand.name}</p>
                  </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {" "}
                {currentBrandProducts.length > 0 ? (
                  currentBrandProducts.map((product) => (
                    <div
                      key={product.id}
                      className="hover:shadow-lg transition-shadow duration-300"
                      onClick={() => {
                        console.log(
                          `Clicked on brand product with ID: ${product.id}`
                        );
                        handleProductClick(product.id.toString());
                      }}
                    >
                      <ProductCard product={convertToUIProduct(product)} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">
                      Không có sản phẩm nào của thương hiệu này
                    </p>
                  </div>
                )}
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
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProductsWithTabs;
