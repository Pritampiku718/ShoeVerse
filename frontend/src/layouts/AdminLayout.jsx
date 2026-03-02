import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../pages/admin/Sidebar";
import TopBar from "../pages/admin/TopBar";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  const { user } = useAuthStore();
  const { darkMode } = useThemeStore();
  const location = useLocation();

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Track window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileSidebarOpen]);

  // Handle route changes
  useEffect(() => {
    if (windowWidth >= 1024) {
    } else {
      setMobileSidebarOpen(false);
    }
  }, [location, windowWidth]);

  const toggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Calculate margin based on screen size and sidebar state
  const getMarginLeft = () => {
    if (windowWidth < 1024) {
      return "ml-0";
    } else {
      return sidebarCollapsed ? "ml-20" : "ml-72";
    }
  };

  // Calculate content width based on sidebar state
  const getContentWidth = () => {
    if (windowWidth < 1024) {
      return "w-full";
    } else {
      return sidebarCollapsed ? "w-[calc(100%-80px)]" : "w-[calc(100%-288px)]";
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex overflow-x-hidden w-full relative">
      
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Subtle Grid Pattern - Enhanced */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${darkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient Orbs */}
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-400/5 to-pink-400/5 dark:from-amber-500/10 dark:to-pink-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-emerald-400/3 to-cyan-400/3 dark:from-emerald-500/8 dark:to-cyan-500/8 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${getMarginLeft()} ${getContentWidth()} ${
          mobileSidebarOpen && windowWidth < 1024
            ? "overflow-hidden h-screen"
            : ""
        } relative z-10`}
      >
        {/* Top Bar */}
        <TopBar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={mobileSidebarOpen}
        />

        {/* Page Content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-3 sm:py-4 md:py-5 lg:py-6 overflow-x-auto relative"
        >
          {/* Content Card */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8">
            <div className="w-full max-w-full mx-auto">
              <Outlet />
            </div>
          </div>
        </motion.main>
      </div>

      {/* Mobile floating close button */}
      {windowWidth < 1024 && mobileSidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed bottom-4 right-4 z-50 lg:hidden bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default AdminLayout;