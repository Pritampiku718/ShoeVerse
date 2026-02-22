// frontend/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiTrendingUp,
  FiClock,
  FiAlertCircle,
  FiActivity,
  FiCreditCard,
  FiCalendar,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';
import StatsCard from './StatsCard';
import RevenueChart from './charts/RevenueChart';
import MonthlyRevenueChart from './charts/MonthlyRevenueChart';
import CategoryRevenueChart from './charts/CategoryRevenueChart';
import PaymentMethodChart from './charts/PaymentMethodChart';
import RecentOrdersTable from './RecentOrdersTable';
import TopProducts from './TopProducts';
import LowStockAlerts from './LowStockAlerts';
import ActivityFeed from './ActivityFeed';
import { useRevenue } from '../../hooks/useRevenue';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getDashboardData } = useRevenue();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      setData(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2 text-gray-400">
          <FiClock />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards - Clickable */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleCardClick('/admin/revenue')} className="cursor-pointer">
          <StatsCard
            title="Total Revenue"
            value={data?.revenue?.total}
            icon={FiDollarSign}
            trend="+23.5%"
            trendLabel="vs last month"
            color="from-green-500 to-emerald-500"
            gradient
          />
        </div>
        <div onClick={() => handleCardClick('/admin/orders')} className="cursor-pointer">
          <StatsCard
            title="Total Orders"
            value={data?.orders?.total}
            icon={FiShoppingBag}
            trend="+12.3%"
            trendLabel="vs last month"
            color="from-blue-500 to-cyan-500"
            gradient
          />
        </div>
        <div onClick={() => handleCardClick('/admin/users')} className="cursor-pointer">
          <StatsCard
            title="Total Users"
            value={data?.users?.total}
            icon={FiUsers}
            trend="+8.2%"
            trendLabel="vs last month"
            color="from-purple-500 to-pink-500"
            gradient
          />
        </div>
        <div onClick={() => handleCardClick('/admin/products')} className="cursor-pointer">
          <StatsCard
            title="Total Products"
            value={data?.products?.total}
            icon={FiPackage}
            trend="+5.1%"
            trendLabel="vs last month"
            color="from-orange-500 to-red-500"
            gradient
          />
        </div>
      </motion.div>

      {/* Order Status Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
          <p className="text-yellow-400 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-white">{data?.orders?.pending}</p>
        </div>
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <p className="text-green-400 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-white">{data?.orders?.delivered}</p>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
          <p className="text-red-400 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-white">{data?.orders?.cancelled}</p>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <p className="text-purple-400 text-sm">Refunded</p>
          <p className="text-2xl font-bold text-white">{data?.orders?.refunded}</p>
        </div>
      </motion.div>

      {/* Revenue Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Daily Revenue (Last 7 Days)
          </h2>
          <RevenueChart data={data?.revenue?.daily} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-green-500" />
            Monthly Revenue (Last 12 Months)
          </h2>
          <MonthlyRevenueChart data={data?.revenue?.monthly} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiPieChart className="text-purple-500" />
            Revenue by Category
          </h2>
          <CategoryRevenueChart data={data?.revenue?.byCategory} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiCreditCard className="text-orange-500" />
            Revenue by Payment Method
          </h2>
          <PaymentMethodChart data={data?.revenue?.byPaymentMethod} />
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
          <TopProducts data={data?.topProducts} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiAlertCircle className="text-yellow-500" />
            Low Stock Alerts ({data?.products?.lowStock})
          </h2>
          <LowStockAlerts data={data?.lowStockProducts} />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-blue-500" />
            Recent Activity
          </h2>
          <ActivityFeed data={data?.recentActivity} />
        </div>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="text-primary-400 hover:text-primary-300 text-sm"
          >
            View All
          </button>
        </div>
        <RecentOrdersTable data={data?.recentOrders} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;