import { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [authError, setAuthError] = useState(null);

  //  Check  login on refresh
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);

      // rejoin socket room after refresh
      socket.emit("join", res.data.user._id);
    } catch (err) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Register
  const register = async (data) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/register", data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // Login
  const login = async (data) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);

      // 🔥 join socket room
      socket.emit("join", res.data.user._id);

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/logout");
      setUser(null);
      socket.disconnect();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Logout failed";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        authError,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
