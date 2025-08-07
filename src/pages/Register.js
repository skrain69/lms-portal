// src/pages/Register.js
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  fetchSignInMethodsForEmail,
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
    if (!form.wireSign || form.wireSign.length !== 2)
      newErrors.wireSign = "Wire sign must be exactly 2 characters.";
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setFormMessage("");
    if (!validate()) return;

    try {
      // Check Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, form.email);
      if (methods.length > 0) {
        setFormMessage("❌ Email already registered in Firebase.");
        return;
      }

      // Check Firestore manually
      const existingDoc = await getDoc(doc(db, "email_index", form.email));
      if (existingDoc.exists()) {
        setFormMessage("❌ Email already exists in Firestore.");
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
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
        photoURL: user.photoURL || "",
      });

      await setDoc(doc(db, "email_index", form.email), { uid: user.uid });

      setFormMessage("✅ Registration successful! Please verify your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setFormMessage("❌ Registration failed. Please try again.");
    }
  };

  const inputClass = (field) =>
    `w-full p-2 pr-10 border rounded-md bg-gray-900 text-white placeholder-gray-400 ${
      errors[field] ? "border-red-500" : "border-gray-600"
    } focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* Input Fields */}
        {["name", "email", "contact", "wireSign"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={inputClass(field)}
              placeholder={`Enter your ${field}`}
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        {/* Password Fields */}
        {["password", "confirmPassword"].map((field) => (
          <div className="mb-4 relative" key={field}>
            <label className="block mb-1 capitalize">{field.replace("Password", " Password")}</label>
            <input
              type={showPassword[field] ? "text" : "password"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={inputClass(field)}
              placeholder={field}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field)}
              className="absolute top-8 right-3 text-gray-400"
            >
              {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <button
          onClick={handleRegister}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md mb-4"
        >
          Register
        </button>

        {formMessage && (
          <p
            className={`text-center text-sm mb-4 ${
              formMessage.startsWith("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {formMessage}
          </p>
        )}

        <p className="text-sm text-center">
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
