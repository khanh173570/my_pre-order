import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RegisterFormData } from "../types";
import { registerUser } from "../services/api";
import { PageTransition } from "../components/PageTransition";
import { motion } from "framer-motion";
import { getValidationErrors } from "../utils/validation";
import Swal from "sweetalert2";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const validationErrors = getValidationErrors(formData);
    if (validationErrors.length > 0) {
      setIsLoading(false);
      await Swal.fire({
        icon: "error",
        title: "Lỗi Nhập Liệu",
        html: validationErrors
          .map((error) => `<div class="mb-2">- ${error}</div>`)
          .join(""),
        confirmButtonText: "Đóng",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    try {
      // Create form data to submit
      const submitData = new FormData();
      submitData.append("name", formData.userName); // Changed from userName to name
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);

      // Call registration API
      const result = await registerUser(submitData);

      await Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: result.message,
        confirmButtonColor: "#3085d6",
      });

      // Navigate to OTP verification page
      navigate("/otp-verification", {
        state: {
          email: formData.email,
          userId: result.data.userId,
          from: "register",
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      await Swal.fire({
        icon: "error",
        title: "Đăng Ký Thất Bại",
        text: errorMessage,
        confirmButtonText: "Thử Lại",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsLoading(false);
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
      <main className="flex-1 flex mb-8 mt-8">
        <div className="m-auto w-full px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto flex">
            {/* Form Section */}
            <PageTransition
              className="w-full md:w-1/2 p-8"
              from={location.state?.from}
              isForm
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Đăng kí tài khoản
              </h2>

              {/* Remove error display div as we're using SweetAlert2 now */}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="userName"
                    className="block text-gray-700 mb-2"
                  >
                    Tên đăng nhập
                    <span className="text-xs text-gray-500 block">
                      3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới
                    </span>
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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
                </div>{" "}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 mb-2"
                  >
                    Mật khẩu
                    <span className="text-xs text-gray-500 block">
                      Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự
                      đặc biệt
                    </span>
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
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      required
                    />
                    <span className="ml-2 text-gray-700 text-sm">
                      Tôi đồng ý với điều khoản
                    </span>
                  </label>
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
                  <span>Đăng kí với Google</span>
                </motion.button>

                <motion.p
                  className="mt-6 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    state={{ from: "register" }}
                    className="text-blue-600 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </motion.p>
              </div>
            </PageTransition>

            {/* Image Section */}
            <PageTransition
              className="hidden md:block w-1/2"
              from={location.state?.from}
            >
              <img
                src="/images/logoGundam.webp"
                alt="Register"
                className="h-full w-full object-cover"
              />
            </PageTransition>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <div className="bg-gray-100 p-4 border-t border-gray-200">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Nhieuthuay Vietnam. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-900">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-900">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-900">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Register;
