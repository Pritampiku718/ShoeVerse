import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiMenu,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiClock,
  FiRefreshCw,
  FiXCircle,
  FiCheckCircle,
  FiHome,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { toast } from "react-hot-toast";
import { adminAPI } from "../../services/api";
import io from "socket.io-client";

const TopBar = ({ toggleSidebar, isSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Real-time stats state
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    newUsers: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();

  // Socket.io connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token, skipping socket connection");
      return;
    }

    //Get API URL and remove /api for socket connection
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const baseUrl = apiUrl.replace("/api", "");
    const socketUrl = baseUrl;

    console.log("Socket connecting to:", socketUrl);
    console.log("API URL was:", apiUrl);

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
      path: "/socket.io/",
      withCredentials: true,
      autoConnect: true,
      rememberUpgrade: true,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket.io connected successfully", newSocket.id);
      setIsConnected(true);
      newSocket.emit("ping");
    });

    newSocket.on("pong", () => {
      console.log("ocket.io pong received");
    });

    newSocket.on("connect_error", (error) => {
      console.log("Socket.io connection error:", error.message);
      console.log("Socket URL:", socketUrl);
      console.log("Make sure your backend is running on:", socketUrl);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket.io disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("error", (error) => {
      console.log("Socket.io error:", error);
    });

    newSocket.io.on("open", () => {
      console.log("Socket transport open");
    });

    newSocket.io.on("close", (reason) => {
      console.log("Socket transport closed:", reason);
    });

    // New Order Notification
    newSocket.on("newOrder", (data) => {
      console.log("📦 New order received:", data);

      setStats((prev) => ({
        ...prev,
        todayOrders: prev.todayOrders + 1,
        todayRevenue: prev.todayRevenue + (data.total || 0),
      }));

      const newNotification = {
        id: Date.now(),
        type: "order",
        title: "🛒 New Order Received",
        message: `Order #${data.orderNumber} from ${data.customerName} - $${data.total}`,
        time: "Just now",
        read: false,
        icon: FiShoppingBag,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        data: data,
        actionable: true,
        actionLabel: "View Order",
        actionLink: `/admin/orders/${data.orderId}`,
      };

      addNotification(newNotification);

      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FiShoppingBag className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                New Order!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ${data.total} from {data.customerName}
              </p>
            </div>
          </div>
        </motion.div>
      ));
    });

    // Low Stock Alert
    newSocket.on("lowStock", (data) => {
      console.log("Low stock alert:", data);

      setStats((prev) => ({
        ...prev,
        lowStock: prev.lowStock + 1,
      }));

      const newNotification = {
        id: Date.now(),
        type: "stock",
        title: "⚠️ Low Stock Alert",
        message: `${data.productName} is running low (${data.stock} left)`,
        time: "Just now",
        read: false,
        icon: FiPackage,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        data: data,
        actionable: true,
        actionLabel: "Restock",
        actionLink: `/admin/products/${data.productId}`,
      };

      addNotification(newNotification);
    });

    // New User Registration
    newSocket.on("newUser", (data) => {
      console.log("New user registered:", data);

      setStats((prev) => ({
        ...prev,
        newUsers: prev.newUsers + 1,
      }));

      const newNotification = {
        id: Date.now(),
        type: "user",
        title: "👤 New User Registered",
        message: `${data.userName} just created an account`,
        time: "Just now",
        read: false,
        icon: FiUsers,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        data: data,
        actionable: true,
        actionLabel: "View User",
        actionLink: `/admin/users/${data.userId}`,
      };

      addNotification(newNotification);
    });

    // Failed Payment Alert
    newSocket.on("failedPayment", (data) => {
      console.log("Failed payment:", data);

      const newNotification = {
        id: Date.now(),
        type: "payment",
        title: "❌ Failed Payment",
        message: `Payment failed for order #${data.orderNumber} - $${data.amount}`,
        time: "Just now",
        read: false,
        icon: FiXCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        data: data,
        actionable: true,
        actionLabel: "Review",
        actionLink: `/admin/orders/${data.orderId}`,
      };

      addNotification(newNotification);
    });

    // Successful Payment
    newSocket.on("successfulPayment", (data) => {
      console.log("Successful payment:", data);

      const newNotification = {
        id: Date.now(),
        type: "payment",
        title: "✅ Payment Successful",
        message: `Payment of $${data.amount} for order #${data.orderNumber} completed`,
        time: "Just now",
        read: false,
        icon: FiCheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        data: data,
        actionable: true,
        actionLabel: "View Order",
        actionLink: `/admin/orders/${data.orderId}`,
      };

      addNotification(newNotification);
    });

    // Order Status Update
    newSocket.on("orderStatusUpdate", (data) => {
      console.log("Order status update:", data);

      const newNotification = {
        id: Date.now(),
        type: "order",
        title: `📦 Order ${data.status}`,
        message: `Order #${data.orderNumber} status updated to ${data.status}`,
        time: "Just now",
        read: false,
        icon: FiShoppingBag,
        color: data.status === "Delivered" ? "text-green-500" : "text-blue-500",
        bgColor:
          data.status === "Delivered" ? "bg-green-500/10" : "bg-blue-500/10",
        data: data,
        actionable: true,
        actionLabel: "View Order",
        actionLink: `/admin/orders/${data.orderId}`,
      };

      addNotification(newNotification);
    });

    // Product Deleted
    newSocket.on("productDeleted", (data) => {
      console.log("Product deleted:", data);

      const newNotification = {
        id: Date.now(),
        type: "product",
        title: "🗑️ Product Deleted",
        message: data.message,
        time: "Just now",
        read: false,
        icon: FiPackage,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        data: data,
      };

      addNotification(newNotification);
    });

    // User Status Update
    newSocket.on("userStatusUpdate", (data) => {
      console.log("User status update:", data);

      const newNotification = {
        id: Date.now(),
        type: "user",
        title: data.isActive ? "🔓 User Unblocked" : "🔒 User Blocked",
        message: data.message,
        time: "Just now",
        read: false,
        icon: FiUsers,
        color: data.isActive ? "text-green-500" : "text-red-500",
        bgColor: data.isActive ? "bg-green-500/10" : "bg-red-500/10",
        data: data,
        actionable: true,
        actionLabel: "View User",
        actionLink: `/admin/users/${data.userId}`,
      };

      addNotification(newNotification);
    });

    // Bulk Order Update
    newSocket.on("bulkOrderUpdate", (data) => {
      console.log("Bulk order update:", data);

      const newNotification = {
        id: Date.now(),
        type: "bulk",
        title: "📊 Bulk Order Update",
        message: data.message,
        time: "Just now",
        read: false,
        icon: FiRefreshCw,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        data: data,
      };

      addNotification(newNotification);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("Cleaning up socket connection");
        newSocket.removeAllListeners();
        newSocket.disconnect();
      }
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev].slice(0, 50);
      localStorage.setItem("adminNotifications", JSON.stringify(updated));
      return updated;
    });
    setUnreadCount((prev) => prev + 1);
  };

  // Load saved notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminNotifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n) => !n.read).length);
      } catch (e) {
        console.error("Failed to parse saved notifications");
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));
  }, [notifications]);

  // Fetch real-time stats - ONLY when refresh button is clicked
  const fetchRealTimeStats = async (showToast = true) => {
    setLoading(true);

    try {
      const response = await adminAPI.getDashboardStats();
      const data = response.data?.data || response.data;

      const today = new Date().toDateString();
      const recentOrders = data.recentOrders || [];
      const todayOrdersCount =
        recentOrders.filter(
          (order) =>
            order?.createdAt &&
            new Date(order.createdAt).toDateString() === today,
        ).length || 0;

      const todayRevenueAmount =
        recentOrders
          .filter(
            (order) =>
              order?.createdAt &&
              new Date(order.createdAt).toDateString() === today,
          )
          .reduce((sum, order) => sum + (order?.totalPrice || 0), 0) || 0;

      const newUsersToday = data.users?.newToday || data.newUsersToday || 0;
      const lowStockCount =
        data.products?.lowStock || data.lowStockProducts?.length || 0;

      setStats({
        todayRevenue: todayRevenueAmount,
        todayOrders: todayOrdersCount,
        newUsers: newUsersToday,
        lowStock: lowStockCount,
      });

      setCountdown(30);

      if (showToast) {
        toast.success("Stats refreshed!");
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      if (showToast) {
        toast.error("Failed to refresh stats");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh is DISABLED by default
  useEffect(() => {
    let interval;
    let countdownInterval;

    if (autoRefresh) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
      }, 1000);

      interval = setInterval(() => {
        fetchRealTimeStats(false);
      }, 30000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [autoRefresh]);

  // Initial fetch - only once when component mounts
  useEffect(() => {
    fetchRealTimeStats(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("adminNotifications");
    toast.success("All notifications cleared");
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionable && notification.actionLink) {
      navigate(notification.actionLink);
    }
    setShowNotifications(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
    if (!autoRefresh) {
      setCountdown(30);
      toast.success("Auto-refresh enabled");
    } else {
      toast.success("Auto-refresh disabled");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Left Section */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiMenu
                size={18}
                sm:size={20}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            <div className="hidden xs:block sm:block">
              <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {getGreeting()},{" "}
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  {user?.name?.split(" ")[0] || "Admin"}
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div
            ref={searchRef}
            className="hidden md:block flex-1 max-w-md mx-2 lg:mx-4"
          >
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search orders, products, users..."
                className="w-full pl-9 pr-4 py-1.5 lg:py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs lg:text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <FiSun size={14} sm:size={18} className="text-yellow-500" />
              ) : (
                <FiMoon size={14} sm:size={18} className="text-blue-500" />
              )}
            </button>

            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiBell
                  size={14}
                  sm:size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[7px] sm:text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-primary-600 text-white text-[8px] sm:text-[10px] rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          Mark all read
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">
                          |
                        </span>
                        <button
                          onClick={clearAllNotifications}
                          className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                          <FiBell className="mx-auto text-gray-400 dark:text-gray-500 text-2xl sm:text-3xl mb-2" />
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <motion.div
                              key={notification.id}
                              whileHover={{
                                backgroundColor: darkMode
                                  ? "#1F2937"
                                  : "#F9FAFB",
                              }}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${
                                !notification.read
                                  ? "bg-primary-50/50 dark:bg-primary-900/10"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div
                                  className={`p-1.5 sm:p-2 rounded-lg ${notification.bgColor} flex-shrink-0`}
                                >
                                  <Icon
                                    className={notification.color}
                                    size={12}
                                    sm:size={16}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 truncate">
                                    {notification.message}
                                  </p>
                                  <p className="text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500">
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                                )}
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <FiChevronDown
                  size={12}
                  sm:size={16}
                  className={`text-gray-500 dark:text-gray-400 transition-transform hidden xs:block ${showUserMenu ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-primary-600 to-accent">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/80 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1 sm:p-2">
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                      >
                        <FiHome size={12} sm:size={16} />
                        <span>Home</span>
                      </Link>
                      
                      <Link
                        to="/admin/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                      >
                        <FiUser size={12} sm:size={16} />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/admin/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm"
                      >
                        <FiSettings size={12} sm:size={16} />
                        <span>Settings</span>
                      </Link>

                      {/* Divider */}
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm"
                      >
                        <FiLogOut size={12} sm:size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max sm:min-w-full">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            
            {/* Today's Revenue */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg sm:rounded-xl">
                <FiDollarSign
                  className="text-blue-600 dark:text-blue-400"
                  size={14}
                  sm:size={16}
                />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                  Revenue
                </p>
                <p className="text-xs sm:text-sm lg:text-base font-black text-gray-900 dark:text-white">
                  {formatCurrency(stats.todayRevenue)}
                </p>
              </div>
            </div>

            {/* Today's Orders */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg sm:rounded-xl">
                <FiShoppingBag
                  className="text-green-600 dark:text-green-400"
                  size={14}
                  sm:size={16}
                />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                  Orders
                </p>
                <p className="text-xs sm:text-sm lg:text-base font-black text-gray-900 dark:text-white">
                  {stats.todayOrders}
                </p>
              </div>
            </div>

            {/* New Users */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg sm:rounded-xl">
                <FiUsers
                  className="text-purple-600 dark:text-purple-400"
                  size={14}
                  sm:size={16}
                />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                  New Users
                </p>
                <p className="text-xs sm:text-sm lg:text-base font-black text-gray-900 dark:text-white">
                  +{stats.newUsers}
                </p>
              </div>
            </div>

            {/* Low Stock */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg sm:rounded-xl">
                <FiPackage
                  className="text-yellow-600 dark:text-yellow-400"
                  size={14}
                  sm:size={16}
                />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                  Low Stock
                </p>
                <p
                  className={`text-xs sm:text-sm lg:text-base font-black ${
                    stats.lowStock > 5
                      ? "text-yellow-600 dark:text-yellow-400"
                      : stats.lowStock > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {stats.lowStock}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Refresh Button */}
          <div className="flex items-center gap-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchRealTimeStats(true)}
              disabled={loading}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: loading ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <FiRefreshCw size={14} sm:size={16} />
              </motion.div>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {loading ? "Refreshing..." : "Refresh"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
