import { createContext, useContext, useState, useEffect } from "react";
import { registerApi, loginApi, getMeApi } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            // Invalid response, clear token
            logout();
          }
        } catch (error) {
          console.warn("Session verification failed:", error.message);
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized 401 events dispatched from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Register function
  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Login function
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Refresh user data function
  const refreshUser = async () => {
    try {
      const res = await getMeApi();
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error.message);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
