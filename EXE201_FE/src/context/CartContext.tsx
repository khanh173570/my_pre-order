import React, { createContext, useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import { useAuth } from "../hooks/useAuth";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

// Base key for guest cart
const GUEST_CART_KEY = "cart_guest";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const { currentUser } = useAuth();

  // Generate cart key based on user ID or guest key
  const getCartKey = useCallback(() => {
    // If user is logged in, use their ID to create a unique cart key
    if (currentUser?.data?.user?.id) {
      return `cart_id_${currentUser.data.user.id}`;
    }
    // Otherwise use guest cart
    return GUEST_CART_KEY;
  }, [currentUser]); // Load cart from localStorage whenever user changes or component mounts
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
          console.log("Cart loaded successfully:", parsedCart.length, "items");
        } else {
          console.warn(
            "Invalid cart format in localStorage. Initializing empty cart."
          );
          setCartItems([]);
          // Fix the storage by setting an empty array
          localStorage.setItem(cartKey, JSON.stringify([]));
        }
      } else {
        console.log(
          "No cart data found in localStorage. Initializing empty cart."
        );
        // Initialize empty cart in localStorage
        localStorage.setItem(cartKey, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      // Initialize empty cart on error
      setCartItems([]);
      localStorage.setItem(getCartKey(), JSON.stringify([]));
    }
  }, [getCartKey]); // Reload when user changes (which affects the cart key)  // Save cart to localStorage whenever it changes or user changes
  useEffect(() => {
    // Don't save if we're in the middle of clearing (handled by the clearCart function)
    if (isClearing) {
      setIsClearing(false);
      return;
    }

    try {
      const cartKey = getCartKey();
      console.log("Saving cart for key:", cartKey);
      console.log("Cart data to save:", cartItems.length, "items");

      // Validate cartItems before saving
      if (!Array.isArray(cartItems)) {
        console.warn("Invalid cart state detected");
        localStorage.setItem(cartKey, JSON.stringify([]));
        return;
      }

      // Always save the cart state to localStorage, even if empty
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log("Cart saved successfully");

      // Verify the save was successful
      const savedCart = localStorage.getItem(cartKey);
      if (!savedCart) {
        console.warn("Failed to save cart to localStorage");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems, isClearing, getCartKey]); // Include getCartKey dependency to update when user changes
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      return;
    }

    const productId = product.id.toString();
    console.log(
      `Adding/updating product ID: ${productId} with quantity: ${quantity}`
    );

    setCartItems((prevItems) => {
      // Ensure prevItems is an array
      const safeItems = Array.isArray(prevItems) ? prevItems : [];

      const existingItem = safeItems.find(
        (item) => (item.id?.toString() || "") === productId
      );

      if (existingItem) {
        console.log(
          "Updating quantity for existing item:",
          productId,
          "from",
          existingItem.quantity,
          "to",
          existingItem.quantity + quantity
        );

        const updated = safeItems.map((item) =>
          (item.id?.toString() || "") === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

        // Double-check the updated cart has the item
        const didUpdate = updated.some(
          (item) => (item.id?.toString() || "") === productId
        );
        if (!didUpdate) {
          console.warn("Failed to update item in cart!");
        }

        return updated;
      }

      console.log(
        "Adding new item to cart:",
        productId,
        "with quantity:",
        quantity
      );
      const newCartItem: CartItem = {
        ...product,
        quantity: quantity,
      };

      return [...safeItems, newCartItem];
    }); // Force a save to localStorage after state update
    setTimeout(() => {
      const cartKey = getCartKey();
      console.log("Forcing localStorage update after cart change");
      const currentCart = localStorage.getItem(cartKey);
      const parsedCart = currentCart ? JSON.parse(currentCart) : [];
      console.log("Current localStorage cart:", parsedCart.length, "items");
    }, 100);
  };
  const removeFromCart = (productId: string) => {
    const idStr = productId.toString();
    console.log("Removing item from cart:", idStr);

    // Get current cart before change
    const cartKey = getCartKey();
    const cartBefore = localStorage.getItem(cartKey);
    console.log("Current cart in localStorage before removal:", cartBefore);

    setCartItems((prevItems) => {
      const safeItems = Array.isArray(prevItems) ? prevItems : [];

      // Log what we're removing
      const itemToRemove = safeItems.find(
        (item) => (item.id?.toString() || "") === idStr
      );
      if (itemToRemove) {
        console.log(
          `Removing item: ${
            itemToRemove.productName || itemToRemove.name || productId
          }`
        );
      } else {
        console.warn(`Item with ID ${productId} not found in cart`);
      }

      return safeItems.filter((item) => (item.id?.toString() || "") !== idStr);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const idStr = productId.toString();
    setCartItems((prevItems) => {
      const safeItems = Array.isArray(prevItems) ? prevItems : [];
      if (quantity < 1) {
        // Xóa luôn sản phẩm nếu số lượng < 1
        return safeItems.filter(
          (item) => (item.id?.toString() || "") !== idStr
        );
      }
      const itemExists = safeItems.some(
        (item) => (item.id?.toString() || "") === idStr
      );
      if (!itemExists) {
        return safeItems;
      }
      return safeItems.map((item) =>
        (item.id?.toString() || "") === idStr ? { ...item, quantity } : item
      );
    });
  };
  const clearCart = useCallback(() => {
    console.log("=== CLEARING CART START ===");
    console.log("Current cart items before clear:", cartItems);

    // Set clearing flag to prevent save effect from firing multiple times
    setIsClearing(true);

    try {
      const cartKey = getCartKey();
      console.log("Attempting to clear localStorage with key:", cartKey);

      // First verify if cart exists
      const existingCart = localStorage.getItem(cartKey);
      console.log("Existing cart in localStorage:", existingCart);

      // Instead of removing the key, store an empty array
      localStorage.setItem(cartKey, JSON.stringify([]));

      // Verify empty array was saved
      const afterClear = localStorage.getItem(cartKey);
      console.log("Cart after clear:", afterClear);

      if (afterClear !== JSON.stringify([])) {
        console.warn("Cart may not have been properly cleared in localStorage");
        // Try again with direct assignment
        localStorage.setItem(cartKey, "[]");
      }

      console.log("Cart cleared in localStorage");
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }

    // Clear state
    setCartItems([]);
    console.log("Cart state cleared");

    console.log("=== CLEARING CART END ===");

    // Double check after a short delay
    setTimeout(() => {
      const cartKey = getCartKey();
      const finalCheck = localStorage.getItem(cartKey);
      console.log("Final cart state check:", finalCheck);
      if (finalCheck !== "[]" && finalCheck !== JSON.stringify([])) {
        console.warn(
          "Final cart clear verification failed, forcing empty array"
        );
        localStorage.setItem(cartKey, "[]");
      }
    }, 200);
  }, [cartItems, getCartKey]);

  const totalItems = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
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
