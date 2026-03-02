import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShoppingBag,
  FiGrid,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiStar,
  FiAward,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import { useThemeStore } from "../../store/themeStore";

const CategoryShowcase = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const { darkMode } = useThemeStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = [
    {
      id: 1,
      name: "Men's Collection",
      description: "Streetwear essentials for the modern man",
      longDescription:
        "From classic Air Max to limited edition collaborations, discover sneakers that define your style.",
      count: "124 Products",
      bgColor: "from-blue-600 to-indigo-600",
      lightColor: "bg-blue-100 dark:bg-blue-900/50",
      textColor: "text-blue-700 dark:text-blue-300",
      trend: "+25%",
      featured: ["Air Max", "Ultraboost", "Retro"],
      link: "/products?category=men",
      gradient: "from-blue-500 to-indigo-600",
      icon: FiPackage,
      image:
        "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&auto=format&fit=crop",
      overlay: "from-blue-600/90 to-indigo-600/90",
    },
    {
      id: 2,
      name: "Women's Collection",
      description: "Trendsetting kicks for every occasion",
      longDescription:
        "Elevate your style with our curated selection of women's sneakers from top brands.",
      count: "98 Products",
      bgColor: "from-pink-600 to-rose-600",
      lightColor: "bg-pink-100 dark:bg-pink-900/50",
      textColor: "text-pink-700 dark:text-pink-300",
      trend: "+32%",
      featured: ["Platform", "Running", "Lifestyle"],
      link: "/products?category=women",
      gradient: "from-pink-500 to-rose-600",
      icon: FiAward,
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop",
      overlay: "from-pink-600/90 to-rose-600/90",
    },
    {
      id: 3,
      name: "Kids' Collection",
      description: "Mini sneakerheads in the making",
      longDescription:
        "Comfortable, durable, and stylish sneakers for your little ones. Built to last through every adventure.",
      count: "56 Products",
      bgColor: "from-green-600 to-emerald-600",
      lightColor: "bg-green-100 dark:bg-green-900/50",
      textColor: "text-green-700 dark:text-green-300",
      trend: "+18%",
      featured: ["School", "Sports", "Casual"],
      link: "/products?category=kids",
      gradient: "from-green-500 to-emerald-600",
      icon: FiShield,
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop",
      overlay: "from-green-600/90 to-emerald-600/90",
    },
    {
      id: 4,
      name: "Limited Edition",
      description: "Exclusive drops you won't find elsewhere",
      longDescription:
        "Be among the first to own these rare and exclusive collaborations. Limited quantities available.",
      count: "23 Products",
      bgColor: "from-orange-600 to-red-600",
      lightColor: "bg-orange-100 dark:bg-orange-900/50",
      textColor: "text-orange-700 dark:text-orange-300",
      badge: "HOT",
      trend: "+45%",
      featured: ["Collaborations", "Anniversary", "Special"],
      link: "/products?category=limited",
      gradient: "from-orange-500 to-red-600",
      icon: FiZap,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop",
      overlay: "from-orange-600/90 to-red-600/90",
    },
    {
      id: 5,
      name: "Sports Performance",
      description: "Engineered for peak performance",
      longDescription:
        "Advanced technology meets athletic design. Sneakers built to enhance your game.",
      count: "87 Products",
      bgColor: "from-cyan-600 to-blue-600",
      lightColor: "bg-cyan-100 dark:bg-cyan-900/50",
      textColor: "text-cyan-700 dark:text-cyan-300",
      trend: "+15%",
      featured: ["Running", "Training", "Basketball"],
      link: "/products?category=sports",
      gradient: "from-cyan-500 to-blue-600",
      icon: FiTrendingUp,
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop",
      overlay: "from-cyan-600/90 to-blue-600/90",
    },
    {
      id: 6,
      name: "Classic Collection",
      description: "Timeless designs that never go out of style",
      longDescription:
        "Iconic silhouettes that have stood the test of time. The foundation of every sneaker collection.",
      count: "112 Products",
      bgColor: "from-amber-600 to-yellow-600",
      lightColor: "bg-amber-100 dark:bg-amber-900/50",
      textColor: "text-amber-700 dark:text-amber-300",
      trend: "+12%",
      featured: ["Vintage", "Retro", "Originals"],
      link: "/products?category=classic",
      gradient: "from-amber-500 to-yellow-600",
      icon: FiStar,
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop",
      overlay: "from-amber-600/90 to-yellow-600/90",
    },
  ];

  const filters = [
    { id: "all", label: "All", icon: FiGrid },
    { id: "trending", label: "Trending", icon: FiTrendingUp },
    { id: "new", label: "New", icon: FiClock },
    { id: "limited", label: "Limited", icon: FiZap },
  ];

  const filteredCategories =
    activeFilter === "all"
      ? categories
      : activeFilter === "trending"
        ? categories.filter((c) => parseInt(c.trend) > 20)
        : activeFilter === "new"
          ? categories.slice(0, 4)
          : categories.filter((c) => c.badge);

  return (
    <section className="relative py-12 xs:py-14 sm:py-16 md:py-18 lg:py-20 xl:py-24 px-2 xs:px-3 sm:px-4 overflow-hidden bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/*Background Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
            color: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 dark:bg-accent/15 rounded-full blur-3xl hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 xs:px-5 py-2 xs:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-full text-white mb-4 xs:mb-5 shadow-xl relative overflow-hidden group border border-primary-400 dark:border-primary-600">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <FiShoppingBag className="w-3 h-3 xs:w-4 xs:h-4 relative z-10" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider relative z-10">
              PREMIUM COLLECTIONS
            </span>
            <FiShoppingBag className="w-3 h-3 xs:w-4 xs:h-4 relative z-10" />
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 xs:mb-3 sm:mb-4 text-gray-900 dark:text-white px-2">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-primary-600 via-accent to-pink-600 dark:from-primary-400 dark:via-accent dark:to-pink-400 bg-clip-text text-transparent relative inline-block">
              Style
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-accent dark:from-primary-400 dark:to-accent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform hidden sm:block" />
            </span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Curated collections for every sneaker enthusiast, from iconic
            classics to exclusive limited drops
          </p>
        </div>

        {/* Premium Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 xs:gap-2.5 sm:gap-3 mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 px-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 xs:gap-1.5 sm:gap-2 overflow-hidden group ${
                  isActive
                    ? "text-white shadow-xl scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent dark:from-primary-700 dark:to-accent" />
                )}
                <Icon
                  size={12}
                  xs:size={14}
                  sm:size={16}
                  className="relative z-10"
                />
                <span
                  className={`relative z-10 ${isMobile ? "hidden sm:inline" : ""}`}
                >
                  {filter.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full hidden sm:block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 px-2">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              onMouseEnter={() => !isMobile && setHoveredId(category.id)}
              onMouseLeave={() => !isMobile && setHoveredId(null)}
              className="group relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[425px] lg:h-[450px] xl:h-[500px] rounded-xl xs:rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  hoveredId === category.id
                    ? "from-black/95 via-black/70 to-black/40"
                    : "from-black/90 via-black/60 to-black/30"
                } transition-all duration-500`}
              />

              {/* Content Container */}
              <div className="absolute inset-0 p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-end">
                
                {/* Badge */}
                {category.badge && (
                  <div className="absolute top-3 xs:top-4 sm:top-5 md:top-6 left-3 xs:left-4 sm:left-5 md:left-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md animate-pulse opacity-80" />
                      <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 xs:px-3 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-xs font-bold flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 shadow-xl border border-white/30">
                        <FiZap className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 animate-pulse" />
                        {category.badge}
                      </div>
                    </div>
                  </div>
                )}

                {/* Icon with Animation */}
                <div
                  className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg xs:rounded-lg sm:rounded-xl bg-gradient-to-r ${category.gradient} p-0.5 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 transform transition-all duration-500 ${
                    hoveredId === category.id ? "scale-110 rotate-3" : ""
                  }`}
                >
                  <div className="w-full h-full bg-black/30 backdrop-blur-sm rounded-lg xs:rounded-lg sm:rounded-xl flex items-center justify-center">
                    <category.icon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-2.5xl lg:text-3xl font-bold text-white mb-1 xs:mb-1.5 sm:mb-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-sm lg:text-base mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 line-clamp-2 transform transition-all duration-300 group-hover:opacity-100">
                  {hoveredId === category.id && !isMobile
                    ? category.longDescription
                    : category.description}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4">
                  <span className="text-white/80 text-[8px] xs:text-[9px] sm:text-xs md:text-xs lg:text-sm flex items-center gap-1 xs:gap-1.5">
                    <FiShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    {category.count}
                  </span>
                  <span className="text-white/80 text-[8px] xs:text-[9px] sm:text-xs md:text-xs lg:text-sm flex items-center gap-1 xs:gap-1.5">
                    <FiTrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-green-400" />
                    {category.trend}
                  </span>
                </div>

                {/* Featured Tags */}
                <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                  {category.featured.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-0.5 xs:py-0.5 sm:py-1 ${category.lightColor} ${category.textColor} text-[8px] xs:text-[9px] sm:text-xs font-bold rounded-full backdrop-blur-sm border border-white/20`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Shop Now Button */}
                <div className="inline-flex items-center gap-1 xs:gap-1.5 text-white font-bold text-[10px] xs:text-xs sm:text-sm group/btn">
                  <span className="relative">
                    Shop Now
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover/btn:w-full transition-all duration-300 hidden sm:block" />
                  </span>
                  <FiArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </div>

                {/* Corner Accent */}
                <div
                  className={`absolute top-0 right-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-t-2 border-r-2 border-white/40 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-b-2 border-l-2 border-white/40 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
              </div>

              {/* Floating Stats Card - Desktop Only */}
              {hoveredId === category.id && !isMobile && (
                <div className="absolute top-4 xs:top-5 sm:top-6 right-4 xs:right-5 sm:right-6 bg-black/30 backdrop-blur-md rounded-lg xs:rounded-lg sm:rounded-xl p-2 xs:p-2.5 border border-white/30 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 xs:gap-2.5">
                    <div className="flex items-center gap-1 xs:gap-1.5">
                      <div className="w-1.5 h-1.5 xs:w-1.8 xs:h-1.8 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white text-[8px] xs:text-[9px] sm:text-xs font-medium">
                        In Stock
                      </span>
                    </div>
                    <div className="w-px h-2 xs:h-2.5 sm:h-3 bg-white/30" />
                    <span className="text-white text-[8px] xs:text-[9px] sm:text-xs font-medium">
                      24h shipping
                    </span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16">
          <Link to="/products">
            <button className="group relative px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden border border-primary-400 dark:border-primary-600">
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-1.5 xs:gap-2">
                Explore All Categories
                <FiArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mt-4 xs:mt-5 sm:mt-6 md:mt-7 lg:mt-8 px-2">
          <div className="inline-flex items-center gap-2 xs:gap-2.5 px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-0.5 xs:gap-1">
              <FiStar className="text-yellow-500 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <FiStar className="text-yellow-500 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <FiStar className="text-yellow-500 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <FiStar className="text-yellow-500 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <FiStar className="text-yellow-500 fill-current w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </div>
            <span className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Trusted by 50,000+ sneakerheads
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
