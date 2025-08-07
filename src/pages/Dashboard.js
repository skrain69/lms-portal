import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";

import Layout from "../components/Layout";
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
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        {!showSettings && !showDirectory && (
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
            {userData
              ? `Welcome back, ${userData.name || userData.wireSign || "User"}.`
              : "Here's what's happening today."}
          </p>
        )}

        {showSettings ? (
          <div className="w-full">
            <Settings inline />
          </div>
        ) : showDirectory ? (
          <div className="w-full">
            <Directory inline />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Dashboard;
