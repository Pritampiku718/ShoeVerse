import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiDownload,
  FiPrinter,
  FiMessageCircle,
  FiTrendingUp,
  FiAward,
  FiGift,
  FiZap,
  FiArrowRight,
  FiAlertCircle,
  FiLock,
} from "react-icons/fi";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import { format, formatDistance } from "date-fns";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { orders, fetchMyOrders, isLoading, cancelOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Update stats whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      const total = orders.length;
      const delivered = orders.filter(
        (o) => o?.orderStatus === "Delivered",
      ).length;
      const processing = orders.filter(
        (o) => o?.orderStatus === "Processing",
      ).length;
      const shipped = orders.filter((o) => o?.orderStatus === "Shipped").length;
      const cancelled = orders.filter(
        (o) => o?.orderStatus === "Cancelled",
      ).length;
      const totalSpent = orders
        .filter((o) => o?.orderStatus === "Delivered")
        .reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

      setStats({
        total,
        delivered,
        processing,
        shipped,
        cancelled,
        totalSpent,
      });
    } else {
      setStats({
        total: 0,
        delivered: 0,
        processing: 0,
        shipped: 0,
        cancelled: 0,
        totalSpent: 0,
      });
    }
  }, [orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "Shipped":
        return <FiTruck className="text-blue-500" size={20} />;
      case "Processing":
        return <FiPackage className="text-yellow-500" size={20} />;
      case "Cancelled":
        return <FiXCircle className="text-red-500" size={20} />;
      default:
        return <FiClock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Delivered: "bg-green-500",
      Shipped: "bg-blue-500",
      Processing: "bg-yellow-500",
      Cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusProgress = (status) => {
    const steps = ["Processing", "Shipped", "Delivered"];
    if (status === "Cancelled") return 0;
    const index = steps.indexOf(status);
    return index === -1 ? 0 : ((index + 1) / steps.length) * 100;
  };

  const canCancelOrder = (order) => {
    return order?.orderStatus === "Processing";
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    try {
      await cancelOrder(orderToCancel._id, cancelReason);
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setOrderToCancel(null);
      setCancelReason("");
      fetchMyOrders();
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    
    // Status filter
    if (filterStatus !== "all" && order.orderStatus !== filterStatus)
      return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id?.toLowerCase().includes(searchLower) ||
        order.orderItems?.some((item) =>
          item.name?.toLowerCase().includes(searchLower),
        )
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

      if (dateRange === "30" && daysDiff > 30) return false;
      if (dateRange === "90" && daysDiff > 90) return false;
      if (dateRange === "365" && daysDiff > 365) return false;
    }

    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "highest") {
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    } else if (sortBy === "lowest") {
      return (a.totalPrice || 0) - (b.totalPrice || 0);
    }
    return 0;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleTrackOrder = (orderId) => {
    toast.success("Tracking feature coming soon!");
  };

  const handleReorder = (order) => {
    toast.success("Items added to cart!");
  };

  const handleDownloadInvoice = (orderId) => {
    toast.success("Downloading invoice...");
  };

  const handleRefresh = () => {
    fetchMyOrders();
    toast.success("Orders refreshed!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary-200 border-t-primary-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-accent rounded-full" />
              </motion.div>
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
                Loading your orders...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - ShoeVerse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  My Orders
                </h1>
                {stats.total > 0 && (
                  <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-primary-600 to-accent text-white text-xs sm:text-sm font-semibold rounded-full">
                    {stats.total} Total
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                Track, manage, and review your orders
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:shadow-lg transition-all group text-xs sm:text-sm text-gray-900 dark:text-white w-full sm:w-auto"
            >
              <FiRefreshCw
                className="group-hover:rotate-180 transition-transform duration-500 text-gray-700 dark:text-gray-300"
                size={14}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiShoppingBag size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">Total</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.total}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                All Orders
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiDollarSign size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">Spent</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                ${stats.totalSpent.toFixed(2)}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                Total Spent
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiCheckCircle size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">
                  {stats.delivered}
                </span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.delivered}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                Delivered
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiPackage size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">
                  {stats.processing}
                </span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.processing}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                Processing
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiTruck size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">
                  {stats.shipped}
                </span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.shipped}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                Shipped
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <FiXCircle size={16} />
                <span className="text-[10px] sm:text-xs opacity-90">
                  {stats.cancelled}
                </span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {stats.cancelled}
              </p>
              <p className="text-[8px] sm:text-[10px] opacity-75 mt-0.5 sm:mt-1">
                Cancelled
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6 md:mb-8">
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-600/5 to-accent/5">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiFilter className="text-primary-600" size={14} />
                Filter Orders
              </h2>
            </div>
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {/* Search */}
                <div className="relative">
                  <FiSearch
                    className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <FiPackage
                    className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="relative">
                  <FiCalendar
                    className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="all">All Time</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">Last Year</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="relative">
                  <FiTrendingUp
                    className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Total</option>
                    <option value="lowest">Lowest Total</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {sortedOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg px-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FiPackage className="text-3xl sm:text-4xl md:text-5xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                No orders found
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                {searchTerm || filterStatus !== "all" || dateRange !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "You haven't placed any orders yet. Start shopping to see your orders here!"}
              </p>
              {!searchTerm && filterStatus === "all" && dateRange === "all" && (
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group text-sm sm:text-base"
                >
                  <FiShoppingBag size={16} />
                  Start Shopping
                  <FiArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sortedOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <div
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <span className="text-[10px] sm:text-xs font-mono text-gray-500 dark:text-gray-400">
                              #{order._id?.slice(-8)}
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusBadge(order.orderStatus)}`}
                              />
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                            <FiCalendar size={10} />
                            <span>
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy",
                              )}
                            </span>
                            <span className="hidden xs:inline text-gray-300 dark:text-gray-600">
                              •
                            </span>
                            <FiClock size={10} className="hidden xs:inline" />
                            <span className="hidden xs:inline">
                              {formatDistance(
                                new Date(order.createdAt),
                                new Date(),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Total
                          </p>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                            ${order.totalPrice?.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order._id ? null : order._id,
                            )
                          }
                          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                        >
                          {expandedOrder === order._id ? (
                            <FiChevronUp size={16} />
                          ) : (
                            <FiChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.orderStatus !== "Cancelled" && (
                      <div className="mt-3 sm:mt-4">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              Progress
                            </span>
                            <div className="flex items-center gap-1">
                              <FiZap size={10} className="text-primary-600" />
                              <span className="text-[8px] sm:text-xs font-medium text-primary-600">
                                {getStatusProgress(order.orderStatus).toFixed(
                                  1,
                                )}
                                %
                              </span>
                            </div>
                          </div>
                          <span className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {order.orderStatus === "Processing" && "Preparing"}
                            {order.orderStatus === "Shipped" && "On the way"}
                            {order.orderStatus === "Delivered" && "Delivered"}
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${getStatusProgress(order.orderStatus)}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary-600 to-accent rounded-full relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                          
                          {/* Order Items */}
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                              <FiShoppingBag
                                className="text-primary-600"
                                size={14}
                              />
                              Items ({order.orderItems?.length})
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                              {order.orderItems?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                                >
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                      {item.name}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1">
                                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity}
                                      </span>
                                      {item.size && (
                                        <>
                                          <span className="text-[8px] sm:text-xs text-gray-400 dark:text-gray-500">
                                            •
                                          </span>
                                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                            Size: {item.size}
                                          </span>
                                        </>
                                      )}
                                      {item.color && (
                                        <>
                                          <span className="text-[8px] sm:text-xs text-gray-400 dark:text-gray-500">
                                            •
                                          </span>
                                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <span
                                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                                              style={{
                                                backgroundColor:
                                                  item.color.toLowerCase(),
                                              }}
                                            />
                                            <span className="hidden xs:inline">
                                              {item.color}
                                            </span>
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            
                            {/* Shipping Address */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                <FiMapPin
                                  className="text-primary-600"
                                  size={14}
                                />
                                Shipping Address
                              </h4>
                              <div className="text-[10px] sm:text-xs space-y-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {order.shippingAddress?.fullName}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 break-words">
                                  {order.shippingAddress?.address}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {order.shippingAddress?.city},{" "}
                                  {order.shippingAddress?.state}{" "}
                                  {order.shippingAddress?.zipCode}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {order.shippingAddress?.country}
                                </p>
                                {order.shippingAddress?.phoneNumber && (
                                  <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
                                    📞 {order.shippingAddress.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                                <FiDollarSign
                                  className="text-primary-600"
                                  size={14}
                                />
                                Payment Info
                              </h4>
                              <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Subtotal
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    ${order.itemsPrice?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Shipping
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    ${order.shippingPrice?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Tax
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    ${order.taxPrice?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-1 sm:pt-2 mt-1 sm:mt-2">
                                  <div className="flex justify-between font-bold">
                                    <span className="text-gray-900 dark:text-white">
                                      Total
                                    </span>
                                    <span className="text-primary-600">
                                      ${order.totalPrice?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
                                  Method:{" "}
                                  {order.paymentMethod || "Cash on Delivery"}
                                </p>
                                {order.isPaid && (
                                  <p className="text-[8px] sm:text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                                    <FiCheckCircle size={10} />
                                    Paid{" "}
                                    {format(new Date(order.paidAt), "MMM dd")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2 pt-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-[10px] sm:text-xs"
                            >
                              <FiEye size={12} />
                              <span className="hidden xs:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleTrackOrder(order._id)}
                              className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[10px] sm:text-xs"
                            >
                              <FiTruck size={12} />
                              <span className="hidden xs:inline">Track</span>
                            </button>
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[10px] sm:text-xs"
                            >
                              <FiRefreshCw size={12} />
                              <span className="hidden xs:inline">Reorder</span>
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[10px] sm:text-xs"
                            >
                              <FiDownload size={12} />
                              <span className="hidden xs:inline">Invoice</span>
                            </button>

                            {/* Cancel Order Button */}
                            {canCancelOrder(order) && (
                              <button
                                onClick={() => handleCancelClick(order)}
                                className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[10px] sm:text-xs col-span-2 xs:col-span-1"
                              >
                                <FiXCircle size={12} />
                                <span className="hidden xs:inline">Cancel</span>
                              </button>
                            )}

                            <button className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-[10px] sm:text-xs">
                              <FiMessageCircle size={12} />
                              <span className="hidden xs:inline">Support</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent px-4 sm:px-6 py-3 sm:py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm sm:text-base md:text-xl font-bold">
                      Order #{selectedOrder._id?.slice(-8)}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-white/80">
                      Placed{" "}
                      {format(
                        new Date(selectedOrder.createdAt),
                        "MMM dd, yyyy",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiXCircle size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* Order Status Banner */}
                <div
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${getStatusColor(selectedOrder.orderStatus)}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getStatusIcon(selectedOrder.orderStatus)}
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">
                        Status: {selectedOrder.orderStatus}
                      </p>
                      <p className="text-[10px] sm:text-xs opacity-80">
                        {selectedOrder.orderStatus === "Delivered" &&
                          "Your order has been delivered. Thank you!"}
                        {selectedOrder.orderStatus === "Shipped" &&
                          "Your order is on its way!"}
                        {selectedOrder.orderStatus === "Processing" &&
                          "Your order is being processed."}
                        {selectedOrder.orderStatus === "Cancelled" &&
                          "This order has been cancelled."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedOrder.itemsPrice?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedOrder.shippingPrice?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedOrder.taxPrice?.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-primary-600 text-sm sm:text-base">
                          ${selectedOrder.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleTrackOrder(selectedOrder._id);
                    }}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-[10px] sm:text-xs"
                  >
                    <FiTruck size={14} />
                    Track Order
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDownloadInvoice(selectedOrder._id);
                    }}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-purple-600 text-white rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-[10px] sm:text-xs"
                  >
                    <FiDownload size={14} />
                    Download Invoice
                  </button>
                  {canCancelOrder(selectedOrder) && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleCancelClick(selectedOrder);
                      }}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-[10px] sm:text-xs col-span-1 xs:col-span-2 sm:col-span-1"
                    >
                      <FiXCircle size={14} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && orderToCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <FiAlertCircle className="text-red-600 text-xl sm:text-2xl md:text-3xl" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Cancel Order
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                  Cancel order #{orderToCancel._id?.slice(-8)}?
                </p>

                {/* Cancel Reason */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 text-left mb-1 sm:mb-2">
                    Reason (optional)
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white mb-2"
                  >
                    <option value="">Select a reason</option>
                    <option value="Changed mind">Changed my mind</option>
                    <option value="Found cheaper">
                      Found cheaper elsewhere
                    </option>
                    <option value="Ordered by mistake">
                      Ordered by mistake
                    </option>
                    <option value="Shipping too slow">Shipping too slow</option>
                    <option value="Other">Other</option>
                  </select>
                  {cancelReason === "Other" && (
                    <textarea
                      placeholder="Specify reason..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-2 sm:p-3 rounded-lg mb-4 sm:mb-5">
                  <p className="text-[8px] sm:text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1 sm:gap-2">
                    <FiLock size={10} />
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm text-gray-900 dark:text-white"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    disabled={cancelling}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg sm:rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    {cancelling ? (
                      <>
                        <FiRefreshCw className="animate-spin" size={12} />
                        <span className="hidden xs:inline">Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <FiXCircle size={12} />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Orders;
