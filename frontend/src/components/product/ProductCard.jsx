import { useState } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiStar,
  FiEye,
  FiCheck,
  FiClock,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiZap,
  FiTrendingUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-hot-toast";

const ProductCard = ({ product, index, onAddToCart, onWishlistToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null,
  );
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(e, product);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAddedToCart(true);
    onAddToCart?.(e, product);

    setTimeout(() => setAddedToCart(false), 1500);

    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
  };

  const handleColorSelect = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickActions(true);
    setTimeout(() => setShowQuickActions(false), 2000);
  };

  // Calculate discount percentage
  const discountPercentage = (() => {
    if (product.currentPrice && product.sellPrice) {
      return Math.round(
        ((product.currentPrice - product.sellPrice) / product.currentPrice) *
          100,
      );
    }
    if (product.originalPrice && product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      );
    }
    return product.discount || 0;
  })();

  // Determine stock status
  const getStockStatus = () => {
    if (product.stock === 0)
      return {
        text: "Out of Stock",
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/40",
        border: "border-red-200 dark:border-red-800",
        icon: FiClock,
      };
    if (product.stock < 5)
      return {
        text: "Low Stock",
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/40",
        border: "border-orange-200 dark:border-orange-800",
        icon: FiZap,
      };
    if (product.stock < 15)
      return {
        text: "Limited Stock",
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/40",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: FiTrendingUp,
      };
    return {
      text: "In Stock",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/40",
      border: "border-green-200 dark:border-green-800",
      icon: FiCheck,
    };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  // Get product image
  const productImage = (() => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      if (typeof product.images[0] === "string") {
        return product.images[currentImageIndex] || product.images[0];
      }
      if (product.images[0]?.url) {
        return product.images[currentImageIndex]?.url || product.images[0]?.url;
      }
    }
    return (
      product.image ||
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    );
  })();

  // Multiple images for hover effect
  const hasMultipleImages = (() => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 1
    ) {
      return true;
    }
    return false;
  })();

  // Get secondary image for hover
  const getSecondaryImage = () => {
    if (
      !product.images ||
      !Array.isArray(product.images) ||
      product.images.length < 2
    ) {
      return null;
    }
    if (typeof product.images[1] === "string") {
      return product.images[1];
    }
    if (product.images[1]?.url) {
      return product.images[1].url;
    }
    return null;
  };

  // Extract size values
  const sizeValues =
    product.sizes?.map((s) => (typeof s === "object" ? s.size : s)) || [];

  // Calculate delivery date
  const deliveryDate = new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      onHoverStart={() => {
        setIsHovered(true);
        if (hasMultipleImages) {
          setCurrentImageIndex(1);
        }
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700"
    >
      {/* Border Gradient on Hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(145deg, rgba(59,130,246,0.6), rgba(139,92,246,0.6), rgba(236,72,153,0.4))",
          padding: "2px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Image Container */}
      <div className="relative h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-t-xl">
        
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 border-2 xs:border-3 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 bg-gradient-to-r from-primary-600 to-accent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Sold Out Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-[2px] z-20">
            <span className="px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full text-[10px] xs:text-xs transform -rotate-12 shadow-xl border border-white/20">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Main Image */}
        <motion.img
          src={productImage}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${isHovered ? "scale-110" : "scale-100"}`}
        />

        {/* Secondary Image Overlay */}
        {hasMultipleImages && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img
              src={getSecondaryImage()}
              alt={`${product.name} alternate view`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Image Gallery Thumbnails */}
        {hasMultipleImages && (
          <div className="absolute bottom-1 xs:bottom-1.5 sm:bottom-2 left-1 xs:left-1.5 sm:left-2 flex gap-0.5 xs:gap-0.8 sm:gap-1 z-20">
            {product.images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-0.5 xs:h-0.8 sm:h-1 rounded-full transition-all duration-300 ${
                  currentImageIndex === idx
                    ? "w-3 xs:w-3.5 sm:w-4 bg-primary-600 shadow-md shadow-primary-500/50"
                    : "w-0.5 xs:w-0.8 sm:w-1 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        {/* Badges Container */}
        <div className="absolute top-1 xs:top-1.5 sm:top-2 left-1 xs:left-1.5 sm:left-2 flex flex-col gap-0.5 xs:gap-1 sm:gap-1.5 z-10">
          {discountPercentage > 0 && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-[2px] xs:blur-sm animate-pulse opacity-70" />
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 rounded-full text-[7px] xs:text-[8px] sm:text-[9px] font-bold shadow-lg flex items-center gap-0.5 border border-white/30">
                <span className="text-[8px] xs:text-[9px] sm:text-xs leading-none">
                  −
                </span>
                {discountPercentage}%
              </div>
            </motion.div>
          )}

          {product.isNew && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-[2px] xs:blur-sm opacity-70" />
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 rounded-full text-[7px] xs:text-[8px] sm:text-[9px] font-bold shadow-lg flex items-center gap-0.5 border border-white/30">
                <FiZap size={8} xs:size={9} sm:size={10} />
                NEW
              </div>
            </motion.div>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className="absolute top-1 xs:top-1.5 sm:top-2 right-1 xs:right-1.5 sm:right-2 p-1 xs:p-1.2 sm:p-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all z-10 group/wishlist border border-gray-200 dark:border-gray-600"
        >
          <motion.div
            animate={{ scale: inWishlist ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiHeart
              className={`text-[10px] xs:text-xs sm:text-sm transition-colors ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 dark:text-gray-300 group-hover/wishlist:text-red-500"
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Quick View Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickView}
          className="absolute bottom-1 xs:bottom-1.5 sm:bottom-2 right-1 xs:right-1.5 sm:right-2 p-1 xs:p-1.2 sm:p-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all z-10 border border-gray-200 dark:border-gray-600"
        >
          <FiEye className="text-[10px] xs:text-xs sm:text-sm text-gray-700 dark:text-gray-300" />
        </motion.button>

        {/* Stock Status Badge */}
        <div
          className={`absolute bottom-1 xs:bottom-1.5 sm:bottom-2 left-1 xs:left-1.5 sm:left-2 ${stockStatus.bg} backdrop-blur-sm px-1 xs:px-1.2 sm:px-1.5 py-0.2 xs:py-0.3 sm:py-0.5 rounded-full flex items-center gap-0.5 xs:gap-0.8 sm:gap-1 shadow-lg z-10 border ${stockStatus.border}`}
        >
          <StockIcon
            className={stockStatus.color}
            size={8}
            xs:size={9}
            sm:size={10}
          />
          <span
            className={`text-[8px] xs:text-[9px] sm:text-[10px] font-medium ${stockStatus.color}`}
          >
            {stockStatus.text}
          </span>
        </div>

        {/* Quick Actions Toast */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-12 xs:bottom-14 sm:bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.2 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-xs shadow-xl whitespace-nowrap z-20 border border-white/20"
            >
              Quick view coming soon!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Added to Cart Animation */}
        <AnimatePresence>
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm z-30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 xs:p-2.5 sm:p-3 rounded-full shadow-2xl border-2 border-white/30"
              >
                <FiCheck size={14} xs:size={16} sm:size={18} md:size={20} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Container */}
      <div className="p-1.5 xs:p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-b-xl">
        
        {/* Brand and Rating */}
        <div className="flex items-center justify-between mb-0.5 xs:mb-0.8 sm:mb-1">
          <motion.span
            whileHover={{ x: 2 }}
            className="text-[10px] xs:text-xs sm:text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider"
          >
            {product.brand}
          </motion.span>
          <div className="flex items-center gap-0.2 xs:gap-0.3 sm:gap-0.5 bg-yellow-50 dark:bg-gray-700/80 px-1 xs:px-1.2 sm:px-1.5 py-0.2 xs:py-0.3 sm:py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">
            <FiStar
              className="text-yellow-400 fill-current"
              size={7}
              xs:size={8}
              sm:size={9}
            />
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-gray-800 dark:text-gray-200">
              {product.rating || "4.5"}
            </span>
            <span className="text-[6px] xs:text-[7px] sm:text-[8px] text-gray-500 dark:text-gray-400">
              ({product.numReviews || "128"})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-0.5 xs:mb-0.8 sm:mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        {/* Size Preview */}
        {sizeValues.length > 0 && (
          <div className="flex flex-wrap gap-0.5 xs:gap-0.8 sm:gap-1 mb-0.5 xs:mb-1 sm:mb-1.5">
            {sizeValues.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.2 sm:px-1.5 py-0.2 xs:py-0.3 sm:py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                {size}
              </span>
            ))}
            {sizeValues.length > 3 && (
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.2 sm:px-1.5 py-0.2 xs:py-0.3 sm:py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                +{sizeValues.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-0.5 xs:gap-0.8 sm:gap-1 mb-0.5 xs:mb-1 sm:mb-1.5">
            {product.colors.slice(0, 4).map((color, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, y: -1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleColorSelect(e, color)}
                className={`relative group/color`}
              >
                <div
                  className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full transition-all ${
                    selectedColor === color
                      ? "ring-2 ring-primary-600 ring-offset-2 dark:ring-offset-gray-800 scale-110"
                      : "ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-2 hover:ring-primary-400"
                  }`}
                  style={{ backgroundColor: color.hex || color }}
                />
                {/* Tooltip */}
                <span className="absolute -bottom-3 xs:-bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white text-[5px] xs:text-[6px] px-0.5 xs:px-1 py-0.2 xs:py-0.3 rounded opacity-0 group-hover/color:opacity-100 whitespace-nowrap border border-white/20">
                  {color.name || color}
                </span>
              </motion.button>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[7px] xs:text-[8px] sm:text-[9px] text-gray-500 dark:text-gray-400 ml-0.2 xs:ml-0.3 sm:ml-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-0.5 xs:gap-0.8 sm:gap-1">
            <span className="text-xs xs:text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              ${product.sellPrice || product.price || 0}
            </span>
            {(product.currentPrice || product.originalPrice) && (
              <span className="text-[8px] xs:text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 line-through">
                ${product.currentPrice || product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 xs:gap-0.8 sm:gap-1">
            
            {/* Buy Now Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              disabled={product.stock === 0}
              className={`p-1 xs:p-1.2 sm:p-1.5 rounded-lg transition-all duration-300 ${
                product.stock === 0
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              }`}
              title="Buy Now"
            >
              <FiZap size={10} xs:size={12} sm:size={14} />
            </motion.button>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCartClick}
              disabled={product.stock === 0}
              className={`relative p-1 xs:p-1.2 sm:p-1.5 rounded-lg transition-all duration-300 overflow-hidden group/btn ${
                product.stock === 0
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <span className="relative flex items-center justify-center">
                <FiShoppingBag
                  className="group-hover/btn:rotate-12 transition-transform"
                  size={10}
                  xs:size={12}
                  sm:size={14}
                />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="mt-1 xs:mt-1.5 sm:mt-2 pt-1 xs:pt-1.2 sm:pt-1.5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.2 xs:gap-0.3 sm:gap-0.5">
              <FiTruck
                size={6}
                xs:size={7}
                sm:size={8}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400">
                Free Delivery By
              </span>
            </div>
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-gray-800 dark:text-gray-200">
              {deliveryDate}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Stats Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-6 xs:-top-7 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-0.8 sm:py-1 rounded-full text-[6px] xs:text-[7px] sm:text-[8px] whitespace-nowrap shadow-xl flex items-center gap-1 xs:gap-1.5 sm:gap-2 z-20 border border-white/20"
          >
            <span className="flex items-center gap-0.2 xs:gap-0.3 sm:gap-0.5">
              <FiEye size={6} xs:size={7} sm:size={8} />{" "}
              {product.views || "2.3k"}
            </span>
            <span className="flex items-center gap-0.2 xs:gap-0.3 sm:gap-0.5">
              <FiHeart size={6} xs:size={7} sm:size={8} />{" "}
              {product.wishlistCount || "234"}
            </span>
            <span className="flex items-center gap-0.2 xs:gap-0.3 sm:gap-0.5">
              <FiShoppingBag size={6} xs:size={7} sm:size={8} />{" "}
              {product.purchases || "89"}
            </span>
            <div className="absolute -bottom-0.5 xs:-bottom-0.8 sm:-bottom-1 left-1/2 transform -translate-x-1/2 w-1 xs:w-1.2 sm:w-1.5 h-1 xs:h-1.2 sm:h-1.5 bg-gray-900 dark:bg-gray-950 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 border-t border-l border-primary-500/40 dark:border-primary-400/40 rounded-tl-lg xs:rounded-tl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 border-b border-r border-primary-500/40 dark:border-primary-400/40 rounded-br-lg xs:rounded-br-xl pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;
