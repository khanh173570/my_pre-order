import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PreOrderProvider } from "./context/PreOrderContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";
import HomeCustomer from "./pages/home/HomeCustomer";
import HomeStaff from "./pages/home/HomeStaff";
import HomeAdmin from "./pages/home/HomeAdmin";
import Products from "./pages/Products";
import PreOrder from "./pages/PreOrder";
import PreOrderDetail from "./pages/PreOrderDetail";
import Policy from "./pages/Policy";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Cart from "./pages/Cart";
import { AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <PreOrderProvider>
          <Router>
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
              {" "}
              <Routes>
                {/* Auth routes without layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/otp-verification" element={<OTPVerification />} />

                {/* Customer routes with MainLayout */}
                <Route element={<MainLayout />}>
                  {/* Redirect root path to login */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
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
                  <Route path="/products" element={<Products />} />
                  <Route path="/pre-order" element={<PreOrder />} />
                  <Route path="/pre-order/:id" element={<PreOrderDetail />} />
                  <Route path="/policy" element={<Policy />} />
                  <Route path="/cart" element={<Cart />} />
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
                        <HomeAdmin />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </PreOrderProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
