import React, { createContext, useEffect, useState } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getCookie("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // small startup delay to simulate async restore (and keep compatibility with components
    // that check `loading` on mount). In the real app you might verify the token with the API here.
    setLoading(false);
  }, []);

  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem("token", newToken);
      // Also set cookie for apiHelper using js-cookie
      setCookie("token", newToken, { path: "/" });
    }
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Also clear cookie using js-cookie
    removeCookie("token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
