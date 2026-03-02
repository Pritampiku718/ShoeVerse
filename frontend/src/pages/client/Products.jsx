import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
import MobileProductFilters from "../../components/product/MobileProductFilters";
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

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []); 
  
  // Fetch products when filters change
  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0 || searchTerm) {
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

    console.log("Adding product to cart:", {
      id: product._id,
      name: product.name,
      stock: product.stock,
    });

    // In handleAddToCart
    addToCart({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.sellPrice || product.price,
      originalPrice: product.currentPrice || product.originalPrice,
      image: product.image || (product.images && product.images[0]),
      images: product.images,
      totalStock: product.totalStock,
      stock: product.stock,
      quantity: 1,
    });

    toast.success("Added to cart!");
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
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
        <div className="relative h-48 xs:h-56 sm:h-64 md:h-80 bg-gradient-to-r from-primary-600 via-accent to-primary-600 overflow-hidden">
         
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "30px 30px xs:35px 35px sm:40px 40px",
              }}
            />
          </div>

          {/* Floating Shapes - Hidden on mobile */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-48 xs:w-56 sm:w-64 h-48 xs:h-56 sm:h-64 border border-white/20 rounded-full hidden lg:block"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 border border-white/20 rounded-full hidden lg:block"
          />

          {/* Floating Icons - Hidden on mobile */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-20 text-white/10 text-6xl md:text-7xl lg:text-8xl hidden lg:block"
          >
            👟
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-20 text-white/10 text-6xl md:text-7xl lg:text-8xl hidden lg:block"
          >
            👟
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 h-full flex items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 xs:mb-3 sm:mb-4"
              >
                Premium Collection
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl"
              >
                Discover hand-picked sneakers from the world's most exclusive
                brands
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 mt-3 xs:mt-4 sm:mt-5 md:mt-6 text-white/80"
              >
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <FiAward className="text-yellow-400 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] xs:text-xs sm:text-sm text-white/90">
                    100% Authentic
                  </span>
                </div>
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <FiZap className="text-yellow-400 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] xs:text-xs sm:text-sm text-white/90">
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <FiMapPin className="text-yellow-400 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span className="text-[10px] xs:text-xs sm:text-sm text-white/90">
                    Global Delivery
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-5 sm:py-6 md:py-7 lg:py-8">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
              <div className="relative group">
                <FiSearch
                  className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors dark:text-gray-500"
                  size={16}
                  xs:size={18}
                  sm:size={20}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by brand, model, or collection..."
                  className="w-full pl-9 xs:pl-10 sm:pl-12 pr-16 xs:pr-20 sm:pr-24 py-2 xs:py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-14 xs:right-16 sm:right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX size={14} xs:size={16} sm:size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1 xs:right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-primary-600 to-accent text-white text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
              
              {/* Filter Toggle Button Mobile */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiSliders
                  size={14}
                  xs:size={16}
                  sm:size={18}
                  className="text-gray-700 dark:text-gray-300"
                />
                <span className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">
                  Filters
                </span>
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
                  className="appearance-none pl-2 xs:pl-3 sm:pl-4 pr-6 xs:pr-8 sm:pr-10 py-2 xs:py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg xs:rounded-xl text-[10px] xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-gray-900 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
                  size={12}
                  xs:size={14}
                  sm:size={16}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-0.5 xs:gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg xs:rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 xs:p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <FiGrid size={14} xs:size={16} sm:size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 xs:p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <FiList size={14} xs:size={16} sm:size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8">
            
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <ProductFilters
                onFilterChange={handleFilterChange}
                initialFilters={selectedFilters}
              />
            </div>

            {/* Mobile Filters Drawer */}
            <MobileProductFilters
              isOpen={showMobileFilters}
              onClose={() => setShowMobileFilters(false)}
              onFilterChange={handleFilterChange}
              initialFilters={selectedFilters}
            />

            {/* Products Grid */}
            <div ref={gridRef} className="flex-1 w-full">
              
              {/* Results Count */}
              <div className="flex items-center justify-between mb-3 xs:mb-4">
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {products.length}
                  </span>{" "}
                  products
                </p>
                <button
                  onClick={() => fetchProducts(selectedFilters)}
                  className="p-1 xs:p-1.5 sm:p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  title="Refresh"
                >
                  <FiRefreshCw size={12} xs:size={14} sm:size={16} />
                </button>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-lg p-3 xs:p-4 animate-pulse"
                    >
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg xs:rounded-xl mb-2 xs:mb-3 sm:mb-4"></div>
                      <div className="h-2 xs:h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1 xs:mb-2"></div>
                      <div className="h-2 xs:h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-10 xs:py-12 sm:py-16 md:py-20">
                  <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                    <FiShoppingBag className="text-2xl xs:text-3xl sm:text-4xl text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 xs:mb-2">
                    No products found
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 xs:mb-5 sm:mb-6">
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
                    className="px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg xs:rounded-xl text-xs xs:text-sm sm:text-base font-semibold hover:shadow-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6"
                        : "space-y-3 xs:space-y-4"
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
                    <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 mt-6 xs:mt-8 sm:mt-10 md:mt-12">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 xs:p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                      >
                        <FiChevronLeft size={14} xs:size={16} sm:size={18} />
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
                              className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-all ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
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
                            <span
                              key={pageNum}
                              className="text-gray-400 dark:text-gray-500 text-xs xs:text-sm"
                            >
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
                        className="p-1.5 xs:p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                      >
                        <FiChevronRight size={14} xs:size={16} sm:size={18} />
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
            className="fixed bottom-4 xs:bottom-5 sm:bottom-6 md:bottom-7 lg:bottom-8 right-4 xs:right-5 sm:right-6 md:right-7 lg:right-8 z-40 p-2 xs:p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          >
            <FiChevronUp
              size={16}
              xs:size={18}
              sm:size={20}
              md:size={22}
              lg:size={24}
            />
            <span className="absolute right-full mr-2 xs:mr-2.5 sm:mr-3 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-[8px] xs:text-[9px] sm:text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Products;
