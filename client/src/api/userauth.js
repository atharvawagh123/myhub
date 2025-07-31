// api/authService.js or wherever your API functions are
import axios from "axios";

// global API URL
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/";



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
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${apiUrl}api/auth/forgot-password`, { email });
    return res.data;
  } catch (error) {
    console.error("Error during forgot password:", error);
    throw error;
  }
}
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await axios.post(`${apiUrl}api/auth/reset-password/${token}`, { newPassword });
    return res.data;
  } catch (error) {
    console.error("Error during reset password:", error);
    throw error;
  }
}

export const logoutFromOtherDevices = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axios.post(
    "/api/auth/logout-other"
  );

  return res.data;
};


// context provider

