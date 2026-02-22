import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiTruck, 
  FiStar,
  FiGlobe,
  FiAward,
  FiTrendingUp,
  FiHeart,
  FiClock,
  FiMapPin
} from 'react-icons/fi';

const Stats = () => {
  const [counts, setCounts] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    reviews: 0,
    countries: 0,
    years: 0
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  const stats = [
    {
      id: 1,
      label: 'Happy Customers',
      value: 50000,
      suffix: '+',
      icon: FiUsers,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500',
      description: 'Worldwide sneaker enthusiasts'
    },
    {
      id: 2,
      label: 'Premium Products',
      value: 1000,
      suffix: '+',
      icon: FiShoppingBag,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500',
      description: 'Curated from top brands'
    },
    {
      id: 3,
      label: 'Orders Delivered',
      value: 150000,
      suffix: '+',
      icon: FiTruck,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500',
      description: 'Safely delivered worldwide'
    },
    {
      id: 4,
      label: '5-Star Reviews',
      value: 25000,
      suffix: '+',
      icon: FiStar,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500',
      description: 'From satisfied customers'
    },
    {
      id: 5,
      label: 'Countries Served',
      value: 50,
      suffix: '+',
      icon: FiGlobe,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500',
      description: 'Global shipping network'
    },
    {
      id: 6,
      label: 'Years of Excellence',
      value: 5,
      suffix: '+',
      icon: FiAward,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500',
      description: 'Serving sneakerheads since 2019'
    }
  ];

  // Animate counters when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      stats.forEach((stat) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounts(prev => ({ ...prev, [getStatKey(stat.label)]: end }));
            clearInterval(timer);
          } else {
            setCounts(prev => ({ ...prev, [getStatKey(stat.label)]: Math.floor(start) }));
          }
        }, 16);
        
        return () => clearInterval(timer);
      });
    }
  }, [isInView]);

  const getStatKey = (label) => {
    const map = {
      'Happy Customers': 'customers',
      'Premium Products': 'products',
      'Orders Delivered': 'orders',
      '5-Star Reviews': 'reviews',
      'Countries Served': 'countries',
      'Years of Excellence': 'years'
    };
    return map[label];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />

        {/* Floating Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-primary-600/20 to-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -200, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

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
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent rounded-full text-white mb-6 shadow-xl"
          >
            <FiTrendingUp className="animate-pulse" />
            <span className="text-sm font-bold tracking-wider">OUR IMPACT</span>
            <FiTrendingUp className="animate-pulse" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            By the{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent to-pink-400 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied sneakerheads who trust us for authentic, premium footwear
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = counts[getStatKey(stat.label)] || 0;

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                className="group relative"
              >
                {/* Background Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Main Card */}
                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    }}
                    animate={{
                      backgroundPosition: ['0px 0px', '20px 20px'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Corner Accent */}
                  <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 ${stat.bgColor} rounded-tl-2xl opacity-30`} />
                  <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 ${stat.bgColor} rounded-br-2xl opacity-30`} />

                  {/* Icon with Animation */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${stat.color} p-0.5`}
                  >
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-xl blur-md -z-10`}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Count with Animation */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-black text-white"
                    >
                      {count.toLocaleString()}
                    </motion.span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">
                    {stat.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '100%' } : { width: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>

                  {/* Hover Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4"
                  >
                    <div className={`w-2 h-2 rounded-full ${stat.bgColor} animate-pulse`} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: FiHeart, label: 'Satisfaction Rate', value: '99%', color: 'from-pink-500 to-rose-500' },
            { icon: FiClock, label: 'Avg. Delivery', value: '3-5 Days', color: 'from-blue-500 to-cyan-500' },
            { icon: FiMapPin, label: 'Cities Covered', value: '500+', color: 'from-green-500 to-emerald-500' },
            { icon: FiAward, label: 'Authenticity', value: '100%', color: 'from-yellow-500 to-orange-500' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
            >
              <item.icon className={`text-2xl mx-auto mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <FiAward className="text-yellow-500" />
            <span className="text-white/80 text-sm">Trusted by sneakerheads in 50+ countries</span>
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-600 to-accent border-2 border-gray-900"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;