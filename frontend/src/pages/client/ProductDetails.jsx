import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ProductGallery from "../../components/product/ProductGallery";
import {
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiArrowLeft,
  FiCheck,
  FiMinus,
  FiPlus,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiCopy,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiAward,
  FiPercent,
  FiTrendingUp,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentProduct, fetchProductById, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    window.scrollTo(0, 0);

    // Calculate estimated delivery
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 5);
    setEstimatedDelivery(delivery);
  }, [id, fetchProductById]);

  // log product structure
  useEffect(() => {
    if (currentProduct) {
      console.log("🔥 Product data:", currentProduct);
      console.log("📦 Stock value:", currentProduct.stock);
      console.log("🎨 Colors array:", currentProduct.colors);
      console.log("📏 Sizes array:", currentProduct.sizes);
    }
  }, [currentProduct]);

  // Get stock count
  const stockCount = useMemo(() => {
    if (!currentProduct) return 0;

    if (currentProduct.stock && typeof currentProduct.stock === "object") {
      const totalStock = Object.values(currentProduct.stock).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0,
      );
      return totalStock;
    }

    // Try all possible stock field names
    if (currentProduct.stock !== undefined && currentProduct.stock !== null) {
      return Number(currentProduct.stock);
    }
    if (
      currentProduct.quantity !== undefined &&
      currentProduct.quantity !== null
    ) {
      return Number(currentProduct.quantity);
    }
    if (
      currentProduct.inStock !== undefined &&
      currentProduct.inStock !== null
    ) {
      return currentProduct.inStock === true
        ? 10
        : Number(currentProduct.inStock);
    }
    if (
      currentProduct.totalStock !== undefined &&
      currentProduct.totalStock !== null
    ) {
      return Number(currentProduct.totalStock);
    }
    if (
      currentProduct.countInStock !== undefined &&
      currentProduct.countInStock !== null
    ) {
      return Number(currentProduct.countInStock);
    }

    // Default to 10 for demo if can't find stock
    console.log("No stock field found, defaulting to 10");
    return 10;
  }, [currentProduct]);

  const hasStock = stockCount > 0;

  // Extract colors with proper handling for object arrays
  const colorOptions = useMemo(() => {
    if (!currentProduct?.colors) {
      console.log("No colors array found");
      return [];
    }

    // Ensure colors is an array
    const colorsArray = Array.isArray(currentProduct.colors)
      ? currentProduct.colors
      : [currentProduct.colors].filter(Boolean);

    console.log("Processing colors:", colorsArray);

    return colorsArray.map((color, index) => {
      
      // If color is an object
      if (typeof color === "object") {
      
        // Try to get color name and hex from object
        const colorName =
          color.name ||
          color.color ||
          Object.keys(color)[0] ||
          `Color ${index + 1}`;
        const colorHex = color.hex || color.code || "#cccccc";

        return {
          name: colorName,
          hex: colorHex,
          value: colorName.toLowerCase(),
        };
      }

      // If color is a string
      if (typeof color === "string") {
        
        // Common color names
        const colorMap = {
          blue: "#0000FF",
          red: "#FF0000",
          green: "#00FF00",
          yellow: "#FFFF00",
          black: "#000000",
          white: "#FFFFFF",
          purple: "#800080",
          orange: "#FFA500",
          pink: "#FFC0CB",
          gray: "#808080",
          grey: "#808080",
          brown: "#8B4513",
          navy: "#000080",
          gold: "#FFD700",
          silver: "#C0C0C0",
        };

        const colorLower = color.toLowerCase();
        return {
          name: color,
          hex: colorMap[colorLower] || "#cccccc",
          value: colorLower,
        };
      }

      return {
        name: `Color ${index + 1}`,
        hex: "#cccccc",
        value: `color-${index}`,
      };
    });
  }, [currentProduct]);

  // Extract sizes with proper handling
  const sizeOptions = useMemo(() => {
    if (!currentProduct?.sizes) {
      console.log("⚠️ No sizes array found");
      return [];
    }

    // Ensure sizes is an array
    const sizesArray = Array.isArray(currentProduct.sizes)
      ? currentProduct.sizes
      : [currentProduct.sizes].filter(Boolean);

    console.log("📏 Processing sizes:", sizesArray);

    return sizesArray
      .map((size) => {
        if (typeof size === "object") {
         
          // If size is an object, try to get the size value
          return (
            size.size ||
            size.value ||
            size.name ||
            Object.values(size)[0] ||
            "US 9"
          );
        }
        return size;
      })
      .filter(Boolean);
  }, [currentProduct]);

  // Auto-select first size if available and none selected
  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [sizeOptions, selectedSize]);

  // Auto-select first color if available and none selected
  useEffect(() => {
    if (colorOptions.length > 0 && !selectedColor) {
      setSelectedColor(colorOptions[0].name);
    }
  }, [colorOptions, selectedColor]);

  const handleAddToCart = () => {
    if (!currentProduct) return;

    if (sizeOptions.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Pass parameters separately as expected by the store
    addToCart(currentProduct, quantity, selectedSize, selectedColor);

    toast.success("Added to cart!", {
      icon: "🛒",
      duration: 2000,
    });
  };

  const handleBuyNow = () => {
    if (!currentProduct) return;

    if (sizeOptions.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Pass parameters separately as expected by the store
    addToCart(currentProduct, quantity, selectedSize, selectedColor);
    navigate("/checkout");
  };
  const handleWishlistToggle = () => {
    if (!currentProduct) return;

    if (isInWishlist(currentProduct._id)) {
      removeFromWishlist(currentProduct._id);
      toast.success("Removed from wishlist", { icon: "💔", duration: 1500 });
    } else {
      addToWishlist(currentProduct);
      toast.success("Added to wishlist", { icon: "❤️", duration: 1500 });
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${currentProduct?.name} at ShoeVerse!`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!", { duration: 1500 });
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
        );
        break;
    }
    setShowShareModal(false);
  };

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!currentProduct?.currentPrice || !currentProduct?.sellPrice)
      return null;
    const current = Number(currentProduct.currentPrice);
    const sell = Number(currentProduct.sellPrice);
    if (current > sell) {
      return Math.round(((current - sell) / current) * 100);
    }
    return null;
  }, [currentProduct]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary-200 border-t-primary-600 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-accent rounded-full" />
          </motion.div>
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-4">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiPackage className="text-4xl sm:text-5xl md:text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(currentProduct._id);

  // Prepare images array for gallery
  const galleryImages =
    currentProduct.images?.length > 0
      ? currentProduct.images
      : [{ url: currentProduct.image || "https://via.placeholder.com/600" }];

  return (
    <>
      <Helmet>
        <title>{currentProduct.name} - ShoeVerse Premium</title>
        <meta name="description" content={currentProduct.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              to="/"
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <Link
              to="/products"
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              Products
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <Link
              to={`/category/${currentProduct.category ? currentProduct.category.toLowerCase() : "all"}`}
              className="hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {currentProduct.category || "All"}
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium whitespace-nowrap truncate max-w-[120px] sm:max-w-[200px]">
              {currentProduct.name}
            </span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors mb-3 sm:mb-4 md:mb-6 group"
          >
            <FiArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xs sm:text-sm">Back</span>
          </button>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-12 md:mb-16">
            
            {/* Product Gallery */}
            <ProductGallery
              images={galleryImages}
              productName={currentProduct.name}
              onImageChange={(index) => setActiveImageIndex(index)}
              allowZoom={true}
              allowFullscreen={true}
              showThumbnails={true}
              thumbnailPosition="bottom"
            />

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
             
              {/* Brand & Title */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Link
                    to={`/brand/${currentProduct.brand?.toLowerCase()}`}
                    className="text-primary-600 dark:text-primary-400 font-semibold text-[10px] sm:text-xs hover:underline inline-block mb-1 sm:mb-2"
                  >
                    {currentProduct.brand?.toUpperCase() || "PREMIUM BRAND"}
                  </Link>
                  {discountPercentage && (
                    <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {currentProduct.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm sm:text-base md:text-lg ${
                        i < Math.floor(currentProduct.rating || 4.5)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  ({currentProduct.numReviews || 128} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  ${currentProduct.sellPrice}
                </span>
                {currentProduct.currentPrice && (
                  <>
                    <span className="text-sm sm:text-base text-gray-400 dark:text-gray-500 line-through">
                      ${currentProduct.currentPrice}
                    </span>
                    <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
                      Save $
                      {Number(currentProduct.currentPrice) -
                        Number(currentProduct.sellPrice)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentProduct.description ||
                  "Premium quality sneakers with exceptional comfort and style. Designed for both performance and everyday wear."}
              </p>

              {/* Size Selection */}
              {sizeOptions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      Size{" "}
                      <span className="text-primary-600 ml-1">
                        - {selectedSize}
                      </span>
                    </h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-[10px] sm:text-xs text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <FiCheckCircle size={12} /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {sizeOptions.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] sm:min-w-[60px] px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "border-primary-600 bg-primary-600 text-white shadow-md"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-primary-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {colorOptions.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Color{" "}
                    <span className="text-primary-600 ml-1">
                      - {selectedColor}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {colorOptions.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className="flex flex-col items-center gap-1 sm:gap-2 group"
                        title={color.name}
                      >
                        <div
                          className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-all ${
                            selectedColor === color.name
                              ? "border-primary-600 scale-105 sm:scale-110 shadow-md ring-1 sm:ring-2 ring-primary-200 dark:ring-primary-800"
                              : "border-gray-300 dark:border-gray-600 group-hover:border-primary-400"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.name && (
                            <FiCheck
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
                              size={10}
                            />
                          )}
                        </div>
                        <span className="text-[8px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Status */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                    Quantity
                  </h3>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-24 sm:w-28">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 py-1.5 sm:py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-gray-700 dark:text-gray-300"
                      disabled={!hasStock}
                    >
                      <FiMinus size={12} className="mx-auto" />
                    </button>
                    <span className="flex-1 text-center text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(stockCount, quantity + 1))
                      }
                      className="flex-1 py-1.5 sm:py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-gray-700 dark:text-gray-300"
                      disabled={!hasStock || quantity >= stockCount}
                    >
                      <FiPlus size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <div
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${hasStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-medium ${hasStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {hasStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {hasStock && (
                    <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                      {stockCount} units available
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  className={`flex-1 min-w-[120px] py-2.5 sm:py-3 md:py-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                    hasStock
                      ? "bg-gradient-to-r from-primary-600 to-accent text-white hover:shadow-lg hover:-translate-y-0.5"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiShoppingBag size={14} />
                  <span className="hidden xs:inline">Add to Cart</span>
                  <span className="xs:hidden">Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!hasStock}
                  className={`flex-1 min-w-[80px] py-2.5 sm:py-3 md:py-4 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    hasStock
                      ? "border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:-translate-y-0.5"
                      : "border-2 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2.5 sm:p-3 md:p-4 rounded-lg border transition-all hover:-translate-y-0.5 ${
                    inWishlist
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
                  }`}
                >
                  <FiHeart
                    size={14}
                    className={
                      inWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  />
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2.5 sm:p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 text-gray-700 dark:text-gray-300"
                >
                  <FiShare2 size={14} />
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3 pt-2 sm:pt-4">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto mb-1 sm:mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <FiTruck className="text-primary-600" size={14} />
                  </div>
                  <p className="text-[10px] sm:text-[12px] md:text-xs font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                    $100+
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto mb-1 sm:mb-2 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <FiRefreshCw className="text-green-600" size={14} />
                  </div>
                  <p className="text-[10px] sm:text-[12px] md:text-xs font-medium text-gray-900 dark:text-white">
                    30-Day Returns
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                    Hassle-free
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto mb-1 sm:mb-2 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <FiShield className="text-purple-600" size={14} />
                  </div>
                  <p className="text-[10px] sm:text-[12px] md:text-xs font-medium text-gray-900 dark:text-white">
                    100% Authentic
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                    Guaranteed
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto mb-1 sm:mb-2 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <FiPackage className="text-orange-600" size={14} />
                  </div>
                  <p className="text-[10px] sm:text-[12px] md:text-xs font-medium text-gray-900 dark:text-white">
                    Secure Pack
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                    Premium box
                  </p>
                </div>
              </div>

              {/* Delivery Estimate */}
              {estimatedDelivery && hasStock && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FiClock className="text-blue-600" size={16} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Estimated Delivery
                      </p>
                      <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                        Order within{" "}
                        <span className="font-semibold text-primary-600">
                          4 hours
                        </span>
                      </p>
                      <p className="text-sm sm:text-base font-bold text-primary-600 mt-1">
                        {estimatedDelivery.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
              <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 sm:pb-3 text-xs sm:text-sm font-medium capitalize transition-all relative ${
                      activeTab === tab
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[150px] sm:min-h-[200px]"
              >
                {activeTab === "description" && (
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>
                      {currentProduct.description ||
                        "Premium quality sneakers with exceptional comfort and style. Designed for both performance and everyday wear, these shoes feature responsive cushioning and breathable materials."}
                    </p>

                    {/* Key Features */}
                    <div className="mt-4 sm:mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-5">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                        <FiAward className="text-primary-600" size={16} />
                        Key Features
                      </h4>
                      <ul className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                        <li className="flex items-center gap-2 text-xs sm:text-sm">
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={12}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Premium materials
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm">
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={12}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Responsive cushioning
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm">
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={12}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Breathable upper
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-xs sm:text-sm">
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={12}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Durable outsole
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl">
                      <FiPackage className="text-lg sm:text-2xl text-primary-600 mx-auto mb-1 sm:mb-2" />
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Product Code
                      </h4>
                      <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                        SNK-{currentProduct._id?.slice(-6)}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl">
                      <FiAward className="text-lg sm:text-2xl text-primary-600 mx-auto mb-1 sm:mb-2" />
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Brand
                      </h4>
                      <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {currentProduct.brand || "Premium"}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl">
                      <FiCheckCircle className="text-lg sm:text-2xl text-primary-600 mx-auto mb-1 sm:mb-2" />
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Category
                      </h4>
                      <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {currentProduct.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-4 sm:py-8">
                    <FiStar className="text-2xl sm:text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      No reviews yet
                    </p>
                    <button className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-primary-600 text-white rounded-lg text-xs sm:text-sm hover:bg-primary-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowShareModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Share this product
              </h3>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 sm:p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiFacebook size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 sm:p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <FiTwitter size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className="p-2 sm:p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiMail size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-2 sm:p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FiCopy size={16} className="mx-auto" />
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Size Guide
              </h3>
              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                <div className="grid grid-cols-4 gap-0.5 sm:gap-1 text-center text-[8px] sm:text-xs font-medium">
                  <div className="p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                    US
                  </div>
                  <div className="p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                    UK
                  </div>
                  <div className="p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                    EU
                  </div>
                  <div className="p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                    CM
                  </div>
                </div>
                {["7", "8", "9", "10", "11", "12"].map((size, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-0.5 sm:gap-1 text-center text-[8px] sm:text-xs"
                  >
                    <div className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {size}
                    </div>
                    <div className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {parseInt(size) - 0.5}
                    </div>
                    <div className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {parseInt(size) + 33}
                    </div>
                    <div className="p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {Math.round(parseInt(size) * 0.85 + 22)}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg text-xs sm:text-sm hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;
