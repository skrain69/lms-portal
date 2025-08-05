// src/pages/Home.js
import { useSearchParams } from "react-router-dom";
import Directory from "../pages/Directory"; // ✅ make sure path is correct
import Settings from "../pages/Settings"; // if needed

const Home = () => {
  const [searchParams] = useSearchParams();
  const showDirectory = searchParams.get("directory") === "true";
  const showSettings = searchParams.get("settings") === "true";

  return (
    <div className="space-y-6">
      {showDirectory && <Directory />}
      {showSettings && <Settings />}
      {!showDirectory && !showSettings && (
        <div className="text-gray-600 dark:text-gray-300 p-4">
          Welcome to the dashboard. Use the sidebar to navigate.
        </div>
      )}
    </div>
  );
};

export default Home;
