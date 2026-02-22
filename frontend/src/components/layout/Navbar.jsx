import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiSearch,
  FiHeart,
  FiChevronDown,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { darkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setShowUserMenu(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".user-menu-button") &&
        !e.target.closest(".user-menu-dropdown")
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
  ];

  // Promo badges for mobile menu
  const promoBadges = [
    { label: "HOT", color: "from-red-500 to-red-600", icon: FiZap },
    { label: "-30%", color: "from-green-500 to-green-600", icon: FiStar },
    {
      label: "EXCLUSIVE",
      color: "from-purple-500 to-purple-600",
      icon: FiStar,
    },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative group">
              <span
                className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                  scrolled
                    ? "text-gray-900 dark:text-white"
                    : darkMode
                      ? "text-white"
                      : "text-gray-900"
                }`}
              >
                ShoeVerse
              </span>
            </Link>

            {/* Desktop Navigation - LEFT SIDE (right after logo) */}
            <div className="hidden lg:flex items-center space-x-1 ml-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => {
                    let textColor = "";
                    if (scrolled) {
                      textColor = isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400";
                    } else {
                      // When not scrolled (on hero section)
                      if (darkMode) {
                        // Dark mode - text should be light
                        textColor = isActive
                          ? "text-white font-semibold"
                          : "text-gray-300 hover:text-white";
                      } else {
                        // Light mode - text should be dark for visibility
                        textColor = isActive
                          ? "text-gray-900 font-semibold"
                          : "text-gray-800 hover:text-gray-900";
                      }
                    }
                    return `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor}`;
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Spacer to push everything else to the right */}
            <div className="flex-1" />

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-xl transition-colors relative group ${
                  scrolled
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                    : darkMode
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <FiSearch size={20} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Search
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-colors relative group ${
                  scrolled
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                    : darkMode
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <button
                  className={`p-2 rounded-xl transition-colors ${
                    scrolled
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                      : darkMode
                        ? "hover:bg-white/10 text-white"
                        : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <FiHeart size={20} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Wishlist
                </span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <button
                  className={`p-2 rounded-xl transition-colors ${
                    scrolled
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                      : darkMode
                        ? "hover:bg-white/10 text-white"
                        : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <FiShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Cart
                </span>
              </Link>

              {/* Auth Buttons / User Menu */}
              {!user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      scrolled
                        ? "text-gray-700 dark:text-gray-200 hover:text-primary-600"
                        : darkMode
                          ? "text-white/80 hover:text-white"
                          : "text-gray-800 hover:text-primary-600"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      scrolled
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : darkMode
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-menu-button flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-semibold shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                      />
                    </div>
                    <span
                      className={`text-sm font-medium hidden md:block ${
                        scrolled
                          ? "text-gray-700 dark:text-gray-200"
                          : darkMode
                            ? "text-white"
                            : "text-gray-800"
                      }`}
                    >
                      {user?.name?.split(" ")[0]}
                    </span>
                    <FiChevronDown
                      className={`text-sm transition-transform duration-300 ${
                        showUserMenu ? "rotate-180" : ""
                      } ${
                        scrolled
                          ? "text-gray-700 dark:text-gray-200"
                          : darkMode
                            ? "text-white"
                            : "text-gray-800"
                      }`}
                      size={16}
                    />
                  </button>

                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="user-menu-dropdown absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600/10 to-accent/10">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                          {user?.isAdmin && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <FiUser size={16} />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <FiShoppingCart size={16} />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <FiHeart size={16} />
                            <span>Wishlist</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <FiUser size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  scrolled
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                    : darkMode
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 mt-2 mx-auto max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              <div className="p-4">
                <div className="relative">
                  <FiSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search for sneakers, brands, collections..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Popular: Nike Air Max, Adidas Ultraboost, Jordan Retro
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden shadow-2xl"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      block py-2 px-4 rounded-xl transition-all
                      ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile Promo Badges */}
                <div className="flex items-center gap-2 px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {promoBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <span
                        key={badge.label}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${badge.color} text-white text-xs font-bold rounded-full`}
                      >
                        <Icon size={12} />
                        {badge.label}
                      </span>
                    );
                  })}
                </div>

                {/* Mobile Auth */}
                {!user ? (
                  <div className="flex gap-2 px-4 pt-4">
                    <Link
                      to="/login"
                      className="flex-1 text-center py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center py-2 bg-primary-600 text-white rounded-xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 pt-4 space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                      <FiUser size={18} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                      <FiShoppingCart size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                      <FiHeart size={18} />
                      <span>Wishlist</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
                      <FiUser size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
