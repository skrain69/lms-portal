import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formMessage, setFormMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
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

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        await auth.signOut();
        setFormMessage("❌ Access denied. Account not found.");
        setLoading(false);
        return;
      }

      if (!user.emailVerified) {
        setFormMessage("⚠️ Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      await refreshUserData();
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

  const inputClass =
    "w-full p-2 pr-10 border rounded-md bg-gray-900 text-white placeholder-gray-400 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600";

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -left-32 -top-24 opacity-30 z-0 animate-spin-slow"></div>
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -right-32 -bottom-24 opacity-30 z-0 animate-spin-slow"></div>

      <div className="relative z-10 w-full max-w-md bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-10 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-sm mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-8 right-3 text-gray-400"
            aria-label="Toggle Password Visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        {formMessage && (
          <p className="text-sm text-center mb-4 text-red-500">
            {formMessage}
          </p>
        )}

        <div className="flex items-center my-5 text-sm text-gray-400">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3">Or login with</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          className="w-full flex justify-center items-center gap-2 border border-blue-500 text-blue-400 rounded-md py-2 hover:bg-blue-950 transition"
          onClick={() => alert("🔐 TODO: Google Auth")}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-medium">Sign in with Google</span>
        </button>

        <p className="text-sm text-center mt-5">
          Don’t have an account? {" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create new
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
