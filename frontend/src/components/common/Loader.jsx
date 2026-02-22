import { motion } from "framer-motion";

const Loader = ({
  size = "medium",
  color = "primary",
  fullScreen = false,
  text = "Loading...",
  showText = true,
  type = "spinner", // 'spinner', 'dots', 'pulse', 'bar'
}) => {
  // Size mappings
  const sizeMap = {
    small: {
      container: "w-16 h-16",
      icon: "text-2xl",
      text: "text-sm",
      dot: "w-2 h-2",
      bar: "h-1",
    },
    medium: {
      container: "w-24 h-24",
      icon: "text-4xl",
      text: "text-base",
      dot: "w-3 h-3",
      bar: "h-1.5",
    },
    large: {
      container: "w-32 h-32",
      icon: "text-5xl",
      text: "text-lg",
      dot: "w-4 h-4",
      bar: "h-2",
    },
  };

  // Color mappings
  const colorMap = {
    primary: {
      bg: "from-primary-600 to-accent",
      light: "bg-primary-100",
      dot: "bg-primary-600",
      text: "text-primary-600",
    },
    white: {
      bg: "from-white to-gray-100",
      light: "bg-white/20",
      dot: "bg-white",
      text: "text-white",
    },
    gray: {
      bg: "from-gray-600 to-gray-700",
      light: "bg-gray-100",
      dot: "bg-gray-600",
      text: "text-gray-600",
    },
  };

  const sizes = sizeMap[size] || sizeMap.medium;
  const colors = colorMap[color] || colorMap.primary;

  // Spinner Loader
  const SpinnerLoader = () => (
    <div className={`relative ${sizes.container}`}>
      {/* Outer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 rounded-full border-4 border-t-${colors.dot} border-r-transparent border-b-transparent border-l-transparent opacity-30`}
        style={{ borderTopColor: "currentColor" }}
      />

      {/* Middle Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-2 rounded-full border-4 border-r-${colors.dot} border-t-transparent border-b-transparent border-l-transparent opacity-50`}
        style={{ borderRightColor: "currentColor" }}
      />

      {/* Inner Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-4 rounded-full border-4 border-b-${colors.dot} border-t-transparent border-r-transparent border-l-transparent`}
        style={{ borderBottomColor: "currentColor" }}
      />

      {/* Center Dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className={`absolute inset-0 m-auto w-3 h-3 ${colors.dot} rounded-full shadow-lg`}
      />
    </div>
  );

  // Dots Loader
  const DotsLoader = () => (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, 0, -10],
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className={`${sizes.dot} ${colors.dot} rounded-full shadow-lg`}
        />
      ))}
    </div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <div className={`relative ${sizes.container}`}>
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute inset-0 ${colors.dot} rounded-full opacity-20`}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className={`absolute inset-2 ${colors.dot} rounded-full opacity-30`}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
        className={`absolute inset-4 ${colors.dot} rounded-full opacity-40`}
      />
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className={`absolute inset-6 ${colors.dot} rounded-full`}
      />
    </div>
  );

  // Bar Loader
  const BarLoader = () => (
    <div
      className={`w-48 ${sizes.bar} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`h-full w-1/2 bg-gradient-to-r ${colors.bg} rounded-full`}
      />
    </div>
  );

  // Shoe Loader (Custom for ShoeVerse)
  const ShoeLoader = () => (
    <div className={`relative ${sizes.container}`}>
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -5, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center text-4xl"
      >
        👟
      </motion.div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute inset-0 ${colors.dot} rounded-full blur-xl opacity-20`}
      />
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return <DotsLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bar":
        return <BarLoader />;
      case "shoe":
        return <ShoeLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="text-center">
          {renderLoader()}
          {showText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`mt-4 ${sizes.text} ${colors.text} font-medium`}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {showText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 ${sizes.text} ${colors.text} font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Page Transition Loader
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="text-center"
    >
      <div className="relative w-32 h-32">
        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
        >
          <div className="w-full h-full rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl font-black bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
            SV
          </span>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300"
      >
        Loading ShoeVerse...
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-sm text-gray-500 dark:text-gray-400"
      >
        Premium sneakers loading
      </motion.p>
    </motion.div>
  </div>
);

// Content Loader (for lazy loading sections)
export const ContentLoader = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        {i < lines - 1 && (
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        )}
      </div>
    ))}
  </div>
);

// Image Loader
export const ImageLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
    />
  </div>
);

// Button Loader
export const ButtonLoader = ({ color = "primary" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`w-5 h-5 border-2 border-t-transparent rounded-full ${
      color === "primary" ? "border-white" : "border-primary-600"
    }`}
  />
);

// Skeleton Loader (for cards)
export const SkeletonLoader = ({ type = "card", count = 1 }) => {
  if (type === "card") {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 animate-pulse"
          >
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return null;
};

// Default export with all features
export default Loader;
