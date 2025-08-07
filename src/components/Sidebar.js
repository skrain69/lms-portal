// ✅ src/components/Sidebar.js
import {
  Home,
  Settings,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/" },
    { label: "Directory", icon: <Users size={20} />, path: "/?directory=true" },
    { label: "Settings", icon: <Settings size={20} />, path: "/?settings=true" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    const url = new URLSearchParams(location.search);
    return location.pathname === path || url.toString() === path.split("?")[1];
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md sm:hidden"
        aria-label="Toggle Sidebar"
      >
        <Menu size={20} className="text-gray-800 dark:text-gray-100" />
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-16 sm:w-16 flex flex-col justify-between bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="flex flex-col items-center pt-6 gap-6">
          <img
            src="/logo-main.svg"
            alt="Logo"
            className="w-6 h-6"
          />

          {links.map((link) => (
            <button
              key={link.label}
              title={link.label}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
              className={`p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition ${
                isActive(link.path)
                  ? "bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {link.icon}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center pb-6 gap-4">
          {userData?.photoURL ? (
            <img
              src={userData.photoURL}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
          ) : (
            <div
              title={userData?.name || "User"}
              className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-white"
            >
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <button
            title="Logout"
            onClick={handleLogout}
            className="p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
