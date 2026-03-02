import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const PaymentMethodChart = ({ data, darkMode }) => {
  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div
        className={`h-64 flex items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        No payment method data available
      </div>
    );
  }

  // Format data for pie chart with shorter labels
  const formattedData = chartData.map((item) => {
    let name = item._id || item.method || item.name || "Unknown";

    // Shorten long payment method names
    if (name === "Cash on Delivery") {
      name = "Cash on Del";
    } else if (name === "Credit Card") {
      name = "Credit";
    } else if (name === "Debit Card") {
      name = "Debit";
    } else if (name === "PayPal") {
      name = "PayPal";
    }

    return {
      originalName: item._id || item.method || item.name || "Unknown", // Keep original for tooltip
      name: name,
      value: item.revenue || item.value || 0,
    };
  });

  // Calculate total for percentages
  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  // Custom label that shows percentage only
  const renderCustomizedLabel = ({ name, percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: "0.5rem",
            color: darkMode ? "#ffffff" : "#000000",
          }}
          formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
          // Show original name in tooltip
          labelFormatter={(label, payload) => {
            if (payload && payload[0] && payload[0].payload) {
              return payload[0].payload.originalName;
            }
            return label;
          }}
        />
        <Legend
          wrapperStyle={{
            color: darkMode ? "#9ca3af" : "#6b7280",
            fontSize: "12px",
            paddingTop: "20px",
          }}
          
          // Use original names
          formatter={(value, entry) => {
            return entry.payload?.originalName || value;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentMethodChart;
