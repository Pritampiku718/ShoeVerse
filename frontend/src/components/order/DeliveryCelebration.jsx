import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiX, 
  FiGift, 
  FiStar, 
  FiHeart,
  FiShare2,
  FiAward,
  FiTruck,
  FiPackage,
} from 'react-icons/fi';

const DeliveryCelebration = ({ onClose, orderDetails = {} }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 8 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 35, 
      spread: 360, 
      ticks: 80, 
      zIndex: 1000,
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        setShowConfetti(false);
        return clearInterval(interval);
      }

      const particleCount = 60 * (timeLeft / duration);

      // Left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });

      // Right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ef4444', '#ec4899']
      });

      // Center burst
      if (Math.random() > 0.7) {
        confetti({
          ...defaults,
          particleCount: particleCount * 0.5,
          origin: { x: 0.5, y: 0.5 },
          spread: 120,
          startVelocity: 45,
        });
      }
    }, 200);

    // Auto close after 10 seconds
    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My New Sneakers from ShoeVerse!',
          text: 'Just got my amazing new sneakers delivered! 🎉',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareOptions(true);
      setTimeout(() => setShowShareOptions(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-x-4 sm:inset-x-6 md:inset-x-auto md:top-24 md:left-1/2 md:transform md:-translate-x-1/2 z-50 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        >
          {/* Main Celebration Card */}
          <div className="relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-[10px] opacity-30">
                <div className="absolute top-0 -left-4 w-24 h-24 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
                <div className="absolute top-0 -right-4 w-24 h-24 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-24 h-24 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
              </div>
            </div>

            {/* Confetti Overlay Indicator */}
            {showConfetti && (
              <div className="absolute top-2 right-2 z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-primary-500 rounded-full"
                />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors group"
            >
              <FiX size={16} className="text-gray-600 dark:text-gray-400 group-hover:rotate-90 transition-transform" />
            </button>

            {/* Content */}
            <div className="relative p-5 sm:p-6 md:p-8">
              
              {/* Celebration Icons */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
              >
                {['🎉', '👟', '✨', '🎊'].map((emoji, index) => (
                  <motion.span
                    key={index}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: index * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-lg"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>

              {/* Success Icon */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-4 sm:mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50"
                  />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                    <FiCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
              >
                Delivery Complete!
              </motion.h2>

              {/* Message */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 text-center mb-4 sm:mb-6"
              >
                Your sneakers have arrived! Time to rock your new kicks 🚀
              </motion.p>

              {/* Order Summary */}
              {orderDetails.orderNumber && (
                <motion.div
                  variants={itemVariants}
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl border border-primary-200 dark:border-primary-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-primary-600 dark:text-primary-400" size={14} />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">
                        Order #{orderDetails.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTruck className="text-green-600 dark:text-green-400" size={12} />
                      <span className="text-[10px] sm:text-xs font-bold text-green-600 dark:text-green-400">
                        Delivered
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
              >
                {/* Write Review Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <FiStar className="group-hover:rotate-12 transition-transform" size={14} />
                  <span>Write a Review</span>
                </motion.button>

                {/* Share Button */}
                <div className="relative w-full sm:flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:border-primary-500 dark:hover:border-primary-500 transition-all flex items-center justify-center gap-2 group"
                  >
                    <FiShare2 className="group-hover:rotate-12 transition-transform" size={14} />
                    <span>Share</span>
                  </motion.button>

                  {/* Share Options Tooltip */}
                  <AnimatePresence>
                    {showShareOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-950 text-white px-3 py-1.5 rounded-lg text-[10px] whitespace-nowrap"
                      >
                        Link copied to clipboard!
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-950 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Track Another Order Link */}
              <motion.p
                variants={itemVariants}
                className="text-center mt-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400"
              >
                Want to track another order?{' '}
                <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  View all orders
                </button>
              </motion.p>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-l-4 border-primary-500/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-r-4 border-accent/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-l-4 border-accent/30 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-r-4 border-primary-500/30 rounded-br-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryCelebration;