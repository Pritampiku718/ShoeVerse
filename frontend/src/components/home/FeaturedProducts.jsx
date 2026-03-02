import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiZap,
  FiStar,
  FiAward,
  FiShoppingBag,
  FiX,
  FiEye,
  FiShoppingCart,
  FiHeart,
  FiCheck,
} from "react-icons/fi";
import ProductCard from "../product/ProductCard";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-hot-toast";

const FeaturedProducts = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 4));
    }
  }, [products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickView = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedColor(product.colors?.[0]?.name || product.colors?.[0] || "");
    setQuantity(1);
    setQuickViewOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedSize && selectedProduct?.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }

    addToCart({
      ...selectedProduct,
      quantity,
      selectedSize,
      selectedColor,
    });

    setAddedToCart(true);
    toast.success("Added to cart!");

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate("/checkout");
      setQuickViewOpen(false);
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(selectedProduct._id)) {
      removeFromWishlist(selectedProduct._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(selectedProduct);
      toast.success("Added to wishlist");
    }
  };

  const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/400";
    return (
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      "https://via.placeholder.com/400"
    );
  };

  const badges = [
    {
      icon: FiZap,
      label: "Bestseller",
      color: "from-yellow-500 to-orange-500",
    },
    { icon: FiStar, label: "Staff Pick", color: "from-purple-500 to-pink-500" },
    { icon: FiAward, label: "Premium", color: "from-blue-500 to-cyan-500" },
    {
      icon: FiTrendingUp,
      label: "Trending",
      color: "from-green-500 to-emerald-500",
    },
  ];

  if (isLoading) {
    return (
      <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative w-full"
              >
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 h-56 xs:h-64 sm:h-72 md:h-76 lg:h-80 rounded-xl xs:rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
                <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-2 xs:left-3 sm:left-4 right-2 xs:right-3 sm:right-4">
                  <div className="h-3 xs:h-3.5 sm:h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-3/4 mb-1 xs:mb-1.5 sm:mb-2 animate-pulse" />
                  <div className="h-2 xs:h-2.5 sm:h-3 bg-gray-400 dark:bg-gray-600 rounded-full w-1/2 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 xs:py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "30px 30px xs:35px 35px sm:40px 40px",
            color: "rgba(0,0,0,0.05)",
          }}
        />
      </div>

      <motion.div
        style={{ y }}
        className="absolute top-20 -left-20 w-48 xs:w-56 sm:w-64 lg:w-80 h-48 xs:h-56 sm:h-64 lg:h-80 bg-primary-500/15 dark:bg-primary-500/20 rounded-full blur-3xl hidden sm:block"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 -right-20 w-56 xs:w-64 sm:w-72 lg:w-96 h-56 xs:h-64 sm:h-72 lg:h-96 bg-accent/15 dark:bg-accent/20 rounded-full blur-3xl hidden md:block"
      />

      <div className="max-w-7xl mx-auto relative z-10 px-2 xs:px-3 sm:px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 relative"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 bg-primary-500/20 dark:bg-primary-500/25 rounded-full blur-2xl" />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-full text-white mb-3 xs:mb-3.5 sm:mb-4 shadow-xl relative overflow-hidden group border border-primary-400 dark:border-primary-600"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <FiShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 relative z-10" />
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider relative z-10">
              CURATED SELECTION
            </span>
            <FiShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 relative z-10" />
          </motion.div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 px-2">
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 dark:from-primary-400 dark:via-accent dark:to-pink-400 bg-clip-text text-transparent">
              Featured
            </span>{" "}
            <span className="text-gray-900 dark:text-white">Collections</span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2 xs:px-3 sm:px-4">
            Discover our hand-picked selection of premium sneakers
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8"
          >
            {[
              { value: "100%", label: "Authentic" },
              { value: "24h", label: "Shipping" },
              { value: "50k+", label: "Happy Customers" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary-700 to-accent dark:from-primary-400 dark:to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5 xs:mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {featuredProducts.map((product, index) => {
            const badge = badges[index % badges.length];

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => handleProductClick(product._id)}
                className="relative group w-full cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredIndex === index ? 1 : 0 }}
                  className="absolute -top-1 xs:-top-1.5 sm:-top-2 -right-1 xs:-right-1.5 sm:-right-2 z-20"
                >
                  <div
                    className={`relative px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-1 xs:py-1 sm:py-1.5 bg-gradient-to-r ${badge.color} text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold rounded-full shadow-xl flex items-center gap-0.5 xs:gap-1 border border-white/30`}
                  >
                    {badge.icon && (
                      <badge.icon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 animate-pulse" />
                    )}
                    {badge.label}
                  </div>
                </motion.div>

                <ProductCard product={product} index={index} />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl xs:rounded-xl sm:rounded-2xl items-center justify-center transition-opacity duration-300 hidden sm:flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredIndex === index ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={(e) => handleQuickView(product, e)}
                    className="px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 bg-white text-gray-900 rounded-full font-bold text-[10px] xs:text-xs sm:text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-gray-200 flex items-center gap-1"
                  >
                    <FiEye size={14} />
                    Quick View
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 xs:mt-8 sm:mt-10 md:mt-12 relative"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 xs:-top-3 sm:-top-4 w-32 xs:w-40 sm:w-48 h-32 xs:h-40 sm:h-48 border-2 border-primary-500/30 dark:border-primary-500/40 rounded-full hidden sm:block" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 xs:-top-3 sm:-top-4 w-40 xs:w-48 sm:w-64 h-40 xs:h-48 sm:h-64 border-2 border-accent/20 dark:border-accent/30 rounded-full hidden md:block" />

          <Link
            to="/products"
            className="group relative inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden border border-primary-400 dark:border-primary-600"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center gap-1 xs:gap-1.5">
              Explore Full Collection
              <FiArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 mt-3 xs:mt-3.5 sm:mt-4 md:mt-5"
          >
            <div className="flex items-center gap-0.5 xs:gap-1">
              <div className="w-1 h-1 xs:w-1.2 xs:h-1.2 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-700 dark:text-gray-300">
                {featuredProducts.length} premium styles available
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* COMPACT QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewOpen && selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Compact Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 sm:inset-10 md:inset-16 lg:inset-20 xl:inset-24 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex items-center justify-center">
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setQuickViewOpen(false)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <FiX
                      size={16}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </button>

                  {/* Compact Modal Content - Vertical on mobile, Horizontal on desktop */}
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Product Image - Smaller */}
                    <div className="md:w-2/5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-3 flex items-center justify-center">
                      <img
                        src={getProductImage(selectedProduct)}
                        alt={selectedProduct.name}
                        className="w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-full md:h-auto object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="md:w-3/5 p-4 md:p-5">
                      {/* Brand & Title */}
                      <div className="mb-2">
                        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                          {selectedProduct.brand}
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                          {selectedProduct.name}
                        </h3>
                      </div>

                      {/* Rating & Price Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(selectedProduct.rating || 4.5)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            ({selectedProduct.numReviews || 128})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            $
                            {selectedProduct.sellPrice || selectedProduct.price}
                          </span>
                          {(selectedProduct.currentPrice ||
                            selectedProduct.originalPrice) && (
                            <span className="ml-1 text-[10px] text-gray-400 line-through">
                              $
                              {selectedProduct.currentPrice ||
                                selectedProduct.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Size Selection */}
                      {selectedProduct.sizes &&
                        selectedProduct.sizes.length > 0 && (
                          <div className="mb-3">
                            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Size
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {selectedProduct.sizes.slice(0, 5).map((size) => {
                                const sizeValue =
                                  typeof size === "object" ? size.size : size;
                                return (
                                  <button
                                    key={sizeValue}
                                    onClick={() => setSelectedSize(sizeValue)}
                                    className={`px-2 py-1 text-[10px] font-medium rounded border transition-all ${
                                      selectedSize === sizeValue
                                        ? "bg-primary-600 text-white border-primary-600"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                    }`}
                                  >
                                    {sizeValue}
                                  </button>
                                );
                              })}
                              {selectedProduct.sizes.length > 5 && (
                                <span className="text-[10px] text-gray-400">
                                  +{selectedProduct.sizes.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Color Selection */}
                      {selectedProduct.colors &&
                        selectedProduct.colors.length > 0 && (
                          <div className="mb-3">
                            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Color
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {selectedProduct.colors
                                .slice(0, 4)
                                .map((color) => {
                                  const colorName =
                                    typeof color === "string"
                                      ? color
                                      : color.name;
                                  const colorHex =
                                    typeof color === "string"
                                      ? color.toLowerCase()
                                      : color.hex;
                                  return (
                                    <button
                                      key={colorName}
                                      onClick={() =>
                                        setSelectedColor(colorName)
                                      }
                                      className={`w-5 h-5 rounded-full border ${
                                        selectedColor === colorName
                                          ? "border-2 border-primary-600 scale-110"
                                          : "border-gray-300 dark:border-gray-600"
                                      }`}
                                      style={{ backgroundColor: colorHex }}
                                      title={colorName}
                                    />
                                  );
                                })}
                              {selectedProduct.colors.length > 4 && (
                                <span className="text-[10px] text-gray-400">
                                  +{selectedProduct.colors.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Quantity & Actions Row */}
                      <div className="flex items-center gap-2 mb-3">
                        
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded">
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-gray-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1"
                        >
                          {addedToCart ? (
                            <>
                              <FiCheck size={12} />
                              Added
                            </>
                          ) : (
                            <>
                              <FiShoppingCart size={12} />
                              Add
                            </>
                          )}
                        </button>

                        {/* Buy Now */}
                        <button
                          onClick={handleBuyNow}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-1.5 rounded text-xs font-bold"
                        >
                          Buy
                        </button>
                      </div>

                      {/* Wishlist & View Details */}
                      <div className="flex items-center justify-between text-[10px]">
                        <button
                          onClick={handleWishlistToggle}
                          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
                        >
                          <FiHeart
                            size={12}
                            className={
                              isInWishlist(selectedProduct._id)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }
                          />
                          {isInWishlist(selectedProduct._id) ? "Saved" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setQuickViewOpen(false);
                            navigate(`/product/${selectedProduct._id}`);
                          }}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedProducts;
