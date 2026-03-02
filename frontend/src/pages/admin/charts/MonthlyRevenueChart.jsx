import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyRevenueChart = ({ data, darkMode }) => {

  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div
        className={`h-64 flex items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        No monthly revenue data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? "#374151" : "#e5e7eb"}
        />
        <XAxis
          dataKey="month"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: "0.5rem",
            color: darkMode ? "#ffffff" : "#000000",
          }}
          formatter={(value) => [`$${value}`, "Revenue"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyRevenueChart;
