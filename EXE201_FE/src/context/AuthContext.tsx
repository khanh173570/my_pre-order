import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AuthResponse, User } from "../types";
import { fetchUserProfile } from "../services/profile.service";

interface AuthContextProps {
  currentUser: AuthResponse | null;
  userProfile: User | null;
  isAuthenticated: boolean;
  login: (userData: AuthResponse) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Function to fetch the user profile data
  const refreshProfile = useCallback(async () => {
    // Check if token exists in localStorage before attempting to fetch profile
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) {
      console.log("No auth data in localStorage, skipping profile fetch");
      return;
    }

    try {
      // Parse the auth data to verify token exists
      const authData = JSON.parse(storedAuth);
      const token =
        authData.token || (authData.data && authData.data.accessToken);

      if (!token) {
        console.log("No token found in auth data, skipping profile fetch");
        return;
      }

      console.log("Fetching user profile data...");
      const profileData = await fetchUserProfile();

      if (profileData) {
        console.log("Profile data fetched successfully:", profileData);
        setUserProfile(profileData);
      } else {
        console.warn("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    console.log("Checking stored auth:", storedAuth);

    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        // Check for both old and new token formats
        if (
          userData &&
          (userData.token || (userData.data && userData.data.accessToken))
        ) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
          console.log("Auth restored:", userData);

          // Explicitly fetch profile data after setting authenticated state
          console.log("Will fetch profile data now...");
          refreshProfile().catch((err) => {
            console.error(
              "Failed to fetch profile during initialization:",
              err
            );
          });
        }
      } catch (error) {
        console.error("Error restoring auth:", error);
        localStorage.removeItem("auth");
      }
    }
  }, [refreshProfile]);
  const login = async (userData: AuthResponse): Promise<void> => {
    // Check for both old and new token formats
    if (
      !userData ||
      (!userData.token && !(userData.data && userData.data.accessToken))
    ) {
      console.error("Invalid login data");
      return Promise.reject(new Error("Invalid login data"));
    }

    try {
      // First, store the token and user data
      localStorage.setItem("auth", JSON.stringify(userData));
      console.log("Auth data stored in localStorage");

      // Then update the state
      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Log success
      console.log("Login successful in AuthContext:", userData);
      console.log("Auth state updated - isAuthenticated:", true);

      // Small delay to ensure token is available for the profile request
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch user profile right after login
      console.log("Fetching profile after login...");
      await refreshProfile();
      console.log("Profile fetch completed after login");

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
    setUserProfile(null);
    setIsAuthenticated(false);
    console.log("Logged out");
  };

  const value = {
    currentUser,
    userProfile,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
