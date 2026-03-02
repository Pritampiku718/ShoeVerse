import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiChevronUp,
  FiCheck,
  FiSliders,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const MobileProductFilters = ({
  onFilterChange,
  initialFilters = {},
  categories = [],
  brands = [],
  sizes = [],
  priceRange = { min: 0, max: 500 },
  onClose,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState(true);

  // Initialize filters from props
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    brands: initialFilters.brands || [],
    sizes: initialFilters.sizes || [],
    priceMin: initialFilters.priceMin || priceRange.min,
    priceMax: initialFilters.priceMax || priceRange.max,
  });

  const [tempFilters, setTempFilters] = useState(filters);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle drag to close
  const handleDragEnd = (event, info) => {
    if (info.offset.y > 120) {
      onClose();
    }
  };

  // Sample data
  const defaultCategories = [
    { id: "running", name: "Running", count: 124 },
    { id: "basketball", name: "Basketball", count: 89 },
    { id: "lifestyle", name: "Lifestyle", count: 156 },
    { id: "training", name: "Training", count: 67 },
    { id: "skate", name: "Skate", count: 45 },
    { id: "classics", name: "Classics", count: 92 },
  ];

  const defaultBrands = [
    { id: "nike", name: "Nike", count: 234 },
    { id: "adidas", name: "Adidas", count: 189 },
    { id: "jordan", name: "Jordan", count: 67 },
    { id: "newbalance", name: "New Balance", count: 98 },
    { id: "puma", name: "Puma", count: 76 },
    { id: "reebok", name: "Reebok", count: 54 },
  ];

  const defaultSizes = [
    "US 6",
    "US 7",
    "US 8",
    "US 9",
    "US 10",
    "US 11",
    "US 12",
  ];

  const handleCategoryToggle = (categoryId) => {
    setTempFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleBrandToggle = (brandId) => {
    setTempFilters((prev) => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId];
      return { ...prev, brands: newBrands };
    });
  };

  const handleSizeToggle = (size) => {
    setTempFilters((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    setTempFilters((prev) => ({
      ...prev,
      [type === "min" ? "priceMin" : "priceMax"]: numValue,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    if (onFilterChange) {
      onFilterChange(tempFilters);
    }
    onClose();

    const filterSummary = [];
    if (tempFilters.categories.length)
      filterSummary.push(`${tempFilters.categories.length} categories`);
    if (tempFilters.brands.length)
      filterSummary.push(`${tempFilters.brands.length} brands`);
    if (tempFilters.sizes.length)
      filterSummary.push(`${tempFilters.sizes.length} sizes`);
    if (
      tempFilters.priceMin > priceRange.min ||
      tempFilters.priceMax < priceRange.max
    )
      filterSummary.push(`$${tempFilters.priceMin}-$${tempFilters.priceMax}`);

    if (filterSummary.length > 0) {
      toast.success(`Filters applied: ${filterSummary.join(", ")}`);
    } else {
      toast.success("All filters cleared");
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      brands: [],
      sizes: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
    toast.success("All filters cleared");
  };

  const clearCategory = (categoryId) => {
    setTempFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const clearBrand = (brandId) => {
    setTempFilters((prev) => ({
      ...prev,
      brands: prev.brands.filter((id) => id !== brandId),
    }));
  };

  const clearSize = (size) => {
    setTempFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const clearPrice = () => {
    setTempFilters((prev) => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    }));
  };

  const getTempActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.categories.length) count += tempFilters.categories.length;
    if (tempFilters.brands.length) count += tempFilters.brands.length;
    if (tempFilters.sizes.length) count += tempFilters.sizes.length;
    if (
      tempFilters.priceMin > priceRange.min ||
      tempFilters.priceMax < priceRange.max
    )
      count += 1;
    return count;
  };

  const tempActiveFilterCount = getTempActiveFilterCount();

  const filteredCategories = defaultCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredBrands = defaultBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categoryData = categories.length > 0 ? categories : defaultCategories;
  const brandData = brands.length > 0 ? brands : defaultBrands;
  const sizeData = sizes.length > 0 ? sizes : defaultSizes;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Drag Handle Indicator */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FiSliders className="text-primary-600 dark:text-primary-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Filter Products
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                aria-label="Close filters"
              >
                <FiX size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Subheader */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Narrow down your perfect pair
              </p>
            </div>

            {/* Expand/Collapse Toggle */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium"
              >
                {mobileExpanded ? (
                  <>
                    <FiChevronUp size={18} />
                    <span>Collapse filters</span>
                  </>
                ) : (
                  <>
                    <FiChevronDown size={18} />
                    <span>Expand filters</span>
                  </>
                )}
              </button>
              {tempActiveFilterCount > 0 && (
                <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                  {tempActiveFilterCount} active
                </span>
              )}
            </div>

            {/* Independent Scroll Area */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {mobileExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 space-y-4">
                      
                      {/* Search */}
                      <div className="relative">
                        <FiSearch
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search filters..."
                          className="w-full pl-10 pr-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {["categories", "brands", "sizes", "price"].map(
                          (tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                                activeTab === tab
                                  ? "bg-primary-600 text-white shadow-lg"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {tab.charAt(0).toUpperCase() + tab.slice(1)}
                              {tab === "categories" &&
                                tempFilters.categories.length > 0 && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                    {tempFilters.categories.length}
                                  </span>
                                )}
                              {tab === "brands" &&
                                tempFilters.brands.length > 0 && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                    {tempFilters.brands.length}
                                  </span>
                                )}
                              {tab === "sizes" &&
                                tempFilters.sizes.length > 0 && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                    {tempFilters.sizes.length}
                                  </span>
                                )}
                            </button>
                          ),
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="space-y-4">
                       
                        {/* Categories */}
                        {activeTab === "categories" && (
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {(searchTerm
                              ? filteredCategories
                              : categoryData
                            ).map((category) => (
                              <label
                                key={category.id}
                                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={tempFilters.categories.includes(
                                      category.id,
                                    )}
                                    onChange={() =>
                                      handleCategoryToggle(category.id)
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">
                                    {category.name}
                                  </span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                                  {category.count}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Brands */}
                        {activeTab === "brands" && (
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {(searchTerm ? filteredBrands : brandData).map(
                              (brand) => (
                                <label
                                  key={brand.id}
                                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={tempFilters.brands.includes(
                                        brand.id,
                                      )}
                                      onChange={() =>
                                        handleBrandToggle(brand.id)
                                      }
                                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                      {brand.name}
                                    </span>
                                  </div>
                                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                                    {brand.count}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        )}

                        {/* Sizes */}
                        {activeTab === "sizes" && (
                          <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                            {sizeData.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeToggle(size)}
                                className={`px-3 py-3.5 text-sm font-medium rounded-xl transition-all ${
                                  tempFilters.sizes.includes(size)
                                    ? "bg-primary-600 text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        {activeTab === "price" && (
                          <div className="space-y-5">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Min ($)
                                </label>
                                <input
                                  type="number"
                                  value={tempFilters.priceMin}
                                  onChange={(e) =>
                                    handlePriceChange("min", e.target.value)
                                  }
                                  className="w-full px-3 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                  min={priceRange.min}
                                  max={tempFilters.priceMax}
                                />
                              </div>
                              <span className="text-gray-400 dark:text-gray-500 mt-6">
                                -
                              </span>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Max ($)
                                </label>
                                <input
                                  type="number"
                                  value={tempFilters.priceMax}
                                  onChange={(e) =>
                                    handlePriceChange("max", e.target.value)
                                  }
                                  className="w-full px-3 py-3.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                  min={tempFilters.priceMin}
                                  max={priceRange.max}
                                />
                              </div>
                            </div>

                            {/* Range slider */}
                            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div
                                className="absolute h-full bg-primary-500 dark:bg-primary-400 rounded-full"
                                style={{
                                  left: `${((tempFilters.priceMin - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                                  width: `${((tempFilters.priceMax - tempFilters.priceMin) / (priceRange.max - priceRange.min)) * 100}%`,
                                }}
                              />
                            </div>

                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>${priceRange.min}</span>
                              <span>${priceRange.max}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Active Filters */}
                      {tempActiveFilterCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Active filters:
                          </p>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                            {tempFilters.categories.map((catId) => {
                              const category = categoryData.find(
                                (c) => c.id === catId,
                              );
                              return category ? (
                                <span
                                  key={`cat-${catId}`}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                                >
                                  {category.name}
                                  <button
                                    onClick={() => clearCategory(catId)}
                                    className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                                  >
                                    <FiX size={12} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                            {tempFilters.brands.map((brandId) => {
                              const brand = brandData.find(
                                (b) => b.id === brandId,
                              );
                              return brand ? (
                                <span
                                  key={`brand-${brandId}`}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                                >
                                  {brand.name}
                                  <button
                                    onClick={() => clearBrand(brandId)}
                                    className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                                  >
                                    <FiX size={12} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                            {tempFilters.sizes.map((size) => (
                              <span
                                key={`size-${size}`}
                                className="inline-flex items-center gap-1 px-2 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                              >
                                {size}
                                <button
                                  onClick={() => clearSize(size)}
                                  className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                                >
                                  <FiX size={12} />
                                </button>
                              </span>
                            ))}
                            {(tempFilters.priceMin > priceRange.min ||
                              tempFilters.priceMax < priceRange.max) && (
                              <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                                ${tempFilters.priceMin} - $
                                {tempFilters.priceMax}
                                <button
                                  onClick={clearPrice}
                                  className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                                >
                                  <FiX size={12} />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Bottom Action Buttons */}
            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 pt-4 pb-6 px-4 border-t border-gray-200 dark:border-gray-800 shadow-lg">
              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-3.5 bg-primary-600 dark:bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 hover:shadow-lg transition-all"
                >
                  Apply{" "}
                  {tempActiveFilterCount > 0 && `(${tempActiveFilterCount})`}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileProductFilters;
