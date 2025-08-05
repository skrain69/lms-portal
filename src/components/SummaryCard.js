import { BarChart3 } from "lucide-react";

const SummaryCard = ({ title, value, subtitle, icon: Icon = BarChart3 }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <div className="p-3 bg-blue-100 rounded-full mr-4">
        <Icon className="text-blue-600 w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className="text-xl font-semibold">{value}</p>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
};

export default SummaryCard;
