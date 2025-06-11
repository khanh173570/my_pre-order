import React, { createContext, useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import { useAuth } from "../hooks/useAuth";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const { currentUser } = useAuth();

  // Get cart storage key based on user ID
  const getCartKey = useCallback(() => {
    return currentUser?.id ? `cart_${currentUser.id}` : "cart_guest";
  }, [currentUser]);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    try {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      console.log("Loading cart for key:", cartKey);
      console.log("Saved cart data:", savedCart);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          console.log("Cart loaded successfully:", parsedCart);
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, [getCartKey]); // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Don't save if we're in the middle of clearing
    if (isClearing) {
      setIsClearing(false);
      return;
    }

    try {
      const cartKey = getCartKey();
      console.log("Saving cart for key:", cartKey);
      console.log("Cart data to save:", cartItems);

      // Only save if we have items or if it's an explicit clear (empty array)
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log("Cart saved successfully");
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, getCartKey, isClearing]);

  const addToCart = (product: Product) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        console.log("Updating quantity for existing item:", product.id);
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log("Adding new item to cart:", product);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    console.log("Removing item from cart:", productId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log("Updating quantity for item:", productId, quantity);
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  const clearCart = useCallback(() => {
    console.log("=== CLEARING CART START ===");
    console.log("Current cart items before clear:", cartItems);

    // Set clearing flag to prevent save effect
    setIsClearing(true);

    // Clear localStorage aggressively
    try {
      const cartKey = getCartKey();
      console.log("Attempting to clear localStorage with key:", cartKey);

      // Check if key exists before removal
      const existingData = localStorage.getItem(cartKey);
      console.log("Existing data in localStorage:", existingData);

      localStorage.removeItem(cartKey);

      // Also try to remove guest cart and any other cart keys
      localStorage.removeItem("cart_guest");

      // Remove any keys that start with "cart_"
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("cart_")) {
          console.log("Removing additional cart key:", key);
          localStorage.removeItem(key);
        }
      });

      // Verify removal
      const afterRemoval = localStorage.getItem(cartKey);
      console.log("Data after removal:", afterRemoval);

      console.log("Cart cleared from localStorage for key:", cartKey);
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }

    // Then clear state
    setCartItems([]);
    console.log("Cart state cleared");

    console.log("=== CLEARING CART END ===");
  }, [getCartKey, cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
