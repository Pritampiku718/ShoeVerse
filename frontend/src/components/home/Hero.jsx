import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

const Hero = () => {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Updated ShoeVerse Premium Branding Content
  const heroContent = {
    title: 'ShoeVerse',
    subtitle: 'Step Into Your Greatness',
    description:
      'ShoeVerse is where innovation meets identity. We craft premium footwear experiences designed for confidence, performance, and timeless style. Every step tells your story — make it unforgettable.',
    image:
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1920',
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black -mt-20">
      {/* Background Image */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[120%] top-0 left-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <img
          src={heroContent.image}
          alt={heroContent.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 flex items-center h-full pt-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-8">
              
              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl md:text-2xl text-white/70 font-light tracking-wide"
              >
                {heroContent.subtitle}
              </motion.h2>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-6xl md:text-8xl font-black leading-none"
              >
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  {heroContent.title}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-xl leading-relaxed"
              >
                {heroContent.description}
              </motion.p>

              {/* CTA Only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-4"
              >
                <Link
                  to="/products"
                  className="group relative overflow-hidden rounded-full"
                >
                  <span className="relative inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Explore Collection
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right Empty Space */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <FiChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;