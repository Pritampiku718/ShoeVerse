import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiShoppingBag,
  FiSearch,
  FiArrowLeft,
  FiCompass,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-20 w-64 h-64 bg-gradient-to-r from-primary-600/20 to-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              document.documentElement.classList.contains("dark")
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)"
            } 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        
        {/* 404 with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6 relative"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black bg-gradient-to-r from-primary-600 via-accent to-pink-500 bg-clip-text text-transparent leading-none">
            404
          </h1>

          {/* Floating Badge */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <FiZap className="text-white text-lg sm:text-2xl" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Looks Like You're Off Track
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto px-4">
            Even the most exclusive sneaker drops sometimes lead to unexpected
            places. Let's get you back to where the heat is.
          </p>
        </motion.div>

        {/* Search Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {["Nike Air Max", "Jordan 1", "Yeezy", "New Balance"].map(
              (item, index) => (
                <Link
                  key={index}
                  to={`/products?search=${encodeURIComponent(item)}`}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
              <FiHome
                className="group-hover:scale-110 transition-transform"
                size={18}
              />
              Back to Home
              <FiArrowLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={16}
              />
            </span>
          </Link>

          <Link
            to="/products"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <FiShoppingBag
                className="group-hover:scale-110 transition-transform"
                size={18}
              />
              Browse Collection
              <FiTrendingUp
                className="group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </span>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/new-arrivals"
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              <FiCompass size={12} />
              New Arrivals
            </Link>
            <Link
              to="/sale"
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              <FiZap size={12} />
              Flash Sale
            </Link>
            <Link
              to="/search"
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              <FiSearch size={12} />
              Advanced Search
            </Link>
          </div>
        </motion.div>

        {/* Decorative Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, i % 2 === 0 ? 20 : -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute hidden lg:block"
              style={{
                top: `${20 + i * 15}%`,
                left: `${5 + i * 8}%`,
              }}
            >
              <div className="text-4xl opacity-10 dark:opacity-20 rotate-12">
                👟
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
