import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState(""); // New
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    const newErrors = {};
    setFormMessage("");

    if (!name) newErrors.name = "Please enter your name.";
    if (!email) newErrors.email = "Please enter your email.";
    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: "User", // 👈 Default role
      });

      setFormMessage("✅ Registration successful! Please verify your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      let friendlyMessage = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        friendlyMessage = "Email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email.";
      }
      setFormMessage(`❌ ${friendlyMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Name Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            className={`w-full p-2 border rounded dark:bg-gray-700 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
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
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full p-2 border rounded dark:bg-gray-700 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
        >
          Register
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
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
