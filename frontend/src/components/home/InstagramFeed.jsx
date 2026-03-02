import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiInstagram,
  FiClock,
  FiFilm,
  FiBookmark,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
} from "react-icons/fi";

const InstagramFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const posts = [
    {
      id: 1,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      likes: 1234,
      comments: 89,
      username: "@sneakerhead",
      userAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      caption: "New pickup! 🔥 #NikeAirMax #Sneakers",
      timeAgo: "2h ago",
      location: "Tokyo, Japan",
      products: ["Nike Air Max 270", "Nike"],
      tags: ["#NikeAirMax", "#Sneakerhead"],
    },
    {
      id: 2,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop",
      likes: 2345,
      comments: 156,
      username: "@kicksdaily",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108777-76671e5e2d8b?w=100&h=100&fit=crop",
      caption: "Clean fit with the Ultraboosts 👟 #Adidas",
      timeAgo: "4h ago",
      location: "New York, USA",
      products: ["Adidas Ultraboost", "Adidas"],
      tags: ["#Adidas", "#Ultraboost"],
    },
    {
      id: 3,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
      likes: 3456,
      comments: 234,
      username: "@sneakerfreaker",
      userAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      caption: "Retro vibes with the Jordan 4s 🔥 #Jordan",
      timeAgo: "6h ago",
      location: "Chicago, USA",
      products: ["Jordan Retro 4", "Jordan"],
      tags: ["#Jordan", "#Retro"],
    },
    {
      id: 4,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?w=300&h=300&fit=crop",
      likes: 4567,
      comments: 312,
      username: "@freshkicks",
      userAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      caption: "New Balance gang where you at? 🔥 #NewBalance",
      timeAgo: "8h ago",
      location: "Boston, USA",
      products: ["New Balance 990", "New Balance"],
      tags: ["#NewBalance", "#990"],
    },
    {
      id: 5,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      likes: 5678,
      comments: 423,
      username: "@limitededition",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      caption: "Limited pair just dropped! Who copped? 🔥",
      timeAgo: "10h ago",
      location: "Los Angeles, USA",
      products: ["Limited Edition", "Various"],
      tags: ["#LimitedEdition", "#Exclusive"],
    },
    {
      id: 6,
      type: "image",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
      thumbnail:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
      likes: 6789,
      comments: 534,
      username: "@womensneakers",
      userAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      caption: "Perfect for summer vibes ☀️ #WomenWhoKick",
      timeAgo: "12h ago",
      location: "Miami, USA",
      products: ["Puma RS-X", "Puma"],
      tags: ["#Puma", "#WomenSneakers"],
    },
  ];

  const fallbackImages = [
    "https://placehold.co/600x600/3b82f6/ffffff?text=Sneaker+1",
    "https://placehold.co/600x600/ef4444/ffffff?text=Sneaker+2",
    "https://placehold.co/600x600/8b5cf6/ffffff?text=Sneaker+3",
    "https://placehold.co/600x600/10b981/ffffff?text=Sneaker+4",
    "https://placehold.co/600x600/f59e0b/ffffff?text=Sneaker+5",
    "https://placehold.co/600x600/ec4899/ffffff?text=Sneaker+6",
  ];

  const fallbackAvatars = [
    "https://placehold.co/100x100/3b82f6/ffffff?text=U1",
    "https://placehold.co/100x100/ef4444/ffffff?text=U2",
    "https://placehold.co/100x100/8b5cf6/ffffff?text=U3",
    "https://placehold.co/100x100/10b981/ffffff?text=U4",
    "https://placehold.co/100x100/f59e0b/ffffff?text=U5",
    "https://placehold.co/100x100/ec4899/ffffff?text=U6",
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, posts.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % posts.length);
  };

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleImageError = (postId, type = "main") => {
    setImagesLoaded((prev) => ({
      ...prev,
      [`${postId}-${type}`]: false,
    }));
  };

  const handleImageLoad = (postId, type = "main") => {
    setImagesLoaded((prev) => ({
      ...prev,
      [`${postId}-${type}`]: true,
    }));
  };

  return (
    <section className="relative py-16 xs:py-20 sm:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "30px 30px xs:35px 35px sm:40px 40px",
            color: "rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-48 xs:w-56 sm:w-64 lg:w-80 h-48 xs:h-56 sm:h-64 lg:h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 dark:from-pink-500/30 dark:to-purple-500/30 rounded-full blur-3xl hidden lg:block"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-56 xs:w-64 sm:w-72 lg:w-96 h-56 xs:h-64 sm:h-72 lg:h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full blur-3xl hidden lg:block"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-full text-white mb-4 xs:mb-5 sm:mb-6 shadow-xl border border-white/20"
          >
            <FiInstagram className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
              INSTAGRAM COMMUNITY
            </span>
            <FiInstagram className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          </motion.div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 px-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              #ShoeVerse
            </span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Tag us in your sneaker photos for a chance to be featured and win
            exclusive prizes
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative mb-8 xs:mb-10 sm:mb-12">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex border border-gray-200 dark:border-gray-700"
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl items-center justify-center hover:shadow-2xl transition-all duration-300 hidden md:flex border border-gray-200 dark:border-gray-700"
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
          <div className="relative overflow-hidden rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square xs:aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] bg-gray-200 dark:bg-gray-700"
              >
                {/* Loading State */}
                {!imagesLoaded[`${posts[activeIndex].id}-main`] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 border-3 xs:border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Background Image with Fallback */}
                <img
                  src={posts[activeIndex].image}
                  alt={posts[activeIndex].caption}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imagesLoaded[`${posts[activeIndex].id}-main`]
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(posts[activeIndex].id, "main")}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImages[activeIndex];
                    handleImageLoad(posts[activeIndex].id, "main");
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 flex flex-col justify-end">
                  
                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 xs:gap-2.5 mb-2 xs:mb-3 sm:mb-4"
                  >
                    <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12">
                      {!imagesLoaded[`${posts[activeIndex].id}-avatar`] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full">
                          <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={posts[activeIndex].userAvatar}
                        alt={posts[activeIndex].username}
                        className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white/80 dark:border-gray-300 object-cover transition-opacity duration-300 ${
                          imagesLoaded[`${posts[activeIndex].id}-avatar`]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        onLoad={() =>
                          handleImageLoad(posts[activeIndex].id, "avatar")
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackAvatars[activeIndex];
                          handleImageLoad(posts[activeIndex].id, "avatar");
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xs xs:text-sm sm:text-base md:text-lg">
                        {posts[activeIndex].username}
                      </p>
                      <p className="text-white/70 text-[8px] xs:text-[9px] sm:text-xs md:text-sm flex items-center gap-0.5 xs:gap-1">
                        <FiClock size={10} xs:size={11} sm:size={12} />
                        {posts[activeIndex].timeAgo}
                      </p>
                    </div>
                  </motion.div>

                  {/* Caption */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-1.5 line-clamp-2"
                  >
                    {posts[activeIndex].caption}
                  </motion.p>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-1 xs:gap-1.5 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 flex-wrap"
                  >
                    {posts[activeIndex].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-primary-400 dark:text-primary-300 text-[8px] xs:text-[9px] sm:text-xs md:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4"
                  >
                    <button
                      onClick={() => handleLike(posts[activeIndex].id)}
                      className="flex items-center gap-1 xs:gap-1.5 text-white hover:text-pink-500 transition-colors group text-[8px] xs:text-[9px] sm:text-xs md:text-sm"
                    >
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        animate={{
                          scale: likedPosts[posts[activeIndex].id]
                            ? [1, 1.2, 1]
                            : 1,
                        }}
                      >
                        <FiHeart
                          size={16}
                          xs:size={18}
                          sm:size={20}
                          md:size={24}
                          className={
                            likedPosts[posts[activeIndex].id]
                              ? "fill-pink-500 text-pink-500"
                              : ""
                          }
                        />
                      </motion.div>
                      <span>
                        {posts[activeIndex].likes +
                          (likedPosts[posts[activeIndex].id] ? 1 : 0)}
                      </span>
                    </button>

                    <button className="flex items-center gap-1 xs:gap-1.5 text-white hover:text-blue-400 transition-colors text-[8px] xs:text-[9px] sm:text-xs md:text-sm">
                      <FiMessageCircle
                        size={16}
                        xs:size={18}
                        sm:size={20}
                        md:size={24}
                      />
                      <span>{posts[activeIndex].comments}</span>
                    </button>

                    <button
                      onClick={() => handleSave(posts[activeIndex].id)}
                      className="text-white hover:text-yellow-500 transition-colors"
                    >
                      <FiBookmark
                        size={16}
                        xs:size={18}
                        sm:size={20}
                        md:size={24}
                        className={
                          savedPosts[posts[activeIndex].id]
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }
                      />
                    </button>

                    <button className="text-white hover:text-green-500 transition-colors ml-auto">
                      <FiShare2
                        size={16}
                        xs:size={18}
                        sm:size={20}
                        md:size={24}
                      />
                    </button>
                  </motion.div>
                </div>

                {/* Video Indicator */}
                {posts[activeIndex].type === "video" && (
                  <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-full flex items-center gap-1 xs:gap-1.5 border border-white/20">
                    <FiFilm size={12} xs:size={14} sm:size={16} />
                    <span className="text-[8px] xs:text-[9px] sm:text-xs">
                      Video
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-5 sm:mt-6">
            
            {/* Slide Indicators */}
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              {posts.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1 xs:h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-6 xs:w-8 sm:w-10 md:w-12 bg-gradient-to-r from-purple-600 to-pink-600"
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

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(index)}
              className="relative aspect-square rounded-lg xs:rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors"
            >
              {/* Loading State */}
              {!imagesLoaded[`${post.id}-thumb`] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 xs:border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              )}

              <img
                src={post.thumbnail}
                alt={`Instagram post by ${post.username}`}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imagesLoaded[`${post.id}-thumb`] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(post.id, "thumb")}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImages[index];
                  handleImageLoad(post.id, "thumb");
                }}
              />

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              >
                <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-2.5 sm:p-3 md:p-4 text-white">
                  <p className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-semibold mb-0.5 xs:mb-1 truncate">
                    {post.username}
                  </p>
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs">
                    <span className="flex items-center gap-0.5 xs:gap-1">
                      <FiHeart className="text-pink-500 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />{" "}
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5 xs:gap-1">
                      <FiMessageCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />{" "}
                      {post.comments}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-lg xs:rounded-lg sm:rounded-xl lg:rounded-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 xs:mt-10 sm:mt-12"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-full blur-lg xs:blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl border border-white/20">
                <FiInstagram size={14} xs:size={16} sm:size={18} md:size={20} />
                Follow Us on Instagram
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-sm xs:text-base sm:text-lg md:text-xl"
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
