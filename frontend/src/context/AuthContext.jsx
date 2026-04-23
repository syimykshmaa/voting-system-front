import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("voting_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = localStorage.getItem("voting_token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const user = await apiClient.get("/auth/me");
        setCurrentUser(user);
        setToken(savedToken);
      } catch {
        localStorage.removeItem("voting_token");
        setCurrentUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const applyAuthPayload = (data) => {
    localStorage.setItem("voting_token", data.token);
    setToken(data.token);
    setCurrentUser(data.user);
    return data.user;
  };

  const login = async (username, password) => {
    const data = await apiClient.post("/auth/login", { username, password });
    return applyAuthPayload(data);
  };

  const register = async ({ name, username, email, password }) => {
    const data = await apiClient.post("/auth/register", { name, username, email, password });
    return applyAuthPayload(data);
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch {
      // no-op
    }
    localStorage.removeItem("voting_token");
    setCurrentUser(null);
    setToken(null);
  };

  const hasRole = (...roles) => Boolean(currentUser && roles.includes(currentUser.role));

  return (
    <AuthContext.Provider value={{ currentUser, token, login, register, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
