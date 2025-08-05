import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Dashboard from "../pages/Dashboard";

const ProtectedRoute = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!auth.currentUser) return <Navigate to="/login" replace />;

  // Redirect admin users
  if (userData?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Dashboard />;
};

export default ProtectedRoute;
