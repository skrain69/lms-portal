import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = {};
    setFormMessage("");

    if (!email) newErrors.email = "Please enter your email.";
    if (!password) newErrors.password = "Please enter your password.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        setFormMessage("⚠️ Please verify your email before logging in.");
        return;
      }

      setFormMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      // Friendly message
      let friendlyMessage = "An error occurred. Please try again.";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        friendlyMessage = "Incorrect email or password.";
      } else if (error.code === "auth/too-many-requests") {
        friendlyMessage = "Too many attempts. Please try again later.";
      }

      setFormMessage(`❌ ${friendlyMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2 border rounded dark:bg-gray-700 ${
              errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
        >
          Login
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

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
