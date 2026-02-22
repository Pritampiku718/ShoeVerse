import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiSliders,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiDollarSign,
  FiShoppingBag,
  FiHeart,
  FiEye,
  FiRefreshCw,
  FiMapPin,
  FiAward,
  FiZap,
  FiCheck,
  FiFilter,
  FiPackage,
  FiTruck,
  FiShield,
  FiGift,
  FiPercent,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

// Components
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
import Loader from "../../components/common/Loader";

const Shop = () => {
  const navigate = useNavigate();
  const {
    products,
    fetchProducts,
    isLoading,
    totalPages,
    currentPage,
    setPage,
  } = useProductStore();

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    priceMin: 0,
    priceMax: 500,
    rating: 0,
    sortBy: "newest",
    inStock: false,
    onSale: false,
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filterRef = useRef(null);
  const searchInputRef = useRef(null);
  const quickViewRef = useRef(null);
  const gridRef = useRef(null);

  // Categories for quick filter
  const categories = [
    { id: "all", name: "All Products", icon: "👟" },
    { id: "running", name: "Running", icon: "🏃" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "lifestyle", name: "Lifestyle", icon: "👞" },
    { id: "training", name: "Training", icon: "🏋️" },
    { id: "skate", name: "Skate", icon: "🛹" },
    { id: "classics", name: "Classics", icon: "⭐" },
  ];

  // Hero slides
  const heroSlides = [
    {
      id: 1,
      title: "Summer Collection",
      subtitle: "Fresh Kicks for Warm Days",
      image:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: 2,
      title: "Limited Edition",
      subtitle: "Exclusive Drops",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: 3,
      title: "Performance Gear",
      subtitle: "Train Like a Pro",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      color: "from-green-600 to-emerald-500",
    },
  ];

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts({
      ...selectedFilters,
      keyword: searchTerm,
      page: currentPage,
    });
  }, [selectedFilters, searchTerm, currentPage]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close quick view on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && quickViewProduct) {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [quickViewProduct]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    setPage(1);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      setSelectedFilters((prev) => ({ ...prev, categories: [] }));
    } else {
      setSelectedFilters((prev) => ({ ...prev, categories: [categoryId] }));
    }
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setActiveImageIndex(0);
    setSelectedColor("");
    setSelectedSize("");
  };

  const handleAddToCart = (product) => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
    });
    setQuickViewProduct(null);
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First", icon: FiClock },
    { value: "popular", label: "Most Popular", icon: FiTrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: FiDollarSign },
    { value: "price-high", label: "Price: High to Low", icon: FiDollarSign },
    { value: "rating", label: "Top Rated", icon: FiStar },
  ];

  // Quick stats
  const stats = [
    { icon: FiPackage, label: "Products", value: "1000+" },
    { icon: FiTruck, label: "Free Shipping", value: "$100+" },
    { icon: FiShield, label: "Authentic", value: "100%" },
    { icon: FiGift, label: "Gift Cards", value: "Available" },
  ];

  return (
    <>
      <Helmet>
        <title>Shop Premium Sneakers - ShoeVerse</title>
        <meta
          name="description"
          content="Browse our exclusive collection of premium sneakers from top brands. Find your perfect pair with advanced filtering and sorting."
        />
        <meta
          name="keywords"
          content="sneakers, nike, adidas, jordan, new balance, puma, reebok, shop"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Carousel */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
              <img
                src={heroSlides[currentHeroSlide].image}
                alt={heroSlides[currentHeroSlide].title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl"
                  >
                    <span
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${heroSlides[currentHeroSlide].color} text-white text-sm font-bold rounded-full mb-4`}
                    >
                      {heroSlides[currentHeroSlide].subtitle}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                      {heroSlides[currentHeroSlide].title}
                    </h1>
                    <p className="text-xl text-white/80 mb-6">
                      Discover the latest drops and exclusive releases from top
                      brands
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                      Shop Now
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentHeroSlide
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Stats Bar */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 justify-center md:justify-start"
                  >
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon
                        className="text-primary-600 dark:text-primary-400"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative group">
                <FiSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors"
                  size={20}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by brand, model, or collection..."
                  className="w-full pl-12 pr-24 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3">
              {/* Filter Toggle Button (Mobile) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiSliders size={18} />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>

              {/* Filter Toggle Button (Desktop) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiSliders size={18} />
                <span className="text-sm font-medium">Filters</span>
                {showFilters ? (
                  <FiChevronUp size={16} />
                ) : (
                  <FiChevronDown size={16} />
                )}
              </motion.button>

              {/* Quick Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedFilters.sortBy}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      sortBy: e.target.value,
                    })
                  }
                  className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-gray-900 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden lg:block w-80 flex-shrink-0"
                >
                  <div className="sticky top-24">
                    <ProductFilters
                      onFilterChange={handleFilterChange}
                      initialFilters={selectedFilters}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 30 }}
                    className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 overflow-y-auto lg:hidden"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiFilter className="text-primary-600" />
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    <div className="p-4">
                      <ProductFilters
                        onFilterChange={handleFilterChange}
                        initialFilters={selectedFilters}
                        isMobile={true}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div ref={gridRef} className="flex-1">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {products.length}
                  </span>{" "}
                  products
                </p>
                <button
                  onClick={() => fetchProducts(selectedFilters)}
                  className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                  title="Refresh"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 animate-pulse"
                    >
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingBag className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFilters({
                        categories: [],
                        brands: [],
                        sizes: [],
                        priceMin: 0,
                        priceMax: 500,
                        rating: 0,
                        sortBy: "newest",
                        inStock: false,
                        onSale: false,
                      });
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onHoverStart={() => setHoveredProduct(product._id)}
                        onHoverEnd={() => setHoveredProduct(null)}
                        className="relative"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <ProductCard
                          product={product}
                          index={index}
                          onAddToCart={(e) => {
                            e.stopPropagation();
                            addToCart({ ...product, quantity: 1 });
                            toast.success("Added to cart!");
                          }}
                          onWishlistToggle={(e) => {
                            e.stopPropagation();
                            handleWishlistToggle(product);
                          }}
                        />

                        {/* Quick Actions Overlay */}
                        <AnimatePresence>
                          {hoveredProduct === product._id && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="absolute top-4 right-4 flex flex-col gap-2 z-20"
                            >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickView(product);
                                }}
                                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                                title="Quick View"
                              >
                                <FiEye size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWishlistToggle(product);
                                }}
                                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                                title="Add to Wishlist"
                              >
                                <FiHeart
                                  size={18}
                                  className={
                                    isInWishlist(product._id)
                                      ? "fill-current text-pink-600"
                                      : ""
                                  }
                                />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiChevronLeft size={18} />
                      </motion.button>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setPage(pageNum)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        } else if (
                          (pageNum === currentPage - 2 && currentPage > 3) ||
                          (pageNum === currentPage + 2 &&
                            currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={pageNum} className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiChevronRight size={18} />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              ref={quickViewRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick View
                </h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={
                          quickViewProduct.images?.[activeImageIndex]?.url ||
                          quickViewProduct.image
                        }
                        alt={quickViewProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnails */}
                    {quickViewProduct.images &&
                      quickViewProduct.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {quickViewProduct.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                activeImageIndex === i
                                  ? "border-primary-600 scale-95 shadow-lg"
                                  : "border-transparent hover:border-primary-300"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2">
                        {quickViewProduct.brand}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {quickViewProduct.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-lg ${
                                i < Math.floor(quickViewProduct.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({quickViewProduct.reviews || 0} reviews)
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {quickViewProduct.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${quickViewProduct.price}
                      </span>
                      {quickViewProduct.originalPrice && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ${quickViewProduct.originalPrice}
                          </span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold rounded-full">
                            Save $
                            {quickViewProduct.originalPrice -
                              quickViewProduct.price}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Size Selection */}
                    {quickViewProduct.sizes &&
                      quickViewProduct.sizes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Size:{" "}
                            <span className="text-primary-600">
                              {selectedSize || "Select"}
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {quickViewProduct.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[60px] px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                                  selectedSize === size
                                    ? "border-primary-600 bg-primary-600 text-white shadow-lg"
                                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:text-primary-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Color Selection */}
                    {quickViewProduct.colors &&
                      quickViewProduct.colors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Color:{" "}
                            <span className="text-primary-600">
                              {selectedColor || "Select"}
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {quickViewProduct.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                                  selectedColor === color
                                    ? "border-primary-600 scale-110 shadow-lg"
                                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
                                }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                              >
                                {selectedColor === color && (
                                  <FiCheck
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
                                    size={16}
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${quickViewProduct.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                      />
                      <span
                        className={`text-sm font-medium ${quickViewProduct.stock > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {quickViewProduct.stock > 0
                          ? `${quickViewProduct.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleAddToCart(quickViewProduct)}
                        disabled={quickViewProduct.stock === 0}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-accent text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleWishlistToggle(quickViewProduct)}
                        className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiHeart
                          size={20}
                          className={
                            isInWishlist(quickViewProduct._id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          >
            <FiChevronUp size={24} />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;
