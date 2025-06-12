import Swal from "sweetalert2";

/**
 * AlertService - A centralized service for displaying alerts using SweetAlert2
 */
export const AlertService = {
  /**
   * Display a success message
   * @param message The message to display
   * @param title Optional title (defaults to "Thành công")
   */
  success: (message: string, title: string = "Thành công") => {
    return Swal.fire({
      icon: "success",
      title,
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });
  },

  /**
   * Display an error message
   * @param message The message to display
   * @param title Optional title (defaults to "Lỗi")
   */
  error: (message: string, title: string = "Lỗi") => {
    return Swal.fire({
      icon: "error",
      title,
      text: message,
    });
  },

  /**
   * Display an information message
   * @param message The message to display
   * @param title Optional title (defaults to "Thông tin")
   */
  info: (message: string, title: string = "Thông tin") => {
    return Swal.fire({
      icon: "info",
      title,
      text: message,
    });
  },

  /**
   * Display a warning message
   * @param message The message to display
   * @param title Optional title (defaults to "Cảnh báo")
   */
  warning: (message: string, title: string = "Cảnh báo") => {
    return Swal.fire({
      icon: "warning",
      title,
      text: message,
    });
  },

  /**
   * Display a confirmation dialog
   * @param message The message to display
   * @param title Optional title (defaults to "Xác nhận")
   * @returns Promise resolving to SweetAlert2 result
   */
  confirm: (
    message: string,
    title: string = "Xác nhận",
    confirmButtonText: string = "Đồng ý",
    cancelButtonText: string = "Hủy"
  ) => {
    return Swal.fire({
      title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText,
    });
  },
};
