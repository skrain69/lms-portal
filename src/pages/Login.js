import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formMessage, setFormMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setFormMessage("");
    if (!form.email || !form.password) {
      setFormMessage("❌ Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = res.user;

      // ❌ Deny access if not in Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await auth.signOut();
        setFormMessage("❌ Access denied. Account not found.");
        setLoading(false);
        return;
      }

      // ❌ Deny access if not verified
      if (!user.emailVerified) {
        setFormMessage("⚠️ Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      await refreshUserData(); // ✅ Sync context with Firestore
      navigate("/");
    } catch (error) {
      let msg = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") msg = "No account found.";
      if (error.code === "auth/wrong-password") msg = "Incorrect password.";
      setFormMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {["email", "password"].map((field) => (
          <div className="mb-4" key={field}>
            <input
              type={field === "password" ? "password" : "email"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-2 border rounded dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {formMessage && (
          <p className="text-sm text-center mb-4 text-red-600 dark:text-red-400">
            {formMessage}
          </p>
        )}

        <div className="flex justify-center text-sm">
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
