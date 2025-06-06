import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  // Immediate authentication check - this happens synchronously before any rendering
  console.log("ProtectedRoute Debug:");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("currentUser:", currentUser);
  console.log("allowedRoles:", allowedRoles);

  if (!isAuthenticated || !currentUser) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role check after authentication
  const userRole = currentUser.user?.role || currentUser.roleName || "customer";
  console.log("User role:", userRole);
  console.log("Role check:", !allowedRoles.includes(userRole));

  if (!allowedRoles.includes(userRole)) {
    console.log("Role not allowed, redirecting based on user role");
    // Redirect authenticated users to their appropriate home page
    switch (userRole) {
      case import.meta.env.VITE_ROLE_ADMIN:
        return <Navigate to="/admin" replace />;
      case import.meta.env.VITE_ROLE_STAFF:
        return <Navigate to="/staff" replace />;
      case import.meta.env.VITE_ROLE_CUSTOMER:
        return <Navigate to="/customer" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Only render children if authentication and role checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
