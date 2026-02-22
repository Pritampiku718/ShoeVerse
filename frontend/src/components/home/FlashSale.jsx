import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiClock, 
  FiShoppingBag, 
  FiZap, 
  FiTrendingUp,
  FiAlertCircle,
  FiGift,
  FiStar,
  FiChevronRight
} from 'react-icons/fi';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [saleEnds] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(23, 59, 59);
    return date;
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = saleEnds.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [saleEnds]);

  // Auto-rotate slides
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % saleItems.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  const saleItems = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      price: 150,
      originalPrice: 200,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      sold: 45,
      totalStock: 60,
      rating: 4.8,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      price: 180,
      originalPrice: 240,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      sold: 32,
      totalStock: 50,
      rating: 4.9,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      name: 'Jordan Retro 4',
      brand: 'Jordan',
      price: 210,
      originalPrice: 280,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      sold: 28,
      totalStock: 40,
      rating: 5.0,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      name: 'New Balance 990v5',
      brand: 'New Balance',
      price: 175,
      originalPrice: 230,
      discount: 24,
      image: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      sold: 19,
      totalStock: 35,
      rating: 4.7,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: '📅' },
    { label: 'Hours', value: timeLeft.hours, icon: '⏰' },
    { label: 'Minutes', value: timeLeft.minutes, icon: '⏱️' },
    { label: 'Seconds', value: timeLeft.seconds, icon: '⚡' }
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-40 text-white/10 text-8xl hidden lg:block"
      >
        ⚡
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-40 left-40 text-white/10 text-8xl hidden lg:block"
      >
        🏷️
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Premium Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white mb-6 shadow-xl"
          >
            <FiZap className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">FLASH SALE</span>
            <FiZap className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            Limited Time{' '}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Offers
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Up to <span className="text-2xl font-bold text-yellow-400">25% OFF</span> on premium sneakers. 
            Hurry, these deals won't last long!
          </p>
        </motion.div>

        {/* Premium Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiClock className="text-3xl text-red-500" />
            <span className="text-xl text-white/80">Sale ends in:</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                className="relative"
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                />
                
                {/* Timer Card */}
                <div className="relative bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-w-[100px] text-center overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                  />
                  
                  <span className="text-4xl md:text-5xl font-black text-white mb-1 block">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center justify-center gap-1">
                    <span>{unit.icon}</span>
                    {unit.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sale Items Carousel */}
        <div className="relative">
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {saleItems.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === index 
                    ? 'w-12 bg-gradient-to-r from-red-500 to-orange-500' 
                    : 'w-4 bg-white/30 hover:bg-white/50'
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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {saleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
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
                      className="absolute top-4 right-4"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md animate-pulse" />
                        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl">
                          -{item.discount}%
                        </div>
                      </div>
                    </motion.div>

                    {/* Rating */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <FiStar className="text-yellow-400 fill-current" size={14} />
                      <span className="text-white text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-primary-400">
                        {item.brand}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiTrendingUp />
                        {item.sold} sold
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Sold</span>
                        <span className="text-white font-semibold">
                          {item.sold}/{item.totalStock}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.sold / item.totalStock) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 1 }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">
                            ${item.price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${item.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <FiZap size={12} />
                          Save ${item.originalPrice - item.price}
                        </p>
                      </div>

                      <Link to={`/product/${item.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group/btn"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-full blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                          <span className="relative flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent text-white px-5 py-2.5 rounded-full font-semibold">
                            Shop Now
                            <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </motion.button>
                      </Link>
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-500/30 rounded-tl-3xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-500/30 rounded-br-3xl" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/sale">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <span className="relative flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl">
                <FiGift size={20} />
                View All Flash Deals
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>

          <p className="text-gray-400 text-sm mt-4 flex items-center justify-center gap-2">
            <FiAlertCircle className="text-yellow-500" />
            Limited stock available. Prices shown reflect discount.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSale;