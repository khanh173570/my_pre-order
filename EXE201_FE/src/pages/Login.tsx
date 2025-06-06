import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/api";
import { LoginFormData } from "../types";
import { PageTransition } from "../components/PageTransition";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Show success message if coming from OTP verification
    if (location.state?.from === "otp-verification") {
      Swal.fire({
        icon: "success",
        title: "Chào mừng!",
        text: "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập",
        confirmButtonColor: "#3085d6",
      });
    }

    // Debug environment variables
    console.log("Environment Variables Debug:");
    console.log("VITE_ROLE_ADMIN:", import.meta.env.VITE_ROLE_ADMIN);
    console.log("VITE_ROLE_STAFF:", import.meta.env.VITE_ROLE_STAFF);
    console.log("VITE_ROLE_CUSTOMER:", import.meta.env.VITE_ROLE_CUSTOMER);
  }, [location.state]);
  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log(
        "Authentication detected, checking role:",
        currentUser.user.role
      );
      let targetPath;
      switch (currentUser.user.role) {
        case import.meta.env.VITE_ROLE_ADMIN:
          targetPath = "/admin";
          break;
        case import.meta.env.VITE_ROLE_STAFF:
          targetPath = "/staff";
          break;
        case import.meta.env.VITE_ROLE_CUSTOMER:
          targetPath = "/customer";
          break;
        default:
          targetPath = "/login";
      }
      console.log("Navigating to role-based path:", targetPath);
      navigate(targetPath, { replace: true });
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const userData = await loginUser(formData);
      console.log("Login response userData:", userData); // Log user role for debugging
      console.log("User role:", userData.user.role);
      console.log("Login response:", userData);

      // Wait for login to complete
      await login(userData);
      console.log("Login context updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    } finally {
      // Don't set loading to false here as it will be handled by useEffect or catch
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      {/* Header */}
      {/* <div className="bg-blue-900 text-white p-4 mb-8">
        <div className="container mx-auto">
          <Link
            to="/"
            className="text-white text-xl font-bold flex items-center"
          >
            <img
              src="/images/logoGundam.webp"
              alt="Nhieuthuay"
              className="h-8 mr-2"
            />
            Tài khoản Nhieuthuay
          </Link>
        </div>
      </div> */}
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)] mb-8 mt-8">
        <div className="m-auto w-full px-4">
          {" "}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto flex">
            {/* Image Section */}
            <PageTransition
              className="hidden md:flex md:w-1/2"
              from={location.state?.from}
            >
              <img
                src="/images/logoGundam.webp"
                alt="Login"
                className="w-full object-cover"
              />
            </PageTransition>

            {/* Form Section */}

            <PageTransition
              className="w-full md:w-1/2 p-8 flex flex-col justify-center min-h-[600px]"
              from={location.state?.from}
              isForm
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Đăng nhập
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                {" "}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 mb-2"
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition duration-300 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Đang xử lý..." : "Tiếp tục"}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">Hoặc</p>

                <motion.button
                  className="w-full mt-4 flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-6 h-6 mr-2"
                  />
                  <span>Đăng nhập với Google</span>
                </motion.button>

                <motion.p
                  className="mt-6 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    state={{ from: "login" }}
                    className="text-blue-600 hover:underline"
                  >
                    Đăng kí
                  </Link>
                </motion.p>
              </div>
            </PageTransition>
          </div>
        </div>
      </main>{" "}
      {/* Footer */}
      {/* <div className="bg-red-600 p-4 border-t border-gray-200">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <p className="text-sm text-white">
            © 2025 Nhieuthuay Vietnam. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="text-white hover:text-gray-200">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
