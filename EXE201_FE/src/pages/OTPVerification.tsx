import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { verifyEmail, resendOTP } from "../services/api";
import Swal from "sweetalert2";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(300); // 5 minutes
  const [canResend, setCanResend] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ mã OTP",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the real API to verify OTP
      await verifyEmail(email, otpString);

      await Swal.fire({
        icon: "success",
        title: "Xác thực thành công!",
        text: "Tài khoản của bạn đã được tạo thành công",
        confirmButtonColor: "#3085d6",
      });

      // Navigate to login page with success message
      navigate("/login", {
        state: {
          from: "otp-verification",
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Mã OTP không đúng",
        text:
          error instanceof Error
            ? error.message
            : "Vui lòng kiểm tra lại mã OTP",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOTP = async () => {
    setCanResend(false);

    try {
      // Call the real API to resend OTP
      const response = await resendOTP(email);

      // Reset timer only after successful API call
      setTimer(300);

      await Swal.fire({
        icon: "success",
        title: "Đã gửi lại mã OTP",
        text: response.message || "Vui lòng kiểm tra email của bạn",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Không thể gửi lại mã OTP",
        text: error instanceof Error ? error.message : "Vui lòng thử lại sau",
        confirmButtonColor: "#3085d6",
      });
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      {/* <div className="bg-blue-900 text-white p-4 mb-4">
        <div className="container mx-auto">
          <Link
            to="/"
            className="text-white text-xl font-bold flex items-center"
          >
            <img src="/logo.svg" alt="Nhieuthuay" className="h-8 mr-2" />
            Tài khoản Nhieuthuay
          </Link>
        </div>
      </div> */}

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="m-auto w-full px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <PageTransition className="p-8" from={location.state?.from} isForm>
              <div className="text-center mb-6">
                {" "}
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <img
                      src="/images/iconEmail.png"
                      alt="Email Icon"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Xác thực OTP
                </h2>
                <p className="text-gray-600 mb-2">
                  Chúng tôi đã gửi mã xác thực đến email
                </p>
                <p className="text-blue-600 font-medium">{email}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-4 text-center">
                    Nhập mã OTP (6 chữ số)
                  </label>{" "}
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={1}
                        pattern="[0-9]"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center mb-6">
                  {timer > 0 ? (
                    <p className="text-gray-600">
                      Mã sẽ hết hạn sau:{" "}
                      <span className="font-bold text-red-600">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-red-600">Mã OTP đã hết hạn</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-900 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </motion.button>
              </form>{" "}
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2">Bạn chưa nhận được mã?</p>
                <motion.button
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {canResend ? "Gửi lại mã OTP" : "Vui lòng chờ..."}
                </motion.button>
              </div>
              <div className=" text-center">
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-blue-600 hover:underline flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Quay lại đăng ký
                </Link>
              </div>
            </PageTransition>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OTPVerification;
