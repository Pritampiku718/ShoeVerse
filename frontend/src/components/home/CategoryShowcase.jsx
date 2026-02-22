import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiTrendingUp, 
  FiStar, 
  FiClock,
  FiShoppingBag,
  FiHeart,
  FiEye,
  FiZap
} from 'react-icons/fi';

const CategoryShowcase = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = [
    {
      id: 1,
      name: "Men's Collection",
      description: 'Streetwear essentials for the modern man',
      longDescription: 'From classic silhouettes to cutting-edge designs, discover sneakers that define your style.',
      image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '124 Products',
      color: 'from-blue-600 to-purple-600',
      accentColor: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: '👟',
      trend: '+25%',
      featured: ['Air Max', 'Ultraboost', 'Retro'],
      link: '/category/men'
    },
    {
      id: 2,
      name: "Women's Collection",
      description: 'Trendsetting kicks for every occasion',
      longDescription: 'Elevate your style with our curated selection of women\'s sneakers from top brands.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '98 Products',
      color: 'from-pink-600 to-purple-600',
      accentColor: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      icon: '👠',
      trend: '+32%',
      featured: ['Platform', 'Running', 'Lifestyle'],
      link: '/category/women'
    },
    {
      id: 3,
      name: "Kids' Collection",
      description: 'Mini sneakerheads in the making',
      longDescription: 'Comfortable, durable, and stylish sneakers for your little ones. Built to last through every adventure.',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '56 Products',
      color: 'from-green-600 to-teal-600',
      accentColor: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: '🧸',
      trend: '+18%',
      featured: ['School', 'Sports', 'Casual'],
      link: '/category/kids'
    },
    {
      id: 4,
      name: 'Limited Edition',
      description: 'Exclusive drops you won\'t find elsewhere',
      longDescription: 'Be among the first to own these rare and exclusive collaborations. Limited quantities available.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1412&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '23 Products',
      color: 'from-orange-600 to-red-600',
      accentColor: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      icon: '✨',
      badge: 'HOT',
      trend: '+45%',
      featured: ['Collaborations', 'Anniversary', 'Special'],
      link: '/category/limited'
    },
    {
      id: 5,
      name: 'Sports Performance',
      description: 'Engineered for peak performance',
      longDescription: 'Advanced technology meets athletic design. Sneakers built to enhance your game.',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '87 Products',
      color: 'from-cyan-600 to-blue-600',
      accentColor: 'bg-cyan-500',
      lightColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
      icon: '⚡',
      trend: '+15%',
      featured: ['Running', 'Training', 'Basketball'],
      link: '/category/sports'
    },
    {
      id: 6,
      name: 'Classic Collection',
      description: 'Timeless designs that never go out of style',
      longDescription: 'Iconic silhouettes that have stood the test of time. The foundation of every sneaker collection.',
      image: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      hoverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      count: '112 Products',
      color: 'from-amber-600 to-yellow-600',
      accentColor: 'bg-amber-500',
      lightColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      icon: '⭐',
      trend: '+12%',
      featured: ['Vintage', 'Retro', 'Originals'],
      link: '/category/classic'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Collections', icon: FiStar },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'new', label: 'New Arrivals', icon: FiClock },
    { id: 'limited', label: 'Limited', icon: FiZap }
  ];

  const filteredCategories = activeFilter === 'all' 
    ? categories 
    : activeFilter === 'trending'
      ? categories.filter(c => parseInt(c.trend) > 20)
      : activeFilter === 'new'
        ? categories.slice(0, 4)
        : categories.filter(c => c.badge);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

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

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary-600/10 to-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
      />

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
            <FiShoppingBag className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">SHOP BY CATEGORY</span>
            <FiShoppingBag className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-4">
            Explore Our{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 bg-clip-text text-transparent">
              Collections
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the perfect pair from our carefully curated categories
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} />
                  {filter.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
              className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Background Image with Parallax */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: hoveredCategory === category.id ? 1.1 : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hoveredCategory === category.id ? 'hover' : 'default'}
                    src={hoveredCategory === category.id ? category.hoverImage : category.image}
                    alt={category.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </motion.div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                hoveredCategory === category.id 
                  ? 'from-black/95 via-black/60 to-black/30'
                  : 'from-black/80 via-black/40 to-transparent'
              } transition-all duration-500`} />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                {/* Badge */}
                {category.badge && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-6 left-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md animate-pulse" />
                      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                        <FiZap className="animate-pulse" />
                        {category.badge}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    y: hoveredCategory === category.id ? -10 : 0,
                    scale: hoveredCategory === category.id ? 1.1 : 1,
                  }}
                  className="text-6xl mb-4"
                >
                  {category.icon}
                </motion.div>

                {/* Category Name */}
                <motion.h3
                  animate={{
                    y: hoveredCategory === category.id ? -5 : 0,
                  }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {category.name}
                </motion.h3>

                {/* Description */}
                <motion.p
                  animate={{
                    opacity: hoveredCategory === category.id ? 1 : 0.8,
                    y: hoveredCategory === category.id ? -5 : 0,
                  }}
                  className="text-white/80 mb-4 line-clamp-2"
                >
                  {hoveredCategory === category.id ? category.longDescription : category.description}
                </motion.p>

                {/* Stats Row */}
                <motion.div
                  animate={{
                    opacity: hoveredCategory === category.id ? 1 : 0.7,
                  }}
                  className="flex items-center gap-4 mb-4"
                >
                  <span className="text-white/60 text-sm flex items-center gap-1">
                    <FiShoppingBag size={14} />
                    {category.count}
                  </span>
                  <span className="text-white/60 text-sm flex items-center gap-1">
                    <FiTrendingUp size={14} className="text-green-400" />
                    {category.trend}
                  </span>
                </motion.div>

                {/* Featured Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredCategory === category.id ? 1 : 0,
                    y: hoveredCategory === category.id ? 0 : 20,
                  }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {category.featured.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 ${category.lightColor} ${category.textColor} text-xs rounded-full font-medium`}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Shop Link */}
                <Link to={category.link}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-white font-semibold group"
                  >
                    <span>Shop Now</span>
                    <motion.span
                      animate={{ x: hoveredCategory === category.id ? [0, 5, 0] : 0 }}
                      transition={{ repeat: hoveredCategory === category.id ? Infinity : 0, duration: 1 }}
                    >
                      <FiArrowRight />
                    </motion.span>
                  </motion.div>
                </Link>
              </div>

              {/* Corner Accents */}
              <motion.div
                animate={{
                  opacity: hoveredCategory === category.id ? 1 : 0,
                  scale: hoveredCategory === category.id ? 1 : 0.8,
                }}
                className={`absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 ${category.accentColor} rounded-tl-3xl`}
              />
              <motion.div
                animate={{
                  opacity: hoveredCategory === category.id ? 1 : 0,
                  scale: hoveredCategory === category.id ? 1 : 0.8,
                }}
                className={`absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 ${category.accentColor} rounded-br-3xl`}
              />

              {/* Hover Stats Card */}
              <AnimatePresence>
                {hoveredCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <FiHeart className="text-pink-500" />
                        <span className="text-white text-sm">234</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiEye className="text-blue-500" />
                        <span className="text-white text-sm">1.2k</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/categories">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-8 py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <span className="relative flex items-center gap-3 bg-gradient-to-r from-primary-600 to-accent text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl">
                Explore All Categories
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
      </div>
    </section>
  );
};

export default CategoryShowcase;