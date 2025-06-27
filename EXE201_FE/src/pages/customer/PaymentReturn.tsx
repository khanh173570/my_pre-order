<<<<<<< HEAD
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { PaymentService } from "../../services/payment.service";
// import { useCart } from "../../hooks/useCart";

// const PaymentReturn: React.FC = () => {
//   const [status, setStatus] = useState<"loading" | "success" | "error">(
//     "loading"
//   );
//   const [message, setMessage] = useState<string>("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { clearCart } = useCart();

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         // Extract query parameters from the URL
//         const queryParams = new URLSearchParams(location.search);
//         const params: Record<string, string> = {};

//         // Convert URLSearchParams to Record<string, string>
//         queryParams.forEach((value, key) => {
//           params[key] = value;
//         });

//         console.log("Payment return parameters:", params);

//         // Call API to verify payment
//         const response = await PaymentService.handlePaymentReturn(params);
//         if (response.code === "00") {
//           setStatus("success");
//           setMessage("Thanh toán thành công!");
//           // Clear cart when payment is successful
//           clearCart();
//         } else {
//           setStatus("error");
//           setMessage(response.message || "Thanh toán thất bại");
//         }
//       } catch (error) {
//         console.error("Payment verification error:", error);
//         setStatus("error");
//         setMessage("Đã xảy ra lỗi trong quá trình xử lý thanh toán");
//       }
//     };
//     verifyPayment();
//   }, [location.search, clearCart]);
=======
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { orderService } from "../../services/order.service";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";

const PaymentReturn: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<{
    orderId?: number;
    amount?: number;
    transactionId?: string;
  }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const vnpResponseCode = queryParams.get("vnp_ResponseCode");

        console.log(
          "Payment return parameters:",
          Object.fromEntries(queryParams.entries())
        ); // Check if this is a COD order from state
        const locationState = location.state as {
          paymentMethod?: string;
          status?: string;
          message?: string;
          orderId?: number;
        } | null;
        if (
          locationState?.paymentMethod === "COD" &&
          locationState?.status === "success"
        ) {
          setStatus("success");
          setMessage(
            locationState.message || "Đơn hàng COD đã được tạo thành công!"
          );
          setOrderDetails({ orderId: locationState.orderId });
          return;
        }

        // For VNPay payments, verify with backend
        if (vnpResponseCode) {
          const queryParamsObject = Object.fromEntries(queryParams.entries());

          try {
            const verificationResult = await orderService.verifyPayment(
              queryParamsObject
            );

            if (verificationResult.succeeded && verificationResult.data) {
              setStatus("success");
              setMessage("Thanh toán thành công!");
              setOrderDetails({
                orderId: verificationResult.data.orderId,
                amount: verificationResult.data.amount,
                transactionId: verificationResult.data.transactionId,
              });
              // Clear cart when payment is successful
              clearCart();
              toast.success("Thanh toán thành công!");
            } else {
              setStatus("error");
              setMessage(verificationResult.message || "Thanh toán thất bại");
              toast.error("Thanh toán thất bại");
            }
          } catch (backendError) {
            console.error("Backend verification failed:", backendError);
            // Fallback to simple response code check
            if (vnpResponseCode === "00") {
              setStatus("success");
              setMessage("Thanh toán thành công!");
              clearCart();
              toast.success("Thanh toán thành công!");
            } else {
              setStatus("error");
              setMessage("Thanh toán thất bại hoặc bị hủy");
              toast.error("Thanh toán thất bại");
            }
          }
        } else {
          setStatus("error");
          setMessage("Không tìm thấy thông tin thanh toán");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage("Đã xảy ra lỗi trong quá trình xử lý thanh toán");
        toast.error("Đã xảy ra lỗi trong quá trình xử lý thanh toán");
      }
    };
    verifyPayment();
  }, [location.search, location.state, clearCart]);
>>>>>>> b71609db450d032cb2defadeae196bd802434c5e

//   const handleContinueShopping = () => {
//     navigate("/products");
//   };

//   const handleViewOrders = () => {
//     navigate("/history");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         {status === "loading" && (
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
//           </div>
//         )}

<<<<<<< HEAD
//         {status === "success" && (
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//               <svg
//                 className="w-8 h-8 text-green-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 ></path>
//               </svg>
//             </div>
//             <h2 className="mt-4 text-xl font-semibold text-gray-800">
//               Thanh toán thành công!
//             </h2>
//             <p className="mt-2 text-gray-600">{message}</p>
//             <div className="mt-6 space-y-3">
//               <button
//                 onClick={handleViewOrders}
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
//               >
//                 Xem đơn hàng
//               </button>
//               <button
//                 onClick={handleContinueShopping}
//                 className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Tiếp tục mua sắm
//               </button>
//             </div>
//           </div>
//         )}
=======
        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>{" "}
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Thanh toán thành công!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            {orderDetails.orderId && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Mã đơn hàng:</strong> #{orderDetails.orderId}
                </p>
                {orderDetails.amount && (
                  <p className="text-sm text-gray-600">
                    <strong>Số tiền:</strong>{" "}
                    {orderDetails.amount.toLocaleString("vi-VN")}đ
                  </p>
                )}
                {orderDetails.transactionId && (
                  <p className="text-sm text-gray-600">
                    <strong>Mã giao dịch:</strong> {orderDetails.transactionId}
                  </p>
                )}
              </div>
            )}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleViewOrders}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
>>>>>>> b71609db450d032cb2defadeae196bd802434c5e

//         {status === "error" && (
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//               <svg
//                 className="w-8 h-8 text-red-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 ></path>
//               </svg>
//             </div>
//             <h2 className="mt-4 text-xl font-semibold text-gray-800">
//               Thanh toán thất bại
//             </h2>
//             <p className="mt-2 text-gray-600">{message}</p>
//             <div className="mt-6 space-y-3">
//               <button
//                 onClick={() => navigate("/cart")}
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
//               >
//                 Quay lại giỏ hàng
//               </button>
//               <button
//                 onClick={handleContinueShopping}
//                 className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Tiếp tục mua sắm
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentReturn;
import React from "react";

const PaymentReturn = () => {
  return <div>PaymentReturn</div>;
};

export default PaymentReturn;
