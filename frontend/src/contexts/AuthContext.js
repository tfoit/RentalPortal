import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login, logout as logoutService, register } from "../services/authService";

// Create the auth context
const AuthContext = createContext();

/**
 * AuthProvider component to wrap the application and provide authentication context
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Login attempt with:", { username });

      // Pass username and password as separate parameters to match the updated authService
      const userData = await login(username, password);
      console.log("Login successful, user data:", userData);

      // The backend now returns more complete user data
      const userObject = {
        userId: userData.userId,
        username: userData.username,
        role: userData.role || "user",
        email: userData.email,
      };

      setUser(userObject);
      return userData;
    } catch (err) {
      console.error("Login error details:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    try {
      logoutService();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isOwner: user?.role === "owner",
    isTenant: user?.role === "tenant",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 *
 * @returns {Object} Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
