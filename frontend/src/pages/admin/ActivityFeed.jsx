import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiUser,
  FiDollarSign,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiHeart,
  FiTruck,
  FiCreditCard,
  FiZap,
  FiActivity,
  FiAward,
  FiBell,
  FiRefreshCw,
} from "react-icons/fi";

const ActivityFeed = ({ data }) => {
  const defaultActivities = [
    {
      id: 1,
      type: "order",
      message: "New order received",
      user: "Sarah Johnson",
      amount: "$245.99",
      item: "Nike Air Max 270",
      time: "2 min ago",
      status: "success",
      icon: FiShoppingBag,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      lightBg: "bg-blue-50",
      darkBg: "dark:bg-blue-500/10",
    },
    {
      id: 2,
      type: "user",
      message: "New user registered",
      user: "Mike Chen",
      time: "15 min ago",
      status: "info",
      icon: FiUser,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      lightBg: "bg-green-50",
      darkBg: "dark:bg-green-500/10",
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received",
      user: "Order #ORD-004",
      amount: "$129.50",
      time: "1 hour ago",
      status: "success",
      icon: FiDollarSign,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      lightBg: "bg-purple-50",
      darkBg: "dark:bg-purple-500/10",
    },
    {
      id: 4,
      type: "stock",
      message: "Low stock alert",
      user: "Nike Air Max",
      stock: 3,
      time: "2 hours ago",
      status: "warning",
      icon: FiAlertCircle,
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
      lightBg: "bg-yellow-50",
      darkBg: "dark:bg-yellow-500/10",
    },
    {
      id: 5,
      type: "order",
      message: "Order delivered",
      user: "Order #ORD-002",
      time: "3 hours ago",
      status: "success",
      icon: FiCheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      lightBg: "bg-green-50",
      darkBg: "dark:bg-green-500/10",
    },
  ];

  const activities = data || defaultActivities;

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return FiCheckCircle;
      case "warning":
        return FiAlertCircle;
      case "error":
        return FiXCircle;
      case "info":
        return FiClock;
      default:
        return FiActivity;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return {
          light: "text-green-700 bg-green-100",
          dark: "dark:text-green-300 dark:bg-green-500/20",
          border: "border-green-200 dark:border-green-500/20",
        };
      case "warning":
        return {
          light: "text-yellow-700 bg-yellow-100",
          dark: "dark:text-yellow-300 dark:bg-yellow-500/20",
          border: "border-yellow-200 dark:border-yellow-500/20",
        };
      case "error":
        return {
          light: "text-red-700 bg-red-100",
          dark: "dark:text-red-300 dark:bg-red-500/20",
          border: "border-red-200 dark:border-red-500/20",
        };
      case "info":
        return {
          light: "text-blue-700 bg-blue-100",
          dark: "dark:text-blue-300 dark:bg-blue-500/20",
          border: "border-blue-200 dark:border-blue-500/20",
        };
      default:
        return {
          light: "text-gray-700 bg-gray-100",
          dark: "dark:text-gray-300 dark:bg-gray-500/20",
          border: "border-gray-200 dark:border-gray-500/20",
        };
    }
  };

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <FiActivity className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            No Recent Activity
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
            There are no activities to display at the moment.
            <br />
            New activities will appear here.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Live Activity Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-2 px-1"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <FiZap className="text-yellow-500 text-base" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
              </div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Live Feed
              </h4>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiRefreshCw
                size={14}
                className="text-gray-500 dark:text-gray-400"
              />
            </motion.button>
          </motion.div>

          {/* Activities List */}
          <AnimatePresence>
            {activities.map((activity, index) => {
              const Icon = activity.icon || getStatusIcon(activity.status);
              const statusColors = getStatusColor(activity.status);
              const StatusIcon = getStatusIcon(activity.status);

              return (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                  whileHover={{
                    scale: 1.02,
                    x: 4,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  className={`group relative overflow-hidden rounded-xl border ${statusColors.border} transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800`}
                >
                  {/* Animated gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${activity.gradient || "from-gray-500 to-gray-600"} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  {/* Animated shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="relative p-3">
                    <div className="flex items-start gap-3">
                      
                      {/* Icon with animated ring */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.lightBg || "bg-gray-100"
                          } ${activity.darkBg || "dark:bg-gray-700"}`}
                        >
                          <Icon
                            className={`${activity.textColor || "text-primary-600 dark:text-primary-400"} text-lg`}
                          />
                        </motion.div>

                        {/* Status indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${
                            activity.status === "success"
                              ? "bg-green-500"
                              : activity.status === "warning"
                                ? "bg-yellow-500"
                                : activity.status === "error"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                          }`}
                        >
                          <StatusIcon size={8} className="text-white" />
                        </div>
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {activity.message}
                          </p>

                          {/* Amount badge */}
                          {activity.amount && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                activity.status === "success"
                                  ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {activity.amount}
                            </span>
                          )}
                        </div>

                        {/* User/Item info */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {activity.user}
                          </span>

                          {/* Additional details */}
                          {activity.item && (
                            <>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                •
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-300 truncate">
                                {activity.item}
                              </span>
                            </>
                          )}

                          {activity.stock && (
                            <>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                •
                              </span>
                              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                {activity.stock} left
                              </span>
                            </>
                          )}
                        </div>

                        {/* Time and metadata */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                            <FiClock size={10} />
                            <span>{activity.time}</span>
                          </div>

                          {/* Status badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-medium ${
                              statusColors.light
                            } ${statusColors.dark} whitespace-nowrap`}
                          >
                            {activity.status || "info"}
                          </span>
                        </div>
                      </div>

                      {/* Quick action button */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3 p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <FiActivity
                          size={12}
                          className="text-gray-600 dark:text-gray-300"
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700"
          >
            <button className="w-full flex items-center justify-center gap-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium py-2 transition-colors group">
              <FiActivity size={12} />
              <span>View All Activity</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-xs"
              >
                →
              </motion.span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
