import React, { createContext, useState, useEffect, useCallback } from "react";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { fetchProducts, fetchCategories } from "../services/product.service";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  isInitialized: boolean;
  refetchProducts: () => Promise<void>;
  refetchCategories: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  // Load data only once when context is first created
  useEffect(() => {
    if (!isInitialized) {
      loadData(true);
    }
  }, [loadData, isInitialized]);

  const refetchProducts = useCallback(async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error refetching products:", error);
    }
  }, []);

  const refetchCategories = useCallback(async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error refetching categories:", error);
    }
  }, []);

  const value = {
    products,
    categories,
    isLoading,
    isInitialized,
    refetchProducts,
    refetchCategories,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
