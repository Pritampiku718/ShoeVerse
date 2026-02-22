import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
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
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const Products = () => {
  const navigate = useNavigate();
  const {
    products,
    fetchProducts,
    isLoading,
    totalPages,
    currentPage,
    setPage,
  } = useProductStore();

  // Add console logs to debug
  console.log("Products:", products);
  console.log("Count:", products?.length);

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
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const filterRef = useRef(null);
  const searchInputRef = useRef(null);
  const gridRef = useRef(null);

  // ✅ FIXED: Fetch products on component mount
  useEffect(() => {
    console.log("🟢 Component mounted, fetching products...");
    fetchProducts();
  }, []); // Empty array means this runs once when component loads

  // Fetch products when filters change
  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0 || searchTerm) {
      console.log("🟡 Filters changed, fetching with filters...");
      fetchProducts({
        ...selectedFilters,
        keyword: searchTerm,
        page: currentPage,
      });
    }
  }, [selectedFilters, searchTerm, currentPage]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation to product details
    addToCart({
      ...product,
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation(); // Prevent navigation to product details
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

  // Sort options for the quick filter bar
  const sortOptions = [
    { value: "newest", label: "Newest", icon: FiClock },
    { value: "popular", label: "Popular", icon: FiTrendingUp },
    { value: "price-low", label: "Price: Low", icon: FiDollarSign },
    { value: "price-high", label: "Price: High", icon: FiDollarSign },
    { value: "rating", label: "Rating", icon: FiStar },
  ];

  return (
    <>
      <Helmet>
        <title>Premium Sneakers Collection - ShoeVerse</title>
        <meta
          name="description"
          content="Browse our exclusive collection of premium sneakers from top brands. Find your perfect pair with advanced filtering and sorting."
        />
        <meta
          name="keywords"
          content="sneakers, nike, adidas, jordan, new balance, puma, reebok"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary-600 via-accent to-primary-600 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Floating Shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 border border-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-96 h-96 border border-white/20 rounded-full"
          />

          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-20 text-white/10 text-8xl hidden lg:block"
          >
            👟
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-20 text-white/10 text-8xl hidden lg:block"
          >
            👟
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold text-white mb-4"
              >
                Premium Collection
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/90 text-xl max-w-2xl"
              >
                Discover hand-picked sneakers from the world's most exclusive
                brands
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-6 mt-6 text-white/80"
              >
                <div className="flex items-center gap-2">
                  <FiAward className="text-yellow-400" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiZap className="text-yellow-400" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-yellow-400" />
                  <span>Global Delivery</span>
                </div>
              </motion.div>
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

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <ProductFilters
                onFilterChange={handleFilterChange}
                initialFilters={selectedFilters}
              />
            </div>

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
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className="cursor-pointer"
                      >
                        <ProductCard
                          product={product}
                          index={index}
                          onAddToCart={(e) => handleAddToCart(e, product)}
                          onWishlistToggle={(e) =>
                            handleWishlistToggle(e, product)
                          }
                        />
                      </div>
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

export default Products;
