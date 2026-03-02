import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import {
  FiUser,
  FiPackage,
  FiLogOut,
  FiSettings,
  FiHeart,
  FiShoppingBag,
  FiChevronRight,
  FiMoon,
  FiSun,
  FiStar,
  FiClock,
  FiAward,
  FiCreditCard,
  FiMapPin,
  FiBell,
  FiGift,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";

const ClientLayout = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowUserMenu(false);
  }, [location]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
  };

  // Mock user stats
  const userStats = {
    orders: 12,
    wishlist: 5,
    reviews: 3,
    points: 1250,
    tier: "Gold",
    saved: 249.99,
  };

  const userMenuItems = [
    {
      icon: FiUser,
      label: "Profile",
      path: "/profile",
      description: "Manage your account",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: FiPackage,
      label: "Orders",
      path: "/orders",
      description: "Track & manage orders",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      icon: FiHeart,
      label: "Wishlist",
      path: "/wishlist",
      description: "Your saved items",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-500",
    },
    {
      icon: FiMapPin,
      label: "Addresses",
      path: "/addresses",
      description: "Manage delivery addresses",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      icon: FiCreditCard,
      label: "Payments",
      path: "/payments",
      description: "Payment methods",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    },
    {
      icon: FiSettings,
      label: "Settings",
      path: "/settings",
      description: "Preferences & privacy",
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-500/10",
      iconColor: "text-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 relative overflow-x-hidden">
      
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Geometric Lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-[0.01] dark:opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating Dots Pattern */}
        <div
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, ${darkMode ? "#ffffff" : "#000000"} 0.5px, transparent 0.5px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Premium User Menu */}
      <AnimatePresence>
        {showUserMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setShowUserMenu(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-20 xs:top-24 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 lg:right-6 xl:right-8 sm:translate-x-0 w-[calc(100%-2rem)] xs:w-80 sm:w-88 md:w-92 lg:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden z-50 mx-4"
            >
              {/* User Info Section */}
              <div className="p-4 xs:p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || "Guest User"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user?.email || "guest@example.com"}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    {userStats.tier}
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {userStats.orders}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                      Orders
                    </p>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {userStats.points}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                      Points
                    </p>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-2 text-center border border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${userStats.saved}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                      Saved
                    </p>
                  </div>
                </div>
              </div>

              {/* User Menu Items */}
              <div className="p-3 xs:p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700/90 border border-gray-200 dark:border-gray-700 transition-all duration-300 group hover:shadow-md"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Theme & Logout */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 xs:p-3.5 sm:p-4 bg-gray-100/80 dark:bg-gray-800/80">
                <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                  
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 p-1.5 xs:p-2 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-300 dark:border-gray-600 group"
                  >
                    {darkMode ? (
                      <>
                        <FiSun
                          size={12}
                          xs:size={14}
                          sm:size={16}
                          className="text-yellow-500 group-hover:rotate-90 transition-transform"
                        />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                          Light
                        </span>
                      </>
                    ) : (
                      <>
                        <FiMoon
                          size={12}
                          xs:size={14}
                          sm:size={16}
                          className="text-blue-500 group-hover:rotate-90 transition-transform"
                        />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                          Dark
                        </span>
                      </>
                    )}
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 p-1.5 xs:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg xs:rounded-xl transition-all duration-300 group shadow-md hover:shadow-lg"
                  >
                    <FiLogOut
                      size={12}
                      xs:size={14}
                      sm:size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    <span className="text-[10px] xs:text-xs sm:text-sm font-medium">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-0"
      >
        <div className="w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default ClientLayout;
