// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react"; 
import { getCookie, setCookie, removeCookie } from "../utils/cookie"; 
import apiHelper from "../utils/apiHelper"; 
import { apiUrls } from "../utils/constants"; 

const AuthContext = createContext(null);

// FIX: ĐÃ XÓA export const useAuth = () => useContext(AuthContext); 
// (Vì bạn đã có file useAuth.js riêng, gây ra lỗi HMR)

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getCookie("token") || null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const bootstrapAsync = async () => {
      const currentToken = getCookie("token"); 
      
      if (!currentToken) {
        setUser(null);
        setToken(null);
        setLoading(false); 
        return;
      }

      try {
        const response = await apiHelper.get(apiUrls.getMe);
        
        if (response.success && response.data) {
          setUser(response.data);
          setToken(currentToken);
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Bootstrap error:", error);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        removeCookie("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []); 

  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem("token", newToken);
      setCookie("token", newToken, { path: "/" }); 
    }
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    removeCookie("token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const response = await apiHelper.get(apiUrls.getMe);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
    return null;
  };

  // HÀM GỐC: Trả về boolean
  const isAuthenticated = () => Boolean(token); 

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading, 
        login,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated, // Cung cấp hàm isAuthenticated()
      }}
    >

      {!loading && children} 
    </AuthContext.Provider>
  );
};

// FIX: Thêm lại default export để khắc phục lỗi HMR "export removed"
export default AuthContext;