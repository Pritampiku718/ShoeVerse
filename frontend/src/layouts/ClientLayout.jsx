import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { 
  FiUser, 
  FiPackage, 
  FiLogOut, 
  FiSettings,
  FiHeart,
  FiShoppingBag,
  FiChevronRight,
  FiMoon,
  FiSun
} from 'react-icons/fi';

const ClientLayout = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowUserMenu(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const userMenuItems = [
    { 
      icon: FiUser, 
      label: 'My Profile', 
      path: '/profile',
      description: 'Manage your account'
    },
    { 
      icon: FiPackage, 
      label: 'My Orders', 
      path: '/orders',
      description: 'Track your orders'
    },
    { 
      icon: FiHeart, 
      label: 'Wishlist', 
      path: '/wishlist',
      description: 'Saved items'
    },
    { 
      icon: FiSettings, 
      label: 'Settings', 
      path: '/settings',
      description: 'Preferences'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
          color: 'rgba(0,0,0,0.1)'
        }} />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Navbar */}
      <Navbar />

      {/* User Menu Overlay */}
      <AnimatePresence>
        {showUserMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowUserMenu(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-20 right-6 z-50 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* User Header */}
              <div className="bg-gradient-to-r from-primary-600 to-accent p-5 text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-white/80 text-sm">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {user?.isAdmin ? 'Admin' : 'Member'}
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        Joined {new Date(user?.createdAt || Date.now()).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">12</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">5</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wishlist</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">3</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reviews</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {userMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                          isActive 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-primary-100 dark:bg-primary-900/30' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                              isActive 
                                ? 'text-primary-600 dark:text-primary-400' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className={`text-gray-400 group-hover:translate-x-1 transition-transform ${
                          isActive ? 'text-primary-600' : ''
                        }`} size={16} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Theme Toggle & Logout */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group mb-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {darkMode ? <FiSun size={18} className="text-yellow-500" /> : <FiMoon size={18} className="text-blue-500" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Switch theme
                      </p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <motion.div
                      animate={{ x: darkMode ? 20 : 2 }}
                      className="w-4 h-4 bg-white rounded-full shadow-md mt-0.5"
                    />
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all duration-300 group"
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FiLogOut size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Logout</p>
                    <p className="text-xs text-red-500/70">End your session</p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FiChevronRight size={16} />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 min-h-screen pt-20"
      >
        <Outlet />
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* User Menu Button (Floating) - Only visible when logged in */}
      {user && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-primary-600 to-accent text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group lg:hidden"
        >
          <FiUser size={24} />
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Your Account
          </span>
        </motion.button>
      )}

      {/* Quick Actions for Mobile */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 lg:hidden">
          <Link to="/cart">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <FiShoppingBag size={20} />
            </motion.button>
          </Link>
          <Link to="/wishlist">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <FiHeart size={20} />
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientLayout;