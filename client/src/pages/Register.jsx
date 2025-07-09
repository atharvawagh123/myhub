import React, { useState } from "react";
import { useAuth } from "../api/Authcontext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form.name, form.email, form.password, form.role);

      toast.success("✅ Registered Successfully!");
      setForm({ name: "", email: "", password: "", role: "user" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "❌ Registration Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <div className="text-sm text-center text-gray-600">
            Already have an account?
            <Link to="/login" className="text-blue-600 ml-1 hover:underline">
              Login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
