import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiClock,
  FiEye,
  FiHeart,
  FiShoppingBag,
  FiStar,
  FiZap,
  FiAward,
  FiBarChart2,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiCheck,
} from "react-icons/fi";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-hot-toast";

const TrendingNow = () => {
  const { products, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const [trendingItems, setTrendingItems] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const [addedToCart, setAddedToCart] = useState({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Generate trending items from real products with REAL STOCK
  useEffect(() => {
    if (products && products.length > 0) {
      console.log(
        "📦 Real products from backend:",
        products.map((p) => ({
          name: p.name,
          stock: p.stock,
          totalStock: p.totalStock,
        })),
      );

      const generatedItems = products.slice(0, 8).map((p, index) => {
        const colors = [
          "from-blue-500 to-cyan-500",
          "from-green-500 to-emerald-500",
          "from-orange-500 to-red-500",
          "from-purple-500 to-pink-500",
          "from-yellow-500 to-amber-500",
          "from-pink-500 to-rose-500",
          "from-indigo-500 to-purple-500",
          "from-red-500 to-orange-500",
        ];

        const badgeColors = [
          "from-red-500 to-orange-500",
          "from-green-500 to-emerald-500",
          "from-purple-500 to-pink-500",
          "from-yellow-500 to-orange-500",
          "from-pink-500 to-rose-500",
          "from-blue-500 to-indigo-500",
          "from-indigo-500 to-purple-500",
          "from-red-500 to-orange-500",
        ];

        const badges = [
          "Hot",
          "Trending",
          "Limited",
          "Popular",
          "Bestseller",
          "New",
          "Exclusive",
          "Iconic",
        ];
        const categories = [
          "Running",
          "Lifestyle",
          "Basketball",
          "Skate",
          "Classics",
          "Sports",
          "Casual",
          "Athletic",
        ];
        const locations = [
          "Global",
          "USA",
          "Europe",
          "Asia",
          "Worldwide",
          "Americas",
          "EMEA",
          "APAC",
        ];

        // Random stats for UI 
        const views = Math.floor(Math.random() * 20000) + 5000;
        const sold = Math.floor(Math.random() * 5000) + 1000;
        const trend = Math.floor(Math.random() * 40) + 10;
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        const reviews = Math.floor(Math.random() * 9000) + 1000;

        const realStock = p.totalStock || p.stock || 0;

        return {
          id: p._id || index,
          _id: p._id || index,
          name: p.name || "Premium Sneaker",
          brand: p.brand || "Top Brand",
          price:
            p.sellPrice ||
            p.currentPrice ||
            Math.floor(Math.random() * 200) + 50,
          originalPrice:
            p.currentPrice ||
            (p.sellPrice
              ? p.sellPrice * 1.3
              : Math.floor(Math.random() * 250) + 80),
          rating: p.rating || rating,
          reviews: p.reviews || reviews,
          image:
            p.images && p.images[0]
              ? typeof p.images[0] === "string"
                ? p.images[0]
                : p.images[0].url
              : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
          hoverImage:
            p.images && p.images[1]
              ? typeof p.images[1] === "string"
                ? p.images[1]
                : p.images[1].url
              : p.images && p.images[0]
                ? typeof p.images[0] === "string"
                  ? p.images[0]
                  : p.images[0].url
                : "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop",
          views: views.toLocaleString(),
          trend: `+${trend}%`,
          badge: badges[index % badges.length],
          badgeColor: badgeColors[index % badgeColors.length],
          category: p.category || categories[index % categories.length],
          color: colors[index % colors.length],
          sold: sold,
          stock: realStock,
          location: locations[index % locations.length],
          timeLeft: `${Math.floor(Math.random() * 5) + 1} days`,
          features: [
            p.features && p.features[0] ? p.features[0] : "Premium",
            p.features && p.features[1] ? p.features[1] : "Comfort",
            p.features && p.features[2] ? p.features[2] : "Style",
          ].filter(Boolean),
        };
      });

      console.log(
        "Trending items with REAL stock:",
        generatedItems.map((i) => ({
          name: i.name,
          stock: i.stock,
        })),
      );

      setTrendingItems(generatedItems);
    }
  }, [products]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || trendingItems.length === 0) return;
    const getItemsPerPage = () => {
      if (windowWidth < 640) return 1;
      if (windowWidth < 1024) return 2;
      return 4;
    };
    const itemsPerPage = getItemsPerPage();
    const pageCount = Math.ceil(getFilteredItems().length / itemsPerPage);

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pageCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, windowWidth, trendingItems, activeTab]);

  const handleProductClick = (item, e) => {
    if (
      e.target.closest(".add-to-cart-btn") ||
      e.target.closest(".cart-button")
    ) {
      return;
    }
    navigate(`/product/${item.id}`);
  };

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Adding from TrendingNow with stock:", item.stock);

    addToCart({
      _id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      quantity: 1,
      stock: item.stock, 
      totalStock: item.stock,
    });

    setAddedToCart((prev) => ({ ...prev, [item.id]: true }));
    toast.success("Added to cart!");

    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const tabs = [
    { id: "trending", label: "Trending Now", icon: FiTrendingUp },
    { id: "popular", label: "Most Popular", icon: FiUsers },
    { id: "rising", label: "Rising Stars", icon: FiBarChart2 },
    { id: "limited", label: "Limited Stock", icon: FiClock },
  ];

  const getFilteredItems = () => {
    if (trendingItems.length === 0) return [];

    switch (activeTab) {
      case "popular":
        return [...trendingItems].sort(
          (a, b) =>
            parseInt(b.views.replace(/,/g, "")) -
            parseInt(a.views.replace(/,/g, "")),
        );
      case "rising":
        return [...trendingItems].sort(
          (a, b) => parseInt(b.trend) - parseInt(a.trend),
        );
      case "limited":
        return trendingItems.filter((item) => item.stock < 30);
      default:
        return trendingItems;
    }
  };

  const filteredItems = getFilteredItems();

  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 4;
  };

  const itemsPerPage = getItemsPerPage();
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <section
      ref={ref}
      className="relative py-16 xs:py-20 sm:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
            color: "rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-r from-primary-500/20 to-accent/20 dark:from-primary-500/30 dark:to-accent/30 rounded-full blur-3xl hidden lg:block"
      />
      <motion.div
        animate={{
          x: [0, -200, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-40 xs:w-56 sm:w-72 md:w-80 h-40 xs:h-56 sm:h-72 md:h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl hidden lg:block"
      />

      {/* Parallax Floating Icons */}
      <motion.div
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="absolute inset-0 pointer-events-none hidden md:block"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl md:text-4xl text-white/10 dark:text-white/15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          >
            {i % 2 === 0 ? "👟" : "🔥"}
          </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 px-2 xs:px-3 sm:px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 xs:mb-10 sm:mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-full text-white mb-4 xs:mb-5 sm:mb-6 shadow-xl border border-primary-400 dark:border-primary-600"
          >
            <FiTrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
              TRENDING NOW
            </span>
            <FiTrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </motion.div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 xs:mb-3 sm:mb-4 px-2">
            What's{" "}
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 dark:from-primary-400 dark:via-accent dark:to-pink-400 bg-clip-text text-transparent">
              Hot
            </span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Most popular sneakers right now, updated in real-time based on user
            activity
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 xs:gap-2.5 sm:gap-3 mb-8 xs:mb-10 sm:mb-12 px-2"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(0);
                }}
                className={`relative px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTrendingTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1 xs:gap-1.5">
                  <Icon size={12} xs:size={14} sm:size={16} />
                  <span className="hidden xs:inline">{tab.label}</span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Trending Grid */}
        {filteredItems.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentPage}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6"
            >
              {displayedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  onClick={(e) => handleProductClick(item, e)}
                  className="group relative w-full cursor-pointer"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl xs:rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                    {/* Image Container */}
                    <div className="relative h-40 xs:h-44 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={hoveredItem === item.id ? "hover" : "default"}
                          src={
                            hoveredItem === item.id && item.hoverImage
                              ? item.hoverImage
                              : item.image
                          }
                          alt={item.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Badge */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4"
                      >
                        <div className="relative">
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${item.badgeColor} rounded-full blur-md animate-pulse opacity-80`}
                          />
                          <div
                            className={`relative flex items-center gap-0.5 xs:gap-1 px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 bg-gradient-to-r ${item.badgeColor} text-white text-[8px] xs:text-[9px] sm:text-xs font-bold rounded-full shadow-lg border border-white/30`}
                          >
                            <FiZap
                              size={10}
                              className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3"
                            />
                            {item.badge}
                          </div>
                        </div>
                      </motion.div>

                      {/* Views Count */}
                      <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-xs flex items-center gap-0.5 xs:gap-1 border border-white/20">
                        <FiEye
                          size={10}
                          className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3"
                        />
                        {item.views}
                      </div>

                      {/* Category Tag */}
                      <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-2 xs:left-3 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-xs border border-white/20">
                        {item.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-2 xs:p-3 sm:p-4 md:p-5">
                      
                      {/* Brand and Rating */}
                      <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
                        <span className="text-[8px] xs:text-[9px] sm:text-xs font-bold text-primary-700 dark:text-primary-400">
                          {item.brand}
                        </span>
                        <div className="flex items-center gap-0.5 xs:gap-1">
                          <FiStar className="text-yellow-500 fill-current w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                          <span className="text-[8px] xs:text-[9px] sm:text-xs font-bold text-gray-800 dark:text-gray-200">
                            {item.rating}
                          </span>
                          <span className="text-[6px] xs:text-[7px] sm:text-[8px] text-gray-500 dark:text-gray-400">
                            ({item.reviews})
                          </span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-xs xs:text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 xs:mb-1.5 sm:mb-2 line-clamp-1">
                        {item.name}
                      </h3>

                      {/* Features */}
                      <div className="flex flex-wrap gap-0.5 xs:gap-1 mb-2 xs:mb-2.5 sm:mb-3">
                        {item.features.slice(0, 2).map((feature, i) => (
                          <span
                            key={i}
                            className="text-[6px] xs:text-[7px] sm:text-[8px] px-1 xs:px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full border border-gray-300 dark:border-gray-600"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price and Trend */}
                      <div className="flex items-center justify-between mb-2 xs:mb-2.5 sm:mb-3">
                        <div className="flex items-baseline gap-0.5 xs:gap-1 sm:gap-2">
                          <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-[8px] xs:text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 xs:gap-1 text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full border border-green-300 dark:border-green-700">
                          <FiTrendingUp
                            size={10}
                            className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3"
                          />
                          <span className="text-[6px] xs:text-[7px] sm:text-[8px] font-bold">
                            {item.trend}
                          </span>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-1 xs:gap-1.5 text-[6px] xs:text-[7px] sm:text-[8px] font-medium text-gray-700 dark:text-gray-300 mb-2 xs:mb-2.5 sm:mb-3">
                        <div className="flex items-center gap-0.5 xs:gap-1">
                          <FiUsers
                            size={8}
                            className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5"
                          />
                          <span className="truncate">{item.sold} sold</span>
                        </div>
                        <div className="flex items-center gap-0.5 xs:gap-1">
                          <FiMapPin
                            size={8}
                            className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5"
                          />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-0.5 xs:gap-1">
                          <FiClock
                            size={8}
                            className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5"
                          />
                          <span className="truncate">{item.timeLeft}</span>
                        </div>
                      </div>

                      {/* Progress Bar - Stock Level with REAL stock */}
                      <div className="mb-2 xs:mb-2.5 sm:mb-3">
                        <div className="flex justify-between text-[6px] xs:text-[7px] sm:text-[8px] mb-0.5 xs:mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Stock
                          </span>
                          <span
                            className={`font-bold ${
                              item.stock < 20
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {item.stock} left
                          </span>
                        </div>
                        <div className="h-1 xs:h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (item.stock / 100) * 100)}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              item.stock < 20 ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="cart-button add-to-cart-btn w-full bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-lg xs:rounded-lg sm:rounded-xl font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-2 group/btn border border-primary-400 dark:border-primary-600"
                      >
                        {addedToCart[item.id] ? (
                          <>
                            <FiCheck className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                            Added!
                          </>
                        ) : (
                          <>
                            <FiShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:rotate-12 transition-transform" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    {/* Hover Stats Card */}
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-xs whitespace-nowrap shadow-xl hidden md:block border border-white/20"
                        >
                          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                            <span className="flex items-center gap-0.5 xs:gap-1">
                              <FiEye
                                size={10}
                                className="w-2 h-2 xs:w-2.5 xs:h-2.5"
                              />{" "}
                              {item.views}
                            </span>
                            <span className="flex items-center gap-0.5 xs:gap-1">
                              <FiHeart
                                size={10}
                                className="w-2 h-2 xs:w-2.5 xs:h-2.5"
                              />{" "}
                              {Math.floor(item.reviews / 2)}
                            </span>
                            <span className="flex items-center gap-0.5 xs:gap-1">
                              <FiShoppingBag
                                size={10}
                                className="w-2 h-2 xs:w-2.5 xs:h-2.5"
                              />{" "}
                              {item.sold}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 dark:bg-gray-950 rotate-45 border-r border-b border-white/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 mt-8 xs:mt-10 sm:mt-12"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft
                size={16}
                className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200"
              />
            </button>

            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full font-bold text-[10px] xs:text-xs sm:text-sm transition-all ${
                    currentPage === i
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      : "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
              }
              disabled={currentPage === pageCount - 1}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight
                size={16}
                className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200"
              />
            </button>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-1 xs:ml-2 sm:ml-3 md:ml-4 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            >
              {isAutoPlaying ? (
                <FiPause
                  size={14}
                  className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-800 dark:text-gray-200"
                />
              ) : (
                <FiPlay
                  size={14}
                  className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ml-0.5 xs:ml-1 text-gray-800 dark:text-gray-200"
                />
              )}
            </button>
          </motion.div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 xs:mt-10 sm:mt-12"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-full blur-lg xs:blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl border border-primary-400 dark:border-primary-600">
                View All Products
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-sm xs:text-base sm:text-lg md:text-xl"
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Real-time Update Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 mt-4 xs:mt-5 sm:mt-6 md:mt-8 text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <span className="relative flex h-1.5 w-1.5 xs:h-2 xs:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 xs:h-2 xs:w-2 bg-green-500"></span>
          </span>
          <span>Live updates • Based on real products</span>
          <FiCalendar
            size={12}
            className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5"
          />
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingNow;
