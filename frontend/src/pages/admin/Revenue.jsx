import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiCreditCard,
  FiCalendar,
  FiDownload,
  FiDollarSign,
  FiShoppingBag,
  FiPercent,
  FiRefreshCw,
} from "react-icons/fi";
import { useThemeStore } from "../../store/themeStore";
import RevenueChart from "./charts/RevenueChart";
import MonthlyRevenueChart from "./charts/MonthlyRevenueChart";
import CategoryRevenueChart from "./charts/CategoryRevenueChart";
import PaymentMethodChart from "./charts/PaymentMethodChart";
import { useRevenue } from "../../hooks/useRevenue";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import { exportToCSV } from "../../utils/exportUtils";
import { toast } from "react-hot-toast";

const Revenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useThemeStore();
  const { getRevenueData } = useRevenue();

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchData = async () => {
      
      // Add a small delay to prevent rapid successive calls
      timeoutId = setTimeout(async () => {
        if (!isMounted) return;

        setLoading(true);
        try {
          const response = await getRevenueData({ range: dateRange });
          if (isMounted) {
            console.log("Revenue Data loaded:", response.data);
            setData(response.data);
          }
        } catch (error) {
          console.error("Error fetching revenue data:", error);
          if (isMounted) {
            toast.error("Failed to fetch revenue data");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }, 300);
    };

    fetchData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dateRange, getRevenueData]);

  const refreshRevenueData = async () => {
    setRefreshing(true);
    try {
      const response = await getRevenueData({ range: dateRange });
      setData(response.data);
      toast.success("Revenue data refreshed");
    } catch (error) {
      console.error("Error refreshing revenue data:", error);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const handleExport = () => {
    if (!data?.revenue?.daily || data.revenue.daily.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCSV(data.revenue.daily, "daily-revenue.csv");
    toast.success("Revenue data exported successfully");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  // If data is still null after loading, show error
  if (!data) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <FiDollarSign className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Revenue Data
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Unable to load revenue data. Please try refreshing.
          </p>
          <button
            onClick={refreshRevenueData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1
                className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Revenue Analytics
              </h1>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Real-time revenue tracking and analytics
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={refreshRevenueData}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 disabled:opacity-50"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 disabled:opacity-50"
                }`}
                title="Refresh Data"
              >
                <FiRefreshCw
                  className={refreshing ? "animate-spin" : ""}
                  size={16}
                />
              </button>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="year">Last 12 Months</option>
              </select>

              <button
                onClick={handleExport}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-colors ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                <FiDownload size={14} sm:size={16} />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Total Revenue Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign
                  className="text-white/80"
                  size={20}
                  sm:size={24}
                />
                <span className="text-xs text-white/60">Total</span>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                ${data?.revenue?.total?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Total Revenue
              </p>
            </motion.div>

            {/* AOV Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp
                  className="text-white/80"
                  size={20}
                  sm:size={24}
                />
                <span className="text-xs text-white/60">AOV</span>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                ${data?.revenue?.aov?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Average Order Value
              </p>
            </motion.div>

            {/* Total Orders Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <FiShoppingBag
                  className="text-white/80"
                  size={20}
                  sm:size={24}
                />
                <span className="text-xs text-white/60">Orders</span>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
               
                {/* Calculate total orders from monthly data */}
                {data?.revenue?.monthly?.reduce(
                  (sum, month) => sum + (month.orders || 0),
                  0,
                ) || "0"}
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Total Orders
              </p>
            </motion.div>

            {/* Conversion Rate Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <FiPercent className="text-white/80" size={20} sm:size={24} />
                <span className="text-xs text-white/60">Rate</span>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {data?.revenue?.conversionRate || "3.2"}%
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Conversion Rate
              </p>
            </motion.div>
          </div>

          {/* Charts Section Only render when data exists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Daily Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FiTrendingUp
                  className="text-blue-500 flex-shrink-0"
                  size={18}
                  sm:size={20}
                />
                <span className="truncate">Daily Revenue</span>
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px] sm:min-w-0">
                  {data?.revenue?.daily && data.revenue.daily.length > 0 ? (
                    <RevenueChart
                      data={data.revenue.daily}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div
                      className={`h-64 flex items-center justify-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      No daily revenue data available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Monthly Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FiBarChart2
                  className="text-green-500 flex-shrink-0"
                  size={18}
                  sm:size={20}
                />
                <span className="truncate">Monthly Revenue</span>
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px] sm:min-w-0">
                  {data?.revenue?.monthly && data.revenue.monthly.length > 0 ? (
                    <MonthlyRevenueChart
                      data={data.revenue.monthly}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div
                      className={`h-64 flex items-center justify-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      No monthly revenue data available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Revenue by Category Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FiPieChart
                  className="text-purple-500 flex-shrink-0"
                  size={18}
                  sm:size={20}
                />
                <span className="truncate">Revenue by Category</span>
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px] sm:min-w-0">
                  {data?.revenue?.byCategory &&
                  data.revenue.byCategory.length > 0 ? (
                    <CategoryRevenueChart
                      data={data.revenue.byCategory}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div
                      className={`h-64 flex items-center justify-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      No category revenue data available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Revenue by Payment Method Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FiCreditCard
                  className="text-orange-500 flex-shrink-0"
                  size={18}
                  sm:size={20}
                />
                <span className="truncate">Revenue by Payment Method</span>
              </h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px] sm:min-w-0">
                  {data?.revenue?.byPaymentMethod &&
                  data.revenue.byPaymentMethod.length > 0 ? (
                    <PaymentMethodChart
                      data={data.revenue.byPaymentMethod}
                      darkMode={darkMode}
                    />
                  ) : (
                    <div
                      className={`h-64 flex items-center justify-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      No payment method data available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quarterly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
              darkMode
                ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <h2
              className={`text-base sm:text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FiCalendar
                className="text-yellow-500 flex-shrink-0"
                size={18}
                sm:size={20}
              />
              <span className="truncate">Quarterly Comparison</span>
            </h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {data?.revenue?.quarterly && data.revenue.quarterly.length > 0 ? (
                data.revenue.quarterly.map((quarter, index) => (
                  <div
                    key={index}
                    className={`rounded-lg sm:rounded-xl p-3 sm:p-4 ${
                      darkMode ? "bg-gray-700/30" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {quarter.name ||
                        `Q${quarter._id?.quarter || index + 1} ${quarter._id?.year || new Date().getFullYear()}`}
                    </p>
                    <p
                      className={`text-base sm:text-lg lg:text-xl font-bold mt-1 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${quarter.revenue?.toFixed(2) || "0.00"}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {quarter.orders || 0} orders
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className={`col-span-full text-center py-8 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  No quarterly data available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
