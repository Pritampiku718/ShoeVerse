import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiPackage,
  FiShoppingBag,
  FiZap,
  FiBell,
} from "react-icons/fi";

const LowStockAlerts = ({ data }) => {
  const defaultAlerts = [
    {
      id: 1,
      name: "Nike Air Force 1",
      stock: 3,
      size: "US 9",
      color: "White/Black",
      category: "Running",
      threshold: 10,
      lastRestocked: "2 days ago",
    },
    {
      id: 2,
      name: "Adidas Stan Smith",
      stock: 2,
      size: "US 10",
      color: "Cloud White",
      category: "Lifestyle",
      threshold: 10,
      lastRestocked: "5 days ago",
    },
    {
      id: 3,
      name: "Vans Old Skool",
      stock: 5,
      size: "US 8",
      color: "Black/White",
      category: "Skateboarding",
      threshold: 15,
      lastRestocked: "1 week ago",
    },
    {
      id: 4,
      name: "Converse Chuck Taylor",
      stock: 4,
      size: "US 7",
      color: "Black",
      category: "Casual",
      threshold: 12,
      lastRestocked: "3 days ago",
    },
  ];

  const alerts = data || defaultAlerts;

  // Calculate urgency level based on stock vs threshold
  const getUrgencyLevel = (stock, threshold = 10) => {
    const ratio = stock / threshold;
    if (ratio <= 0.2) return { level: "critical", color: "red", icon: FiZap };
    if (ratio <= 0.5) return { level: "high", color: "orange", icon: FiBell };
    return { level: "medium", color: "yellow", icon: FiAlertCircle };
  };

  // Get color classes based on urgency
  const getColorClasses = (color) => {
    const colors = {
      red: {
        light: "bg-red-50 border-red-200",
        dark: "dark:bg-red-500/10 dark:border-red-500/20",
        badge: "bg-red-500 text-white",
        icon: "text-red-600 dark:text-red-400",
        progress: "bg-red-500",
        ring: "ring-red-500/30",
        text: "text-red-900 dark:text-red-200",
        label: "text-red-700 dark:text-red-300",
      },
      orange: {
        light: "bg-orange-50 border-orange-200",
        dark: "dark:bg-orange-500/10 dark:border-orange-500/20",
        badge: "bg-orange-500 text-white",
        icon: "text-orange-600 dark:text-orange-400",
        progress: "bg-orange-500",
        ring: "ring-orange-500/30",
        text: "text-orange-900 dark:text-orange-200",
        label: "text-orange-700 dark:text-orange-300",
      },
      yellow: {
        light: "bg-yellow-50 border-yellow-200",
        dark: "dark:bg-yellow-500/10 dark:border-yellow-500/20",
        badge: "bg-yellow-500 text-white",
        icon: "text-yellow-600 dark:text-yellow-400",
        progress: "bg-yellow-500",
        ring: "ring-yellow-500/30",
        text: "text-yellow-900 dark:text-yellow-200",
        label: "text-yellow-700 dark:text-yellow-300",
      },
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
            <FiPackage className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            All Stock Healthy
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
            No low stock alerts at the moment. All products are above threshold.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white"
          >
            <div className="flex items-center gap-2">
              <FiAlertCircle size={18} />
              <div>
                <p className="text-sm font-semibold">
                  {alerts.length} {alerts.length === 1 ? "Product" : "Products"}{" "}
                  Need Attention
                </p>
                <p className="text-xs text-white/80">
                  Restock soon to avoid stockouts
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium">
              Urgent
            </span>
          </motion.div>

          {alerts.map((alert, index) => {
            const urgency = getUrgencyLevel(alert.stock, alert.threshold);
            const colors = getColorClasses(urgency.color);

            return (
              <motion.div
                key={alert.id || `${alert.name}-${alert.size}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`group relative overflow-hidden rounded-xl border ${colors.light} ${colors.dark} transition-all duration-300 hover:shadow-lg hover:shadow-${urgency.color}-500/10 bg-white dark:bg-gray-800`}
              >
                {/* Animated background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-${urgency.color}-500/0 via-${urgency.color}-500/5 to-${urgency.color}-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}
                />

                <div className="relative p-3">
                  <div className="flex items-start gap-3">
                    
                    {/* Icon with animated ring */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${colors.light} ${colors.dark} border ${colors.dark} flex items-center justify-center relative z-10 bg-white dark:bg-gray-800`}
                      >
                        <urgency.icon className={`${colors.icon} text-lg`} />
                      </div>
                      <div
                        className={`absolute inset-0 rounded-xl animate-ping opacity-20 ${colors.ring} -z-0`}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`text-sm font-semibold truncate pr-2 ${colors.text}`}
                        >
                          {alert.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors.badge} shadow-lg flex-shrink-0`}
                        >
                          {alert.stock} left
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                            Size
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {alert.size}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                            Category
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium truncate">
                            {alert.category || "N/A"}
                          </p>
                        </div>
                        {alert.color && (
                          <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                              Color
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium text-xs">
                              {alert.color}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            Stock Level
                          </p>
                          <p className="text-[10px] font-medium text-gray-700 dark:text-gray-200">
                            {Math.round(
                              (alert.stock / (alert.threshold || 10)) * 100,
                            )}
                            % of threshold
                          </p>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (alert.stock / (alert.threshold || 10)) * 100)}%`,
                            }}
                            transition={{
                              delay: index * 0.2,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                            className={`h-full ${colors.progress} rounded-full relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Last Restocked Info */}
                      {alert.lastRestocked && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                          <FiPackage size={10} />
                          <span>Last restocked: {alert.lastRestocked}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons  */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 right-3 flex gap-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        
                        // Handle restock action
                        console.log("Restock:", alert.name);
                      }}
                      className={`p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:scale-110`}
                      title="Restock now"
                    >
                      <FiPackage
                        size={14}
                        className="text-gray-700 dark:text-gray-200"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle view product
                        console.log("View:", alert.name);
                      }}
                      className={`p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:scale-110`}
                      title="View product"
                    >
                      <FiShoppingBag
                        size={14}
                        className="text-gray-700 dark:text-gray-200"
                      />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}

          {/* Restock Summary Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">
                Total at risk:
                <span className="font-bold text-red-600 dark:text-red-400 ml-1">
                  {alerts.reduce((sum, a) => sum + a.stock, 0)}
                </span>
              </span>
              <button
                onClick={() => console.log("Bulk restock")}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
              >
                <FiZap size={12} />
                <span>Bulk Restock</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default LowStockAlerts;
