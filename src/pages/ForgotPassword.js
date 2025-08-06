import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMessage("");
    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Reset link sent! Please check your inbox.");
    } catch (error) {
      let msg = "Something went wrong.";
      if (error.code === "auth/user-not-found") msg = "No account found.";
      else if (error.code === "auth/invalid-email") msg = "Invalid email address.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -left-32 -top-24 opacity-30 z-0 animate-spin-slow" />
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -right-32 -bottom-24 opacity-30 z-0 animate-spin-slow" />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-10 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 pr-10 border rounded-md bg-gray-900 text-white placeholder-gray-400 border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md mb-4 text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className={`text-sm text-center mb-4 ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-sm text-center">
          Go back to{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
