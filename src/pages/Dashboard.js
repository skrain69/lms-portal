import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Settings from "./Settings";
import Directory from "./Directory";

const Dashboard = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const showSettings = query.get("settings") === "true" || query.get("uid") !== null;
  const showDirectory = query.get("directory") === "true";

  const currentPage = query.get("uid")
    ? "User Profile"
    : showSettings
    ? "Settings"
    : showDirectory
    ? "Directory"
    : "Dashboard";

  return (
    <Layout>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <span
                className="hover:underline cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                Home
              </span>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-700 dark:text-gray-200">
              {currentPage}
            </li>
          </ol>
        </nav>

        {/* Page Content */}
        {showSettings && <Settings inline />}
        {showDirectory && <Directory inline />}
      </div>
    </Layout>
  );
};

export default Dashboard;
