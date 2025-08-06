import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react";

const Navbar = () => {
  const { userData, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef();

  const name = userData?.name || "User";
  const photoURL = userData?.photoURL || null;

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const docEl = document.documentElement;
    if (!document.fullscreenElement) {
      docEl.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Logout: reset everything and reload
  const handleLogout = async () => {
    try {
      await logout?.();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.replace("/login");
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenExit);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenExit);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full flex justify-center mt-4 px-4 z-30 relative">
      <div className="w-full max-w-6xl flex items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-3 shadow-sm">
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <label className="relative block">
            <span className="absolute inset-y-0 left-2 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Theme, Fullscreen, Avatar Menu */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {isFullscreen ? (
              <Minimize2 size={18} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Maximize2 size={18} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
              aria-label="User menu"
            >
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="User Avatar"
                  className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-2 z-50 text-sm">
                <button
                  onClick={() => {
                    navigate("/?settings=true");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Preferences
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
