import React, { createContext, useState, useEffect, useCallback } from "react";
import { PreOrderProduct } from "../types";
import { fetchPreOrders } from "../services/preorder";

interface PreOrderDataContextType {
  preOrderProducts: PreOrderProduct[];
  isLoading: boolean;
  isInitialized: boolean;
  refetchPreOrderProducts: () => Promise<void>;
}

export const PreOrderDataContext = createContext<
  PreOrderDataContextType | undefined
>(undefined);

export const PreOrderDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preOrderProducts, setPreOrderProducts] = useState<PreOrderProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadPreOrderProducts = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const data = await fetchPreOrders();
      setPreOrderProducts(data);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching pre-order products:", error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  // Load data only once when context is first created
  useEffect(() => {
    if (!isInitialized) {
      loadPreOrderProducts(true);
    }
  }, [loadPreOrderProducts, isInitialized]);

  const refetchPreOrderProducts = useCallback(async () => {
    await loadPreOrderProducts(false);
  }, [loadPreOrderProducts]);

  const value = {
    preOrderProducts,
    isLoading,
    isInitialized,
    refetchPreOrderProducts,
  };

  return (
    <PreOrderDataContext.Provider value={value}>
      {children}
    </PreOrderDataContext.Provider>
  );
};
