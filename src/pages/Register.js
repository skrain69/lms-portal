import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    wireSign: "",
    contact: "",
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
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.wireSign.trim() || !/^[A-Za-z]{2}$/.test(form.wireSign)) {
      newErrors.wireSign = "Wire Sign must be exactly 2 letters.";
    }

    if ((form.contact.match(/\d/g) || []).length < 11) {
      newErrors.contact = "Contact number must contain at least 11 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailExistsInFirestore = async (email) => {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleRegister = async () => {
    setFormMessage("");
    if (!validate()) return;

    try {
      const emailExists = await checkEmailExistsInFirestore(form.email);
      if (emailExists) {
        setFormMessage("❌ Email is already registered in the system.");
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = res.user;

      await updateProfile(user, { displayName: form.name });
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name.trim(),
        email: form.email.toLowerCase(),
        wireSign: form.wireSign.trim().toUpperCase(),
        contact: form.contact.trim(),
        photoURL: "",
        role: "User",
      });

      setFormMessage("✅ Registration successful! Please verify your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "Email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak.";
      }
      setFormMessage(`❌ ${message}`);
    }
  };

  const inputClass = (field) =>
    `w-full p-2 pr-10 border rounded dark:bg-gray-700 ${
      errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
    }`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Name, Email, WireSign, Contact */}
        {["name", "email", "wireSign", "contact"].map((field) => (
          <div className="mb-4" key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={
                field === "wireSign"
                  ? "Wire Sign (e.g. AB)"
                  : field === "contact"
                  ? "Contact Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className={inputClass(field)}
              value={form[field]}
              onChange={handleChange}
            />
            {errors[field] && (
              <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Password + Confirm Password */}
        {["password", "confirmPassword"].map((field) => (
          <div className="mb-4 relative" key={field}>
            <input
              type={showPassword[field] ? "text" : "password"}
              name={field}
              placeholder={field === "confirmPassword" ? "Confirm Password" : "Password"}
              className={inputClass(field)}
              value={form[field]}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-500 hover:underline focus:outline-none"
            >
              {showPassword[field] ? "Hide" : "Show"}
            </button>
            {errors[field] && (
              <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
        >
          Register
        </button>

        {formMessage && (
          <p
            className={`text-sm text-center mb-4 ${
              formMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
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
