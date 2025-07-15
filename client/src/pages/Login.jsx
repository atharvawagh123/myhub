import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../api/Authcontext";

const Login = () => {
  const navigate = useNavigate();
  const { login, setIsLoggedIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    e.preventDefault();
    // Update form state with input values
    // Using spread operator to maintain immutability
    // This allows us to update only the changed field
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate form inputs
    if (!form.email || !form.password) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    // check if email is valid
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("❌ Please enter a valid email");
      return;
    }

    try {
      const res = await login(form.email, form.password);

      // Save token in localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("✅ Login Successful!");
      // Set logged-in state
      setIsLoggedIn(true);
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "❌ Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            Don&apos;t have an account?
            <Link to="/register" className="text-blue-600 ml-1 hover:underline">
              Register
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
