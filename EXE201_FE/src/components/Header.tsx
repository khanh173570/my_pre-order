import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { usePreOrder } from "../hooks/usePreOrder";

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const { totalItems, cartItems, totalPrice } = useCart();
  const { preOrderHistory } = usePreOrder();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPreOrder, setSelectedPreOrder] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
    setSelectedPreOrder(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSelectedPreOrder(null);
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
      className={`header-fixed transition-all duration-300 ${
        isScrolled ? "bg-blue-900 shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div className="bg-blue-900 text-white text-center py-2 text-sm">
        Chúng tôi có các sản phẩm chưa từng xuất hiện tại thị trường Việt Nam
      </div>

      {/* Main header */}
      <div
        className={`${
          isScrolled
            ? "bg-blue-900 border-blue-900"
            : "bg-white border-gray-200"
        }  px-6 border-b transition-all duration-300`}
      >
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/customer"
              className={`text-2xl font-bold ${
                isScrolled ? "text-white" : "text-blue-900"
              }`}
            >
              <img
                src="/images/logo.png"
                alt="Nhieuthuay"
                className="h-[100px] w-[100px]"
              />
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-1/3 my-4 md:my-0">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm tại đây"
              className={`w-full pl-10 pr-4 py-2 rounded-full border ${
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

          {/* Navigation */}
          <div className="flex items-center space-x-6">
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

              {/* Cart Dropdown */}
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
                  <span className="ml-2">
                    Welcome, {currentUser?.userName || "User"}
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
                      Lịch sử đặt trước
                      {preOrderHistory.length > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {preOrderHistory.length}
                        </span>
                      )}
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

      {/* Navigation menu */}
      <nav
        className={`${
          isScrolled ? "bg-blue-900 shadow-md" : "bg-white shadow-sm"
        } transition-all duration-300`}
      >
        <div className="container mx-auto">
          <ul className="flex justify-center space-x-8 py-3">
            <li>
              <Link
                to="/products"
                className={`font-medium ${
                  isScrolled
                    ? "text-white hover:text-red-100"
                    : "text-gray-700 hover:text-blue-900"
                } transition-colors duration-300`}
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/pre-order"
                className={`font-medium ${
                  isScrolled
                    ? "text-white hover:text-red-100"
                    : "text-gray-700 hover:text-blue-900"
                } transition-colors duration-300`}
              >
                Pre-Order
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className={`font-medium ${
                  isScrolled
                    ? "text-white hover:text-red-100"
                    : "text-gray-700 hover:text-blue-900"
                } transition-colors duration-300`}
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
