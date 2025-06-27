import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

  // Determine user role from new API response structure or fallback to old structure
  let userRole = "customer"; // Default fallback role

  // Handle new API structure (array of roles)
  if (currentUser.data?.user?.roles && currentUser.data.user.roles.length > 0) {
    userRole = currentUser.data.user.roles[0].toLowerCase();
    console.log("Role from new API structure:", userRole);
  }
  // Legacy support for old API structure
  else if (currentUser.roleName) {
    userRole = currentUser.roleName.toLowerCase();
  }

  console.log("User role determined:", userRole);

  // Convert allowedRoles to lowercase for case-insensitive comparison
  const lowerCaseAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  console.log("Normalized allowed roles:", lowerCaseAllowedRoles);
  console.log("Role check:", !lowerCaseAllowedRoles.includes(userRole));

  if (!lowerCaseAllowedRoles.includes(userRole)) {
    console.log("Role not allowed, redirecting based on user role");
    // Redirect authenticated users to their appropriate home page
    const adminRole = import.meta.env.VITE_ROLE_ADMIN.toLowerCase();
    const staffRole = import.meta.env.VITE_ROLE_STAFF.toLowerCase();
    const customerRole = import.meta.env.VITE_ROLE_CUSTOMER.toLowerCase();

    switch (userRole) {
      case adminRole:
        return <Navigate to="/admin" replace />;
      case staffRole:
        return <Navigate to="/staff" replace />;
      case customerRole:
      case "user": // Additional fallback for "user" role
        return <Navigate to="/customer" replace />;
      default:
        console.log("Default role case, redirecting to login");
        return <Navigate to="/login" replace />;
    }
  }

  // Only render children if authentication and role checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
