// AuthContext.js
import React, { createContext, useContext , useState} from "react";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "./userauth";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return token ? true : false;
  });
  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        token,
        isLoggedIn,
        setIsLoggedIn,
        user,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
