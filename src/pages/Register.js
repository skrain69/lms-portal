import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    wireSign: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Please enter your name.";
    if (!form.email) newErrors.email = "Please enter your email.";
    if (!form.contact) newErrors.contact = "Please enter your contact number.";
    if (!form.wireSign) newErrors.wireSign = "Please enter your wire sign.";
    else if (form.wireSign.length !== 2)
      newErrors.wireSign = "Wire sign must be exactly 2 characters.";
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setFormMessage("");
    if (!validate()) return;

    try {
      const emailCheck = await getDoc(doc(db, "email_index", form.email));
      if (emailCheck.exists()) {
        setFormMessage("❌ Email already registered.");
        return;
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = res.user;

      await updateProfile(user, { displayName: form.name });
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        contact: form.contact,
        wireSign: form.wireSign,
        role: "User",
      });

      await setDoc(doc(db, "email_index", form.email), { uid: user.uid });

      setFormMessage("✅ Registration successful! Please verify your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "Email already registered in Firebase.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      setFormMessage(`❌ ${message}`);
    }
  };

  const inputClass = (field) =>
    `w-full p-2 pr-10 border rounded-md bg-gray-900 text-white placeholder-gray-400 ${
      errors[field] ? "border-red-500" : "border-gray-600"
    } focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -left-32 -top-24 opacity-30 z-0 animate-spin-slow"></div>
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-900 to-indigo-700 rounded-[40%] -right-32 -bottom-24 opacity-30 z-0 animate-spin-slow"></div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg px-8 py-10 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* Text Fields */}
        {Object.entries({
          name: "Name",
          email: "Email",
          contact: "Contact",
          wireSign: "Wire Sign",
        }).map(([field, label]) => (
          <div className="mb-4" key={field}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={`Enter your ${label}`}
              className={inputClass(field)}
              value={form[field]}
              onChange={handleChange}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Password Fields */}
        {Object.entries({
          password: "Password",
          confirmPassword: "Confirm Password",
        }).map(([field, label]) => (
          <div className="mb-4 relative" key={field}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type={showPassword[field] ? "text" : "password"}
              name={field}
              placeholder={label}
              className={inputClass(field)}
              value={form[field]}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field)}
              className="absolute top-8 right-3 text-gray-400"
              aria-label="Toggle Password Visibility"
            >
              {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md mb-4 text-sm font-medium transition"
        >
          Register
        </button>

        {/* Status Message */}
        {formMessage && (
          <p
            className={`text-sm text-center mb-4 ${
              formMessage.startsWith("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {formMessage}
          </p>
        )}

        {/* Navigation Link */}
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
