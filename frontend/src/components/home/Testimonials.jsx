import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiStar, 
  FiMessageCircle, 
  FiHeart, 
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiGlobe,
  FiThumbsUp,
  FiMapPin  // ← Added missing import
} from 'react-icons/fi';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedReview, setExpandedReview] = useState(null);
  
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
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Sneaker Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'ShoeVerse has the most authentic collection I\'ve ever seen. The quality check is impeccable and delivery is always on time. Found my grails here!',
      rating: 5,
      date: '2 days ago',
      location: 'New York, USA',
      verified: true,
      purchases: 12,
      helpful: 234,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#AirMax', '#Nike', '#Grails']
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Fashion Blogger',
      avatar: 'https://images.unsplash.com/photo-1494790108777-76671e5e2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'As a fashion blogger, I need exclusive sneakers. ShoeVerse never disappoints. Their customer service is top-notch and the shipping is lightning fast!',
      rating: 5,
      date: '5 days ago',
      location: 'London, UK',
      verified: true,
      purchases: 8,
      helpful: 189,
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#Adidas', '#Ultraboost', '#Blogger']
    },
    {
      id: 3,
      name: 'Mike Chen',
      role: 'Pro Athlete',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'The performance gear section is amazing. Perfect for my training needs. Highly recommended for athletes! The durability is outstanding.',
      rating: 5,
      date: '1 week ago',
      location: 'Tokyo, Japan',
      verified: true,
      purchases: 15,
      helpful: 312,
      images: [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#Performance', '#Training', '#Athlete']
    },
    {
      id: 4,
      name: 'Emma Davis',
      role: 'Collector',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'Found some rare editions here that I couldn\'t find anywhere else. ShoeVerse is a gem for collectors. Their authentication process is thorough.',
      rating: 5,
      date: '3 days ago',
      location: 'Los Angeles, USA',
      verified: true,
      purchases: 23,
      helpful: 456,
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#Rare', '#Collector', '#Limited']
    },
    {
      id: 5,
      name: 'James Wilson',
      role: 'Streetwear Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'The curation at ShoeVerse is unmatched. Always finding pieces that inspire my designs. Great platform for creatives.',
      rating: 5,
      date: '4 days ago',
      location: 'Paris, France',
      verified: true,
      purchases: 9,
      helpful: 167,
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#Design', '#Streetwear', '#Creative']
    },
    {
      id: 6,
      name: 'Lisa Thompson',
      role: 'Fitness Instructor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      content: 'The comfort and quality of the trainers I bought are exceptional. Perfect for my daily workouts and classes.',
      rating: 5,
      date: '6 days ago',
      location: 'Sydney, Australia',
      verified: true,
      purchases: 5,
      helpful: 98,
      images: [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      tags: ['#Fitness', '#Comfort', '#Training']
    }
  ];

  const stats = [
    { icon: FiStar, label: '5-Star Reviews', value: '25K+', color: 'text-yellow-500' },
    { icon: FiGlobe, label: 'Countries', value: '50+', color: 'text-green-500' },
    { icon: FiThumbsUp, label: 'Happy Customers', value: '50K+', color: 'text-blue-500' },
    { icon: FiAward, label: 'Verified Reviews', value: '100%', color: 'text-purple-500' }
  ];

  const handleLike = (id) => {
    setLikedTestimonials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
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
        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
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
        {[...Array(12)].map((_, i) => (
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
            {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '💬' : '❤️'}
          </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white mb-6 shadow-xl"
          >
            <FiMessageCircle className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">CUSTOMER LOVE</span>
            <FiMessageCircle className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-4">
            What Our{' '}
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join 50,000+ satisfied sneakerheads who trust us for authentic premium footwear
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <Icon className={`text-3xl mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-16">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex"
          >
            <FiChevronLeft size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex"
          >
            <FiChevronRight size={24} />
          </motion.button>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="p-8 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Testimonial Content */}
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`text-2xl ${
                              i < testimonials[activeIndex].rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {testimonials[activeIndex].rating}.0
                      </span>
                    </div>

                    {/* Testimonial Content */}
                    <p className={`text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed ${
                      expandedReview === activeIndex ? '' : 'line-clamp-4'
                    }`}>
                      "{testimonials[activeIndex].content}"
                    </p>

                    {/* Read More */}
                    <button
                      onClick={() => setExpandedReview(expandedReview === activeIndex ? null : activeIndex)}
                      className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 hover:underline"
                    >
                      {expandedReview === activeIndex ? 'Show less' : 'Read more'}
                    </button>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {testimonials[activeIndex].tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonials[activeIndex].avatar}
                        alt={testimonials[activeIndex].name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {testimonials[activeIndex].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">{testimonials[activeIndex].role}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <FiMapPin size={14} />
                            {testimonials[activeIndex].location}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <FiClock size={14} />
                            {testimonials[activeIndex].date}
                          </span>
                          {testimonials[activeIndex].verified && (
                            <span className="flex items-center gap-1 text-green-500">
                              <FiCheckCircle size={14} />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(testimonials[activeIndex].id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiHeart className={likedTestimonials[testimonials[activeIndex].id] ? 'fill-red-500 text-red-500' : ''} />
                        <span>{testimonials[activeIndex].helpful + (likedTestimonials[testimonials[activeIndex].id] ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <FiShare2 />
                        Share
                      </button>
                      <span className="text-sm text-gray-500">
                        {testimonials[activeIndex].purchases} purchases
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Images */}
                  <div className="grid grid-cols-2 gap-4">
                    {testimonials[activeIndex].images.map((image, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square rounded-xl overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Review image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'w-12 bg-gradient-to-r from-yellow-500 to-orange-500' 
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-4 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} className="ml-1" />}
            </motion.button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`text-lg ${
                    i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
                {testimonial.verified && (
                  <FiCheckCircle className="text-green-500 ml-auto" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Reviews Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/reviews">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-8 py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <span className="relative flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl">
                View All Reviews
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

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex justify-center mt-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
            <FiAward className="text-yellow-500 text-xl" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              All reviews are from verified customers
            </span>
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <img
                  key={i}
                  src={t.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;