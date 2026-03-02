import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
  FiHeart,
  FiShare2,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const ProductGallery = ({
  images = [],
  productName = "Product",
  onImageChange,
  allowZoom = true,
  allowFullscreen = true,
  showThumbnails = true,
  thumbnailPosition = "bottom",
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Handle image navigation
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle touch events for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle mouse drag for zoomed images
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Limit drag based on zoom level
      const maxOffset = 100 * (zoomLevel - 1);
      setDragOffset({
        x: Math.min(maxOffset, Math.max(-maxOffset, newX)),
        y: Math.min(maxOffset, Math.max(-maxOffset, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom in/out
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setDragOffset({ x: 0, y: 0 });
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: productName,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFullscreen) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") setShowFullscreen(false);
        if (e.key === "+" || e.key === "=") zoomIn();
        if (e.key === "-") zoomOut();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreen]);

  // Notify parent of image change
  useEffect(() => {
    onImageChange?.(activeIndex);
  }, [activeIndex, onImageChange]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
          No images available
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`space-y-3 sm:space-y-4 ${className}`}>
        
        {/* Main Image Container */}
        <div
          className="relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUp();
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Main Image with Zoom Effect */}
          <motion.div
            className="relative w-full h-full cursor-zoom-in"
            animate={{
              scale: zoomLevel,
              x: dragOffset.x,
              y: dragOffset.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img
              src={images[activeIndex]?.url || images[activeIndex]}
              alt={`${productName} - View ${activeIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Navigation Arrows - Responsive */}
          <AnimatePresence>
            {isHovered && !showFullscreen && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={16} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                  aria-label="Next image"
                >
                  <FiChevronRight size={16} />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Top Controls - Responsive */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
           
           {/* Zoom Controls */}
            {allowZoom && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={zoomIn}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                  title="Zoom In"
                >
                  <FiZoomIn size={14} />
                </motion.button>
                {zoomLevel > 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={zoomOut}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                    title="Zoom Out"
                  >
                    <FiZoomOut size={14} />
                  </motion.button>
                )}
              </>
            )}

            {/* Fullscreen Button */}
            {allowFullscreen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
                title="Fullscreen"
              >
                <FiMaximize2 size={14} />
              </motion.button>
            )}

            {/* Share Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
              title="Share"
            >
              <FiShare2 size={14} />
            </motion.button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full border border-white/20 shadow-lg">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Zoom Level Indicator */}
          {zoomLevel > 1 && (
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full border border-white/20 shadow-lg">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div
            className={`
            grid gap-1 sm:gap-2
            ${thumbnailPosition === "bottom" && "grid-cols-4 sm:grid-cols-5 lg:grid-cols-6"}
            ${thumbnailPosition === "left" && "grid-cols-1 gap-1 sm:gap-2 absolute left-0 top-0 w-16 sm:w-20"}
            ${thumbnailPosition === "right" && "grid-cols-1 gap-1 sm:gap-2 absolute right-0 top-0 w-16 sm:w-20"}
          `}
          >
            {images.map((image, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveIndex(index);
                  setZoomLevel(1);
                  setDragOffset({ x: 0, y: 0 });
                }}
                className={`relative aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all shadow-md ${
                  activeIndex === index
                    ? "border-primary-600 dark:border-primary-500 scale-95 shadow-xl ring-2 ring-primary-600/20 dark:ring-primary-500/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                <img
                  src={image?.url || image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Active Indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeThumbnail"
                    className="absolute inset-0 bg-primary-600/10 dark:bg-primary-500/20"
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-xl hover:scale-110"
              aria-label="Close fullscreen"
            >
              <FiX size={20} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-xl hover:scale-110"
              aria-label="Previous image"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-xl hover:scale-110"
              aria-label="Next image"
            >
              <FiChevronRight size={20} />
            </button>

            {/* Fullscreen Image */}
            <motion.div
              key={activeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-full sm:max-w-4xl md:max-w-6xl max-h-[80vh] sm:max-h-[85vh] md:max-h-[90vh] w-full h-full flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeIndex]?.url || images[activeIndex]}
                alt={`${productName} - View ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Fullscreen Thumbnails */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 px-2 max-w-[90vw] overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                  }}
                  className={`flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all shadow-xl ${
                    activeIndex === index
                      ? "border-primary-500 scale-110 shadow-primary-500/30"
                      : "border-white/30 opacity-50 hover:opacity-100 hover:border-white/50"
                  }`}
                >
                  <img
                    src={image?.url || image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Fullscreen Controls Info */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white/70 text-[10px] sm:text-xs hidden sm:block bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
              ← → arrows • ESC to exit
            </div>

            {/* Mobile Controls Info */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-xs sm:hidden bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              Swipe to navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;
