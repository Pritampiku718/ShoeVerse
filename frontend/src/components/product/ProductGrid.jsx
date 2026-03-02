import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLoader,
  FiPackage,
  FiFilter,
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
  FiSliders,
} from "react-icons/fi";

const ProductGrid = ({
  products = [],
  loading = false,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  viewMode = "grid",
  onViewModeChange,
  itemsPerPage = 12,
  showPagination = true,
  showViewToggle = true,
  emptyStateMessage = "No products found",
  className = "",
  onProductClick,
  onAddToCart,
  onWishlistToggle,
  totalProducts = 0,
  onFilterClick,
}) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [pageInput, setPageInput] = useState(currentPage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Update page input when currentPage changes
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  // Handle page change with smooth scroll
  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage ||
      isTransitioning
    )
      return;

    setIsTransitioning(true);
    onPageChange?.(newPage);

    // Smooth scroll to top of grid
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setPageInput(currentPage);
    }
  };

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = window.innerWidth < 640 ? 1 : 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Loading skeleton with premium design
  if (loading) {
    return (
      <div className={`w-full ${className}`} ref={gridRef}>
        
        {/* Top Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full w-48 animate-pulse"></div>
          {showViewToggle && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-xl">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Grid Skeleton with Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-4 sm:p-5">
                <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full w-1/2 mb-3 animate-pulse"></div>

                {/* Price and Button */}
                <div className="flex items-center justify-between mt-4">
                  <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full w-20 animate-pulse"></div>
                  <div className="w-9 h-9 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl animate-pulse"></div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        {showPagination && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12">
            <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full w-32 animate-pulse"></div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`w-full py-12 sm:py-16 ${className}`} ref={gridRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 dark:from-primary-800/50 dark:to-accent-800/50 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-xl w-full h-full">
              <FiPackage className="text-4xl sm:text-5xl text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
            {emptyStateMessage}
          </h3>

          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6">
            Try adjusting your filters or search term to find what you're
            looking for
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FiLoader className="animate-spin" size={18} />
              <span>Refresh</span>
            </motion.button>

            {onFilterClick && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onFilterClick}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-all flex items-center justify-center gap-2"
              >
                <FiSliders size={18} />
                <span>Adjust Filters</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} ref={gridRef}>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          
          {/* Results Count with Styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-accent/30 rounded-full blur-md"></div>
            <div className="relative bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700">
              <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                Showing{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {products.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {totalProducts || products.length}
                </span>{" "}
                products
              </span>
            </div>
          </div>

          {/* Page Info - Hidden on Mobile */}
          {totalPages > 1 && (
            <div className="hidden sm:block px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                Page{" "}
                <span className="font-bold text-primary-700 dark:text-primary-400">
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          
          {/* Mobile Filter Button */}
          {onFilterClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFilterClick}
              className="sm:hidden relative w-10 h-10 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary-500 transition-colors"
            >
              <FiSliders
                size={18}
                className="text-gray-700 dark:text-gray-300"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </motion.button>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-accent/30 rounded-xl blur-sm"></div>
              <div className="relative flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewModeChange?.("grid")}
                  className={`relative p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Grid View"
                >
                  {viewMode === "grid" && (
                    <motion.div
                      layoutId="viewModeBackground"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <FiGrid size={18} className="relative z-10" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewModeChange?.("list")}
                  className={`relative p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="List View"
                >
                  {viewMode === "list" && (
                    <motion.div
                      layoutId="viewModeBackground"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <FiList size={18} className="relative z-10" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Page Info */}
      {totalPages > 1 && (
        <div className="sm:hidden mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-full inline-block border border-gray-300 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
            Page{" "}
            <span className="font-bold text-primary-700 dark:text-primary-400">
              {currentPage}
            </span>{" "}
            of {totalPages}
          </span>
        </div>
      )}

      {/* Products Grid/List with Animations */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onHoverStart={() => setHoveredProduct(product._id)}
              onHoverEnd={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product._id)}
              className={`cursor-pointer transform-gpu ${
                hoveredProduct === product._id ? "z-10" : ""
              } ${viewMode === "list" ? "w-full" : ""}`}
            >
              <ProductCard
                product={product}
                index={index}
                onAddToCart={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(e, product);
                }}
                onWishlistToggle={(e) => {
                  e.stopPropagation();
                  onWishlistToggle?.(e, product);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 sm:mt-12 space-y-4">
          
          {/* Desktop Pagination */}
          <div className="hidden sm:flex flex-col items-center gap-4">
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              
              {/* First Page */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isTransitioning}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                title="First Page"
              >
                <FiChevronsLeft
                  size={16}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors"
                />
              </motion.button>

              {/* Previous Page */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isTransitioning}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                title="Previous Page"
              >
                <FiChevronLeft
                  size={16}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors"
                />
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2 mx-2">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="w-10 text-center font-bold text-gray-500 dark:text-gray-400"
                    >
                      ⋯
                    </span>
                  ) : (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      disabled={isTransitioning}
                      className={`relative w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                          : "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500 text-gray-800 dark:text-gray-200 hover:text-primary-600"
                      }`}
                    >
                      {currentPage === page && (
                        <motion.div
                          layoutId="activePage"
                          className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <span className="relative z-10">{page}</span>
                    </motion.button>
                  ),
                )}
              </div>

              {/* Next Page */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isTransitioning}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                title="Next Page"
              >
                <FiChevronRight
                  size={16}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors"
                />
              </motion.button>

              {/* Last Page */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isTransitioning}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                title="Last Page"
              >
                <FiChevronsRight
                  size={16}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors"
                />
              </motion.button>
            </div>

            {/* Page Jump Input */}
            <form
              onSubmit={handlePageInputSubmit}
              className="flex items-center gap-3"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Go to page
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-16 px-3 py-2 text-sm text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isTransitioning}
                className="px-4 py-2 text-sm bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-bold"
              >
                Go
              </motion.button>
            </form>
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden space-y-4">
            
            {/* Mobile Page Navigation */}
            <div className="flex items-center justify-between gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isTransitioning}
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiArrowLeft
                  size={16}
                  className="text-gray-700 dark:text-gray-300"
                />
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Previous
                </span>
              </motion.button>

              <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-accent rounded-xl border-2 border-primary-400 dark:border-primary-700">
                <span className="text-sm font-bold text-white">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isTransitioning}
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Next
                </span>
                <FiArrowRight
                  size={16}
                  className="text-gray-700 dark:text-gray-300"
                />
              </motion.button>
            </div>

            {/* Mobile Page Jump */}
            <form
              onSubmit={handlePageInputSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="Page #"
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-medium"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isTransitioning}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-bold disabled:opacity-50"
              >
                Jump
              </motion.button>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl flex items-center gap-4 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent rounded-full blur-md animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-primary-600 to-accent rounded-full flex items-center justify-center">
                  <FiLoader className="animate-spin text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Loading page {currentPage}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Please wait a moment...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
