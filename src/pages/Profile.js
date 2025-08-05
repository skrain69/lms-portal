import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", contact: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({ name: data.name || "", contact: data.contact || "" });
      }
    };
    fetchProfile();
  }, [currentUser.uid]);

  const handleUpdate = async () => {
    if (!profile.name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: profile.name,
        contact: profile.contact,
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow text-gray-900 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <label className="block mb-1">Name</label>
      <input
        type="text"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
      />

      <label className="block mb-1">Contact</label>
      <input
        type="text"
        value={profile.contact}
        onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>

      {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
    </div>
  );
};

export default Profile;
