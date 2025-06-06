import { PreOrderProduct } from "../types";

// Utility function to reset the cached preorders data
export const resetCachedPreOrders = (): void => {
  localStorage.removeItem("cachedPreorders");
};

// Get the remaining available quantity for a product
export const getAvailableQuantity = async (
  productId: string
): Promise<number> => {
  try {
    const preorders = await fetchPreOrders();
    const product = preorders.find((p) => p.id === productId);

    if (!product) {
      return 0;
    }

    return Math.max(0, product.targetQuantity - product.currentQuantity);
  } catch (error) {
    console.error("Error getting available quantity:", error);
    return 0;
  }
};

export const fetchPreOrders = async (): Promise<PreOrderProduct[]> => {
  try {
    // Check if we have cached preorders in localStorage
    const cachedPreorders = localStorage.getItem("cachedPreorders");

    if (cachedPreorders) {
      return JSON.parse(cachedPreorders);
    }

    // If not in localStorage, fetch from the JSON file
    const response = await fetch("/data/preorders.json");
    if (!response.ok) {
      throw new Error("Failed to fetch pre-orders");
    }
    const data = await response.json();

    // Cache the preorders data
    localStorage.setItem("cachedPreorders", JSON.stringify(data.preorders));

    return data.preorders;
  } catch (error) {
    console.error("Error fetching pre-orders:", error);
    return [];
  }
};

// Update preorder quantity
export const updatePreOrderQuantity = async (
  productId: string,
  quantityToAdd: number
): Promise<{ success: boolean; updatedProduct?: PreOrderProduct }> => {
  try {
    // Get preorders from localStorage if available, otherwise fetch from JSON
    let preorders: PreOrderProduct[] = [];
    const cachedPreorders = localStorage.getItem("cachedPreorders");

    if (cachedPreorders) {
      preorders = JSON.parse(cachedPreorders);
    } else {
      preorders = await fetchPreOrders();
      // Cache the initial preorders data
      localStorage.setItem("cachedPreorders", JSON.stringify(preorders));
    }

    const productIndex = preorders.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return { success: false };
    }

    const product = preorders[productIndex];

    // Make sure we don't exceed target quantity
    const newQuantity = Math.min(
      product.currentQuantity + quantityToAdd,
      product.targetQuantity
    );

    // Update the product
    const updatedProduct = {
      ...product,
      currentQuantity: newQuantity,
    };

    // Update the product in the preorders array
    preorders[productIndex] = updatedProduct;

    // Store the updated preorders in localStorage so other users will see the updated quantity
    localStorage.setItem("cachedPreorders", JSON.stringify(preorders));

    return {
      success: true,
      updatedProduct,
    };
  } catch (error) {
    console.error("Error updating pre-order quantity:", error);
    return { success: false };
  }
};
