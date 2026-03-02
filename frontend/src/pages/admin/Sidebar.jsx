import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiTag,
  FiAward,
  FiStar,
  FiTruck,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { adminAPI } from "../../services/api";
import { toast } from "react-hot-toast";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const initialRender = useRef(true);
  const isNavigating = useRef(false);

  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { darkMode } = useThemeStore();

  // Fetch dashboard stats for real data
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardData(response.data.data);
      console.log("Sidebar Dashboard Data:", response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle resize with debounce to prevent rapid state changes
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const desktop = window.innerWidth >= 1024;
        setWindowWidth(window.innerWidth);
        setIsDesktop(desktop);

        // Auto close mobile sidebar when resizing to desktop
        if (desktop && mobileOpen) {
          setMobileOpen(false);
        }

        // Auto collapse on smaller screens
        if (!desktop && !collapsed) {
          setCollapsed(true);
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // Set initial render flag after first effect run
    initialRender.current = false;

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [setMobileOpen, mobileOpen, collapsed, setCollapsed]);

  // Handle navigation - don't auto close on mobile unless user wants it
  useEffect(() => {
    if (isNavigating.current) {
      isNavigating.current = false;
      return;
    }
  }, [location, isDesktop, mobileOpen, setMobileOpen]);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
    }
  }, [collapsed, isDesktop]);

  // Load saved sidebar state on mount
  useEffect(() => {
    if (isDesktop) {
      const savedState = localStorage.getItem("sidebarCollapsed");
      if (savedState !== null) {
        setCollapsed(JSON.parse(savedState));
      }
    } else {
      // On mobile/tablet, start collapsed
      setCollapsed(true);
    }
  }, [isDesktop, setCollapsed]);

  // Menu items
  const menuItems = {
    main: [
      {
        path: "/admin",
        name: "Dashboard",
        icon: FiHome,
        color: "from-blue-500 to-cyan-500",
        end: true,
      },
      {
        path: "/admin/profile",
        name: "Profile",
        icon: FiUser,
        color: "from-purple-500 to-pink-500",
      },
      {
        path: "/admin/revenue",
        name: "Revenue",
        icon: FiDollarSign,
        color: "from-green-500 to-emerald-500",
      },
      {
        path: "/admin/products",
        name: "Products",
        icon: FiPackage,
        color: "from-purple-500 to-pink-500",
      },
      {
        path: "/admin/orders",
        name: "Orders",
        icon: FiShoppingBag,
        color: "from-orange-500 to-red-500",
      },
      {
        path: "/admin/users",
        name: "Users",
        icon: FiUsers,
        color: "from-indigo-500 to-purple-500",
      },
      {
        path: "/admin/settings",
        name: "Settings",
        icon: FiSettings,
        color: "from-gray-500 to-slate-500",
      },
    ],
  };

  // Real stats from dashboard data
  const quickStats = [
    {
      label: "Orders",
      value: statsLoading
        ? "..."
        : (dashboardData?.orders?.total || 0).toLocaleString(),
      icon: FiShoppingBag,
      color: "text-blue-500",
    },
    {
      label: "Users",
      value: statsLoading
        ? "..."
        : (dashboardData?.users?.total || 0).toLocaleString(),
      icon: FiUsers,
      color: "text-green-500",
    },
    {
      label: "Revenue",
      value: statsLoading
        ? "..."
        : `$${((dashboardData?.overview?.totalRevenue || 0) / 1000).toFixed(1)}k`,
      icon: FiDollarSign,
      color: "text-purple-500",
    },
  ];

  const isActive = (path, end = false) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleLinkClick = () => {
    
    // Set navigating flag
    isNavigating.current = true;

    // Only close on mobile
    if (!isDesktop) {
      setTimeout(() => {
        setMobileOpen(false);
      }, 100);
    }
  };

  // Get sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (isDesktop) {
      return collapsed ? 80 : 288;
    } else {
      return mobileOpen ? (windowWidth < 640 ? 280 : 320) : 0;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isDesktop && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: getSidebarWidth(),
          x: !isDesktop && !mobileOpen ? -getSidebarWidth() : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full z-50 bg-gradient-to-b ${
          darkMode
            ? "from-gray-900 to-gray-800 border-gray-700/50"
            : "from-white to-gray-50 border-gray-200 shadow-xl"
        } border-r shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className={`h-16 sm:h-20 flex items-center justify-between px-3 sm:px-4 border-b relative overflow-hidden flex-shrink-0 ${
            darkMode ? "border-gray-700/50" : "border-gray-200"
          }`}
        >
          <Link
            to="/admin"
            className="flex items-center gap-1 sm:gap-2"
            onClick={handleLinkClick}
          >
            {collapsed && isDesktop ? (
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent">
                SV
              </span>
            ) : (
              <>
                <span
                  className={`text-base sm:text-lg md:text-2xl font-black bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-none`}
                >
                  {isDesktop ? "ShoeVerse" : "SV"}
                </span>
                {!collapsed && isDesktop && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-primary-500/20 text-primary-400 text-[8px] sm:text-[10px] font-bold rounded-full">
                    ADMIN
                  </span>
                )}
              </>
            )}
          </Link>

          {/* Close Button (Mobile/Tablet) */}
          {!isDesktop && mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <FiX
                size={16}
                sm:size={18}
                className={darkMode ? "text-gray-400" : "text-gray-600"}
              />
            </button>
          )}

          {/* Collapse Toggle (Desktop only) */}
          {isDesktop && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              {collapsed ? (
                <FiChevronRight
                  size={16}
                  sm:size={18}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
              ) : (
                <FiChevronLeft
                  size={16}
                  sm:size={18}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
              )}
            </button>
          )}
        </div>

        {/* User Profile Section */}
        <div
          className={`p-3 sm:p-4 border-b flex-shrink-0 ${
            darkMode ? "border-gray-700/50" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-gray-800" />
            </div>

            {(!collapsed || !isDesktop) && (
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.name}
                </p>
                <p
                  className={`text-[9px] sm:text-xs truncate ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {user?.email}
                </p>
                <p className="text-[8px] sm:text-[10px] text-primary-400 mt-0.5">
                  Administrator
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats With REAL data */}
          {(!collapsed || !isDesktop) && (
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-3 sm:mt-4">
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className={`text-center p-1.5 sm:p-2 rounded-lg ${
                    darkMode ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <stat.icon
                    className={`mx-auto ${stat.color} mb-0.5 sm:mb-1`}
                    size={windowWidth < 640 ? 12 : 14}
                  />
                  <p
                    className={`text-[10px] sm:text-xs font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {statsLoading ? (
                      <span className="animate-pulse text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-[6px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          className={`flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3 ${
            darkMode ? "scrollbar-dark" : "scrollbar-light"
          }`}
        >
          <style>{`
            .scrollbar-dark::-webkit-scrollbar {
              width: 3px;
            }
            .scrollbar-dark::-webkit-scrollbar-track {
              background: #1f2937;
              border-radius: 10px;
            }
            .scrollbar-dark::-webkit-scrollbar-thumb {
              background: #4b5563;
              border-radius: 10px;
            }
            .scrollbar-dark::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
            .scrollbar-dark {
              scrollbar-width: thin;
              scrollbar-color: #4b5563 #1f2937;
            }
            .scrollbar-light::-webkit-scrollbar {
              width: 3px;
            }
            .scrollbar-light::-webkit-scrollbar-track {
              background: #e5e7eb;
              border-radius: 10px;
            }
            .scrollbar-light::-webkit-scrollbar-thumb {
              background: #9ca3af;
              border-radius: 10px;
            }
            .scrollbar-light::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
            .scrollbar-light {
              scrollbar-width: thin;
              scrollbar-color: #9ca3af #e5e7eb;
            }
          `}</style>

          {/* Main Menu  */}
          <div className="mb-4 sm:mb-6">
            {(!collapsed || !isDesktop) && (
              <p
                className={`text-[9px] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-3 mb-1 sm:mb-2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                MAIN
              </p>
            )}
            {menuItems.main.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.end);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`relative flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 mb-0.5 sm:mb-1 group ${
                    active
                      ? darkMode
                        ? "text-white"
                        : "text-gray-900"
                      : darkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg sm:rounded-xl`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    size={windowWidth < 640 ? 16 : 18}
                    className={`relative z-10 ${collapsed && isDesktop ? "mx-auto" : ""}`}
                  />

                  {(!collapsed || !isDesktop) && (
                    <span
                      className={`relative z-10 text-[10px] sm:text-xs md:text-sm font-medium truncate ${
                        active && !darkMode ? "text-white" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode on desktop */}
                  {isDesktop && collapsed && hoveredItem === item.path && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap z-50 ${
                        darkMode
                          ? "bg-gray-900 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`p-3 sm:p-4 border-t flex-shrink-0 ${
            darkMode ? "border-gray-700/50" : "border-gray-200"
          }`}
        >
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 group ${
              darkMode
                ? "text-red-400 hover:text-white hover:bg-red-500/20"
                : "text-red-600 hover:text-white hover:bg-red-500 hover:shadow-lg"
            }`}
          >
            <FiLogOut
              size={windowWidth < 640 ? 16 : 18}
              className="group-hover:rotate-12 transition-transform flex-shrink-0"
            />
            {(!collapsed || !isDesktop) && (
              <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate">
                Logout
              </span>
            )}
          </button>

          {/* Version Info */}
          {(!collapsed || !isDesktop) && (
            <p
              className={`text-center text-[8px] sm:text-[10px] mt-3 sm:mt-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              v2.0.0 · Premium Admin
            </p>
          )}
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border z-50 w-72 sm:w-80 md:w-96 mx-4 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Confirm Logout
              </h3>
              <p
                className={`text-xs sm:text-sm mb-4 sm:mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to logout from the admin panel?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
