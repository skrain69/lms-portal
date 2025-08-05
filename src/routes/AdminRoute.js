import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdminDashboard from "../pages/AdminDashboard";

const AdminRoute = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!auth.currentUser || userData?.role !== "admin") return <Navigate to="/login" replace />;

  return <AdminDashboard />;
};

export default AdminRoute;
