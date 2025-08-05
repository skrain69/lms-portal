// src/components/ThemeToggle.js
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded border dark:border-white border-black"
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
