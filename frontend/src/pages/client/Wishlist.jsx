import { useWishlistStore } from "../../store/wishlistStore";
import { useProductStore } from "../../store/productStore";
import { Helmet } from "react-helmet-async";
import {
  FiHeart,
  FiShoppingBag,
  FiShare2,
  FiTrash2,
  FiGrid,
  FiList,
  FiChevronDown,
  FiGift,
  FiAward,
  FiClock,
  FiTag,
  FiArrowRight,
  FiLoader,
  FiImage,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductStore();

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItems, setSelectedItems] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [stats, setStats] = useState({
    totalValue: 0,
    averagePrice: 0,
    brandCount: 0,
    highestPrice: 0,
  });

  // Fetch all products when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        await fetchProducts({ limit: 100 });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts]);

  // Filter products that are in wishlist
  useEffect(() => {
    if (products.length > 0 && items.length > 0) {
      const wishlistIds = items.map((item) =>
        typeof item === "string" ? item : item._id || item.id,
      );

      const matchedProducts = products.filter((product) =>
        wishlistIds.includes(product._id),
      );

      console.log("✅ Matched Products:", matchedProducts);
      setWishlistProducts(matchedProducts);
    } else {
      setWishlistProducts([]);
    }
  }, [products, items]);

  // Get product price from sellPrice
  const getProductPrice = (product) => {
    if (!product) return 0;
    const price = product.sellPrice || product.currentPrice || 0;
    return price;
  };

  // Get product image with proper URL handling
  const getProductImage = (product) => {
    if (!product) return null;

    // Check if this image has previously errored
    if (imageErrors[product._id]) {
      return null;
    }

    // Get the first image from the array
    const imageUrl = product.images?.[0];

    if (!imageUrl) {
      return null;
    }

    return imageUrl;
  };

  // Handle image error
  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
    console.log(`🖼️ Image failed to load for product: ${productId}`);
  };

  // Calculate wishlist statistics
  useEffect(() => {
    if (wishlistProducts.length > 0) {
      const total = wishlistProducts.reduce(
        (sum, item) => sum + getProductPrice(item),
        0,
      );
      const brands = new Set(
        wishlistProducts.map((item) => item.brand || "Unknown"),
      ).size;
      const highest = Math.max(
        ...wishlistProducts.map((item) => getProductPrice(item)),
      );

      setStats({
        totalValue: total,
        averagePrice:
          wishlistProducts.length > 0
            ? Math.round(total / wishlistProducts.length)
            : 0,
        brandCount: brands,
        highestPrice: highest,
      });
    }
  }, [wishlistProducts]);

  // Sort items
  const sortedItems = useMemo(() => {
    let sorted = [...wishlistProducts];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        break;
      case "price-high":
        sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        break;
      case "name":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    return sorted;
  }, [wishlistProducts, sortBy]);

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistProducts.map((item) => item._id));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((id) => removeFromWishlist(id));
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items removed from wishlist`);
  };

  const handleShareWishlist = () => {
    const wishlistText = `My ShoeVerse Wishlist:\n${wishlistProducts
      .map((item) => `• ${item.name} - $${getProductPrice(item)}`)
      .join("\n")}\n\nTotal Value: $${stats.totalValue}`;

    navigator.clipboard.writeText(wishlistText);
    toast.success("Wishlist copied to clipboard!");
  };

  // Loading state
  if (isLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <FiLoader className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - ShoeVerse Premium</title>
          <meta
            name="description"
            content="Your premium sneaker wishlist collection"
          />
        </Helmet>

        <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30"
              >
                <FiHeart className="text-5xl sm:text-6xl text-white" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Your Wishlist is Empty
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Found something you love? Save it here and never lose track of
                your dream sneakers. Start exploring our premium collection now!
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/products"
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Browse Premium Collection
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Wishlist (${wishlistProducts.length}) - ShoeVerse Premium`}</title>
        <meta
          name="description"
          content="Your curated collection of premium sneakers"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                  My Premium Wishlist
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                  {wishlistProducts.length}{" "}
                  {wishlistProducts.length === 1 ? "item" : "items"} in your
                  collection
                </p>
              </div>

              {/* View Toggle & Actions */}
              <div className="flex items-center gap-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShareWishlist}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiShare2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {[
              {
                label: "Total Items",
                value: wishlistProducts.length,
                icon: FiHeart,
                color: "pink",
              },
              {
                label: "Total Value",
                value: `$${stats.totalValue.toLocaleString()}`,
                icon: FiTag,
                color: "green",
              },
              {
                label: "Avg. Price",
                value: `$${stats.averagePrice.toLocaleString()}`,
                icon: FiAward,
                color: "blue",
              },
              {
                label: "Brands",
                value: stats.brandCount,
                icon: FiShoppingBag,
                color: "purple",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}
                    >
                      <Icon
                        className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-xl`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>

              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    {selectedItems.length === wishlistProducts.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
                  >
                    <FiTrash2 size={14} />
                    Remove ({selectedItems.length})
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedItems.map((product) => {
              const price = getProductPrice(product);
              const imageUrl = getProductImage(product);
              const hasImageError = imageErrors[product._id];

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                    {imageUrl && !hasImageError ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(product._id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <FiImage className="text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No image
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        removeFromWishlist(product._id);
                        toast.success("Removed from wishlist");
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors z-10"
                    >
                      <FiTrash2 className="text-red-500" size={16} />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {product.brand || "Premium Brand"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        ${price.toLocaleString()}
                      </p>
                      {product.currentPrice > price && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                          ${product.currentPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Clear All Button */}
          {wishlistProducts.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => {
                  if (window.confirm("Clear your entire wishlist?")) {
                    clearWishlist();
                    toast.success("Wishlist cleared");
                  }
                }}
                className="px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-xl transition-all hover:shadow-lg"
              >
                Clear Wishlist
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
