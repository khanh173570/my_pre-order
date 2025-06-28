import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const { isAuthenticated, logout, currentUser, userProfile, refreshProfile } =
    useAuth();
  const { totalItems, cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`header-fixed ${
        isScrolled ? "bg-blue-900 shadow-lg" : "bg-transparent"
      }`}
      style={{ transition: "background-color 0.3s, box-shadow 0.3s" }}
    >
      <div className="bg-blue-900 text-white text-center py-1 text-sm">
        Chúng tôi có các sản phẩm chưa từng xuất hiện tại thị trường Việt Nam
      </div>

      <div
        className={`${
          isScrolled
            ? "bg-blue-900 border-blue-900"
            : "bg-white border-gray-200"
        } px-4 sm:px-6 border-b`}
        style={{ transition: "background-color 0.3s, border-color 0.3s" }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-2 space-y-2 md:space-y-0">
          {/* Logo */}
          <div className="relative h-[80px] w-[200px] overflow-visible">
            <Link to="/customer" className="block h-full relative">
              <img
                src="/images/logo.png"
                alt="Nhieuthuay"
                className="absolute top-1/2 left-0 -translate-y-1/2 h-[200px] w-[200px] object-contain z-10"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm tại đây"
              className={`w-full pl-10 pr-4 py-1.5 rounded-full border ${
                isScrolled
                  ? "border-white focus:ring-black bg-white placeholder-black"
                  : "border-gray-300 focus:ring-blue-500 bg-white placeholder-black"
              } focus:outline-none focus:ring-2 transition-colors duration-300`}
            />
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isScrolled ? "text-black" : "text-gray-400"
              }`}
              size={20}
            />
          </div>

          {/* Cart & User */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            {/* Cart */}
            <div
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
              ref={cartDropdownRef}
            >
              <button
                onClick={() => navigate("/cart")}
                className={`flex items-center ${
                  isScrolled
                    ? "text-white hover:text-red-100"
                    : "text-gray-700 hover:text-blue-900"
                } relative group transition-colors duration-300`}
              >
                <div className="cart-icon">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="ml-2">Giỏ Hàng</span>
              </button>
              {isCartOpen && cartItems.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50">
                  <div className="max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2 hover:bg-gray-50 flex items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="ml-3 flex-grow">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x{" "}
                            {item.price.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-2 px-4 py-3">
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
                    </div>
                    <button
                      onClick={() => navigate("/cart")}
                      className="mt-2 w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Xem giỏ hàng
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center ${
                    isScrolled
                      ? "text-white hover:text-red-100"
                      : "text-gray-700 hover:text-blue-900"
                  } transition-colors duration-300`}
                >
                  <User size={24} />
                  <span className="ml-2 flex items-center">
                    Welcome,{" "}
                    <span className="font-medium ml-1">
                      {userProfile?.firstName ||
                        currentUser?.data?.user?.firstName ||
                        currentUser?.firstName ||
                        "User"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshProfile();
                        toast.info("Refreshing profile...");
                      }}
                      className="ml-2 text-xs p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title="Refresh profile"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 2v6h-6" />
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M3 22v-6h6" />
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                      </svg>
                    </button>
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg py-1 z-10 w-48">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/history")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Lịch sử đơn hàng
                    </button>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className={`flex items-center ${
                  isScrolled
                    ? "text-white hover:text-red-100"
                    : "text-gray-700 hover:text-blue-900"
                } transition-colors duration-300`}
              >
                <User size={24} />
                <span className="ml-2">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          isScrolled ? "bg-blue-900 shadow-md" : "bg-white shadow-sm"
        } py-1`}
        style={{ transition: "background-color 0.3s, box-shadow 0.3s" }}
      >
        <div className="container mx-auto overflow-x-auto">
          <ul className="flex flex-wrap justify-center md:justify-center space-x-2 md:space-x-6 whitespace-nowrap">
            <li>
              <Link
                to="/product-all"
                className={`font-medium block py-2 px-4 ${
                  isScrolled ? "text-white" : "text-gray-700"
                }`}
              >
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/booking-products"
                className={`font-medium block py-2 px-4 ${
                  isScrolled ? "text-white" : "text-gray-700"
                }`}
              >
                Sản phẩm có sẵn
              </Link>
            </li>
            <li>
              <Link
                to="/pre-order-products"
                className={`font-medium block py-2 px-4 ${
                  isScrolled ? "text-white" : "text-gray-700"
                }`}
              >
                Pre-Order
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className={`font-medium block py-2 px-4 ${
                  isScrolled ? "text-white" : "text-gray-700"
                }`}
              >
                Chính sách
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
