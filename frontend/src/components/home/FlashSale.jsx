import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiShoppingBag,
  FiZap,
  FiTrendingUp,
  FiAlertCircle,
  FiGift,
  FiStar,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { useProductStore } from "../../store/productStore";

const FlashSale = () => {
  const { products, fetchProducts } = useProductStore();
  const [saleItems, setSaleItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [saleEnds] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(23, 59, 59);
    return date;
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products with discount
  useEffect(() => {
    if (products && products.length > 0) {
      
      // Get products that have discount or create flash sale items
      const discountedProducts = products
        .filter((p) => p.discount && p.discount > 0)
        .slice(0, 4)
        .map((p, index) => {
          const colors = [
            "from-blue-500 to-cyan-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
            "from-purple-500 to-pink-500",
          ];

          const discount = p.discount || 25;
          const originalPrice = p.sellPrice || p.currentPrice || 100;
          const price = originalPrice * (1 - discount / 100);

          return {
            id: p._id,
            name: p.name,
            brand: p.brand || "Premium Brand",
            price: Math.round(price),
            originalPrice: originalPrice,
            discount: discount,
            image:
              p.images && p.images[0]
                ? p.images[0]
                : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
            sold: p.soldCount || Math.floor(Math.random() * 40) + 10,
            totalStock: p.totalStock || 50,
            rating: p.rating || (Math.random() * 1 + 4).toFixed(1),
            color: colors[index % colors.length],
          };
        });

      // If no discounted products, create flash sale items from first 4 products
      if (discountedProducts.length === 0) {
        const fallbackItems = products.slice(0, 4).map((p, index) => {
          const colors = [
            "from-blue-500 to-cyan-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
            "from-purple-500 to-pink-500",
          ];

          const discount = 25;
          const originalPrice = p.sellPrice || p.currentPrice || 100;
          const price = originalPrice * (1 - discount / 100);

          return {
            id: p._id,
            name: p.name,
            brand: p.brand || "Premium Brand",
            price: Math.round(price),
            originalPrice: originalPrice,
            discount: discount,
            image:
              p.images && p.images[0]
                ? p.images[0]
                : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
            sold: p.soldCount || Math.floor(Math.random() * 40) + 10,
            totalStock: p.totalStock || 50,
            rating: p.rating || (Math.random() * 1 + 4).toFixed(1),
            color: colors[index % colors.length],
          };
        });
        setSaleItems(fallbackItems);
      } else {
        setSaleItems(discountedProducts);
      }
    }
  }, [products]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = saleEnds.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [saleEnds]);

  // Auto-rotate slides
  useEffect(() => {
    if (saleItems.length > 0) {
      const slideTimer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % saleItems.length);
      }, 4000);
      return () => clearInterval(slideTimer);
    }
  }, [saleItems]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, icon: "📅" },
    { label: "Hours", value: timeLeft.hours, icon: "⏰" },
    { label: "Minutes", value: timeLeft.minutes, icon: "⏱️" },
    { label: "Seconds", value: timeLeft.seconds, icon: "⚡" },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % saleItems.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + saleItems.length) % saleItems.length);
  };

  return (
    <section className="relative py-16 xs:py-20 sm:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10 dark:opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-r from-red-500/30 to-orange-500/30 dark:from-red-500/40 dark:to-orange-500/40 rounded-full blur-3xl hidden md:block"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 dark:from-purple-500/40 dark:to-pink-500/40 rounded-full blur-3xl hidden md:block"
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-40 text-white/15 dark:text-white/20 text-6xl md:text-7xl lg:text-8xl hidden lg:block"
      >
        ⚡
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-40 left-40 text-white/15 dark:text-white/20 text-6xl md:text-7xl lg:text-8xl hidden lg:block"
      >
        🏷️
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white mb-4 xs:mb-5 sm:mb-6 shadow-xl border border-white/20"
          >
            <FiZap className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
              FLASH SALE
            </span>
            <FiZap className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </motion.div>

          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 xs:mb-3 sm:mb-4">
            Limited Time{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Offers
            </span>
          </h2>

          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Up to{" "}
            <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">
              25% OFF
            </span>{" "}
            on premium sneakers. Hurry, these deals won't last long!
          </p>
        </motion.div>

        {/* Premium Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center mb-12 xs:mb-14 sm:mb-16"
        >
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-4 xs:mb-5 sm:mb-6">
            <FiClock className="text-xl xs:text-2xl sm:text-3xl text-red-500" />
            <span className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 dark:text-gray-300">
              Sale ends in:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="relative"
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl xs:rounded-xl sm:rounded-2xl blur-md xs:blur-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: index * 0.5,
                  }}
                />

                {/* Timer Card */}
                <div className="relative bg-gray-800/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-white/20 rounded-xl xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 min-w-[70px] xs:min-w-[80px] sm:min-w-[90px] md:min-w-[100px] text-center overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: index * 0.3,
                    }}
                  />

                  <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-0.5 xs:mb-1 block">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm text-gray-400 dark:text-gray-400 flex items-center justify-center gap-0.5 xs:gap-1">
                    <span className="text-xs xs:text-sm">{unit.icon}</span>
                    {unit.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sale Items Carousel */}
        {saleItems.length > 0 && (
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors hidden md:block border border-white/20"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors hidden md:block border border-white/20"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-1.5 xs:gap-2 mb-6 xs:mb-7 sm:mb-8">
              {saleItems.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1 xs:h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 xs:w-10 sm:w-12 bg-gradient-to-r from-red-500 to-orange-500"
                      : "w-2 xs:w-3 sm:w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Items Grid with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6"
              >
                {saleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-gray-800/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl xs:rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-500"
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                    />

                    {/* Image Container */}
                    <div className="relative h-48 xs:h-52 sm:h-56 md:h-60 lg:h-64 overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                      {/* Discount Badge */}
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md animate-pulse opacity-80" />
                          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full font-bold text-xs xs:text-sm sm:text-base shadow-xl border border-white/30">
                            -{item.discount}%
                          </div>
                        </div>
                      </motion.div>

                      {/* Rating */}
                      <div className="absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4 flex items-center gap-0.5 xs:gap-1 bg-black/70 backdrop-blur-sm px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 rounded-full border border-white/20">
                        <FiStar className="text-yellow-400 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="text-white text-[10px] xs:text-xs sm:text-sm font-medium">
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 xs:p-4 sm:p-5 md:p-6">
                      <div className="flex items-center justify-between mb-2 xs:mb-2.5">
                        <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-primary-400 dark:text-primary-400">
                          {item.brand}
                        </span>
                        <span className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 dark:text-gray-400 flex items-center gap-0.5 xs:gap-1">
                          <FiTrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                          {item.sold} sold
                        </span>
                      </div>

                      <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 group-hover:text-primary-400 transition-colors">
                        {item.name}
                      </h3>

                      {/* Progress Bar */}
                      <div className="mb-3 xs:mb-4">
                        <div className="flex justify-between text-[8px] xs:text-[9px] sm:text-xs mb-0.5 xs:mb-1">
                          <span className="text-gray-400 dark:text-gray-400">
                            Sold
                          </span>
                          <span className="text-white font-semibold">
                            {item.sold}/{item.totalStock}
                          </span>
                        </div>
                        <div className="h-1 xs:h-1.5 sm:h-2 bg-gray-700 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${(item.sold / item.totalStock) * 100}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3">
                        <div>
                          <div className="flex items-baseline gap-1 xs:gap-1.5 sm:gap-2">
                            <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white">
                              ${item.price}
                            </span>
                            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400 dark:text-gray-400 line-through">
                              ${item.originalPrice}
                            </span>
                          </div>
                          <p className="text-[8px] xs:text-[9px] sm:text-xs text-green-400 dark:text-green-400 mt-0.5 xs:mt-1 flex items-center gap-0.5 xs:gap-1">
                            <FiZap
                              size={10}
                              className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3"
                            />
                            Save ${item.originalPrice - item.price}
                          </p>
                        </div>

                        <Link to={`/product/${item.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group/btn w-full xs:w-auto"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-full blur-md opacity-0 group-hover/btn:opacity-60 transition-opacity" />
                            <span className="relative flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 bg-gradient-to-r from-primary-600 to-accent text-white px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full font-semibold text-[10px] xs:text-xs sm:text-sm border border-white/20">
                              Shop Now
                              <FiChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          </motion.button>
                        </Link>
                      </div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 xs:w-10 xs:h-10 border-t-2 border-l-2 border-primary-500/40 rounded-tl-3xl hidden sm:block" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 xs:w-10 xs:h-10 border-b-2 border-r-2 border-primary-500/40 rounded-br-3xl hidden sm:block" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 xs:mt-14 sm:mt-16"
        >
          <Link to="/products?sort=discount">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg xs:blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-1.5 xs:gap-2 sm:gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl border border-white/20">
                <FiGift
                  size={14}
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
                View All Flash Deals
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

          <p className="text-gray-400 dark:text-gray-400 text-[8px] xs:text-[9px] sm:text-xs md:text-sm mt-3 xs:mt-3.5 sm:mt-4 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
            <FiAlertCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
            Limited stock available. Prices shown reflect discount.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSale;
