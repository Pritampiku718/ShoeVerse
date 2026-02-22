// frontend/src/pages/admin/charts/PaymentMethodChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PaymentMethodChart = ({ data }) => {
  const defaultData = [
    { name: 'Credit Card', value: 85000 },
    { name: 'PayPal', value: 42000 },
    { name: 'Debit Card', value: 38000 },
    { name: 'Cash', value: 15000 },
    { name: 'Other', value: 8000 },
  ];

  const chartData = data || defaultData;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentMethodChart;