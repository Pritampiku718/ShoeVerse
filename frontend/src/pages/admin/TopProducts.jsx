import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiStar,
  FiAward,
  FiBarChart2,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiZap,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
} from "react-icons/fi";

const TopProducts = ({ data }) => {
  const defaultData = [
    {
      id: 1,
      name: "Nike Air Max 270",
      sold: 1245,
      revenue: 124500,
      growth: 23.5,
      previousRank: 2,
      category: "Running",
      image: "🏃",
      inStock: true,
      stockCount: 145,
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      sold: 987,
      revenue: 118440,
      growth: 15.2,
      previousRank: 1,
      category: "Running",
      image: "👟",
      inStock: true,
      stockCount: 89,
    },
    {
      id: 3,
      name: "Jordan 1 Retro High",
      sold: 756,
      revenue: 136080,
      growth: -2.3,
      previousRank: 3,
      category: "Lifestyle",
      image: "👞",
      inStock: true,
      stockCount: 34,
    },
    {
      id: 4,
      name: "New Balance 990v5",
      sold: 543,
      revenue: 86880,
      growth: 8.7,
      previousRank: 5,
      category: "Lifestyle",
      image: "🥾",
      inStock: true,
      stockCount: 67,
    },
    {
      id: 5,
      name: "Converse Chuck Taylor",
      sold: 432,
      revenue: 25920,
      growth: 12.1,
      previousRank: 4,
      category: "Casual",
      image: "👢",
      inStock: false,
      stockCount: 12,
    },
  ];

  const products = data && data.length > 0 ? data : defaultData;

  // Get rank color based on position
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
          text: "text-yellow-900 dark:text-yellow-100",
          badge: "bg-yellow-500",
          ring: "ring-yellow-400",
          glow: "shadow-yellow-500/30",
        };
      case 1:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-500",
          text: "text-gray-900 dark:text-gray-100",
          badge: "bg-gray-400",
          ring: "ring-gray-400",
          glow: "shadow-gray-500/30",
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-amber-600 to-amber-800",
          text: "text-amber-900 dark:text-amber-100",
          badge: "bg-amber-600",
          ring: "ring-amber-500",
          glow: "shadow-amber-700/30",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-primary-600 to-accent",
          text: "text-primary-900 dark:text-primary-100",
          badge: "bg-primary-600",
          ring: "ring-primary-500",
          glow: "shadow-primary-600/30",
        };
    }
  };

  // Get trend indicator
  const getTrendIndicator = (growth) => {
    
    // Handle undefined or null growth
    if (growth === undefined || growth === null) {
      return {
        icon: FiMinus,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-500/10",
        border: "border-gray-200 dark:border-gray-500/20",
        text: "0%",
      };
    }

    if (growth > 0) {
      return {
        icon: FiArrowUp,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-500/10",
        border: "border-emerald-200 dark:border-emerald-500/20",
        text: `+${growth}%`,
      };
    } else if (growth < 0) {
      return {
        icon: FiArrowDown,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/10",
        border: "border-red-200 dark:border-red-500/20",
        text: `${growth}%`,
      };
    } else {
      return {
        icon: FiMinus,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-500/10",
        border: "border-gray-200 dark:border-gray-500/20",
        text: "0%",
      };
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "0";

    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <FiPackage className="text-3xl text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          No Product Data Available
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
          There are no products to display at the moment.
          <br />
          Add products to see them here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      
      {/* Header with Total Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-1 mb-2"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <FiAward
              className="text-primary-600 dark:text-primary-400"
              size={14}
            />
          </div>
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Top Performing Products
          </h4>
        </div>
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
          Last 30 days
        </span>
      </motion.div>

      {/* Products List */}
      {products.map((product, index) => {
        const rankColors = getRankColor(index);
        const trend = getTrendIndicator(product.growth);
        const TrendIcon = trend.icon;
        const previousRank = product.previousRank || index + 2;
        const rankChange = previousRank - (index + 1);

        return (
          <motion.div
            key={product._id || product.id || `product-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
            whileHover={{
              scale: 1.02,
              x: 4,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300`}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {/* Rank indicator strip */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${rankColors.bg}`}
            />

            <div className="relative p-3 pl-4">
              <div className="flex items-start gap-3">
                
                {/* Rank Badge with Animation */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 ${rankColors.bg} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${rankColors.glow} relative overflow-hidden`}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {index + 1}
                  </motion.div>

                  {/* Rank change indicator */}
                  {rankChange !== 0 && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${
                        rankChange > 0 ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      {rankChange > 0 ? (
                        <FiArrowUp size={8} className="text-white" />
                      ) : (
                        <FiArrowDown size={8} className="text-white" />
                      )}
                    </div>
                  )}

                  {/* Gold star */}
                  {index === 0 && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <FiStar className="text-yellow-400 fill-current text-xs drop-shadow-lg" />
                    </motion.div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          {product.category || "General"}
                        </span>
                        <span className="text-[8px] text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span
                          className={`text-[10px] font-medium flex items-center gap-0.5 ${
                            product.inStock
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          <FiPackage size={8} />
                          {product.inStock
                            ? `${product.stockCount || 0} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {/* Performance Badge */}
                    <div
                      className={`px-2 py-1 rounded-lg ${trend.bg} border ${trend.border} flex-shrink-0`}
                    >
                      <div className="flex items-center gap-1">
                        <TrendIcon className={`${trend.color}`} size={10} />
                        <span
                          className={`text-[10px] font-bold ${trend.color}`}
                        >
                          {trend.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    
                    {/* Units Sold */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                        <FiShoppingBag size={10} />
                        <span>Sold</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {product.sold ? formatNumber(product.sold) : "0"}
                      </p>
                    </div>

                    {/* Revenue */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                        <FiDollarSign size={10} />
                        <span>Revenue</span>
                      </div>
                      <p className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        {product.revenue
                          ? formatCurrency(product.revenue)
                          : "$0"}
                      </p>
                    </div>

                    {/* Value per unit */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                        <FiBarChart2 size={10} />
                        <span>Avg</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {product.revenue && product.sold
                          ? formatCurrency(product.revenue / product.sold)
                          : "$0"}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar - Market share visualization */}
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-medium text-gray-500 dark:text-gray-400">
                        Market Share
                      </span>
                      <span className="text-[8px] font-bold text-gray-900 dark:text-white">
                        {product.revenue && products && products.length > 0
                          ? (
                              (product.revenue /
                                products.reduce(
                                  (sum, p) => sum + (p?.revenue || 0),
                                  0,
                                )) *
                              100
                            ).toFixed(1)
                          : "0"}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            product.revenue && products && products.length > 0
                              ? `${(product.revenue / products.reduce((sum, p) => sum + (p?.revenue || 0), 0)) * 100}%`
                              : "0%",
                        }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full bg-gradient-to-r ${rankColors.bg}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
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

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700"
      >
        <button className="w-full flex items-center justify-center gap-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium py-2 transition-colors group">
          <FiBarChart2 size={12} />
          <span>View Full Analytics</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-xs"
          >
            →
          </motion.span>
        </button>
      </motion.div>
    </div>
  );
};

export default TopProducts;
