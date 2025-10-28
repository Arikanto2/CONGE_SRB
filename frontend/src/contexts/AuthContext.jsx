import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!token) return;

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const latestToken = localStorage.getItem("token");
        if (latestToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${latestToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      setToken(currentToken);
      setIsAuthenticated(true);

      try {
        const response = await axios.get("http://localhost:8000/api/verify-token", {
          headers: { Authorization: `Bearer ${currentToken}` },
        });

        if (response.data.valid && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          logout();
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    checkAuth();
  }, [logout]);

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

  const reloadUser = useCallback(async () => {
    if (!token) return false;
    try {
      const response = await axios.get("http://localhost:8000/api/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.valid && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
