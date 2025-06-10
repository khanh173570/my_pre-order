import { useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../stores/store";
// import { topupResult } from "../../stores/slices/auth.slice";

const Result = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  //   const { userAuth } = useSelector((state: RootState) => state.auth);
  const hasDispatched = useRef(false);

  const status = searchParams.get("status") as "success" | "failed" | null;
  //   const balance = parseFloat(searchParams.get("balance") || "0");
  const error = searchParams.get("error") || "";

  // Use useEffect to dispatch only once
  useEffect(() => {
    if (
      status === "success" &&
      //   balance > 0 &&
      !hasDispatched.current
      //   userAuth
    ) {
      //   dispatch(topupResult(balance));
      hasDispatched.current = true;
    }
  }, [status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="w-full max-w-md px-8 py-10 mx-4 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center">
          {status === "success" ? (
            <div className="mb-6 p-4 bg-green-50 rounded-full">
              <div className="text-5xl text-green-500" />
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-50 rounded-full">
              <div className="text-5xl text-red-500" />
            </div>
          )}

          <h1
            className={`text-2xl font-bold mb-4 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success"
              ? "Nạp tiền thành công!"
              : "Nạp tiền thất bại!"}
          </h1>

          {status === "success" ? (
            <div className="w-full mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-700">Số dư mới:</p>
              <p className="text-2xl font-semibold text-gray-800">
                {/* {(userData.balance ?? balance).toLocaleString()} VND */}
              </p>
            </div>
          ) : (
            <div className="w-full mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-red-600">
                {error ? `Lỗi: ${error}` : "Vui lòng thử lại sau."}
              </p>
            </div>
          )}

          <div className="flex gap-4 w-full">
            <button
              className="w-full px-6 py-3 bg-[#F7B731] hover:bg-blue-700 hover:!text-amber-50 font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:ring-opacity-50"
              onClick={() => navigate("/")}
            >
              Quay về trang chủ
            </button>

            {status === "failed" && (
              <button
                className="w-full px-6 py-3 bg-white border border-[#F7B731] hover:!text-white hover:bg-blue-50 font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:ring-opacity-50"
                onClick={() => navigate("/topup")}
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
