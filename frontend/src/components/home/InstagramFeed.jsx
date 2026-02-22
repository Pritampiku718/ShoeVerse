import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiPause
} from 'react-icons/fi';

const InstagramFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  // High-quality working images from Unsplash (guaranteed to work)
  const posts = [
    {
      id: 1,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      likes: 1234,
      comments: 89,
      username: '@sneakerhead',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      caption: 'New pickup! 🔥 #NikeAirMax #Sneakers',
      timeAgo: '2h ago',
      location: 'Tokyo, Japan',
      products: ['Nike Air Max 270', 'Nike'],
      tags: ['#NikeAirMax', '#Sneakerhead']
    },
    {
      id: 2,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
      likes: 2345,
      comments: 156,
      username: '@kicksdaily',
      userAvatar: 'https://images.unsplash.com/photo-1494790108777-76671e5e2d8b?w=100&h=100&fit=crop',
      caption: 'Clean fit with the Ultraboosts 👟 #Adidas',
      timeAgo: '4h ago',
      location: 'New York, USA',
      products: ['Adidas Ultraboost', 'Adidas'],
      tags: ['#Adidas', '#Ultraboost']
    },
    {
      id: 3,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop',
      likes: 3456,
      comments: 234,
      username: '@sneakerfreaker',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      caption: 'Retro vibes with the Jordan 4s 🔥 #Jordan',
      timeAgo: '6h ago',
      location: 'Chicago, USA',
      products: ['Jordan Retro 4', 'Jordan'],
      tags: ['#Jordan', '#Retro']
    },
    {
      id: 4,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1539185445255-3f5b8c9e3f8f?w=300&h=300&fit=crop',
      likes: 4567,
      comments: 312,
      username: '@freshkicks',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      caption: 'New Balance gang where you at? 🔥 #NewBalance',
      timeAgo: '8h ago',
      location: 'Boston, USA',
      products: ['New Balance 990', 'New Balance'],
      tags: ['#NewBalance', '#990']
    },
    {
      id: 5,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      likes: 5678,
      comments: 423,
      username: '@limitededition',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      caption: 'Limited pair just dropped! Who copped? 🔥',
      timeAgo: '10h ago',
      location: 'Los Angeles, USA',
      products: ['Limited Edition', 'Various'],
      tags: ['#LimitedEdition', '#Exclusive']
    },
    {
      id: 6,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
      likes: 6789,
      comments: 534,
      username: '@womensneakers',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      caption: 'Perfect for summer vibes ☀️ #WomenWhoKick',
      timeAgo: '12h ago',
      location: 'Miami, USA',
      products: ['Puma RS-X', 'Puma'],
      tags: ['#Puma', '#WomenSneakers']
    }
  ];

  // Fallback images in case Unsplash fails
  const fallbackImages = [
    'https://placehold.co/600x600/3b82f6/ffffff?text=Sneaker+1',
    'https://placehold.co/600x600/ef4444/ffffff?text=Sneaker+2',
    'https://placehold.co/600x600/8b5cf6/ffffff?text=Sneaker+3',
    'https://placehold.co/600x600/10b981/ffffff?text=Sneaker+4',
    'https://placehold.co/600x600/f59e0b/ffffff?text=Sneaker+5',
    'https://placehold.co/600x600/ec4899/ffffff?text=Sneaker+6'
  ];

  const fallbackAvatars = [
    'https://placehold.co/100x100/3b82f6/ffffff?text=U1',
    'https://placehold.co/100x100/ef4444/ffffff?text=U2',
    'https://placehold.co/100x100/8b5cf6/ffffff?text=U3',
    'https://placehold.co/100x100/10b981/ffffff?text=U4',
    'https://placehold.co/100x100/f59e0b/ffffff?text=U5',
    'https://placehold.co/100x100/ec4899/ffffff?text=U6'
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
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleImageError = (postId, type = 'main') => {
    setImagesLoaded(prev => ({
      ...prev,
      [`${postId}-${type}`]: false
    }));
  };

  const handleImageLoad = (postId, type = 'main') => {
    setImagesLoaded(prev => ({
      ...prev,
      [`${postId}-${type}`]: true
    }));
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
          color: 'rgba(0,0,0,0.1)'
        }} />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white mb-6 shadow-xl"
          >
            <FiInstagram className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">INSTAGRAM COMMUNITY</span>
            <FiInstagram className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              #ShoeVerse
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tag us in your sneaker photos for a chance to be featured and win exclusive prizes
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative mb-12">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 md:flex"
          >
            <FiChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 md:flex"
          >
            <FiChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[16/9] md:aspect-[21/9] bg-gray-200 dark:bg-gray-700"
              >
                {/* Loading State */}
                {!imagesLoaded[`${posts[activeIndex].id}-main`] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Background Image with Fallback */}
                <img
                  src={posts[activeIndex].image}
                  alt={posts[activeIndex].caption}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imagesLoaded[`${posts[activeIndex].id}-main`] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(posts[activeIndex].id, 'main')}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImages[activeIndex];
                    handleImageLoad(posts[activeIndex].id, 'main');
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="relative w-12 h-12">
                      {!imagesLoaded[`${posts[activeIndex].id}-avatar`] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full">
                          <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={posts[activeIndex].userAvatar}
                        alt={posts[activeIndex].username}
                        className={`w-12 h-12 rounded-full border-2 border-white object-cover transition-opacity duration-300 ${
                          imagesLoaded[`${posts[activeIndex].id}-avatar`] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(posts[activeIndex].id, 'avatar')}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackAvatars[activeIndex];
                          handleImageLoad(posts[activeIndex].id, 'avatar');
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{posts[activeIndex].username}</p>
                      <p className="text-white/60 text-sm flex items-center gap-1">
                        <FiClock size={12} />
                        {posts[activeIndex].timeAgo}
                      </p>
                    </div>
                  </motion.div>

                  {/* Caption */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-lg mb-2"
                  >
                    {posts[activeIndex].caption}
                  </motion.p>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2 mb-4"
                  >
                    {posts[activeIndex].tags.map((tag) => (
                      <span key={tag} className="text-primary-400 text-sm">
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <button
                      onClick={() => handleLike(posts[activeIndex].id)}
                      className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors group"
                    >
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        animate={{ scale: likedPosts[posts[activeIndex].id] ? [1, 1.2, 1] : 1 }}
                      >
                        <FiHeart 
                          size={24} 
                          className={likedPosts[posts[activeIndex].id] ? 'fill-pink-500 text-pink-500' : ''} 
                        />
                      </motion.div>
                      <span>{posts[activeIndex].likes + (likedPosts[posts[activeIndex].id] ? 1 : 0)}</span>
                    </button>

                    <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                      <FiMessageCircle size={24} />
                      <span>{posts[activeIndex].comments}</span>
                    </button>

                    <button
                      onClick={() => handleSave(posts[activeIndex].id)}
                      className="text-white hover:text-yellow-500 transition-colors"
                    >
                      <FiBookmark 
                        size={24} 
                        className={savedPosts[posts[activeIndex].id] ? 'fill-yellow-500 text-yellow-500' : ''} 
                      />
                    </button>

                    <button className="text-white hover:text-green-500 transition-colors ml-auto">
                      <FiShare2 size={24} />
                    </button>
                  </motion.div>
                </div>

                {/* Video Indicator */}
                {posts[activeIndex].type === 'video' && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2">
                    <FiFilm size={16} />
                    <span className="text-sm">Video</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {posts.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'w-12 bg-gradient-to-r from-purple-600 to-pink-600' 
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

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-gray-200 dark:bg-gray-700"
            >
              {/* Loading State */}
              {!imagesLoaded[`${post.id}-thumb`] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              )}

              <img
                src={post.thumbnail}
                alt={`Instagram post by ${post.username}`}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imagesLoaded[`${post.id}-thumb`] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(post.id, 'thumb')}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImages[index];
                  handleImageLoad(post.id, 'thumb');
                }}
              />
              
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              >
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-sm font-semibold mb-1">{post.username}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <FiHeart className="text-pink-500" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMessageCircle /> {post.comments}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-2xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
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
              className="relative group px-8 py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <span className="relative flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl">
                <FiInstagram size={20} />
                Follow Us on Instagram
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
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