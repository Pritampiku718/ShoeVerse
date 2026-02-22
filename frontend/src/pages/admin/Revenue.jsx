// frontend/src/pages/admin/Revenue.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart, 
  FiCreditCard,
  FiCalendar,
  FiDownload 
} from 'react-icons/fi';
import RevenueChart from './charts/RevenueChart';
import MonthlyRevenueChart from './charts/MonthlyRevenueChart';
import CategoryRevenueChart from './charts/CategoryRevenueChart';
import PaymentMethodChart from './charts/PaymentMethodChart';
import { useRevenue } from '../../hooks/useRevenue';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { exportToCSV } from '../../utils/exportUtils';

const Revenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const { getRevenueData } = useRevenue();

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchRevenueData = async () => {
    try {
      const response = await getRevenueData({ range: dateRange });
      setData(response);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(data?.revenue?.daily, 'daily-revenue.csv');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Revenue Analytics</h1>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FiDownload size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
          <p className="text-blue-200 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-white">${data?.revenue?.total?.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6">
          <p className="text-green-200 text-sm mb-1">Average Order Value</p>
          <p className="text-3xl font-bold text-white">${data?.revenue?.aov?.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
          <p className="text-purple-200 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-white">{data?.orders?.total}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6">
          <p className="text-orange-200 text-sm mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-white">3.2%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Daily Revenue
          </h2>
          <RevenueChart data={data?.revenue?.daily} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-green-500" />
            Monthly Revenue
          </h2>
          <MonthlyRevenueChart data={data?.revenue?.monthly} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiPieChart className="text-purple-500" />
            Revenue by Category
          </h2>
          <CategoryRevenueChart data={data?.revenue?.byCategory} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiCreditCard className="text-orange-500" />
            Revenue by Payment Method
          </h2>
          <PaymentMethodChart data={data?.revenue?.byPaymentMethod} />
        </motion.div>
      </div>

      {/* Quarterly Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FiCalendar className="text-yellow-500" />
          Quarterly Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data?.revenue?.quarterly?.map((quarter, index) => (
            <div key={index} className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Q{quarter._id.quarter} {quarter._id.year}</p>
              <p className="text-xl font-bold text-white">${quarter.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{quarter.count} orders</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Revenue;