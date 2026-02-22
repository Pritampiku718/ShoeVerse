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

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : product.discount || 0;

  // Determine stock status
  const getStockStatus = () => {
    if (product.stock === 0)
      return {
        text: "Out of Stock",
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-900/20",
        icon: FiClock,
      };
    if (product.stock < 5)
      return {
        text: "Low Stock",
        color: "text-orange-500",
        bg: "bg-orange-100 dark:bg-orange-900/20",
        icon: FiZap,
      };
    if (product.stock < 15)
      return {
        text: "Limited Stock",
        color: "text-yellow-500",
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        icon: FiTrendingUp,
      };
    return {
      text: "In Stock",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20",
      icon: FiCheck,
    };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  // Get product image
  const productImage =
    product.images?.[currentImageIndex]?.url ||
    product.images?.[0]?.url ||
    product.image ||
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  // Multiple images for hover effect
  const hasMultipleImages = product.images?.length > 1;

  // Extract size values if sizes are objects with size property
  const sizeValues =
    product.sizes?.map((s) => (typeof s === "object" ? s.size : s)) || [];

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
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      {/* Premium Border Gradient on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(145deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))",
          padding: "2px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-accent rounded-full animate-pulse"></div>
              </div>
            </div>
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

        {/* Secondary Image Overlay (for hover effect) */}
        {hasMultipleImages && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img
              src={product.images?.[1]?.url}
              alt={`${product.name} alternate view`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Gradient Overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-sm animate-pulse" />
              <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <span className="text-lg leading-none">−</span>
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm" />
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <FiZap size={12} />
                NEW
              </div>
            </motion.div>
          )}

          {product.isFeatured && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm" />
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <FiStar size={12} />
                FEATURED
              </div>
            </motion.div>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all z-10 group/wishlist"
        >
          <motion.div
            animate={{ scale: inWishlist ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiHeart
              className={`text-xl transition-colors ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-300 group-hover/wishlist:text-red-500"
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
          className="absolute bottom-3 right-3 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <FiEye className="text-xl text-gray-600 dark:text-gray-300" />
        </motion.button>

        {/* Stock Status Badge */}
        <div
          className={`absolute bottom-3 left-3 ${stockStatus.bg} backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}
        >
          <StockIcon className={stockStatus.color} size={14} />
          <span className={`text-xs font-medium ${stockStatus.color}`}>
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
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-xl whitespace-nowrap"
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
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="bg-green-500 text-white p-4 rounded-full shadow-2xl"
              >
                <FiCheck size={32} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Brand and Rating */}
        <div className="flex items-center justify-between mb-2">
          <motion.span
            whileHover={{ x: 2 }}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider"
          >
            {product.brand}
          </motion.span>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-gray-700 px-2 py-1 rounded-full">
            <FiStar className="text-yellow-400 fill-current" size={12} />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {product.rating || "4.5"}
            </span>
            <span className="text-xs text-gray-400">
              ({product.numReviews || "128"})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Size Preview - Fixed: Extract size values correctly */}
        {sizeValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {sizeValues.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {size}
              </span>
            ))}
            {sizeValues.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                +{sizeValues.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Color Options - FIXED */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {product.colors.slice(0, 5).map((color, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleColorSelect(e, color)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary-600 scale-110 shadow-lg"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ backgroundColor: color.hex || color }}
                title={color.name || color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-gray-400 ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
            className={`relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden group/btn ${
              product.stock === 0
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-600 to-accent text-white hover:shadow-xl"
            }`}
          >
            {/* Shine Effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />

            <span className="relative flex items-center justify-center gap-1">
              <FiShoppingBag
                className="group-hover/btn:rotate-12 transition-transform"
                size={18}
              />
            </span>
          </motion.button>
        </div>

        {/* Features Icons */}
        <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-500 dark:text-gray-400">
          {product.freeShipping && (
            <div className="flex items-center gap-1" title="Free Shipping">
              <FiTruck size={10} className="text-green-500" />
              <span>Free</span>
            </div>
          )}
          {product.authentic && (
            <div className="flex items-center gap-1" title="100% Authentic">
              <FiShield size={10} className="text-blue-500" />
              <span>Auth</span>
            </div>
          )}
          {product.returns && (
            <div className="flex items-center gap-1" title="30-Day Returns">
              <FiRefreshCw size={10} className="text-purple-500" />
              <span>Returns</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Stats Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs whitespace-nowrap shadow-xl flex items-center gap-3"
          >
            <span className="flex items-center gap-1">
              <FiEye size={12} /> {product.views || "2.3k"}
            </span>
            <span className="flex items-center gap-1">
              <FiHeart size={12} /> {product.wishlistCount || "234"}
            </span>
            <span className="flex items-center gap-1">
              <FiShoppingBag size={12} /> {product.purchases || "89"}
            </span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500/20 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500/20 rounded-br-2xl pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;
