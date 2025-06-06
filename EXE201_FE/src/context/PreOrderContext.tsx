import React, { createContext, useState, useEffect } from "react";
import { PreOrderProduct } from "../types";
import { useAuth } from "../hooks/useAuth";

interface PreOrderHistoryItem extends PreOrderProduct {
  orderDate: string;
  quantity: number;
  userId: string;
}

interface PreOrderContextType {
  preOrderHistory: PreOrderHistoryItem[];
  addToPreOrderHistory: (product: PreOrderProduct, quantity: number) => void;
  clearPreOrderHistory: () => void;
}

export const PreOrderContext = createContext<PreOrderContextType | undefined>(
  undefined
);

export const PreOrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const userId = currentUser?.id || "";

  const [preOrderHistory, setPreOrderHistory] = useState<PreOrderHistoryItem[]>(
    () => {
      // Load from localStorage on initial render
      const savedHistory = localStorage.getItem("preOrderHistory");

      // If there's existing history, check if we need to migrate it
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);

        // If we find items without userId, assign them to the current user or flag them
        if (Array.isArray(parsed) && parsed.some((item) => !item.userId)) {
          const migratedHistory = parsed.map((item) => {
            // Only add userId if it doesn't exist
            if (!item.userId) {
              return { ...item, userId: currentUser?.id || "guest" };
            }
            return item;
          });

          // Save migrated data back to localStorage
          localStorage.setItem(
            "preOrderHistory",
            JSON.stringify(migratedHistory)
          );
          return migratedHistory;
        }

        return parsed;
      }

      return [];
    }
  );

  // Save to localStorage whenever the history changes
  useEffect(() => {
    localStorage.setItem("preOrderHistory", JSON.stringify(preOrderHistory));
  }, [preOrderHistory]);

  const addToPreOrderHistory = (product: PreOrderProduct, quantity: number) => {
    if (!isAuthenticated || !currentUser) {
      console.error("Cannot add to history: User not authenticated");
      return;
    }

    const newHistoryItem: PreOrderHistoryItem = {
      ...product,
      orderDate: new Date().toLocaleString("vi-VN"),
      quantity,
      userId: currentUser.id,
    };

    setPreOrderHistory((prev) => [newHistoryItem, ...prev]);
  };

  const clearPreOrderHistory = () => {
    if (!isAuthenticated) {
      console.error("Cannot clear history: User not authenticated");
      return;
    }

    // Only clear the current user's history
    setPreOrderHistory((prev) => prev.filter((item) => item.userId !== userId));
  };
  // Filter history for current user
  const filteredPreOrderHistory = isAuthenticated
    ? preOrderHistory.filter((item) => item.userId === userId)
    : [];

  return (
    <PreOrderContext.Provider
      value={{
        preOrderHistory: filteredPreOrderHistory,
        addToPreOrderHistory,
        clearPreOrderHistory,
      }}
    >
      {children}
    </PreOrderContext.Provider>
  );
};
