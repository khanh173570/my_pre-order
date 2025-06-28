import { useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../stores/store";
// import { topupResult } from "../../stores/slices/auth.slice";

const Result = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  //   const dispatch = useDispatch();
  //   const { userAuth } = useSelector((state: RootState) => state.auth);
  const hasDispatched = useRef(false);

  const status = searchParams.get("status") as "success" | "failed" | null;
  const transactionId = searchParams.get("transactionId") || "";
  const error = searchParams.get("error") || ""; // Use useEffect to dispatch only once
  useEffect(() => {
    console.log("=== Result.tsx useEffect ===");
    console.log("Status:", status);
    console.log("hasDispatched.current:", hasDispatched.current);

    if (
      status === "success" &&
      //   balance > 0 &&
      !hasDispatched.current
      //   userAuth
    ) {
      console.log("Payment successful, clearing cart...");
      // alert("Payment successful! About to clear cart..."); // Debug alert
      //   dispatch(topupResult(balance));
      // Clear cart when payment is successful
      clearCart();
      hasDispatched.current = true;
      console.log("Cart clear requested and hasDispatched set to true");

      // Check localStorage after clear
      setTimeout(() => {
        const cartKeys = Object.keys(localStorage).filter((key) =>
          key.startsWith("cart_")
        );
        console.log("Cart keys after clear:", cartKeys);
        // alert(`Cart keys in localStorage after clear: ${cartKeys.join(", ")}`);
      }, 1000);
    } else {
      console.log("Conditions not met for clearing cart");
    }
  }, [status, clearCart]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
      <div className="w-full max-w-md mx-4 overflow-hidden bg-white rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,112,184,0.15)] backdrop-blur-sm">
        <div className="relative">
          {/* Top decorative wave */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${
              status === "success"
                ? "bg-gradient-to-r from-emerald-400 to-green-500"
                : "bg-gradient-to-r from-red-400 to-rose-500"
            }`}
          ></div>

          {/* Result Content */}
          <div className="flex flex-col items-center pt-12 pb-10 px-8">
            {/* Status Icon */}
            {status === "success" ? (
              <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full shadow-md border border-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-gradient-to-br from-red-50 to-rose-100 rounded-full shadow-md border border-red-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}

            {/* Status Title */}
            <h1
              className={`text-3xl font-bold mb-4 ${
                status === "success" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {status === "success"
<<<<<<< HEAD
                ? "Thanh toán thành công đơn hàng!"
                : "Thanh toán thất bại!"}
=======
                ? "Thanh toán thành công !"
                : "Thanh toán thất bại !"}
>>>>>>> FE_khanhTran
            </h1>

            {/* Transaction ID or Error */}
            {status === "success" && transactionId && (
              <div className="mb-6 w-full text-center">
                <span className="text-gray-600 text-sm">Mã giao dịch:</span>
                <div className="text-base font-semibold text-emerald-700 break-all">
                  {transactionId}
                </div>
              </div>
            )}
            {status === "failed" && (
              <div className="mb-6 w-full text-center">
                <span className="text-rose-600 text-sm font-medium">
                  {error
                    ? `Lỗi: ${error}`
                    : "Đã có lỗi xảy ra, vui lòng thử lại."}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 w-full mt-2">
              <button
                className="w-1/2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                onClick={() => navigate("/product-all")}
              >
                Về trang sản phẩm
              </button>
              <button
                className="w-1/2 px-4 py-3 bg-white border-2 border-indigo-500 text-indigo-600 font-semibold rounded-xl transition-all duration-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg"
                onClick={() => navigate("/cart")}
              >
                Về giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
