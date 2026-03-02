import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
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
  FiMapPin,
} from "react-icons/fi";

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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
      name: "Alex Johnson",
      role: "Sneaker Enthusiast",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "ShoeVerse has the most authentic collection I've ever seen. The quality check is impeccable and delivery is always on time. Found my grails here!",
      rating: 5,
      date: "2 days ago",
      location: "New York, USA",
      verified: true,
      purchases: 12,
      helpful: 234,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#AirMax", "#Nike", "#Grails"],
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Fashion Blogger",
      avatar:
        "https://images.unsplash.com/photo-1494790108777-76671e5e2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "As a fashion blogger, I need exclusive sneakers. ShoeVerse never disappoints. Their customer service is top-notch and the shipping is lightning fast!",
      rating: 5,
      date: "5 days ago",
      location: "London, UK",
      verified: true,
      purchases: 8,
      helpful: 189,
      images: [
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#Adidas", "#Ultraboost", "#Blogger"],
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "Pro Athlete",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "The performance gear section is amazing. Perfect for my training needs. Highly recommended for athletes! The durability is outstanding.",
      rating: 5,
      date: "1 week ago",
      location: "Tokyo, Japan",
      verified: true,
      purchases: 15,
      helpful: 312,
      images: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#Performance", "#Training", "#Athlete"],
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Collector",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "Found some rare editions here that I couldn't find anywhere else. ShoeVerse is a gem for collectors. Their authentication process is thorough.",
      rating: 5,
      date: "3 days ago",
      location: "Los Angeles, USA",
      verified: true,
      purchases: 23,
      helpful: 456,
      images: [
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#Rare", "#Collector", "#Limited"],
    },
    {
      id: 5,
      name: "James Wilson",
      role: "Streetwear Designer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "The curation at ShoeVerse is unmatched. Always finding pieces that inspire my designs. Great platform for creatives.",
      rating: 5,
      date: "4 days ago",
      location: "Paris, France",
      verified: true,
      purchases: 9,
      helpful: 167,
      images: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#Design", "#Streetwear", "#Creative"],
    },
    {
      id: 6,
      name: "Lisa Thompson",
      role: "Fitness Instructor",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      content:
        "The comfort and quality of the trainers I bought are exceptional. Perfect for my daily workouts and classes.",
      rating: 5,
      date: "6 days ago",
      location: "Sydney, Australia",
      verified: true,
      purchases: 5,
      helpful: 98,
      images: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      ],
      tags: ["#Fitness", "#Comfort", "#Training"],
    },
  ];

  const stats = [
    {
      icon: FiStar,
      label: "5-Star Reviews",
      value: "25K+",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: FiGlobe,
      label: "Countries",
      value: "50+",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: FiThumbsUp,
      label: "Happy Customers",
      value: "50K+",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FiAward,
      label: "Verified Reviews",
      value: "100%",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const handleLike = (id) => {
    setLikedTestimonials((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      ref={ref}
      className="relative py-16 xs:py-20 sm:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900"
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
        className="absolute top-20 left-20 w-48 xs:w-64 sm:w-80 md:w-96 h-48 xs:h-64 sm:h-80 md:h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/30 dark:to-orange-500/30 rounded-full blur-3xl hidden md:block"
      />
      <motion.div
        animate={{
          x: [0, -200, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-40 xs:w-56 sm:w-72 md:w-80 h-40 xs:h-56 sm:h-72 md:h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full blur-3xl hidden lg:block"
      />

      {/* Parallax Floating Icons */}
      <motion.div
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="absolute inset-0 pointer-events-none hidden md:block"
      >
        {[...Array(8)].map((_, i) => (
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
            {i % 3 === 0 ? "⭐" : i % 3 === 1 ? "💬" : "❤️"}
          </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full text-white mb-4 xs:mb-5 sm:mb-6 shadow-xl border border-white/20"
          >
            <FiMessageCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
              CUSTOMER LOVE
            </span>
            <FiMessageCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </motion.div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 xs:mb-3 sm:mb-4 px-2">
            What Our{" "}
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 dark:from-yellow-400 dark:via-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Join 50,000+ satisfied sneakerheads who trust us for authentic
            premium footwear
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 text-center shadow-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <Icon
                  className={`text-xl xs:text-2xl sm:text-3xl mx-auto mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 ${stat.color}`}
                />
                <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 xs:mb-1">
                  {stat.value}
                </div>
                <div className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-10 xs:mb-12 sm:mb-14 md:mb-16">
          
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex border border-gray-200 dark:border-gray-700"
          >
            <FiChevronLeft
              size={16}
              xs:size={18}
              sm:size={20}
              md:size={24}
              className="text-gray-800 dark:text-gray-200"
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex border border-gray-200 dark:border-gray-700"
          >
            <FiChevronRight
              size={16}
              xs:size={18}
              sm:size={20}
              md:size={24}
              className="text-gray-800 dark:text-gray-200"
            />
          </motion.button>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl xs:rounded-2xl sm:rounded-3xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12"
              >
                <div className="grid md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
                  {/* Left Column - Testimonial Content */}
                  <div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4">
                      <div className="flex gap-0.5 xs:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`text-base xs:text-lg sm:text-xl md:text-2xl ${
                              i < testimonials[activeIndex].rating
                                ? "text-yellow-500 dark:text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1 xs:ml-1.5 sm:ml-2">
                        {testimonials[activeIndex].rating}.0
                      </span>
                    </div>

                    {/* Testimonial Content */}
                    <p
                      className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-800 dark:text-gray-200 mb-3 xs:mb-4 sm:mb-5 md:mb-6 leading-relaxed ${
                        expandedReview === activeIndex
                          ? ""
                          : "line-clamp-3 xs:line-clamp-4"
                      }`}
                    >
                      "{testimonials[activeIndex].content}"
                    </p>

                    {/* Read More */}
                    <button
                      onClick={() =>
                        setExpandedReview(
                          expandedReview === activeIndex ? null : activeIndex,
                        )
                      }
                      className="text-primary-600 dark:text-primary-400 text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium mb-3 xs:mb-4 sm:mb-5 md:mb-6 hover:underline"
                    >
                      {expandedReview === activeIndex
                        ? "Show less"
                        : "Read more"}
                    </button>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                      {testimonials[activeIndex].tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-0.5 xs:py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                      <img
                        src={testimonials[activeIndex].avatar}
                        alt={testimonials[activeIndex].name}
                        className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-primary-500 dark:border-primary-400"
                      />
                      <div>
                        <h4 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                          {testimonials[activeIndex].name}
                        </h4>
                        <p className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300">
                          {testimonials[activeIndex].role}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 mt-0.5 xs:mt-1 md:mt-2 text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs">
                          <span className="flex items-center gap-0.5 xs:gap-1 text-gray-600 dark:text-gray-400">
                            <FiMapPin
                              size={8}
                              xs:size={9}
                              sm:size={10}
                              md:size={12}
                              lg:size={14}
                            />
                            <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-full">
                              {testimonials[activeIndex].location}
                            </span>
                          </span>
                          <span className="flex items-center gap-0.5 xs:gap-1 text-gray-600 dark:text-gray-400">
                            <FiClock
                              size={8}
                              xs:size={9}
                              sm:size={10}
                              md:size={12}
                              lg:size={14}
                            />
                            {testimonials[activeIndex].date}
                          </span>
                          {testimonials[activeIndex].verified && (
                            <span className="flex items-center gap-0.5 xs:gap-1 text-green-600 dark:text-green-400">
                              <FiCheckCircle
                                size={8}
                                xs:size={9}
                                sm:size={10}
                                md:size={12}
                                lg:size={14}
                              />
                              <span className="hidden xs:inline">Verified</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                      <button
                        onClick={() => handleLike(testimonials[activeIndex].id)}
                        className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 sm:px-3.5 md:px-4 py-1 xs:py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium border border-gray-300 dark:border-gray-600"
                      >
                        <FiHeart
                          className={`w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 ${likedTestimonials[testimonials[activeIndex].id] ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-300"}`}
                        />
                        <span>
                          {testimonials[activeIndex].helpful +
                            (likedTestimonials[testimonials[activeIndex].id]
                              ? 1
                              : 0)}
                        </span>
                      </button>
                      <button className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 sm:px-3.5 md:px-4 py-1 xs:py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium border border-gray-300 dark:border-gray-600">
                        <FiShare2
                          size={10}
                          xs:size={11}
                          sm:size={12}
                          md:size={14}
                          className="text-gray-700 dark:text-gray-300"
                        />
                        Share
                      </button>
                      <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs font-medium text-gray-600 dark:text-gray-400">
                        {testimonials[activeIndex].purchases} purchases
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Images */}
                  <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    {testimonials[activeIndex].images.map((image, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-square rounded-lg xs:rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <img
                          src={image}
                          alt={`Review image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-3 xs:gap-3.5 sm:gap-4 mt-4 xs:mt-5 sm:mt-6">
            {/* Slide Indicators */}
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1 xs:h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-6 xs:w-8 sm:w-10 md:w-12 bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "w-1 xs:w-1.5 sm:w-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
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
              className="ml-2 xs:ml-3 sm:ml-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            >
              {isAutoPlaying ? (
                <FiPause
                  size={10}
                  xs:size={11}
                  sm:size={12}
                  md:size={14}
                  className="text-gray-800 dark:text-gray-200"
                />
              ) : (
                <FiPlay
                  size={10}
                  xs:size={11}
                  sm:size={12}
                  md:size={14}
                  className="ml-0.5 xs:ml-1 text-gray-800 dark:text-gray-200"
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700"
            >
              {/* Rating */}
              <div className="flex gap-0.5 xs:gap-1 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-sm xs:text-base sm:text-lg ${
                      i < testimonial.rating
                        ? "text-yellow-500 dark:text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div>
                  <h4 className="text-[10px] xs:text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-[8px] xs:text-[9px] sm:text-xs text-gray-700 dark:text-gray-300">
                    {testimonial.role}
                  </p>
                </div>
                {testimonial.verified && (
                  <FiCheckCircle className="text-green-600 dark:text-green-400 ml-auto w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
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
          className="text-center mt-8 xs:mt-10 sm:mt-12"
        >
          <Link to="/reviews">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full blur-lg xs:blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl border border-white/20">
                View All Reviews
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

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex justify-center mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <FiAward className="text-yellow-600 dark:text-yellow-400 text-sm xs:text-base sm:text-lg md:text-xl" />
            <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">
              All reviews are from verified customers
            </span>
            <div className="flex -space-x-1 xs:-space-x-1.5 sm:-space-x-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <img
                  key={i}
                  src={t.avatar}
                  alt=""
                  className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-gray-800"
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
