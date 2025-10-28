import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextDefinition";

// Composant Provider uniquement
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  // Fonction logout définie en premier avec useCallback pour éviter les re-renders
  const logout = useCallback(() => {
    console.log("🚪 Logout appelé");

    // Appel au backend pour invalider le token JWT (optionnel, sans bloquer)
    if (token) {
      axios
        .post(
          "http://localhost:8000/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((error) => {
          console.error("Erreur lors de la déconnexion:", error);
        });
    }

    // Nettoyer immédiatement l'état local
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");

    // Redirection vers la page de connexion
    window.location.href = "/";
  }, [token]);

  // Configuration axios avec intercepteurs (SEULEMENT si on a un token)
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;

    console.log(
      "🔧 Configuration intercepteurs pour token:",
      currentToken?.substring(0, 20) + "..."
    );

    // Intercepteur de requête pour ajouter le token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Toujours utiliser le token le plus récent du localStorage
        const latestToken = localStorage.getItem("token");
        if (latestToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${latestToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse SIMPLIFIÉ - plus de déconnexion automatique
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("❌ Erreur interceptée:", error.response?.status);
        // On laisse les composants gérer leurs propres erreurs
        // Plus de déconnexion automatique ici
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Vérification du token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = localStorage.getItem("token");
      console.log("🔍 Vérification auth, token:", currentToken ? "présent" : "absent");

      if (currentToken) {
        // Toujours mettre à jour l'état local avec le token du localStorage
        setToken(currentToken);
        setIsAuthenticated(true);

        try {
          console.log("📡 Appel verify-token...");
          // Vérifier la validité du token avec le backend (sans bloquer l'UI)
          const response = await axios.get("http://localhost:8000/api/verify-token", {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          });

          console.log("✅ Réponse verify-token:", response.data);

          if (response.data.valid && response.data.user) {
            setUser(response.data.user);
            console.log("✅ Utilisateur authentifié:", response.data.user.IM);
          } else {
            console.log("❌ Token invalide selon le serveur");
            // Token invalide côté serveur
            logout();
          }
        } catch (error) {
          console.error(
            "❌ Erreur de vérification du token:",
            error.response?.status,
            error.response?.data
          );

          // Seulement déconnecter si c'est vraiment un problème d'authentification
          if (error.response?.status === 401 && error.response?.data?.message?.includes("token")) {
            console.log("🚪 Token vraiment expiré, déconnexion");
            logout();
          } else {
            console.log("🌐 Erreur réseau ou serveur, on garde la session locale");
            // En cas d'erreur réseau/serveur, on garde la session
            // L'utilisateur reste connecté localement
          }
        }
      } else {
        console.log("ℹ️ Pas de token, utilisateur non connecté");
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false);
      console.log("🏁 Fin de checkAuth, loading = false");
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // On ignore logout volontairement pour éviter les boucles infinies

  const login = async (credentials) => {
    try {
      console.log("🔐 Tentative de connexion pour:", credentials.IM);
      const response = await axios.post("http://localhost:8000/api/login", credentials);
      const { token: newToken, personnel } = response.data;

      console.log("✅ Connexion réussie, token reçu:", newToken?.substring(0, 20) + "...");
      console.log("👤 Personnel:", personnel);

      // Mettre à jour IMMÉDIATEMENT tous les states
      setToken(newToken);
      setUser(personnel);
      setIsAuthenticated(true);
      localStorage.setItem("token", newToken);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Erreur de connexion:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  // Fonction pour recharger les données utilisateur (utile après login)
  const reloadUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8000/api/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Erreur reloadUser:", error);
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
