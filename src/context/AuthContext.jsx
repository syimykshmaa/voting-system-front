import React, { createContext, useContext, useState, useEffect } from "react";
import { USERS_DB } from "../data/mockData";

const AuthContext = createContext(null);

// Simulated JWT functions
const generateToken = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role, exp: Date.now() + 3600000 };
  return btoa(JSON.stringify(payload));
};

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("voting_token");
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded) {
        const user = USERS_DB.find((u) => u.id === decoded.id);
        if (user) {
          setCurrentUser(user);
          setToken(savedToken);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const user = USERS_DB.find((u) => u.username === username && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    const newToken = generateToken(user);
    setCurrentUser(user);
    setToken(newToken);
    localStorage.setItem("voting_token", newToken);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("voting_token");
  };

  const hasRole = (...roles) => currentUser && roles.includes(currentUser.role);

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
