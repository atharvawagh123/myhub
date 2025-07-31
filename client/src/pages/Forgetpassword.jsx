import React, { useState } from "react";
import { useAuth } from "../api/Authcontext";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const { forgotPassword } = useAuth();
  const [showmsg, setshowmsg] = useState(false);
  const [showreset, setshowreset] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const res = await forgotPassword(email);
      if (res && res.message) {
          toast.success(res.message);
          console.log("Reset link sent successfully:", res);
        setshowmsg(true);
      } else {
        toast.error("Unexpected response");
      }
      e.target.reset();
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please try again later.");
      setshowmsg(false);
      setshowreset(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h1>
        <form onSubmit={handlesubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        {showmsg && (
          <p className="text-green-600 mt-4 text-center">
            Check your email for the reset link.
          </p>
        )}

        {showreset ? (
          <p className="text-red-500 mt-4 text-center">
            Something went wrong. Please try again later.
          </p>
        ) : (
          <p
            onClick={() => setshowreset(true)}
            className="text-blue-500 mt-4 text-center cursor-pointer hover:underline"
          >
            Didn't receive the email? Click here to try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Forgetpassword;
