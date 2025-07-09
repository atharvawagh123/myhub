// AuthContext.js
import React, { createContext, useContext } from "react";
import { register, login, logout, token } from "./userauth";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ register, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
