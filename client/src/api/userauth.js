// api/authService.js or wherever your API functions are
import axios from "axios";

// global API URL
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/";
export const token = localStorage.getItem("token");


// ✅ Named export using ES module syntax
export const register = async (name, email, password, role = "user") => {
  try {
    const res = await axios.post(`${apiUrl}api/auth/register`, {
      name,
      email,
      password,
      role,
    });

    console.log("Registration successful:", res.data);
    
    return res.data;
  } catch (error) {
    console.error(
      "Error during registration:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${apiUrl}api/auth/login`, {
      email,
      password,
    });

    console.log("Login successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const logout = async () => {
  try {
    localStorage.removeItem("token");
    if(localStorage.getItem("token")) {
      throw new Error("Logout failed, token still exists");
    } else {
      console.log("Logout successful");
      return { message: "Logout successful" };
    }
  }catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

// context provider

