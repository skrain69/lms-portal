// src/components/TrafficChart.js
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";

const data = [
  { name: "Mon", users: 100 },
  { name: "Tue", users: 300 },
  { name: "Wed", users: 200 },
  { name: "Thu", users: 400 },
  { name: "Fri", users: 150 },
];

const TrafficChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Weekly Traffic
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke={isDark ? "#374151" : "#e5e7eb"} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={isDark ? "#d1d5db" : "#374151"} />
          <YAxis stroke={isDark ? "#d1d5db" : "#374151"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: isDark ? "#4b5563" : "#e5e7eb",
              color: isDark ? "#f3f4f6" : "#111827",
            }}
            labelStyle={{
              color: isDark ? "#f3f4f6" : "#111827",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke={isDark ? "#60a5fa" : "#2563eb"}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
