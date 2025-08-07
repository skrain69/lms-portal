import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

const UserProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser({ id: uid, ...snap.data() });
        } else {
          navigate("/?directory=true");
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        navigate("/?directory=true");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading profile...
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-gray-900 dark:text-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-500 hover:underline"
        >
          ← Back to Directory
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Full Name</p>
              <p>{user.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Wire Sign</p>
              <p>{user.wireSign || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p>{user.email || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">Contact</p>
              <p>{user.contact || "N/A"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium text-gray-500 dark:text-gray-400">Role</p>
              <p>{user.role || "N/A"}</p>
            </div>
          </div>

          {user.photoURL && (
            <div className="mt-6 text-center">
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-28 h-28 rounded-full mx-auto object-cover border border-gray-300 dark:border-gray-700"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
