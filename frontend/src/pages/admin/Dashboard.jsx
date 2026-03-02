import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  FiZap,
  FiAward,
  FiGift,
  FiTarget,
} from "react-icons/fi";
import StatsCard from "./StatsCard";
import RevenueChart from "./charts/RevenueChart";
import MonthlyRevenueChart from "./charts/MonthlyRevenueChart";
import CategoryRevenueChart from "./charts/CategoryRevenueChart";
import PaymentMethodChart from "./charts/PaymentMethodChart";
import RecentOrdersTable from "./RecentOrdersTable";
import TopProducts from "./TopProducts";
import LowStockAlerts from "./LowStockAlerts";
import ActivityFeed from "./ActivityFeed";
import { useRevenue } from "../../hooks/useRevenue";
import { adminAPI } from "../../services/api";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { getRevenueData } = useRevenue();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Refresh data every 5 minutes
    const dataInterval = setInterval(() => {
      fetchAllData();
    }, 600000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats from adminAPI
      const dashboardResponse = await adminAPI.getDashboardStats();
      setDashboardData(dashboardResponse.data.data);

      // Fetch revenue data
      const revenueResponse = await getRevenueData({ range: "month" });
      setRevenueData(revenueResponse.data);

      console.log("Dashboard Data (ALL orders):", dashboardResponse.data.data);
      console.log("Revenue Data (DELIVERED only):", revenueResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 1,
      },
    },
  };

  const cardHoverVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Format currency with better styling
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3 xs:space-y-4 sm:space-y-6 px-2 xs:px-3 sm:px-4 md:px-6 w-full max-w-full overflow-x-hidden pb-8"
    >
      {/* Header with Gradient */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 xs:p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 xs:gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-1 xs:gap-2 mb-0.5 xs:mb-1">
              <FiActivity className="text-primary-400 text-base xs:text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
                Dashboard Overview
              </h1>
            </div>
            <p className="text-xs xs:text-sm text-gray-300">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 xs:gap-2 text-xs text-gray-300 bg-white/10 backdrop-blur-sm px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl border border-white/20 w-full sm:w-auto justify-center sm:justify-start"
          >
            <FiClock
              size={12}
              xs:size={14}
              className="animate-pulse flex-shrink-0"
            />
            <span className="truncate">
              Last updated: {currentTime.toLocaleTimeString()}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full"
      >
        {/* Total Revenue Card */}
        <motion.div
          variants={cardHoverVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredCard("revenue")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/admin/revenue")}
          className="cursor-pointer w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl xs:rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(
              revenueData?.revenue?.total ||
                dashboardData?.overview?.totalRevenue ||
                0,
            )}
            icon={FiDollarSign}
            trend="+23.5%"
            trendLabel="vs last month"
            color="from-green-500 to-emerald-500"
            gradient
            hovered={hoveredCard === "revenue"}
          />
          <motion.div
            animate={{ rotate: hoveredCard === "revenue" ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1 xs:top-2 right-1 xs:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiTrendingUp className="text-white/60" size={14} xs:size={16} />
          </motion.div>
        </motion.div>

        {/* Total Orders Card */}
        <motion.div
          variants={cardHoverVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredCard("orders")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/admin/orders")}
          className="cursor-pointer w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl xs:rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatsCard
            title="Total Orders"
            value={dashboardData?.orders?.total || 0}
            icon={FiShoppingBag}
            trend="+12.3%"
            trendLabel="vs last month"
            color="from-blue-500 to-cyan-500"
            gradient
            hovered={hoveredCard === "orders"}
          />
          <motion.div
            animate={{ scale: hoveredCard === "orders" ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1 xs:top-2 right-1 xs:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiZap className="text-white/60" size={14} xs:size={16} />
          </motion.div>
        </motion.div>

        {/* Total Users Card  */}
        <motion.div
          variants={cardHoverVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredCard("users")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/admin/users")}
          className="cursor-pointer w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl xs:rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatsCard
            title="Total Users"
            value={dashboardData?.users?.total || 0}
            icon={FiUsers}
            trend="+8.2%"
            trendLabel="vs last month"
            color="from-purple-500 to-pink-500"
            gradient
            hovered={hoveredCard === "users"}
          />
          <motion.div
            animate={{ y: hoveredCard === "users" ? [0, -5, 0] : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1 xs:top-2 right-1 xs:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiAward className="text-white/60" size={14} xs:size={16} />
          </motion.div>
        </motion.div>

        {/* Total Products Card */}
        <motion.div
          variants={cardHoverVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredCard("products")}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/admin/products")}
          className="cursor-pointer w-full relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl xs:rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatsCard
            title="Total Products"
            value={dashboardData?.products?.total || 0}
            icon={FiPackage}
            trend="+5.1%"
            trendLabel="vs last month"
            color="from-orange-500 to-red-500"
            gradient
            hovered={hoveredCard === "products"}
          />
          <motion.div
            animate={{
              rotate: hoveredCard === "products" ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-1 xs:top-2 right-1 xs:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiGift className="text-white/60" size={14} xs:size={16} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Order Status Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 w-full"
      >
        {[
          {
            label: "Processing",
            value: dashboardData?.orders?.processing || 0,
            color: "yellow",
            icon: FiClock,
          },
          {
            label: "Delivered",
            value: dashboardData?.orders?.delivered || 0,
            color: "green",
            icon: FiAward,
          },
          {
            label: "Cancelled",
            value: dashboardData?.orders?.cancelled || 0,
            color: "red",
            icon: FiAlertCircle,
          },
          {
            label: "Refunded",
            value: dashboardData?.orders?.refunded || 0,
            color: "purple",
            icon: FiTarget,
          },
        ].map((item, index) => {
          const Icon = item.icon;
          const colors = {
            yellow: {
              bg: "bg-yellow-500/10 dark:bg-yellow-500/5",
              border: "border-yellow-500/20 dark:border-yellow-500/10",
              text: "text-yellow-700 dark:text-yellow-400",
              value: "text-yellow-900 dark:text-yellow-300",
            },
            green: {
              bg: "bg-green-500/10 dark:bg-green-500/5",
              border: "border-green-500/20 dark:border-green-500/10",
              text: "text-green-700 dark:text-green-400",
              value: "text-green-900 dark:text-green-300",
            },
            red: {
              bg: "bg-red-500/10 dark:bg-red-500/5",
              border: "border-red-500/20 dark:border-red-500/10",
              text: "text-red-700 dark:text-red-400",
              value: "text-red-900 dark:text-red-300",
            },
            purple: {
              bg: "bg-purple-500/10 dark:bg-purple-500/5",
              border: "border-purple-500/20 dark:border-purple-500/10",
              text: "text-purple-700 dark:text-purple-400",
              value: "text-purple-900 dark:text-purple-300",
            },
          };
          const style = colors[item.color];

          return (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${style.bg} rounded-lg xs:rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 border ${style.border} w-full`}
            >
              <div className="flex items-center justify-between mb-0.5 xs:mb-1">
                <p
                  className={`${style.text} text-xs font-medium flex items-center gap-1`}
                >
                  <Icon size={12} xs:size={14} />
                  <span className="truncate">{item.label}</span>
                </p>
                <FiArrowUp className="text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden xs:block" />
              </div>
              <p
                className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${style.value}`}
              >
                {item.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Revenue Charts Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 w-full"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiTrendingUp className="text-blue-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Daily Revenue (Last 7 Days)</span>
          </h2>
          <div className="min-w-[250px] xs:min-w-[280px] sm:min-w-[300px] md:min-w-0">
            <RevenueChart data={revenueData?.revenue?.daily} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiBarChart2 className="text-green-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Monthly Revenue (Last 12 Months)</span>
          </h2>
          <div className="min-w-[250px] xs:min-w-[280px] sm:min-w-[300px] md:min-w-0">
            <MonthlyRevenueChart data={revenueData?.revenue?.monthly} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiPieChart className="text-purple-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Revenue by Category</span>
          </h2>
          <div className="min-w-[250px] xs:min-w-[280px] sm:min-w-[300px] md:min-w-0">
            <CategoryRevenueChart data={revenueData?.revenue?.byCategory} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiCreditCard className="text-orange-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Revenue by Payment Method</span>
          </h2>
          <div className="min-w-[250px] xs:min-w-[280px] sm:min-w-[300px] md:min-w-0">
            <PaymentMethodChart data={revenueData?.revenue?.byPaymentMethod} />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 w-full"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiAward className="text-yellow-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Top Products</span>
          </h2>
          <TopProducts data={dashboardData?.topProducts} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiAlertCircle className="text-yellow-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">
              Low Stock Alerts ({dashboardData?.products?.lowStock || 0})
            </span>
          </h2>
          <LowStockAlerts data={dashboardData?.lowStockProducts} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2">
            <FiActivity className="text-blue-500 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Recent Activity</span>
          </h2>
          <ActivityFeed data={dashboardData?.recentActivity} />
        </motion.div>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-4 min-w-[280px] xs:min-w-[300px] sm:min-w-0">
          <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1 xs:gap-2">
            <FiShoppingBag className="text-primary-600 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Recent Orders</span>
          </h2>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate("/admin/orders")}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium flex items-center gap-0.5 xs:gap-1 flex-shrink-0"
          >
            View All
            <FiArrowUp
              className="rotate-45"
              size={10}
              xs:size={12}
              sm:size={14}
            />
          </motion.button>
        </div>
        <div className="min-w-[280px] xs:min-w-[300px] sm:min-w-0">
          <RecentOrdersTable data={dashboardData?.recentOrders} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
