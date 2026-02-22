import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  FiPause
} from 'react-icons/fi';

const TrendingNow = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % Math.ceil(trendingItems.length / 4));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const trendingItems = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      price: 150,
      originalPrice: 200,
      rating: 4.8,
      reviews: 1234,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '12.5K',
      trend: '+25%',
      badge: 'Hot',
      badgeColor: 'from-red-500 to-orange-500',
      category: 'Running',
      color: 'from-blue-500 to-cyan-500',
      sold: 1234,
      stock: 45,
      location: 'Global',
      timeLeft: '2 days',
      features: ['Popular', 'Trending', 'Bestseller']
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      price: 180,
      originalPrice: 240,
      rating: 4.9,
      reviews: 2345,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '10.2K',
      trend: '+18%',
      badge: 'Trending',
      badgeColor: 'from-green-500 to-emerald-500',
      category: 'Running',
      color: 'from-green-500 to-teal-500',
      sold: 2345,
      stock: 32,
      location: 'Europe',
      timeLeft: '3 days',
      features: ['New', 'Popular', 'Limited']
    },
    {
      id: 3,
      name: 'Jordan Retro 4',
      brand: 'Jordan',
      price: 210,
      originalPrice: 280,
      rating: 5.0,
      reviews: 3456,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '8.7K',
      trend: '+32%',
      badge: 'Limited',
      badgeColor: 'from-purple-500 to-pink-500',
      category: 'Basketball',
      color: 'from-purple-500 to-pink-500',
      sold: 3456,
      stock: 12,
      location: 'USA',
      timeLeft: '1 day',
      features: ['Exclusive', 'Rare', 'Collector']
    },
    {
      id: 4,
      name: 'New Balance 990v5',
      brand: 'New Balance',
      price: 175,
      originalPrice: 230,
      rating: 4.7,
      reviews: 4567,
      image: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '7.3K',
      trend: '+15%',
      badge: 'Classic',
      badgeColor: 'from-yellow-500 to-orange-500',
      category: 'Lifestyle',
      color: 'from-yellow-500 to-amber-500',
      sold: 4567,
      stock: 28,
      location: 'Asia',
      timeLeft: '4 days',
      features: ['Heritage', 'Comfort', 'Quality']
    },
    {
      id: 5,
      name: 'Puma RS-X',
      brand: 'Puma',
      price: 120,
      originalPrice: 160,
      rating: 4.6,
      reviews: 5678,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '6.8K',
      trend: '+22%',
      badge: 'Trending',
      badgeColor: 'from-pink-500 to-rose-500',
      category: 'Lifestyle',
      color: 'from-pink-500 to-rose-500',
      sold: 5678,
      stock: 56,
      location: 'Europe',
      timeLeft: '5 days',
      features: ['Bold', 'Street', 'Modern']
    },
    {
      id: 6,
      name: 'Reebok Classics',
      brand: 'Reebok',
      price: 85,
      originalPrice: 110,
      rating: 4.5,
      reviews: 6789,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '5.9K',
      trend: '+12%',
      badge: 'Value',
      badgeColor: 'from-blue-500 to-indigo-500',
      category: 'Classics',
      color: 'from-blue-500 to-indigo-500',
      sold: 6789,
      stock: 89,
      location: 'Global',
      timeLeft: '6 days',
      features: ['Affordable', 'Iconic', 'Timeless']
    },
    {
      id: 7,
      name: 'Vans Old Skool',
      brand: 'Vans',
      price: 75,
      originalPrice: 95,
      rating: 4.7,
      reviews: 7890,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '7.1K',
      trend: '+19%',
      badge: 'Popular',
      badgeColor: 'from-indigo-500 to-purple-500',
      category: 'Skate',
      color: 'from-indigo-500 to-purple-500',
      sold: 7890,
      stock: 67,
      location: 'USA',
      timeLeft: '3 days',
      features: ['Skate', 'Street', 'Classic']
    },
    {
      id: 8,
      name: 'Converse Chuck Taylor',
      brand: 'Converse',
      price: 65,
      originalPrice: 85,
      rating: 4.8,
      reviews: 8901,
      image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      views: '8.2K',
      trend: '+16%',
      badge: 'Iconic',
      badgeColor: 'from-red-500 to-orange-500',
      category: 'Classics',
      color: 'from-red-500 to-orange-500',
      sold: 8901,
      stock: 78,
      location: 'Global',
      timeLeft: '4 days',
      features: ['Iconic', 'Versatile', 'Timeless']
    }
  ];

  const tabs = [
    { id: 'trending', label: 'Trending Now', icon: FiTrendingUp },
    { id: 'popular', label: 'Most Popular', icon: FiUsers },
    { id: 'rising', label: 'Rising Stars', icon: FiBarChart2 },
    { id: 'limited', label: 'Limited Stock', icon: FiClock }
  ];

  const getFilteredItems = () => {
    switch(activeTab) {
      case 'popular':
        return trendingItems.sort((a, b) => b.views - a.views);
      case 'rising':
        return trendingItems.sort((a, b) => parseInt(b.trend) - parseInt(a.trend));
      case 'limited':
        return trendingItems.filter(item => item.stock < 30);
      default:
        return trendingItems;
    }
  };

  const filteredItems = getFilteredItems();
  const itemsPerPage = 4;
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
          color: 'rgba(0,0,0,0.03)'
        }} />
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary-600/10 to-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -200, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
      />

      {/* Parallax Floating Icons */}
      <motion.div
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl text-white/5"
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
            {i % 2 === 0 ? '👟' : '🔥'}
          </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent rounded-full text-white mb-6 shadow-xl"
          >
            <FiTrendingUp className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">TRENDING NOW</span>
            <FiTrendingUp className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-4">
            What's{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 bg-clip-text text-transparent">
              Hot
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Most popular sneakers right now, updated in real-time based on user activity
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
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
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTrendingTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} />
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Trending Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${currentPage}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className="group relative"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={hoveredItem === item.id ? 'hover' : 'default'}
                        src={hoveredItem === item.id && item.hoverImage ? item.hoverImage : item.image}
                        alt={item.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute top-4 left-4"
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.badgeColor} rounded-full blur-md animate-pulse`} />
                        <div className={`relative flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${item.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                          <FiZap size={12} />
                          {item.badge}
                        </div>
                      </div>
                    </motion.div>

                    {/* Views Count */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                      <FiEye size={12} />
                      {item.views}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
                      {item.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Brand and Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {item.brand}
                      </span>
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 fill-current" size={12} />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.rating}</span>
                        <span className="text-xs text-gray-400">({item.reviews})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price and Trend */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        <FiTrendingUp size={12} />
                        <span className="text-xs font-semibold">{item.trend}</span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <FiUsers size={12} />
                        <span>{item.sold} sold</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={12} />
                        <span>{item.timeLeft}</span>
                      </div>
                    </div>

                    {/* Progress Bar - Stock Level */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Stock</span>
                        <span className={`font-semibold ${
                          item.stock < 20 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {item.stock} left
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.stock / 100) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            item.stock < 20 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-3 rounded-xl font-semibold text-sm hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      <FiShoppingBag className="group-hover/btn:rotate-12 transition-transform" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Hover Stats Card */}
                  <AnimatePresence>
                    {hoveredItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <FiEye size={12} /> {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiHeart size={12} /> {Math.floor(item.reviews / 2)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiShoppingBag size={12} /> {item.sold}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(pageCount)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-full font-medium transition-all ${
                    currentPage === i
                      ? 'bg-gradient-to-r from-primary-600 to-accent text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
              disabled={currentPage === pageCount - 1}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={20} />
            </button>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-4 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} className="ml-1" />}
            </button>
          </motion.div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/trending">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-8 py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <span className="relative flex items-center gap-3 bg-gradient-to-r from-primary-600 to-accent text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl">
                View All Trending
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
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
          className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Live updates • Based on real user activity</span>
          <FiCalendar size={14} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingNow;