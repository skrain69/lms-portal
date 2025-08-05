// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Layout from "../components/Layout";
import TrafficChart from "../components/TrafficChart";
import Settings from "./Settings";
import Directory from "./Directory"; // ✅ Import Directory
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const showSettings = query.get("settings") === "true";
  const showDirectory = query.get("directory") === "true";

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) setUserData(userDoc.data());
      }
    };
    fetchUser();
  }, []);

  return (
    <Layout>
      {!showSettings && !showDirectory && (
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {userData
            ? `Welcome back, ${userData.name || userData.role}.`
            : "Here's what's happening today."}
        </p>
      )}

      {showSettings ? (
        <Settings inline />
      ) : showDirectory ? (
        <Directory inline />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
