import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FiTrendingUp,
  FiAward,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useProductStore } from "../../store/productStore";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const searchRef = useRef(null);
  const wishlistRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { fetchProducts, products, isLoading } = useProductStore();

  const location = useLocation();

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts({ limit: 100 });
  }, [fetchProducts]);

  // Update wishlist products when products or wishlist items change
  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlistItems.length > 0 && products.length > 0) {
        setLoadingWishlist(true);

        // Get product IDs from wishlist items
        const wishlistIds = wishlistItems.map((item) =>
          typeof item === "string" ? item : item._id || item.id,
        );

        // Filter products that match wishlist IDs
        const matchedProducts = products.filter((product) =>
          wishlistIds.includes(product._id),
        );

        console.log("Wishlist products loaded:", matchedProducts);
        setWishlistProducts(matchedProducts);
        setLoadingWishlist(false);
      } else {
        setWishlistProducts([]);
      }
    };

    loadWishlistProducts();
  }, [products, wishlistItems]);

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
    setMobileSearchOpen(false);
    setSearchOpen(false);
    setShowUserMenu(false);
    setShowWishlistPreview(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      
      // Close search when clicking outside
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      
      // Close mobile search when clicking outside
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
      }
      
      // Close wishlist preview when clicking outside
      if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
        setShowWishlistPreview(false);
      }
      
      // Close user menu when clicking outside
      if (
        !e.target.closest(".user-menu-button") &&
        !e.target.closest(".user-menu-dropdown")
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearchLoading(true);
        try {
          
          // Fetch products from API
          const response = await fetch(
            `http://localhost:5000/api/products?search=${searchQuery}&limit=5`,
          );
          const data = await response.json();
          setSearchResults(data.products || []);
        } catch (error) {
          console.error("Search error:", error);
          
          // Fallback to local filtering
          const localResults = products
            .filter(
              (p) =>
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .slice(0, 5);
          setSearchResults(localResults);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery("");
  };

  const handleRemoveFromWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(productId);
    toast.success("Removed from wishlist");

    // Update local state immediately
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { path: "/", label: "Home", icon: FiTrendingUp },
    { path: "/products", label: "Products", icon: FiShoppingCart },
  ];

  // Compact user menu items
  const userMenuItems = [
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiHeart, label: "Wishlist", path: "/wishlist" },
    { icon: FiPackage, label: "Orders", path: "/orders" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
  ];

  // Promo badges for mobile menu
  const promoBadges = [
    { label: "SALE", color: "from-red-500 to-red-600", icon: FiZap },
    { label: "-30%", color: "from-green-500 to-green-600", icon: FiStar },
    {
      label: "PREMIUM",
      color: "from-purple-500 to-purple-600",
      icon: FiAward,
    },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  // Get product image with fallback
  const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/40?text=No+Image";

    const imageUrl =
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      product.imageUrl ||
      "https://via.placeholder.com/40?text=No+Image";

    return imageUrl;
  };

  // Get product price
  const getProductPrice = (product) => {
    return product.sellPrice || product.currentPrice || 0;
  };

  // Determine text color based on scroll state and theme
  const getTextColor = () => {
    if (scrolled) {
      return "text-gray-800 dark:text-gray-200";
    }
    if (darkMode) {
      return "text-gray-100";
    }
    return "text-gray-800";
  };

  const getHoverColor = () => {
    if (scrolled) {
      return "hover:text-primary-600 dark:hover:text-primary-400";
    }
    if (darkMode) {
      return "hover:text-white";
    }
    return "hover:text-primary-600";
  };

  const getBgColor = (isActive = false) => {
    if (isActive) return "bg-gradient-to-r from-primary-600 to-accent";
    if (scrolled) return "bg-white/90 dark:bg-[#0a0a0a]/90";
    return "bg-transparent";
  };

  return (
    <>
      
      {/* Premium Navbar */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg py-1 xs:py-1.5 sm:py-2 lg:py-3 border-b border-gray-200/20 dark:border-gray-700/20"
            : "bg-transparent py-2 xs:py-2.5 sm:py-3 lg:py-4 xl:py-5"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-5 xl:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo - Left side */}
            <Link to="/" className="relative group flex-shrink-0">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black tracking-tight transition-all duration-500 ${getTextColor()}`}
              >
                ShoeVerse
              </motion.span>
            </Link>

            {/* Desktop Navigation - Left side */}
            <div className="hidden lg:flex items-center ml-4 xl:ml-6">
              <div className="flex items-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/30 dark:border-gray-700/30">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) => {
                        let baseClasses =
                          "relative px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl font-medium text-xs xl:text-sm transition-all duration-300 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap";
                        let colorClasses = "";

                        if (isActive) {
                          colorClasses =
                            "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg";
                        } else {
                          colorClasses = `${getTextColor()} ${getHoverColor()}`;
                        }

                        return `${baseClasses} ${colorClasses}`;
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={12}
                            className={isActive ? "text-white" : ""}
                          />
                          <span>{link.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Centered Search Bar - Desktop */}
            <div
              ref={searchRef}
              className="hidden lg:block flex-1 max-w-xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <FiSearch
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-primary-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      placeholder="Search for premium sneakers..."
                      className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800/70 border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary-500/30 focus:border-primary-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <FiXCircle size={18} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-accent text-white text-sm font-medium rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 hover:shadow-lg"
                    >
                      Go
                    </button>
                  </form>

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {searchOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                        className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        <div className="max-h-96 overflow-y-auto">
                          {searchLoading ? (
                            <div className="p-8 text-center">
                              <div className="relative w-12 h-12 mx-auto mb-3">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-full animate-ping opacity-20" />
                                <div className="relative w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Searching our collection...
                              </p>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div>
                              <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                  Products ({searchResults.length})
                                </p>
                              </div>
                              <div className="p-2">
                                {searchResults.map((product, index) => {
                                  const imageUrl =
                                    product.images?.[0]?.url ||
                                    product.image ||
                                    "https://via.placeholder.com/40";
                                  return (
                                    <motion.button
                                      key={product._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() =>
                                        handleProductClick(product._id)
                                      }
                                      className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/30 dark:hover:to-accent-900/30 rounded-xl transition-all group"
                                    >
                                      <div className="relative">
                                        <img
                                          src={imageUrl}
                                          alt={product.name}
                                          className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary-500 transition-all"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                              "https://via.placeholder.com/40?text=No+Image";
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-accent/0 group-hover:from-primary-600/10 group-hover:to-accent/10 rounded-lg transition-all" />
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
                                          {product.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                            $
                                            {product.sellPrice ||
                                              product.currentPrice}
                                          </span>
                                          <span className="text-xs text-gray-400 dark:text-gray-500">
                                            •
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {product.brand || "Premium"}
                                          </span>
                                        </div>
                                      </div>
                                      <FiChevronRight
                                        className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 transition-colors"
                                        size={18}
                                      />
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : searchQuery.length > 1 ? (
                            <div className="p-8 text-center">
                              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                                <FiSearch className="text-3xl text-gray-500 dark:text-gray-400" />
                              </div>
                              <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                No results found
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                We couldn't find any products matching "
                                {searchQuery}"
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {["Nike", "Adidas", "Jordan"].map((term) => (
                                  <button
                                    key={term}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors border border-gray-200 dark:border-gray-600"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-6">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                                Popular Searches
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  "Nike Air Max",
                                  "Adidas Ultraboost",
                                  "Jordan 1",
                                  "Running Shoes",
                                  "Casual Sneakers",
                                  "Limited Edition",
                                ].map((term) => (
                                  <button
                                    key={term}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:from-primary-100 hover:to-accent-100 dark:hover:from-primary-900/40 dark:hover:to-accent-900/40 hover:text-primary-600 transition-all border border-gray-200 dark:border-gray-600"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Icons - Theme, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileSearchOpen(true)}
                className={`lg:hidden p-1 xs:p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    : darkMode
                      ? "hover:bg-white/10 text-gray-100"
                      : "hover:bg-gray-200 text-gray-800"
                }`}
                aria-label="Search"
              >
                <FiSearch size={16} xs:size={17} sm:size={18} lg:size={20} />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: darkMode ? -30 : 30 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-1 xs:p-1.5 sm:p-2 lg:p-2.5 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    : darkMode
                      ? "hover:bg-white/10 text-gray-100"
                      : "hover:bg-gray-200 text-gray-800"
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <FiSun size={14} xs:size={15} sm:size={16} lg:size={18} />
                ) : (
                  <FiMoon size={14} xs:size={15} sm:size={16} lg:size={18} />
                )}
              </motion.button>

              {/* Wishlist */}
              <div ref={wishlistRef} className="relative hidden xs:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWishlistPreview(!showWishlistPreview)}
                  className={`relative p-1 xs:p-1.5 sm:p-2 lg:p-2.5 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : darkMode
                        ? "hover:bg-white/10 text-gray-100"
                        : "hover:bg-gray-200 text-gray-800"
                  }`}
                  aria-label="Wishlist"
                >
                  <FiHeart size={14} xs:size={15} sm:size={16} lg:size={18} />
                  {wishlistProducts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 animate-pulse">
                      {wishlistProducts.length}
                    </span>
                  )}
                </motion.button>

                {/* Wishlist Preview Dropdown */}
                <AnimatePresence>
                  {showWishlistPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="absolute right-0 mt-2 w-64 xs:w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-xl xs:rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-2 xs:p-2.5 sm:p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                            Your Wishlist
                          </h3>
                          <Link
                            to="/wishlist"
                            onClick={() => setShowWishlistPreview(false)}
                            className="text-[10px] xs:text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            View All
                          </Link>
                        </div>
                      </div>

                      <div className="max-h-60 xs:max-h-80 overflow-y-auto">
                        {loadingWishlist ? (
                          <div className="p-4 text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Loading...
                            </p>
                          </div>
                        ) : wishlistProducts.length === 0 ? (
                          <div className="p-4 text-center">
                            <FiHeart className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Your wishlist is empty
                            </p>
                            <Link
                              to="/products"
                              onClick={() => setShowWishlistPreview(false)}
                              className="inline-block mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                            >
                              Browse Products
                            </Link>
                          </div>
                        ) : (
                          <div className="p-1">
                            {wishlistProducts.slice(0, 5).map((product) => {
                              const imageUrl = getProductImage(product);
                              const price = getProductPrice(product);

                              return (
                                <div
                                  key={product._id}
                                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
                                >
                                  <Link
                                    to={`/product/${product._id}`}
                                    onClick={() =>
                                      setShowWishlistPreview(false)
                                    }
                                    className="flex-1 flex items-center gap-2 min-w-0"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={product.name}
                                      className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://via.placeholder.com/40?text=No+Image";
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] xs:text-xs font-medium text-gray-900 dark:text-white truncate">
                                        {product.name}
                                      </p>
                                      <p className="text-[8px] xs:text-[10px] text-gray-500 dark:text-gray-400">
                                        ${price}
                                      </p>
                                    </div>
                                  </Link>
                                  <button
                                    onClick={(e) =>
                                      handleRemoveFromWishlist(e, product._id)
                                    }
                                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                  >
                                    <FiXCircle size={14} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {wishlistProducts.length > 0 && (
                        <div className="p-2 xs:p-2.5 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to="/wishlist"
                            onClick={() => setShowWishlistPreview(false)}
                            className="flex items-center justify-between text-[10px] xs:text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                          >
                            <span>View All Items</span>
                            <span className="bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full text-primary-700 dark:text-primary-300">
                              {wishlistProducts.length}
                            </span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1 xs:p-1.5 sm:p-2 lg:p-2.5 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : darkMode
                        ? "hover:bg-white/10 text-gray-100"
                        : "hover:bg-gray-200 text-gray-800"
                  }`}
                  aria-label="Cart"
                >
                  <FiShoppingCart
                    size={14}
                    xs:size={15}
                    sm:size={16}
                    lg:size={18}
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 bg-primary-600 text-white text-[6px] xs:text-[7px] sm:text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      {cartItems.length}
                    </span>
                  )}
                </motion.button>
              </Link>

              {/* Auth Buttons / User Menu */}
              {!user ? (
                <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 ml-0.5 xs:ml-1 sm:ml-1.5">
                  <Link
                    to="/login"
                    className={`px-1.5 xs:px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1 xs:py-1.5 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg xs:rounded-xl transition-all duration-300 whitespace-nowrap ${
                      scrolled
                        ? "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        : darkMode
                          ? "text-gray-200/90 hover:text-white"
                          : "text-gray-800 hover:text-primary-600"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-1.5 xs:px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1 xs:py-1.5 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg xs:rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative ml-0.5 xs:ml-1 sm:ml-1.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-menu-button flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 p-0.5 xs:p-1 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg xs:rounded-xl bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-semibold text-[10px] xs:text-xs sm:text-sm shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 xs:w-1.8 xs:h-1.8 sm:w-2 sm:h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <FiChevronDown
                      className={`text-[10px] xs:text-xs sm:text-sm transition-transform duration-300 ${
                        showUserMenu ? "rotate-180" : ""
                      } ${getTextColor()}`}
                      size={12}
                    />
                  </motion.button>

                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                        className="user-menu-dropdown absolute right-0 mt-2 w-40 xs:w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* User Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-accent p-2 xs:p-2.5 text-white">
                          <div className="flex items-center gap-1.5 xs:gap-2">
                            <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] xs:text-xs font-bold border border-white/50">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-[10px] xs:text-xs truncate">
                                {user?.name}
                              </h3>
                              <p className="text-white/70 text-[8px] xs:text-[9px] truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-0.5 xs:p-1">
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-2.5 py-1.5 xs:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-[10px] xs:text-xs"
                              >
                                <Icon size={12} className="flex-shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Logout Button */}
                        <div className="p-0.5 xs:p-1 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 xs:gap-2 w-full px-2 xs:px-2.5 py-1.5 xs:py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-[10px] xs:text-xs"
                          >
                            <FiLogOut size={12} className="flex-shrink-0" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`lg:hidden p-1 xs:p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${
                  scrolled
                    ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    : darkMode
                      ? "hover:bg-white/10 text-gray-100"
                      : "hover:bg-gray-200 text-gray-800"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <FiX size={16} xs:size={17} sm:size={18} lg:size={20} />
                ) : (
                  <FiMenu size={16} xs:size={17} sm:size={18} lg:size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              ref={mobileSearchRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50"
            >
              <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 py-3 xs:py-4">
                
                {/* Search Header with Close Button */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">
                    Search Products
                  </h3>
                  <button
                    onClick={() => setMobileSearchOpen(false)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="mb-4">
                  <div className="relative">
                    <FiSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                      autoFocus
                    />
                  </div>
                </form>

                {/* Search Results or Popular Searches */}
                {searchLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Searching...
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <p className="text-[10px] xs:text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Products ({searchResults.length})
                    </p>
                    {searchResults.map((product) => {
                      const imageUrl =
                        product.images?.[0]?.url ||
                        product.image ||
                        "https://via.placeholder.com/40";
                      return (
                        <button
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/40?text=No+Image";
                            }}
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {product.brand} • $
                              {product.sellPrice || product.currentPrice}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div className="py-8 text-center">
                    <FiSearch className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No products found
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] xs:text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Nike Air Max",
                        "Adidas Ultraboost",
                        "Jordan 1",
                        "Running Shoes",
                        "Casual Sneakers",
                        "Limited Edition",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3 py-1.5 text-[10px] xs:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors border border-gray-200 dark:border-gray-600"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 space-y-1.5 xs:space-y-2">
                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-1 xs:gap-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                          flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 px-1.5 xs:px-2 rounded-lg transition-all text-[10px] xs:text-xs font-medium
                          ${
                            isActive
                              ? "bg-gradient-to-r from-primary-600 to-accent text-white"
                              : "bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }
                        `}
                      >
                        <Icon size={12} />
                        <span>{link.label}</span>
                      </NavLink>
                    );
                  })}
                </div>

                {/* Promo Badges */}
                <div className="flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 border-t border-gray-200 dark:border-gray-700">
                  {promoBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <span
                        key={badge.label}
                        className={`inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 py-0.5 xs:py-1 bg-gradient-to-r ${badge.color} text-white text-[8px] xs:text-[9px] font-bold rounded-full`}
                      >
                        <Icon size={8} xs:size={9} sm:size={10} />
                        {badge.label}
                      </span>
                    );
                  })}
                </div>

                {/* Wishlist & Cart for Mobile */}
                <div className="flex items-center gap-1.5 xs:gap-2 py-1 xs:py-1.5 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 bg-gray-100 dark:bg-gray-700/70 rounded-lg text-gray-700 dark:text-gray-300 text-[10px] xs:text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiHeart size={12} />
                    Wishlist ({wishlistProducts.length})
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 bg-gray-100 dark:bg-gray-700/70 rounded-lg text-gray-700 dark:text-gray-300 text-[10px] xs:text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiShoppingCart size={12} />
                    Cart ({cartItems.length})
                  </Link>
                </div>

                {/* Mobile Auth */}
                {!user ? (
                  <div className="flex gap-1.5 xs:gap-2 pt-1 xs:pt-1.5 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-1.5 xs:py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-[10px] xs:text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-1.5 xs:py-2 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg text-[10px] xs:text-xs font-medium hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="pt-1 xs:pt-1.5 border-t border-gray-200 dark:border-gray-700">
                    {/* User Info */}
                    <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 p-1.5 xs:p-2 bg-gray-100 dark:bg-gray-700/70 rounded-lg">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-primary-600 to-accent flex items-center justify-center text-white font-bold text-[10px] xs:text-xs sm:text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] xs:text-xs font-medium text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-[8px] xs:text-[9px] text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-2 gap-1 xs:gap-1.5 mb-1.5 xs:mb-2">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 px-1.5 xs:px-2 bg-gray-100 dark:bg-gray-700/70 rounded-lg text-gray-700 dark:text-gray-300 text-[8px] xs:text-[9px] sm:text-[10px] font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <Icon size={10} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-1 xs:gap-1.5 py-1.5 xs:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] xs:text-xs font-medium transition-colors"
                    >
                      <FiLogOut size={12} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/*Exact navbar height */}
      <div className="h-12 xs:h-14 sm:h-16 lg:h-20 xl:h-24" />
    </>
  );
};

export default Navbar;
