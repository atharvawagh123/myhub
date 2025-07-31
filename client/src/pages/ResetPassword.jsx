import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useAuth} from "../api/Authcontext";

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword , logoutFromOtherDevices} = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await resetPassword(token, newPassword);
      console.log("Password reset successful:", res);
      if (res.token) {
        console.log("New token received:", res.token);
        localStorage.setItem("token", res.token); // ✅ store new token
      }
      if (res) {
        setMessage("Password has been reset successfully.");

        // i wanted to ask user logout other devices after password reset
        const result = prompt(
          "Do you want to log out from other devices? (yes/no)"
        );
        if (result && result.toLowerCase() === "yes") {
          const response = await logoutFromOtherDevices();
          console.log("Logged out from other devices:", response);
        }
        else {
          // If user chooses not to log out from other devices, redirect to login
          navigate("/login");
        }

        
      }

     
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handleReset}>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition duration-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
