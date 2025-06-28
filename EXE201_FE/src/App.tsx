import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PreOrderProvider } from "./context/PreOrderContext";
import { ProductProvider } from "./context/ProductContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Login, Register, OTPVerification } from "./pages/auth";
import HomeStaff from "./pages/home/HomeStaff";
import { PreOrder, PreOrderDetail } from "./pages/customer/product";
import ProductDetail from "./pages/customer/product/ProductDetail";
import {
  Policy,
  Profile,
  History,
  Cart,
  CheckoutReview,
<<<<<<< HEAD
=======
  // PaymentReturn,
>>>>>>> FE_khanhTran
  Result,
} from "./pages/customer";
import HomeCustomer from "./pages/home/HomeCustomer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderList from "./pages/admin/orders/OrderList";
import ProductList from "./pages/admin/products/ProductList";
import CategoryList from "./pages/admin/categories/CategoryList";
import { BrandList } from "./pages/admin/brands";
import AccountList from "./pages/admin/accounts/AccountList";
import BookingProducts from "./pages/customer/BookingProducts";
import PreOrderProducts from "./pages/customer/PreOrderProducts";
import ProductsWithTabs from "./pages/customer/product/ProductsWithTabs";

// Component xử lý redirect khi thanh toán hoặc vào trang gốc "/"
const PaymentRedirector: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/" &&
      (location.search.includes("status=success") ||
        location.search.includes("status=fail"))
    ) {
      navigate(`/payment-result${location.search}`, { replace: true });
    } else if (location.pathname === "/" && !location.search) {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <PaymentRedirector />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <PreOrderProvider>
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Auth routes without layout */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/otp-verification"
                    element={<OTPVerification />}
                  />
                  <Route path="/result" element={<Result />} />

                  {/* Customer routes with MainLayout */}
                  <Route element={<MainLayout />}>
                    <Route
                      path="/customer"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_CUSTOMER]}
                        >
                          <HomeCustomer />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/pre-order" element={<PreOrder />} />
                    <Route path="/pre-order/:id" element={<PreOrderDetail />} />
                    <Route path="/policy" element={<Policy />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/checkout-review"
                      element={<CheckoutReview />}
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_CUSTOMER]}
                        >
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_CUSTOMER]}
                        >
                          <History />
                        </ProtectedRoute>
                      }
                    />
<<<<<<< HEAD
                    <Route
                      path="/product-all"
=======
                    {/* <Route
                      path="/payment-return"
>>>>>>> FE_khanhTran
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_CUSTOMER]}
                        >
                          <ProductsWithTabs />
                        </ProtectedRoute>
                      }
<<<<<<< HEAD
                    /> */}
=======
                    />
                    <Route
                      path="/booking-products"
                      element={<BookingProducts />}
                    />
                    <Route
                      path="/pre-order-products"
                      element={<PreOrderProducts />}
                    />
<<<<<<< HEAD
                    <Route path="/payment-result" element={<Result />} />
=======
>>>>>>> b71609db450d032cb2defadeae196bd802434c5e
>>>>>>> FE_khanhTran
                  </Route>

                  {/* Admin and Staff routes with AdminLayout */}
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          import.meta.env.VITE_ROLE_ADMIN,
                          import.meta.env.VITE_ROLE_STAFF,
                        ]}
                      >
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="/staff"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_STAFF]}
                        >
                          <HomeStaff />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_ADMIN]}
                        >
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            import.meta.env.VITE_ROLE_ADMIN,
                            import.meta.env.VITE_ROLE_STAFF,
                          ]}
                        >
                          <OrderList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            import.meta.env.VITE_ROLE_ADMIN,
                            import.meta.env.VITE_ROLE_STAFF,
                          ]}
                        >
                          <ProductList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/categories"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            import.meta.env.VITE_ROLE_ADMIN,
                            import.meta.env.VITE_ROLE_STAFF,
                          ]}
                        >
                          <CategoryList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/brands"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            import.meta.env.VITE_ROLE_ADMIN,
                            import.meta.env.VITE_ROLE_STAFF,
                          ]}
                        >
                          <BrandList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/accounts"
                      element={
                        <ProtectedRoute
                          allowedRoles={[import.meta.env.VITE_ROLE_ADMIN]}
                        >
                          <AccountList />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </AnimatePresence>
            </PreOrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
