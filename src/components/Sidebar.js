import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import AvatarModal from "./AvatarModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData: authUserData, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (authUserData) return setUserData(authUserData);
      if (!currentUser?.uid) return;
      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserData(snap.data());
      } catch (err) {
        console.error("Sidebar user fetch failed:", err);
      }
    };
    fetchUser();
  }, [authUserData, currentUser]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", !prev);
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      else await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.replace("/login");
    }
  };

  const wireSign = userData?.wireSign?.toUpperCase() || "";
  const displayName =
    wireSign || userData?.name || currentUser?.displayName || "User";
  const role = userData?.role || "Employee";
  const photoURL = userData?.photoURL || currentUser?.photoURL || null;

  const navLink = (to, label, icon, match = pathname === to) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded transition ${
        match
          ? "bg-blue-200 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : ""}
    >
      <span>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 ease-in-out p-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col min-h-screen`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Avatar */}
      <div
        className="flex flex-col items-center mb-6 cursor-pointer"
        onClick={() => photoURL && setShowAvatarModal(true)}
        title={collapsed ? displayName : ""}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt="Avatar"
            className={`rounded-full object-cover border-2 border-white dark:border-gray-800 shadow ${
              collapsed ? "h-10 w-10" : "h-24 w-24"
            } transition-all`}
          />
        ) : (
          <div
            className={`rounded-full bg-gray-300 dark:bg-gray-700 text-white font-semibold flex items-center justify-center ${
              collapsed ? "h-10 w-10 text-sm" : "h-24 w-24 text-xl"
            }`}
          >
            {displayName.slice(0, 2)}
          </div>
        )}
        {!collapsed && (
          <>
            <div className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-100 text-center">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {role}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {/* Dashboard */}
        {navLink("/", "Dashboard", "📊", pathname === "/" && !search)}

        {/* Directory */}
        <button
          onClick={() => navigate("/?directory=true")}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition ${
            pathname === "/" && search.includes("directory=true")
              ? "bg-blue-200 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Directory" : ""}
        >
          <span>📇</span>
          {!collapsed && <span>Directory</span>}
        </button>

        {/* Calendar */}
        <button
          onClick={() => navigate("/?calendar=true")}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition ${
            pathname === "/" && search.includes("calendar=true")
              ? "bg-blue-200 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Calendar" : ""}
        >
          <span>📅</span>
          {!collapsed && <span>Calendar</span>}
        </button>

        {/* Settings */}
        <button
          onClick={() =>
            collapsed
              ? setShowSettingsModal(true)
              : setSettingsOpen((prev) => !prev)
          }
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition ${
            pathname === "/settings"
              ? "bg-blue-200 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Settings" : ""}
        >
          <span>⚙️</span>
          {!collapsed && <span>Settings</span>}
        </button>

        {!collapsed && settingsOpen && (
          <div className="ml-4 mt-1 space-y-1">
            <button
              onClick={() => navigate("/?settings=true")}
              className="block w-full text-left px-4 py-2 text-sm rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              Preferences
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm rounded hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Notes Section */}
      {!collapsed && (
        <div className="mt-auto pt-6">
          <h4 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-400">
            NOTES
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No updates yet
          </p>
        </div>
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModal
          photoURL={photoURL}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* Settings Modal (collapsed mode only) */}
      {collapsed && showSettingsModal && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Settings
            </h2>
            <button
              onClick={() => {
                navigate("/?settings=true");
                setShowSettingsModal(false);
              }}
              className="block w-full text-left mb-2 px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Preferences
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 rounded hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
            >
              Logout
            </button>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="block mt-4 mx-auto px-4 py-1 text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
