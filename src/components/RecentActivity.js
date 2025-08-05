// src/pages/RecentActivity.js
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const q = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActivities(data);
      } catch (err) {
        console.error("Failed to load activity logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Recent Activity
        </h1>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No recent activity found.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="text-gray-800 dark:text-gray-100">
                  {activity.description || "No description"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.timestamp?.toDate().toLocaleString() || ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default RecentActivity;


