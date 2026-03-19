import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import http from "../api/http";

const AuthContext = createContext();
const TOKEN_KEY = "bonjourbee_token";

function getFriendlyError(error, fallback) {
  return error?.response?.data?.error || fallback;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await http.get("/user/profile");
        setUser(data.user);
      } catch (error) {
        console.error("Session restore failed", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    const { data } = await http.post("/auth/login", credentials);
    saveSession(data.token, data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await http.post("/auth/register", payload);
    saveSession(data.token, data.user);
    return data.user;
  };

  const refreshProfile = async () => {
    const { data } = await http.get("/user/profile");
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await http.put("/user/update", updates);
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(getFriendlyError(error, "Failed to update profile"));
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      refreshProfile,
      updateProfile,
    }),
    [user, token, loading],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-amber-300"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
