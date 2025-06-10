import { toast } from "react-toastify";

/**
 * Show success toast notification
 * @param message Message to display
 */
export const showSuccess = (message: string): void => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

/**
 * Show error toast notification
 * @param message Error message to display
 */
export const showError = (message: string): void => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
  });
};

/**
 * Show info toast notification
 * @param message Message to display
 */
export const showInfo = (message: string): void => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
  });
};
