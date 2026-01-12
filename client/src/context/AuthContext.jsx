import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // ✅ REGISTER
  const register = async (data) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/register", data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      console.error("REGISTER ERROR:", msg);
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async (data) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      console.error("LOGIN ERROR:", msg);
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/logout");
      setUser(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Logout failed";
      console.error("LOGOUT ERROR:", msg);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
