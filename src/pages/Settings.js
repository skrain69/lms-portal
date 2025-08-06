import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Notification Banner
const InlineNotif = ({ notif, onClose }) => {
  if (!notif.visible) return null;

  const base =
    "mb-4 p-3 rounded text-sm flex items-start justify-between gap-3 transition-all";
  const style =
    notif.type === "success"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <div className={`${base} ${style}`} role="status" aria-live="polite">
      <div className="flex-1">{notif.message}</div>
      <button
        onClick={onClose}
        className="ml-2 text-xs font-semibold px-2 py-1 rounded hover:opacity-80"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

const Settings = () => {
  const { currentUser, refreshUserData } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    wireSign: "",
    contact: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || "",
            email: data.email || currentUser.email || "",
            role: data.role || "",
            wireSign: data.wireSign || "",
            contact: data.contact || "",
            photoURL: data.photoURL || "",
          });
        }
      } catch {
        setNotif({
          visible: true,
          type: "error",
          message: "Failed to load settings.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!notif.visible) return;
    const timer = setTimeout(() => setNotif((n) => ({ ...n, visible: false })), 4000);
    return () => clearTimeout(timer);
  }, [notif.visible]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const { name, wireSign, contact, photoURL } = form;

    if (!name.trim() || !wireSign.trim() || !contact.trim()) {
      return setNotif({
        visible: true,
        type: "error",
        message: "Please complete all required fields.",
      });
    }

    if (!/^[A-Za-z]{2}$/.test(wireSign.trim())) {
      return setNotif({
        visible: true,
        type: "error",
        message: "Wire Sign must be exactly 2 letters.",
      });
    }

    if ((contact.match(/\d/g) || []).length < 11) {
      return setNotif({
        visible: true,
        type: "error",
        message: "Contact must contain at least 11 digits.",
      });
    }

    setSaving(true);
    try {
      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, {
        name: name.trim(),
        wireSign: wireSign.trim().toUpperCase(),
        contact: contact.trim(),
        photoURL: photoURL.trim(),
      });

      if (typeof refreshUserData === "function") {
        await refreshUserData(); // ✅ Refresh auth context
      }

      setNotif({
        visible: true,
        type: "success",
        message: "Settings updated successfully.",
      });

      setTimeout(() => window.location.reload(), 1000); // ✅ Update Navbar/avatar/etc
    } catch {
      setNotif({
        visible: true,
        type: "error",
        message: "Save failed. Try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-gray-900 dark:text-gray-100">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-gray-800 p-6 rounded shadow-sm"
        >
          <h1 className="text-xl font-semibold mb-6">User Settings</h1>

          {/* Editable fields */}
          {[
            { label: "Name", name: "name", type: "text", required: true },
            {
              label: "Wire Sign",
              name: "wireSign",
              type: "text",
              required: true,
              maxLength: 2,
            },
            {
              label: "Contact Number",
              name: "contact",
              type: "tel",
              required: true,
            },
            { label: "Photo URL", name: "photoURL", type: "url" },
          ].map(({ label, name, type, required, maxLength }) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={required}
                maxLength={maxLength}
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          ))}

          {/* Read-only fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email (read-only)</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role (read-only)</label>
            <input
              type="text"
              value={form.role}
              disabled
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Notification */}
          <div className="mt-4">
            <InlineNotif
              notif={notif}
              onClose={() => setNotif((n) => ({ ...n, visible: false }))}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
