// authAxios.js
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/";

const authAxios = axios.create({
  baseURL: apiUrl,
});

// Automatically add token to headers
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ya sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authAxios;
