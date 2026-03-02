import { useState, useEffect, useRef } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiTruck,
  FiStar,
  FiGlobe,
  FiAward,
  FiHeart,
  FiClock,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";

const Stats = () => {
  const [counts, setCounts] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "50px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const stats = [
    {
      id: 1,
      label: "Happy Customers",
      value: 50000,
      suffix: "+",
      icon: FiUsers,
      color: "from-blue-600 to-blue-400",
      bgColor: "bg-blue-500",
      lightColor: "bg-blue-100 dark:bg-blue-900/40",
      textColor: "text-blue-700 dark:text-blue-300",
      description: "Worldwide sneaker enthusiasts",
    },
    {
      id: 2,
      label: "Premium Products",
      value: 1000,
      suffix: "+",
      icon: FiShoppingBag,
      color: "from-green-600 to-green-400",
      bgColor: "bg-green-500",
      lightColor: "bg-green-100 dark:bg-green-900/40",
      textColor: "text-green-700 dark:text-green-300",
      description: "Curated from top brands",
    },
    {
      id: 3,
      label: "Orders Delivered",
      value: 150000,
      suffix: "+",
      icon: FiTruck,
      color: "from-orange-600 to-orange-400",
      bgColor: "bg-orange-500",
      lightColor: "bg-orange-100 dark:bg-orange-900/40",
      textColor: "text-orange-700 dark:text-orange-300",
      description: "Safely delivered worldwide",
    },
    {
      id: 4,
      label: "5-Star Reviews",
      value: 25000,
      suffix: "+",
      icon: FiStar,
      color: "from-yellow-600 to-yellow-400",
      bgColor: "bg-yellow-500",
      lightColor: "bg-yellow-100 dark:bg-yellow-900/40",
      textColor: "text-yellow-700 dark:text-yellow-300",
      description: "From satisfied customers",
    },
    {
      id: 5,
      label: "Countries Served",
      value: 50,
      suffix: "+",
      icon: FiGlobe,
      color: "from-purple-600 to-purple-400",
      bgColor: "bg-purple-500",
      lightColor: "bg-purple-100 dark:bg-purple-900/40",
      textColor: "text-purple-700 dark:text-purple-300",
      description: "Global shipping network",
    },
    {
      id: 6,
      label: "Years of Excellence",
      value: 5,
      suffix: "+",
      icon: FiAward,
      color: "from-indigo-600 to-indigo-400",
      bgColor: "bg-indigo-500",
      lightColor: "bg-indigo-100 dark:bg-indigo-900/40",
      textColor: "text-indigo-700 dark:text-indigo-300",
      description: "Serving sneakerheads since 2019",
    },
  ];

  const bottomStats = [
    {
      icon: FiHeart,
      label: "Satisfaction Rate",
      value: "99%",
      color: "from-pink-600 to-pink-400",
    },
    {
      icon: FiClock,
      label: "Avg. Delivery",
      value: "3-5 Days",
      color: "from-blue-600 to-blue-400",
    },
    {
      icon: FiMapPin,
      label: "Cities Covered",
      value: "500+",
      color: "from-green-600 to-green-400",
    },
    {
      icon: FiAward,
      label: "Authenticity",
      value: "100%",
      color: "from-yellow-600 to-yellow-400",
    },
  ];

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    stats.forEach((stat) => {
      const key = stat.label.toLowerCase().replace(/\s+/g, "");
      let current = 0;
      const end = stat.value;
      const step = Math.ceil(end / 60); // 60fps * 2 seconds = 120 steps

      const timer = setInterval(() => {
        current += step;
        if (current >= end) {
          setCounts((prev) => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setCounts((prev) => ({ ...prev, [key]: current }));
        }
      }, 16);

      return () => clearInterval(timer);
    });
  }, [isVisible]);

  return (
    <section
      ref={ref}
      className="relative py-12 xs:py-14 sm:py-16 md:py-18 lg:py-20 xl:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden bg-white dark:bg-gray-900"
    >
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "30px 30px xs:35px 35px sm:40px 40px",
            color: "rgba(0,0,0,0.05)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-full text-white mb-3 xs:mb-3.5 sm:mb-4 shadow-lg border border-primary-400 dark:border-primary-600">
            <FiTrendingUp className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider">
              OUR IMPACT
            </span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 xs:mb-2.5 sm:mb-3 text-gray-900 dark:text-white px-2">
            By the{" "}
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 dark:from-primary-400 dark:via-accent dark:to-pink-400 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Join thousands of satisfied sneakerheads who trust us for authentic,
            premium footwear
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const key = stat.label.toLowerCase().replace(/\s+/g, "");
            const count = counts[key] || 0;

            return (
              <div
                key={stat.id}
                className="group relative bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg xs:rounded-lg sm:rounded-xl bg-gradient-to-r ${stat.color} text-white mb-2 xs:mb-3 sm:mb-4 shadow-lg`}
                >
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </div>

                {/* Count */}
                <div className="flex items-baseline gap-0.5 xs:gap-1 mb-1 xs:mb-1.5 sm:mb-2">
                  <span className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 dark:text-white">
                    {count.toLocaleString()}
                  </span>
                  <span
                    className={`text-base xs:text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-1.5 sm:mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {stat.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-2 xs:mt-3 sm:mt-4 h-1 xs:h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                    style={{ width: isVisible ? "100%" : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-8 xs:mt-9 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
          {bottomStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg xs:rounded-lg sm:rounded-xl p-2 xs:p-2.5 sm:p-3 md:p-4 text-center border-2 border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors"
              >
                <Icon
                  className={`w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1 xs:mb-1.5 sm:mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                />
                <div className="text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mt-6 xs:mt-7 sm:mt-8 md:mt-9 lg:mt-10 xl:mt-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-700">
            <FiAward className="text-yellow-600 dark:text-yellow-400 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">
              Trusted by sneakerheads in 50+ countries
            </span>
            <div className="flex -space-x-1 xs:-space-x-1.5 sm:-space-x-2 ml-0.5 xs:ml-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-r from-primary-600 to-accent border-2 border-white dark:border-gray-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
