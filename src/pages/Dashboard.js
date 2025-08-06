// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";

import Layout from "../components/Layout";
import TrafficChart from "../components/TrafficChart";
import Settings from "./Settings";
import Directory from "./Directory";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const showSettings = query.get("settings") === "true";
  const showDirectory = query.get("directory") === "true";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData({ uid: currentUser.uid, ...userSnap.data() });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUserData(null); // ✅ Clear state on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      {!showSettings && !showDirectory && (
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {userData
            ? `Welcome back, ${userData.name || userData.wireSign || "User"}.`
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
