import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize2, 
  FiX,
  FiHeart,
  FiShare2,
  FiZoomIn,
  FiZoomOut
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProductGallery = ({ 
  images = [], 
  productName = 'Product',
  onImageChange,
  allowZoom = true,
  allowFullscreen = true,
  showThumbnails = true,
  thumbnailPosition = 'bottom', // 'bottom', 'left', 'right'
  className = ''
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
      setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
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
        y: Math.min(maxOffset, Math.max(-maxOffset, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom in/out
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
    setDragOffset({ x: 0, y: 0 });
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
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
      navigator.share({
        title: productName,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFullscreen) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') setShowFullscreen(false);
        if (e.key === '+' || e.key === '=') zoomIn();
        if (e.key === '-') zoomOut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen]);

  // Notify parent of image change
  useEffect(() => {
    onImageChange?.(activeIndex);
  }, [activeIndex, onImageChange]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`space-y-4 ${className}`}>
        {/* Main Image Container */}
        <div 
          className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleMouseUp(); }}
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
            />
          </motion.div>

          {/* Navigation Arrows (show on hover) */}
          <AnimatePresence>
            {isHovered && !showFullscreen && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronLeft size={20} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronRight size={20} />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* Zoom Controls */}
            {allowZoom && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={zoomIn}
                  className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  title="Zoom In"
                >
                  <FiZoomIn size={18} />
                </motion.button>
                {zoomLevel > 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={zoomOut}
                    className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    title="Zoom Out"
                  >
                    <FiZoomOut size={18} />
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
                className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Fullscreen"
              >
                <FiMaximize2 size={18} />
              </motion.button>
            )}

            {/* Share Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
              title="Share"
            >
              <FiShare2 size={18} />
            </motion.button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Zoom Level Indicator */}
          {zoomLevel > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className={`
            grid gap-2
            ${thumbnailPosition === 'bottom' && 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6'}
            ${thumbnailPosition === 'left' && 'grid-cols-1 gap-2 absolute left-0 top-0 w-20'}
            ${thumbnailPosition === 'right' && 'grid-cols-1 gap-2 absolute right-0 top-0 w-20'}
          `}>
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
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  activeIndex === index
                    ? 'border-primary-600 scale-95 shadow-lg'
                    : 'border-transparent hover:border-primary-300'
                }`}
              >
                <img
                  src={image?.url || image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Active Indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeThumbnail"
                    className="absolute inset-0 bg-primary-600/10"
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
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Fullscreen Image */}
            <motion.div
              key={activeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeIndex]?.url || images[activeIndex]}
                alt={`${productName} - View ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Fullscreen Thumbnails */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeIndex === index
                      ? 'border-primary-600 scale-110 shadow-lg'
                      : 'border-transparent opacity-50 hover:opacity-100'
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
            <div className="absolute top-4 left-4 text-white/60 text-sm">
              Use arrow keys to navigate • ESC to exit
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;