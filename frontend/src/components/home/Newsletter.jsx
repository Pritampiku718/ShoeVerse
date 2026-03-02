import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiCheck,
  FiGift,
  FiPercent,
  FiStar,
  FiHeart,
  FiZap,
  FiSend,
  FiBell,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const benefits = [
    {
      icon: FiGift,
      text: "10% Welcome Discount",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: FiZap,
      text: "Early Access to Drops",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiStar,
      text: "Exclusive Releases",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FiHeart,
      text: "Member Only Events",
      color: "from-red-500 to-pink-500",
    },
  ];

  const stats = [
    { value: "50K+", label: "Subscribers", icon: FiHeart },
    { value: "24/7", label: "Support", icon: FiBell },
    { value: "100%", label: "Satisfaction", icon: FiStar },
  ];

  const floatingIcons = [
    { Icon: FiShoppingBag, delay: 0, x: "10%", y: "20%", size: 24 },
    { Icon: FiCreditCard, delay: 1, x: "85%", y: "30%", size: 28 },
    { Icon: FiTruck, delay: 2, x: "15%", y: "70%", size: 32 },
    { Icon: FiRefreshCw, delay: 3, x: "75%", y: "80%", size: 26 },
    { Icon: FiStar, delay: 4, x: "45%", y: "15%", size: 20 },
    { Icon: FiHeart, delay: 5, x: "55%", y: "85%", size: 22 },
  ];

  return (
    <section className="relative py-20 xs:py-24 sm:py-28 md:py-32 px-2 xs:px-3 sm:px-4 overflow-hidden">
     
     {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900/40 to-gray-900 dark:from-gray-950 dark:via-primary-900/50 dark:to-gray-950">
        
        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "30px 30px xs:35px 35px sm:40px 40px",
          }}
        />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[300px] xs:w-[400px] sm:w-[500px] h-[300px] xs:h-[400px] sm:h-[500px] bg-gradient-to-r from-primary-500/40 to-accent/40 dark:from-primary-500/50 dark:to-accent/50 rounded-full blur-3xl hidden md:block"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[350px] xs:w-[450px] sm:w-[600px] h-[350px] xs:h-[450px] sm:h-[600px] bg-gradient-to-r from-purple-500/40 to-pink-500/40 dark:from-purple-500/50 dark:to-pink-500/50 rounded-full blur-3xl hidden md:block"
        />
      </div>

      {/* Floating Icons with Parallax */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block text-white/10 dark:text-white/15"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10 px-2 xs:px-3 sm:px-4">
        
        {/* Glass Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          }}
          className="relative bg-gradient-to-br from-white/20 to-white/10 dark:from-white/25 dark:to-white/15 backdrop-blur-2xl rounded-2xl xs:rounded-3xl sm:rounded-[40px] p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12 xl:p-16 border border-white/30 dark:border-white/40 shadow-2xl overflow-hidden"
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-accent-500/20 dark:from-primary-500/30 dark:to-accent-500/30" />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Premium Badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 bg-gradient-to-r from-primary-600 to-accent dark:from-primary-700 dark:to-accent rounded-full text-white mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 shadow-xl border border-white/30"
              >
                <FiZap className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
                  VIP ACCESS
                </span>
                <FiZap className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </motion.div>

              {/* Headline */}
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 leading-tight">
                Join the{" "}
                <span className="bg-gradient-to-r from-primary-400 via-accent to-pink-400 dark:from-primary-300 dark:via-accent dark:to-pink-300 bg-clip-text text-transparent">
                  Inner Circle
                </span>
              </h2>

              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/80 dark:text-white/80 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 leading-relaxed">
                Be the first to know about exclusive drops, limited editions,
                and member-only offers. Join 50,000+ sneakerheads who never miss
                out.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-1 xs:gap-1.5 sm:gap-2"
                  >
                    <div
                      className={`p-1 xs:p-1.5 sm:p-2 bg-gradient-to-r ${benefit.color} rounded-lg shadow-lg`}
                    >
                      <benefit.icon className="text-white w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-white/90 dark:text-white/90 text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 xs:mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[8px] xs:text-[9px] sm:text-xs text-white/60 dark:text-white/60 flex items-center gap-0.5 xs:gap-1">
                      <stat.icon size={10} xs:size={11} sm:size={12} />
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Form Card */}
              <div className="bg-white/10 dark:bg-white/15 backdrop-blur-sm rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 border border-white/30 dark:border-white/40">
                <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <FiMail className="text-primary-400 w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
                  Get 10% Off Your First Order
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 xs:space-y-3.5 sm:space-y-4"
                >
                  {/* Email Input */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent rounded-xl xs:rounded-xl sm:rounded-2xl blur-md"
                      animate={{
                        opacity: focusedField ? 0.6 : 0,
                      }}
                    />

                    <div className="relative">
                      <FiMail className="absolute left-3 xs:left-3.5 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />

                      <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField(true)}
                        onBlur={() => setFocusedField(false)}
                        placeholder="Enter your email address"
                        className="w-full pl-9 xs:pl-10 sm:pl-12 pr-24 xs:pr-28 sm:pr-36 py-2 xs:py-2.5 sm:py-3 md:py-4 bg-white/20 dark:bg-white/25 border border-white/30 dark:border-white/40 rounded-xl xs:rounded-xl sm:rounded-2xl text-white placeholder-white/50 dark:placeholder-white/60 text-xs xs:text-sm sm:text-base focus:outline-none focus:border-primary-500 transition-all duration-300"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />

                      <AnimatePresence>
                        {!isSubmitted ? (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            type="submit"
                            className="absolute right-1 xs:right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-primary-600 to-accent dark:from-primary-700 dark:to-accent text-white font-semibold rounded-lg xs:rounded-lg sm:rounded-xl text-xs xs:text-xs sm:text-sm overflow-hidden group border border-white/20"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            {/* Shine Effect */}
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                              initial={{ x: "-100%" }}
                              animate={{ x: isHovered ? "100%" : "-100%" }}
                              transition={{ duration: 0.5 }}
                            />

                            <span className="relative flex items-center gap-1 xs:gap-1.5">
                              Subscribe
                              <FiSend className="group-hover:translate-x-1 transition-transform w-3 h-3 xs:w-3.5 xs:h-3.5" />
                            </span>
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-1 xs:right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg xs:rounded-lg sm:rounded-xl flex items-center gap-1 xs:gap-1.5 text-xs xs:text-xs sm:text-sm border border-white/20"
                          >
                            <FiCheck className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                            <span>Subscribed!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 text-[8px] xs:text-[9px] sm:text-xs text-white/60 dark:text-white/60">
                    <span className="flex items-center gap-0.5 xs:gap-1">
                      <FiCheck
                        size={10}
                        className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400"
                      />
                      No spam
                    </span>
                    <span className="flex items-center gap-0.5 xs:gap-1">
                      <FiCheck
                        size={10}
                        className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400"
                      />
                      Unsubscribe anytime
                    </span>
                    <span className="flex items-center gap-0.5 xs:gap-1">
                      <FiCheck
                        size={10}
                        className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400"
                      />
                      Secure
                    </span>
                  </div>
                </form>

                {/* Social Proof */}
                <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8 pt-4 xs:pt-5 sm:pt-6 border-t border-white/20 dark:border-white/30">
                  <p className="text-xs xs:text-xs sm:text-sm text-white/50 dark:text-white/50 mb-2 xs:mb-2.5">
                    Trusted by sneakerheads from:
                  </p>
                  <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
                    {["Nike", "Adidas", "Jordan", "New Balance"].map(
                      (brand) => (
                        <span
                          key={brand}
                          className="text-white/70 dark:text-white/70 text-[8px] xs:text-[9px] sm:text-xs px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-0.5 xs:py-1 bg-white/10 dark:bg-white/15 rounded-full"
                        >
                          {brand}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 h-16 xs:h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-r from-primary-500/30 to-accent-500/30 dark:from-primary-500/40 dark:to-accent-500/40 rounded-full blur-2xl hidden md:block"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-20 xs:w-24 sm:w-28 md:w-32 lg:w-40 h-20 xs:h-24 sm:h-28 md:h-32 lg:h-40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 dark:from-purple-500/40 dark:to-pink-500/40 rounded-full blur-2xl hidden md:block"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 dark:text-white/40 text-[8px] xs:text-[9px] sm:text-xs md:text-sm mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8"
        >
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from ShoeVerse
        </motion.p>
      </div>
    </section>
  );
};

export default Newsletter;
