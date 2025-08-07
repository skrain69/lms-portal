import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { userData } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="h-14 flex items-center justify-between px-6">
        {/* Left: Page Title */}
        <h1 className="text-lg font-medium text-gray-800 dark:text-gray-100">
          RPLL Portal
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-white">
            {userData?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
