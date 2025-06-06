import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthResponse } from "../types";

interface AuthContextProps {
  currentUser: AuthResponse | null;
  isAuthenticated: boolean;
  login: (userData: AuthResponse) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    console.log("Checking stored auth:", storedAuth);

    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        if (userData && userData.token) {
          // Ensure backward compatibility
          if (!userData.user && userData.userName) {
            userData.user = {
              id: userData.id,
              name: userData.userName,
              email: userData.email || "",
              role: userData.role || "user",
            };
          }
          setCurrentUser(userData);
          setIsAuthenticated(true);
          console.log("Auth restored:", userData);
        }
      } catch (error) {
        console.error("Error restoring auth:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);
  const login = async (userData: AuthResponse): Promise<void> => {
    if (!userData || !userData.token) {
      console.error("Invalid login data");
      return Promise.reject(new Error("Invalid login data"));
    }

    try {
      // First, store the token and user data
      localStorage.setItem("auth", JSON.stringify(userData));

      // Then update the state
      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Log success but don't navigate here
      console.log("Login successful in AuthContext:", userData);
      console.log("Auth state updated - isAuthenticated:", true);
      console.log("Token stored in localStorage");

      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("auth"); // Cleanup on error
      return Promise.reject(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setCurrentUser(null);
    setIsAuthenticated(false);
    console.log("Logged out");
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
