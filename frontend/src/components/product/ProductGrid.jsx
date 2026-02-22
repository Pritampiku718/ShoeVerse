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
}) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [pageInput, setPageInput] = useState(currentPage);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    const delta = 2;
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

  // Loading skeleton
  if (loading) {
    return (
      <div className={`w-full ${className}`} ref={gridRef}>
        {/* View Toggle Skeleton */}
        {showViewToggle && (
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        {showPagination && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        )}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`w-full py-16 ${className}`} ref={gridRef}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FiPackage className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {emptyStateMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your filters or search term
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} ref={gridRef}>
      {/* Top Bar with View Toggle and Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {products.length}
          </span>{" "}
          products
          {totalPages > 1 && (
            <>
              {" "}
              • Page{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentPage}
              </span>{" "}
              of {totalPages}
            </>
          )}
        </div>

        {showViewToggle && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => onViewModeChange?.("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                title="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => onViewModeChange?.("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                title="List View"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onHoverStart={() => setHoveredProduct(product._id)}
              onHoverEnd={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product._id)}
              className={`cursor-pointer ${viewMode === "list" ? "w-full" : ""}`}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          {/* Mobile Pagination Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
            Page {currentPage} of {totalPages}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* First Page */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isTransitioning}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <FiChevronsLeft size={16} />
            </motion.button>

            {/* Previous Page */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isTransitioning}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <FiChevronLeft size={16} />
            </motion.button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-2">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="w-10 text-center text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    disabled={isTransitioning}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                        : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {page}
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
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <FiChevronRight size={16} />
            </motion.button>

            {/* Last Page */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isTransitioning}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <FiChevronsRight size={16} />
            </motion.button>
          </div>

          {/* Page Jump Input */}
          <form
            onSubmit={handlePageInputSubmit}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
              Go to
            </span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-16 px-2 py-2 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isTransitioning}
              className="px-3 py-2 text-sm bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Loading Overlay for Page Transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl flex items-center gap-3">
              <FiLoader className="animate-spin text-primary-600" size={24} />
              <span className="text-gray-900 dark:text-white font-medium">
                Loading page...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
