import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const handleReset = async () => {
    const newErrors = {};
    setFormMessage("");

    if (!email) newErrors.email = "Please enter your email.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await sendPasswordResetEmail(auth, email);
      setFormMessage("✅ Password reset email sent! Check your inbox.");
    } catch (error) {
      let friendlyMessage = "An error occurred. Please try again.";

      if (error.code === "auth/user-not-found") {
        friendlyMessage = "No account found with this email.";
      }

      setFormMessage(`❌ ${friendlyMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-2 border rounded dark:bg-gray-700 ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
        >
          Send Reset Link
        </button>

        {formMessage && (
          <p
            className={`text-sm text-center mb-4 ${
              formMessage.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formMessage}
          </p>
        )}

        <div className="flex justify-center text-sm">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
