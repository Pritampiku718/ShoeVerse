import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data, darkMode }) => {
  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div
        className={`h-64 flex items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        No daily revenue data available
      </div>
    );
  }

  // Custom tick formatter to show fewer ticks on crowded charts
  const formatXAxis = (value, index) => {
    if (chartData.length > 30) {
      
      // Show every 7th tick for long ranges
      return index % 7 === 0 ? value : "";
    }
    if (chartData.length > 14) {
      
      // Show every 3rd tick for medium ranges
      return index % 3 === 0 ? value : "";
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? "#374151" : "#e5e7eb"}
        />
        <XAxis
          dataKey="date"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          tickFormatter={formatXAxis}
        />
        <YAxis
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: "0.5rem",
            color: darkMode ? "#ffffff" : "#000000",
          }}
          formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
