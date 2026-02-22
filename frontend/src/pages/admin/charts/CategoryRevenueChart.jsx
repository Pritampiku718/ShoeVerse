// frontend/src/pages/admin/charts/CategoryRevenueChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CategoryRevenueChart = ({ data }) => {
  const defaultData = [
    { name: 'Running', value: 45000 },
    { name: 'Basketball', value: 32000 },
    { name: 'Lifestyle', value: 38000 },
    { name: 'Training', value: 28000 },
    { name: 'Skate', value: 15000 },
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
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
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

export default CategoryRevenueChart;