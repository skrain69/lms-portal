import {
  Home,
  Settings,
  Users,
  LogOut,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // 🆕 Modal state

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

  const handleLogoClick = () => {
    setLogoClicked(true);
  };

  useEffect(() => {
    if (logoClicked) {
      const timer = setTimeout(() => setLogoClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [logoClicked]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white/80 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg sm:hidden backdrop-blur-md"
        aria-label="Toggle Sidebar"
      >
        <Menu size={20} className="text-gray-800 dark:text-gray-100" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-16 sm:w-16 flex flex-col justify-between 
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
        border-r border-gray-200 dark:border-gray-800 
        transition-all duration-300 ease-in-out rounded-r-2xl shadow-lg
        ${mobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        <div className="flex flex-col items-center pt-6 gap-6">
          {/* Clickable logo */}
          <img
            src="/logo-main.svg"
            alt="Logo"
            onClick={handleLogoClick}
            className={`w-7 h-7 cursor-pointer transition-transform duration-300 ${
              logoClicked ? "scale-150" : "scale-100"
            }`}
          />

          {/* Navigation Links */}
          {links.map((link) => (
            <button
              key={link.label}
              title={link.label}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
              className={`p-2 rounded-xl transition-all text-sm font-medium
                hover:bg-blue-100 dark:hover:bg-gray-700
                ${isActive(link.path)
                  ? "bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"}`}
            >
              {link.icon}
            </button>
          ))}
        </div>

        {/* Avatar + Logout */}
        <div className="flex flex-col items-center pb-6 gap-4">
          {userData?.photoURL ? (
            <img
              src={userData.photoURL}
              alt="Avatar"
              title="Click to enlarge"
              onClick={() => setModalOpen(true)}
              className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-700 cursor-pointer hover:scale-110 transition"
            />
          ) : (
            <div
              title={userData?.name || "User"}
              className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-white"
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

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ✅ Avatar Modal */}
      {modalOpen && userData?.photoURL && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg"
              aria-label="Close"
            >
              <CloseIcon size={18} />
            </button>
            <img
              src={userData.photoURL}
              alt="Full Size Avatar"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg border border-white dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
