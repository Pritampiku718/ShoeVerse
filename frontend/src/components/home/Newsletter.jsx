import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiRefreshCw
} from 'react-icons/fi';

const Newsletter = () => {
  const [email, setEmail] = useState('');
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
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const benefits = [
    { icon: FiGift, text: '10% Welcome Discount', color: 'from-pink-500 to-rose-500' },
    { icon: FiZap, text: 'Early Access to Drops', color: 'from-yellow-500 to-orange-500' },
    { icon: FiStar, text: 'Exclusive Releases', color: 'from-purple-500 to-indigo-500' },
    { icon: FiHeart, text: 'Member Only Events', color: 'from-red-500 to-pink-500' },
  ];

  const stats = [
    { value: '50K+', label: 'Subscribers', icon: FiHeart },
    { value: '24/7', label: 'Support', icon: FiBell },
    { value: '100%', label: 'Satisfaction', icon: FiStar },
  ];

  const floatingIcons = [
    { Icon: FiShoppingBag, delay: 0, x: '10%', y: '20%', size: 24 },
    { Icon: FiCreditCard, delay: 1, x: '85%', y: '30%', size: 28 },
    { Icon: FiTruck, delay: 2, x: '15%', y: '70%', size: 32 },
    { Icon: FiRefreshCw, delay: 3, x: '75%', y: '80%', size: 26 },
    { Icon: FiStar, delay: 4, x: '45%', y: '15%', size: 20 },
    { Icon: FiHeart, delay: 5, x: '55%', y: '85%', size: 22 },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900/30 to-gray-900">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-primary-600/30 to-accent/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Icons with Parallax */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block text-white/5"
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
            ease: "easeInOut"
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Glass Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          }}
          className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[40px] p-8 md:p-16 border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-accent-500/10" />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-600 to-accent rounded-full text-white mb-8 shadow-xl"
              >
                <FiZap className="animate-pulse" />
                <span className="text-sm font-bold tracking-wider">VIP ACCESS</span>
                <FiZap className="animate-pulse" />
              </motion.div>

              {/* Headline */}
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                Join the{' '}
                <span className="bg-gradient-to-r from-primary-400 via-accent to-pink-400 bg-clip-text text-transparent">
                  Inner Circle
                </span>
              </h2>

              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Be the first to know about exclusive drops, limited editions, and member-only offers. 
                Join 50,000+ sneakerheads who never miss out.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-2 bg-gradient-to-r ${benefit.color} rounded-lg shadow-lg`}>
                      <benefit.icon className="text-white" size={16} />
                    </div>
                    <span className="text-white/80 text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <stat.icon size={12} />
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Form Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FiMail className="text-primary-400" />
                  Get 10% Off Your First Order
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input with Premium Animation */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-2xl blur-md"
                      animate={{
                        opacity: focusedField ? 0.5 : 0,
                      }}
                    />
                    
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                      
                      <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField(true)}
                        onBlur={() => setFocusedField(false)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-36 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all duration-300"
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
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent text-white font-semibold rounded-xl overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            {/* Shine Effect */}
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              initial={{ x: '-100%' }}
                              animate={{ x: isHovered ? '100%' : '-100%' }}
                              transition={{ duration: 0.5 }}
                            />
                            
                            <span className="relative flex items-center gap-2">
                              Subscribe
                              <FiSend className="group-hover:translate-x-1 transition-transform" />
                            </span>
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2"
                          >
                            <FiCheck />
                            <span>Subscribed!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <FiCheck size={12} className="text-green-400" />
                      No spam
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCheck size={12} className="text-green-400" />
                      Unsubscribe anytime
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCheck size={12} className="text-green-400" />
                      Secure
                    </span>
                  </div>
                </form>

                {/* Social Proof */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/40 mb-3">Trusted by sneakerheads from:</p>
                  <div className="flex flex-wrap gap-3">
                    {['Nike', 'Adidas', 'Jordan', 'New Balance'].map((brand) => (
                      <span key={brand} className="text-white/60 text-xs px-3 py-1 bg-white/5 rounded-full">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-primary-600/20 to-accent/20 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-2xl"
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
          className="text-center text-white/30 text-sm mt-8"
        >
          By subscribing, you agree to our Privacy Policy and consent to receive updates from ShoeVerse
        </motion.p>
      </div>
    </section>
  );
};

export default Newsletter;