import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiSearch,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiBarChart2,
  FiActivity,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart
} from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order received', time: '2 min ago', read: false, type: 'order' },
    { id: 2, text: 'Product stock low: Nike Air Max', time: '1 hour ago', read: false, type: 'alert' },
    { id: 3, text: 'New user registered', time: '3 hours ago', read: true, type: 'user' },
  ]);

  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', end: true, color: 'from-blue-500 to-cyan-500' },
    { path: '/admin/products', icon: FiPackage, label: 'Products', color: 'from-green-500 to-emerald-500' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders', color: 'from-purple-500 to-pink-500' },
    { path: '/admin/users', icon: FiUsers, label: 'Users', color: 'from-orange-500 to-red-500' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics', color: 'from-indigo-500 to-purple-500' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings', color: 'from-gray-500 to-slate-500' },
  ];

  const quickStats = [
    { icon: FiDollarSign, value: '$45.2K', label: 'Revenue', change: '+12.5%', positive: true },
    { icon: FiShoppingCart, value: '234', label: 'Orders', change: '+8.2%', positive: true },
    { icon: FiTrendingUp, value: '3.2%', label: 'Conversion', change: '+2.1%', positive: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return <FiShoppingBag className="text-blue-500" size={14} />;
      case 'alert': return <FiActivity className="text-red-500" size={14} />;
      case 'user': return <FiUsers className="text-green-500" size={14} />;
      default: return <FiBell size={14} />;
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-500 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Area with Gradient */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent/10"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {sidebarCollapsed ? (
            <Link to="/admin" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent relative z-10">
              SV
            </Link>
          ) : (
            <Link to="/admin" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent relative z-10">
              ShoeVerse
            </Link>
          )}
          
          <div className="flex items-center gap-1 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {sidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <FiX size={18} />
            </motion.button>
          </div>
        </div>

        {/* User Profile Card */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-600/5 to-accent/5"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <p className="text-[10px] text-primary-600 dark:text-primary-400 mt-1 font-medium">
                  Administrator
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {sidebarCollapsed && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="py-4 flex justify-center border-b border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
              />
            </div>
          </motion.div>
        )}

        {/* Quick Stats - Only when expanded */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-2 p-3 border-b border-gray-200/50 dark:border-gray-700/50"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <stat.icon className="mx-auto text-primary-600 mb-1" size={16} />
                <p className="text-xs font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-[8px] text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((item, index) => {
            const isActive = item.end 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={`relative flex items-center mx-1 px-3 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-0 bg-gradient-to-r ${item.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <Icon size={20} className={`relative z-10 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className={`relative z-10 text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  
                  {/* Hover Glow Effect */}
                  {!isActive && hoveredItem === item.path && (
                    <motion.div
                      layoutId="hoverGlow"
                      className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  {sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-xl"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <button
            onClick={logout}
            className={`flex items-center w-full px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-red-500/10"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <FiLogOut size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
            
            {sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-xl"
              >
                Logout
              </motion.span>
            )}
          </button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30 shadow-lg"
        >
          <div className="h-full px-6 flex items-center justify-between">
            {/* Left Section - Welcome Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:block"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.name}</span>
              </p>
            </motion.div>

            {/* Right Section */}
            <div className="flex items-center gap-2 ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 mr-2"
              >
                <FiMenu size={20} />
              </motion.button>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  + New Product
                </motion.button>
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group"
              >
                <FiSearch size={18} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Search
                </span>
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: darkMode ? -30 : 30 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group"
              >
                {darkMode ? <FiSun size={18} className="text-gray-600 dark:text-gray-300" /> : <FiMoon size={18} className="text-gray-600 dark:text-gray-300" />}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {darkMode ? 'Light' : 'Dark'} mode
                </span>
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group"
                >
                  <FiBell size={18} className="text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    />
                  )}
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Notifications
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600/10 to-accent/10">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center py-8 text-gray-500">No notifications</p>
                        ) : (
                          notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                              onClick={() => markAsRead(notification.id)}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-300 ${
                                !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white mb-1">{notification.text}</p>
                                  <p className="text-xs text-gray-500">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div className="relative ml-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600/10 to-accent/10">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      {[
                        { to: '/profile', icon: FiUsers, label: 'Profile' },
                        { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
                        >
                          <item.icon size={16} className="group-hover:text-primary-600 transition-colors" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
                      >
                        <FiLogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;