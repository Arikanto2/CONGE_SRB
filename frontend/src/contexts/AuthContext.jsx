import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  const logout = useCallback(() => {
    if (token) {
      axios
        .post(
          "http://localhost:8000/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch(() => {});
    }

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", credentials);
      const { token: newToken, personnel } = response.data;
      setToken(newToken);
      setUser(personnel);
      setIsAuthenticated(true);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(personnel));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  const updateUser = (newToken, newUserData) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }
    if (newUserData) {
      setUser(newUserData);
      localStorage.setItem("user", JSON.stringify(newUserData));
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
