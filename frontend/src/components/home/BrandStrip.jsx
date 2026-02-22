import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';

const BrandStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { darkMode } = useThemeStore();

  // High-quality brand logos from official sources
  const brands = [
    { 
      name: 'Nike', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
      width: 70,
      height: 30
    },
    { 
      name: 'Adidas', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
      width: 90,
      height: 30
    },
    { 
      name: 'Jordan', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Jumpman_logo.svg',
      width: 50,
      height: 30
    },
    { 
      name: 'New Balance', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/New_Balance_logo.svg',
      width: 110,
      height: 30
    },
    { 
      name: 'Puma', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg',
      width: 70,
      height: 30
    },
    { 
      name: 'Reebok', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Reebok_logo.svg',
      width: 80,
      height: 30
    },
    { 
      name: 'Vans', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Vans_logo.svg',
      width: 80,
      height: 30
    },
    { 
      name: 'Converse', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg',
      width: 100,
      height: 30
    },
    { 
      name: 'Under Armour', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Under_Armour_logo.svg',
      width: 70,
      height: 30
    },
    { 
      name: 'Asics', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Asics_Logo.svg',
      width: 80,
      height: 30
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Duplicate brands for infinite scroll effect
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full mb-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✦ TRUSTED PARTNERS ✦
          </motion.span>
          <h3 className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Premium Brands You Love
          </h3>
        </motion.div>

        {/* Infinite Scrolling Strip */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
          
          {/* Scrolling Container */}
          <motion.div 
            className="flex items-center gap-16 whitespace-nowrap"
            animate={{ 
              x: [0, -2000]
            }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: (index % brands.length) * 0.02 }}
                className="flex items-center justify-center group cursor-pointer"
                whileHover={{ 
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ 
                      opacity: 0.5, 
                      scale: 1.5,
                      transition: { duration: 0.3 }
                    }}
                  />
                  
                  {/* Logo Container */}
                  <motion.div 
                    className="relative bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    whileHover={{ 
                      y: -4,
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)"
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      style={{ 
                        width: brand.width, 
                        height: brand.height,
                        filter: darkMode ? 'brightness(0) invert(0.9)' : 'brightness(0) invert(0.3)'
                      }}
                      className="transition-all duration-300 group-hover:filter group-hover:brightness-100 group-hover:invert-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        // Show fallback text
                        const parent = e.target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.className = 'text-lg font-bold text-gray-700 dark:text-gray-300';
                          fallback.textContent = brand.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center items-center gap-8 mt-12"
        >
          {[
            { value: '50+', label: 'Brands' },
            { value: '1000+', label: 'Products' },
            { value: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStrip;