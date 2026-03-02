import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiShoppingBag,
  FiSearch,
  FiDownload,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiCreditCard,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiArrowUp,
  FiArrowDown,
  FiFilter,
  FiSliders,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { useOrderStore } from "../../store/orderStore";
import { useThemeStore } from "../../store/themeStore";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const Orders = () => {
  const {
    allOrders = [],
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderStats,
  } = useOrderStore();

  const { darkMode } = useThemeStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [analyticsView, setAnalyticsView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  // Initial load and auto-refresh setup
  useEffect(() => {
    loadOrders();

    // Auto-refresh every 30 seconds without any visual indicator
    const interval = setInterval(() => {
      fetchAllOrders().catch((error) => {
        console.error("Background refresh failed:", error);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setItemsPerPage(5);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(10);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      await fetchAllOrders();
      await getOrderStats();
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const orderStats = useMemo(() => {
    const orders = allOrders;
    const total = orders.length;
    const delivered = orders.filter(
      (o) => o?.orderStatus === "Delivered",
    ).length;
    const pending = orders.filter((o) => o?.orderStatus === "Pending").length;
    const processing = orders.filter(
      (o) => o?.orderStatus === "Processing",
    ).length;
    const shipped = orders.filter((o) => o?.orderStatus === "Shipped").length;
    const cancelled = orders.filter(
      (o) => o?.orderStatus === "Cancelled",
    ).length;

    const totalRevenue = orders
      .filter((o) => o?.orderStatus === "Delivered")
      .reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

    const today = new Date().toDateString();
    const todayRevenue = orders
      .filter((o) => {
        return (
          o?.createdAt &&
          new Date(o.createdAt).toDateString() === today &&
          o?.orderStatus === "Delivered"
        );
      })
      .reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

    const todayOrders = orders.filter(
      (o) => o?.createdAt && new Date(o.createdAt).toDateString() === today,
    ).length;

    return {
      total,
      delivered,
      pending,
      processing,
      shipped,
      cancelled,
      totalRevenue,
      todayRevenue,
      todayOrders,
      averageOrderValue:
        delivered > 0 ? (totalRevenue / delivered).toFixed(2) : "0.00",
      conversionRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : "0",
    };
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      if (!order) return false;

      const matchesSearch =
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && order.isPaid) ||
        (paymentFilter === "unpaid" && !order.isPaid);

      let matchesDate = true;
      if (order.createdAt && dateFilter !== "all") {
        const orderDate = new Date(order.createdAt);
        const today = new Date();

        if (dateFilter === "today") {
          matchesDate = orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = orderDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          matchesDate = orderDate >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [allOrders, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "highest") {
        return (b.totalPrice || 0) - (a.totalPrice || 0);
      } else if (sortBy === "lowest") {
        return (a.totalPrice || 0) - (b.totalPrice || 0);
      }
      return 0;
    });
  }, [filteredOrders, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      await fetchAllOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete._id);
      toast.success("Order deleted successfully");
      setShowDeleteModal(false);
      setOrderToDelete(null);
      await fetchAllOrders();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleExport = () => {
    try {
      const data = allOrders.map((order) => ({
        "Order ID": order._id?.slice(-8) || "N/A",
        Customer: order.user?.name || "Guest",
        Email: order.user?.email || "N/A",
        Date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A",
        Total: `$${order.totalPrice?.toFixed(2) || "0.00"}`,
        Status: order.orderStatus || "N/A",
        Payment: order.isPaid ? "Paid" : "Unpaid",
        Items: order.orderItems?.length || 0,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(
        wb,
        `orders-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("Orders exported successfully");
    } catch (error) {
      toast.error("Failed to export orders");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: {
        light: "bg-amber-50 text-amber-700 border-amber-200",
        dark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      },
      Processing: {
        light: "bg-blue-50 text-blue-700 border-blue-200",
        dark: "dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      },
      Shipped: {
        light: "bg-purple-50 text-purple-700 border-purple-200",
        dark: "dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
      },
      Delivered: {
        light: "bg-green-50 text-green-700 border-green-200",
        dark: "dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
      },
      Cancelled: {
        light: "bg-red-50 text-red-700 border-red-200",
        dark: "dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      },
    };
    return (
      colors[status] || {
        light: "bg-gray-50 text-gray-700 border-gray-200",
        dark: "dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
      }
    );
  };

  const getPaymentStatusColor = (isPaid) => {
    if (isPaid) {
      return {
        light: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      };
    }
    return {
      light: "bg-amber-50 text-amber-700 border-amber-200",
      dark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    };
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-3.5 h-3.5 sm:w-4 sm:h-4";
    switch (status) {
      case "Pending":
        return <FiClock className={`${iconClass} text-amber-500`} />;
      case "Processing":
        return <FiPackage className={`${iconClass} text-blue-500`} />;
      case "Shipped":
        return <FiTruck className={`${iconClass} text-purple-500`} />;
      case "Delivered":
        return <FiCheckCircle className={`${iconClass} text-emerald-500`} />;
      case "Cancelled":
        return <FiXCircle className={`${iconClass} text-red-500`} />;
      default:
        return <FiClock className={`${iconClass} text-gray-500`} />;
    }
  };

  const MobileOrderCard = ({ order, index }) => {
    const statusColor = getStatusColor(order.orderStatus);
    const paymentColor = getPaymentStatusColor(order.isPaid);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl border p-4 mb-3 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-sm font-mono font-medium px-3 py-1.5 rounded-lg ${
              darkMode
                ? "bg-primary-500/10 text-primary-400"
                : "bg-primary-50 text-primary-700"
            }`}
          >
            #{order._id?.slice(-6)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDetailsModal(true);
              }}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-primary-400 hover:bg-primary-500/10"
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => {
                setOrderToDelete(order);
                setShowDeleteModal(true);
              }}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <p
            className={`text-sm font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {order.user?.name || "Guest Customer"}
          </p>
          <p
            className={`text-xs ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {order.user?.email || "No email"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Date
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Items
            </p>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {order.orderItems?.length || 0} items
            </p>
          </div>
        </div>

        <div className="mb-3">
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Amount
          </p>
          <p
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            ${order.totalPrice?.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              className={`w-full text-xs pl-7 pr-6 py-1.5 rounded-lg border font-medium appearance-none cursor-pointer ${
                darkMode ? statusColor.dark : statusColor.light
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 6px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "12px",
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span className="absolute left-2 top-1/2 -translate-y-1/2">
              {getStatusIcon(order.orderStatus)}
            </span>
          </div>

          <span
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 ${
              darkMode ? paymentColor.dark : paymentColor.light
            }`}
          >
            {order.isPaid ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      </motion.div>
    );
  };

  const GridOrderCard = ({ order, index }) => {
    const statusColor = getStatusColor(order.orderStatus);
    const paymentColor = getPaymentStatusColor(order.isPaid);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl border p-4 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-xs font-mono font-medium px-2 py-1 rounded-lg ${
              darkMode
                ? "bg-primary-500/10 text-primary-400"
                : "bg-primary-50 text-primary-700"
            }`}
          >
            #{order._id?.slice(-6)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDetailsModal(true);
              }}
              className={`p-1.5 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-primary-400 hover:bg-primary-500/10"
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <FiEye size={14} />
            </button>
            <button
              onClick={() => {
                setOrderToDelete(order);
                setShowDeleteModal(true);
              }}
              className={`p-1.5 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>

        <div className="mb-2">
          <p
            className={`text-sm font-semibold truncate ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {order.user?.name || "Guest Customer"}
          </p>
          <p
            className={`text-xs truncate ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {order.user?.email || "No email"}
          </p>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.orderItems?.length || 0} items
          </span>
        </div>

        <p
          className={`text-lg font-bold mb-3 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          ${order.totalPrice?.toFixed(2)}
        </p>

        <div className="flex flex-wrap gap-2">
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
            className={`text-xs pl-6 pr-5 py-1 rounded-lg border font-medium appearance-none cursor-pointer ${
              darkMode ? statusColor.dark : statusColor.light
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 4px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "10px",
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <span
            className={`text-xs px-2 py-1 rounded-lg border font-medium inline-flex items-center gap-1 ${
              darkMode ? paymentColor.dark : paymentColor.light
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[calc(100vh-200px)] ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center px-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary-200 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-4" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary-600 dark:bg-primary-400 rounded-full" />
            </motion.div>
          </div>
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading premium orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Orders | ShoeVerse Admin</title>
      </Helmet>

      <div className="w-full space-y-4 sm:space-y-6">
        
        {/* Header with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 sm:p-6"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 bg-primary-500 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 sm:w-64 h-48 sm:h-64 bg-accent rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <FiShoppingBag className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Orders
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1 flex flex-wrap items-center gap-2">
                  <span>{orderStats.total} total orders</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full hidden xs:inline" />
                  <span className="text-primary-300">
                    ${orderStats.totalRevenue.toLocaleString()} revenue
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <FiFilter size={18} />
              </button>

              <div className="flex bg-white/10 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={() => setAnalyticsView("overview")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    analyticsView === "overview"
                      ? "bg-white text-gray-900 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="sm:hidden">📊</span>
                  <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                  onClick={() => setAnalyticsView("analytics")}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    analyticsView === "analytics"
                      ? "bg-white text-gray-900 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="sm:hidden">📈</span>
                  <span className="hidden sm:inline">Analytics</span>
                </button>
              </div>

              {windowWidth < 1024 && (
                <div className="flex bg-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "table"
                        ? "bg-white text-gray-900"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <FiList size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-gray-900"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <FiGrid size={16} />
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shadow-lg shadow-primary-600/20"
              >
                <FiDownload size={14} />
                <span className="hidden xs:inline">Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
        >
          {analyticsView === "overview" ? (
            <>
              <StatCard
                title="Total Orders"
                value={orderStats.total}
                icon={<FiShoppingBag />}
                gradient="from-blue-500 to-blue-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Revenue"
                value={`$${orderStats.totalRevenue.toLocaleString()}`}
                icon={<FiDollarSign />}
                gradient="from-green-500 to-emerald-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Processing"
                value={orderStats.processing}
                icon={<FiClock />}
                gradient="from-amber-500 to-orange-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Today"
                value={`$${orderStats.todayRevenue.toLocaleString()}`}
                icon={<FiTrendingUp />}
                gradient="from-purple-500 to-pink-600"
                darkMode={darkMode}
              />
            </>
          ) : (
            <>
              <AnalyticsCard
                title="Avg Order Value"
                value={`$${orderStats.averageOrderValue}`}
                trend="+12.5%"
                icon={<FiBarChart2 />}
                darkMode={darkMode}
              />
              <AnalyticsCard
                title="Conversion Rate"
                value={`${orderStats.conversionRate}%`}
                trend="+5.2%"
                icon={<FiPieChart />}
                darkMode={darkMode}
              />
              <AnalyticsCard
                title="Delivered"
                value={orderStats.delivered}
                trend={`${((orderStats.delivered / orderStats.total) * 100).toFixed(1)}%`}
                icon={<FiCheckCircle />}
                darkMode={darkMode}
              />
              <AnalyticsCard
                title="Cancelled"
                value={orderStats.cancelled}
                trend={`${((orderStats.cancelled / orderStats.total) * 100).toFixed(1)}%`}
                icon={<FiXCircle />}
                darkMode={darkMode}
              />
            </>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              : "bg-white border-gray-200 shadow-sm"
          } p-3 sm:p-4`}
        >
          <div className="sm:hidden flex items-center justify-between mb-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FiSliders
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
              <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
                Filters & Sorting
              </span>
            </button>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              dateFilter !== "all" ||
              sortBy !== "newest"
                ? "Active"
                : "All"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder={
                  windowWidth < 640
                    ? "Search..."
                    : "Search by order ID, customer, email..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-primary-500/20 ${
                  darkMode
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500"
                }`}
              />
            </div>

            <div
              className={`${showMobileFilters ? "flex" : "hidden"} sm:flex flex-wrap items-center gap-2 mt-2 sm:mt-0`}
            >
              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  {
                    value: "all",
                    label: windowWidth < 640 ? "Status" : "All Status",
                  },
                  { value: "Pending", label: "Pending" },
                  { value: "Processing", label: "Processing" },
                  { value: "Shipped", label: "Shipped" },
                  { value: "Delivered", label: "Delivered" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
                darkMode={darkMode}
                compact={windowWidth < 640}
              />

              <FilterSelect
                value={paymentFilter}
                onChange={setPaymentFilter}
                options={[
                  {
                    value: "all",
                    label: windowWidth < 640 ? "Payment" : "All Payment",
                  },
                  { value: "paid", label: "Paid" },
                  { value: "unpaid", label: "Unpaid" },
                ]}
                darkMode={darkMode}
                compact={windowWidth < 640}
              />

              <FilterSelect
                value={dateFilter}
                onChange={setDateFilter}
                options={[
                  {
                    value: "all",
                    label: windowWidth < 640 ? "Date" : "All Time",
                  },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                ]}
                darkMode={darkMode}
                compact={windowWidth < 640}
              />

              <FilterSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  {
                    value: "newest",
                    label: windowWidth < 640 ? "Sort" : "Newest First",
                  },
                  { value: "oldest", label: "Oldest First" },
                  { value: "highest", label: "Highest Price" },
                  { value: "lowest", label: "Lowest Price" },
                ]}
                darkMode={darkMode}
                compact={windowWidth < 640}
              />
            </div>
          </div>
        </motion.div>

        {/* Orders Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl border overflow-hidden ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              : "bg-white border-gray-200 shadow-lg"
          }`}
        >
          {currentOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FiShoppingBag
                  className="text-gray-400 dark:text-gray-500"
                  size={24}
                />
              </div>
              <h3
                className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                No orders found
              </h3>
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Try adjusting your search or filter to find what you're looking
                for
              </p>
            </div>
          ) : (
            <>
              {windowWidth >= 1024 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`border-b ${
                          darkMode
                            ? "border-gray-700 bg-gray-800/50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {currentOrders.map((order, index) => {
                        const statusColor = getStatusColor(order.orderStatus);
                        const paymentColor = getPaymentStatusColor(
                          order.isPaid,
                        );

                        return (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group transition-all duration-200 ${
                              darkMode
                                ? "hover:bg-gray-700/30"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <span
                                className={`text-xs lg:text-sm font-mono font-medium px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg ${
                                  darkMode
                                    ? "bg-primary-500/10 text-primary-400"
                                    : "bg-primary-50 text-primary-700"
                                }`}
                              >
                                #{order._id?.slice(-6)}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <div className="flex flex-col">
                                <span
                                  className={`text-xs lg:text-sm font-semibold ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {order.user?.name || "Guest Customer"}
                                </span>
                                <span
                                  className={`text-xs ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  {order.user?.email || "No email"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <span
                                className={`text-xs lg:text-sm ${
                                  darkMode ? "text-gray-200" : "text-gray-600"
                                }`}
                              >
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                              <span
                                className={`text-xs lg:text-sm font-medium inline-flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-gray-200"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order.orderItems?.length || 0}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <span
                                className={`text-sm lg:text-lg font-bold ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                ${order.totalPrice?.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <div className="relative">
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      e.target.value,
                                    )
                                  }
                                  className={`text-xs pl-7 pr-6 py-1.5 rounded-lg border font-medium appearance-none cursor-pointer ${
                                    darkMode
                                      ? statusColor.dark
                                      : statusColor.light
                                  }`}
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                    backgroundPosition: "right 6px center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "12px",
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <span className="absolute left-2 top-1/2 -translate-y-1/2">
                                  {getStatusIcon(order.orderStatus)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <span
                                className={`text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 ${
                                  darkMode
                                    ? paymentColor.dark
                                    : paymentColor.light
                                }`}
                              >
                                {order.isPaid ? (
                                  <FiCheckCircle size={12} />
                                ) : (
                                  <FiClock size={12} />
                                )}
                                {order.isPaid ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                              <div className="flex items-center justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowDetailsModal(true);
                                  }}
                                  className={`p-1.5 lg:p-2 rounded-lg transition-all ${
                                    darkMode
                                      ? "text-gray-400 hover:text-primary-400 hover:bg-primary-500/10"
                                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                  }`}
                                  title="View Details"
                                >
                                  <FiEye size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setOrderToDelete(order);
                                    setShowDeleteModal(true);
                                  }}
                                  className={`p-1.5 lg:p-2 rounded-lg transition-all ${
                                    darkMode
                                      ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  title="Delete Order"
                                >
                                  <FiTrash2 size={16} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {windowWidth >= 640 &&
                windowWidth < 1024 &&
                viewMode === "grid" && (
                  <div className="grid grid-cols-2 gap-3 p-3">
                    {currentOrders.map((order, index) => (
                      <GridOrderCard
                        key={order._id}
                        order={order}
                        index={index}
                      />
                    ))}
                  </div>
                )}

              {(windowWidth < 640 ||
                (windowWidth >= 640 &&
                  windowWidth < 1024 &&
                  viewMode === "table")) && (
                <div className="p-3 sm:p-4">
                  {currentOrders.map((order, index) => (
                    <MobileOrderCard
                      key={order._id}
                      order={order}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div
                  className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <p
                    className={`text-xs sm:text-sm order-2 sm:order-1 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span className="hidden xs:inline">Showing </span>
                    <span className="font-medium">
                      {indexOfFirstItem + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, sortedOrders.length)}
                    </span>{" "}
                    <span className="hidden xs:inline">of </span>
                    <span className="font-medium">
                      {sortedOrders.length}
                    </span>{" "}
                    orders
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                        darkMode
                          ? "border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      <FiChevronLeft size={16} />
                    </motion.button>

                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(3, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }

                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? darkMode
                                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                  : "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                : darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                        darkMode
                          ? "border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      <FiChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowDetailsModal(false)}
            darkMode={darkMode}
            getStatusIcon={getStatusIcon}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && orderToDelete && (
          <DeleteConfirmationModal
            order={orderToDelete}
            onConfirm={handleDeleteOrder}
            onCancel={() => setShowDeleteModal(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const StatCard = ({ title, value, icon, gradient, darkMode }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    className={`rounded-lg sm:rounded-xl p-3 sm:p-5 bg-gradient-to-br ${gradient} text-white shadow-lg`}
  >
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
        <span className="text-sm sm:text-base">{icon}</span>
      </div>
      <span className="text-[10px] sm:text-xs font-medium opacity-80">
        This month
      </span>
    </div>
    <p className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight">
      {value}
    </p>
    <p className="text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">{title}</p>
  </motion.div>
);

const AnalyticsCard = ({ title, value, trend, icon, darkMode }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-lg sm:rounded-xl p-3 sm:p-5 border ${
      darkMode
        ? "bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
        : "bg-white border-gray-200 shadow-sm"
    }`}
  >
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div
        className={`p-1.5 sm:p-2 rounded-lg ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <span className={darkMode ? "text-gray-200" : "text-gray-600"}>
          {icon}
        </span>
      </div>
      <span
        className={`text-[10px] sm:text-xs font-medium flex items-center gap-0.5 ${
          trend.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend.startsWith("+") ? (
          <FiArrowUp size={10} />
        ) : (
          <FiArrowDown size={10} />
        )}
        {trend}
      </span>
    </div>
    <p
      className={`text-base sm:text-xl lg:text-2xl font-bold ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {value}
    </p>
    <p
      className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {title}
    </p>
  </motion.div>
);

const FilterSelect = ({ value, onChange, options, darkMode, compact }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`${compact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"} rounded-lg border transition-all focus:ring-2 focus:ring-primary-500/20 ${
      darkMode
        ? "bg-gray-700/50 border-gray-600 text-white focus:border-primary-500"
        : "bg-white border-gray-200 text-gray-900 focus:border-primary-500"
    }`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const OrderDetailsModal = ({ order, onClose, darkMode, getStatusIcon }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className={`rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-accent text-white px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <FiShoppingBag size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
                Order #{order._id?.slice(-8)}
              </h2>
              <p className="text-[10px] sm:text-xs text-white/80">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiX size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div
          className={`rounded-xl p-3 sm:p-5 ${
            darkMode
              ? "bg-gray-700/50 border border-gray-600"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <h3
            className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiUsers className="text-primary-600" size={14} />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p
                className={`text-[10px] sm:text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Full Name
              </p>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {order.user?.name || "Guest Customer"}
              </p>
            </div>
            <div>
              <p
                className={`text-[10px] sm:text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Email Address
              </p>
              <p
                className={`text-xs sm:text-sm font-medium break-all ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {order.user?.email || "N/A"}
              </p>
            </div>
            {order.shippingAddress?.phoneNumber && (
              <div>
                <p
                  className={`text-[10px] sm:text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Phone Number
                </p>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {order.shippingAddress.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {order.shippingAddress && (
          <div
            className={`rounded-xl p-3 sm:p-5 ${
              darkMode
                ? "bg-gray-700/50 border border-gray-600"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <h3
              className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FiMapPin className="text-primary-600" size={14} />
              Shipping Address
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {order.shippingAddress.fullName || order.user?.name}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        )}

        <div
          className={`rounded-xl p-3 sm:p-5 ${
            darkMode
              ? "bg-gray-700/50 border border-gray-600"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <h3
            className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiShoppingBag className="text-primary-600" size={14} />
            Order Items ({order.orderItems?.length || 0})
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {order.orderItems?.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col xs:flex-row xs:items-center justify-between gap-2 p-2 sm:p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-600/50 border border-gray-600"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-xs sm:text-base font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl p-3 sm:p-5 ${
            darkMode
              ? "bg-gray-700/50 border border-gray-600"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <h3
            className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiDollarSign className="text-primary-600" size={14} />
            Order Summary
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Subtotal
              </span>
              <span
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${order.itemsPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Shipping
              </span>
              <span
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${order.shippingPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Tax
              </span>
              <span
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${order.taxPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div
              className={`flex justify-between text-sm sm:text-base font-bold pt-2 sm:pt-3 border-t ${
                darkMode ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <span className={darkMode ? "text-white" : "text-gray-900"}>
                Total
              </span>
              <span className="text-primary-600 dark:text-primary-400">
                ${order.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`rounded-xl p-3 sm:p-4 ${
              darkMode
                ? "bg-gray-700/50 border border-gray-600"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-[10px] sm:text-xs mb-1 sm:mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Order Status
            </p>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              <span
                className={`text-xs sm:text-sm font-medium ${
                  order.orderStatus === "Delivered"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : order.orderStatus === "Cancelled"
                      ? "text-red-600 dark:text-red-400"
                      : order.orderStatus === "Shipped"
                        ? "text-purple-600 dark:text-purple-400"
                        : order.orderStatus === "Processing"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
          <div
            className={`rounded-xl p-3 sm:p-4 ${
              darkMode
                ? "bg-gray-700/50 border border-gray-600"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-[10px] sm:text-xs mb-1 sm:mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Payment Status
            </p>
            <div className="flex items-center gap-2">
              <FiCreditCard
                className={order.isPaid ? "text-emerald-500" : "text-amber-500"}
                size={14}
              />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  order.isPaid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`sticky bottom-0 p-3 sm:p-4 border-t ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        } flex justify-end`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium"
        >
          Close
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const DeleteConfirmationModal = ({ order, onConfirm, onCancel, darkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className={`rounded-xl p-4 sm:p-6 max-w-md w-full ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-500/20 rounded-full">
          <FiTrash2 className="text-red-600 dark:text-red-400" size={20} />
        </div>
        <div>
          <h3
            className={`text-base sm:text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Delete Order
          </h3>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            This action cannot be undone
          </p>
        </div>
      </div>

      <p
        className={`text-xs sm:text-sm mb-4 sm:mb-6 ${
          darkMode ? "text-gray-200" : "text-gray-600"
        }`}
      >
        Are you sure you want to delete order{" "}
        <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">
          #{order._id?.slice(-8)}
        </span>
        ?
        <br />
        All associated data will be permanently removed.
      </p>

      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border transition-colors text-xs sm:text-sm font-medium ${
            darkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

export default Orders;
