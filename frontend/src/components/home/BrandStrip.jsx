import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useThemeStore } from "../../store/themeStore";

const BrandStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { darkMode } = useThemeStore();

  // High-quality brand logos from official sources
  const brands = [
    {
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      width: 70,
      height: 30,
    },
    {
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      width: 90,
      height: 30,
    },
    {
      name: "Jordan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/37/Jumpman_logo.svg",
      width: 50,
      height: 30,
    },
    {
      name: "New Balance",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/New_Balance_logo.svg",
      width: 110,
      height: 30,
    },
    {
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",
      width: 70,
      height: 30,
    },
    {
      name: "Reebok",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Reebok_logo.svg",
      width: 80,
      height: 30,
    },
    {
      name: "Vans",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/76/Vans_logo.svg",
      width: 80,
      height: 30,
    },
    {
      name: "Converse",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg",
      width: 100,
      height: 30,
    },
    {
      name: "Under Armour",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Under_Armour_logo.svg",
      width: 70,
      height: 30,
    },
    {
      name: "Asics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Asics_Logo.svg",
      width: 80,
      height: 30,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Duplicate brands for infinite scroll effect
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 xs:py-12 sm:py-14 md:py-16 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 xs:mb-7 sm:mb-8 md:mb-9 lg:mb-10"
        >
          <motion.span
            className="inline-block px-3 xs:px-3.5 sm:px-4 py-1 xs:py-1.5 bg-primary-200 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-[10px] xs:text-xs font-bold rounded-full mb-2 xs:mb-2.5 border border-primary-300 dark:border-primary-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✦ TRUSTED PARTNERS ✦
          </motion.span>
          <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 dark:text-gray-300">
            Premium Brands You Love
          </h3>
        </motion.div>

        {/* Infinite Scrolling Strip */}
        <div className="relative">
          
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 bg-gradient-to-r from-gray-100 via-gray-100/80 to-transparent dark:from-gray-900 dark:via-gray-900/90 dark:to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 bg-gradient-to-l from-gray-100 via-gray-100/80 to-transparent dark:from-gray-900 dark:via-gray-900/90 dark:to-transparent z-10"></div>

          {/* Scrolling Container */}
          <motion.div
            className="flex items-center gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16 whitespace-nowrap"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
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
                  transition: { type: "spring", stiffness: 300, damping: 15 },
                }}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary-500/30 dark:bg-primary-500/40 rounded-full blur-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      opacity: 0.7,
                      scale: 1.5,
                      transition: { duration: 0.3 },
                    }}
                  />

                  {/* Logo Container */}
                  <motion.div
                    className="relative bg-white dark:bg-gray-800 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-xl xs:rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    whileHover={{
                      y: -4,
                      boxShadow:
                        "0 25px 30px -5px rgba(59,130,246,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      style={{
                        width:
                          brand.width *
                          (window.innerWidth < 640
                            ? 0.7
                            : window.innerWidth < 768
                              ? 0.8
                              : window.innerWidth < 1024
                                ? 0.9
                                : 1),
                        height:
                          brand.height *
                          (window.innerWidth < 640
                            ? 0.7
                            : window.innerWidth < 768
                              ? 0.8
                              : window.innerWidth < 1024
                                ? 0.9
                                : 1),
                        filter: darkMode
                          ? "brightness(0) invert(1) brightness(1.2)"
                          : "brightness(0) invert(0.4) sepia(0.2)",
                      }}
                      className="transition-all duration-300 group-hover:filter group-hover:brightness-100 group-hover:invert-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        const parent = e.target.parentElement;
                        if (parent) {
                          const fallback = document.createElement("span");
                          fallback.className =
                            "text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-800 dark:text-gray-200";
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
          className="flex justify-center items-center gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 mt-8 xs:mt-9 sm:mt-10 md:mt-11 lg:mt-12"
        >
          {[
            { value: "50+", label: "Brands" },
            { value: "1000+", label: "Products" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <div className="text-lg xs:text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-primary-700 to-accent dark:from-primary-400 dark:to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-[10px] xs:text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5 xs:mt-1">
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
