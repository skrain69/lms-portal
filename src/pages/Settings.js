import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const InlineNotif = ({ notif, onClose }) => {
  if (!notif.visible) return null;

  const base = "mb-4 p-3 rounded text-sm flex items-start justify-between gap-3 transition-all";
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [wireSign, setWireSign] = useState("");
  const [contact, setContact] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [notif, setNotif] = useState({ visible: false, type: "success", message: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setEmail(data.email || currentUser.email || "");
          setRole(data.role || "");
          setWireSign(data.wireSign || "");
          setContact(data.contact || "");
          setPhotoURL(data.photoURL || "");
        }
      } catch {
        setNotif({ visible: true, type: "error", message: "Failed to load settings." });
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!name.trim() || !wireSign.trim() || !contact.trim()) {
      return setNotif({ visible: true, type: "error", message: "Please complete all required fields." });
    }

    if (!/^[A-Za-z]{2}$/.test(wireSign.trim())) {
      return setNotif({ visible: true, type: "error", message: "Wire Sign must be exactly 2 letters." });
    }

    if ((contact.match(/\d/g) || []).length < 11) {
      return setNotif({ visible: true, type: "error", message: "Contact must contain at least 11 digits." });
    }

    setSaving(true);
    try {
      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, {
        name: name.trim(),
        wireSign: wireSign.trim().toUpperCase(),
        contact: contact.trim(),
        photoURL: photoURL.trim()
      });

      if (typeof refreshUserData === "function") refreshUserData();

      setNotif({ visible: true, type: "success", message: "Settings updated successfully." });

      // ✅ Clear input fields after successful save
      setName("");
      setWireSign("");
      setContact("");
      setPhotoURL("");

    } catch {
      setNotif({ visible: true, type: "error", message: "Save failed. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-gray-900 dark:text-gray-100">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded shadow-sm">
          <h1 className="text-xl font-semibold mb-6">User Settings</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Wire Sign</label>
            <input
              type="text"
              value={wireSign}
              onChange={(e) => setWireSign(e.target.value.toUpperCase())}
              maxLength={2}
              required
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email (read-only)</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role (read-only)</label>
            <input
              type="text"
              value={role}
              disabled
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mt-4">
            <InlineNotif notif={notif} onClose={() => setNotif(n => ({ ...n, visible: false }))} />
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
