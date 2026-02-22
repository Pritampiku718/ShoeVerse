import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiRefreshCw,
  FiSliders,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const ProductFilters = ({
  onFilterChange,
  initialFilters = {},
  categories = [],
  brands = [],
  sizes = [],
  priceRange = { min: 0, max: 500 },
  className = "",
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize filters from props
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    brands: initialFilters.brands || [],
    sizes: initialFilters.sizes || [],
    priceMin: initialFilters.priceMin || priceRange.min,
    priceMax: initialFilters.priceMax || priceRange.max,
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const filterRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Update tempFilters when initialFilters changes from parent
  useEffect(() => {
    setFilters({
      categories: initialFilters.categories || [],
      brands: initialFilters.brands || [],
      sizes: initialFilters.sizes || [],
      priceMin: initialFilters.priceMin || priceRange.min,
      priceMax: initialFilters.priceMax || priceRange.max,
    });
  }, [initialFilters, priceRange.min, priceRange.max]);

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
    "US 7",
    "US 8",
    "US 9",
    "US 10",
    "US 11",
    "US 12",
    "US 13",
  ];

  const handleCategoryToggle = (categoryId) => {
    setTempFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleBrandToggle = (brandId) => {
    setTempFilters((prev) => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId];
      
      return {
        ...prev,
        brands: newBrands,
      };
    });
  };

  const handleSizeToggle = (size) => {
    setTempFilters((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      
      return {
        ...prev,
        sizes: newSizes,
      };
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
    
    setIsOpen(false);
    
    const filterSummary = [];
    if (tempFilters.categories.length) filterSummary.push(`${tempFilters.categories.length} categories`);
    if (tempFilters.brands.length) filterSummary.push(`${tempFilters.brands.length} brands`);
    if (tempFilters.sizes.length) filterSummary.push(`${tempFilters.sizes.length} sizes`);
    if (tempFilters.priceMin > priceRange.min || tempFilters.priceMax < priceRange.max) 
      filterSummary.push(`$${tempFilters.priceMin}-$${tempFilters.priceMax}`);
    
    if (filterSummary.length > 0) {
      toast.success(`Filters applied: ${filterSummary.join(', ')}`);
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
      categories: prev.categories.filter(id => id !== categoryId)
    }));
  };

  const clearBrand = (brandId) => {
    setTempFilters((prev) => ({
      ...prev,
      brands: prev.brands.filter(id => id !== brandId)
    }));
  };

  const clearSize = (size) => {
    setTempFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const clearPrice = () => {
    setTempFilters((prev) => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.brands.length) count += filters.brands.length;
    if (filters.sizes.length) count += filters.sizes.length;
    if (filters.priceMin > priceRange.min || filters.priceMax < priceRange.max)
      count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Get active filters from tempFilters for display
  const getTempActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.categories.length) count += tempFilters.categories.length;
    if (tempFilters.brands.length) count += tempFilters.brands.length;
    if (tempFilters.sizes.length) count += tempFilters.sizes.length;
    if (tempFilters.priceMin > priceRange.min || tempFilters.priceMax < priceRange.max)
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
    <div ref={filterRef} className={`relative ${className}`}>
      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-full"
      >
        <FiSliders size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filters
        </span>
        {activeFilterCount > 0 && (
          <span className="ml-auto px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
            {activeFilterCount}
          </span>
        )}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown size={16} className="text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-[340px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            style={{
              maxHeight: '480px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header - Fixed */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiFilter className="text-primary-600" />
                  Filter Products
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search filters..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-3">
                {["categories", "brands", "sizes", "price"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content Area - Takes remaining space */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Main Content */}
              <div className="p-4">
                {/* Categories */}
                {activeTab === "categories" && (
                  <div className="space-y-2">
                    {(searchTerm ? filteredCategories : categoryData).map(
                      (category) => (
                        <label
                          key={category.id}
                          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={tempFilters.categories.includes(
                                category.id,
                              )}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                            {category.count}
                          </span>
                        </label>
                      ),
                    )}
                    {filteredCategories.length === 0 && searchTerm && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No categories found
                      </p>
                    )}
                  </div>
                )}

                {/* Brands */}
                {activeTab === "brands" && (
                  <div className="space-y-2">
                    {(searchTerm ? filteredBrands : brandData).map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={tempFilters.brands.includes(brand.id)}
                            onChange={() => handleBrandToggle(brand.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {brand.name}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {brand.count}
                        </span>
                      </label>
                    ))}
                    {filteredBrands.length === 0 && searchTerm && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No brands found
                      </p>
                    )}
                  </div>
                )}

                {/* Sizes */}
                {activeTab === "sizes" && (
                  <div className="grid grid-cols-3 gap-2">
                    {sizeData.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          tempFilters.sizes.includes(size)
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}

                {/* Price */}
                {activeTab === "price" && (
                  <div className="space-y-4">
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
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min={priceRange.min}
                          max={tempFilters.priceMax}
                        />
                      </div>
                      <span className="text-gray-400 mt-6">-</span>
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
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min={tempFilters.priceMin}
                          max={priceRange.max}
                        />
                      </div>
                    </div>

                    {/* Simple slider */}
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="absolute h-full bg-primary-600 rounded-full"
                        style={{
                          left: `${((tempFilters.priceMin - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                          width: `${((tempFilters.priceMax - tempFilters.priceMin) / (priceRange.max - priceRange.min)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Summary - Only show if there are active filters in tempFilters */}
              {tempActiveFilterCount > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active filters:</p>
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                    {/* Category filters */}
                    {tempFilters.categories.map((catId) => {
                      const category = categoryData.find(c => c.id === catId);
                      return category ? (
                        <span
                          key={`cat-${catId}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                        >
                          {category.name}
                          <button
                            onClick={() => clearCategory(catId)}
                            className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                          >
                            <FiX size={10} />
                          </button>
                        </span>
                      ) : null;
                    })}
                    
                    {/* Brand filters */}
                    {tempFilters.brands.map((brandId) => {
                      const brand = brandData.find(b => b.id === brandId);
                      return brand ? (
                        <span
                          key={`brand-${brandId}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                        >
                          {brand.name}
                          <button
                            onClick={() => clearBrand(brandId)}
                            className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                          >
                            <FiX size={10} />
                          </button>
                        </span>
                      ) : null;
                    })}
                    
                    {/* Size filters */}
                    {tempFilters.sizes.map((size) => (
                      <span
                        key={`size-${size}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                      >
                        {size}
                        <button
                          onClick={() => clearSize(size)}
                          className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                        >
                          <FiX size={10} />
                        </button>
                      </span>
                    ))}
                    
                    {/* Price filter */}
                    {(tempFilters.priceMin > priceRange.min || tempFilters.priceMax < priceRange.max) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                        ${tempFilters.priceMin} - ${tempFilters.priceMax}
                        <button
                          onClick={clearPrice}
                          className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5"
                        >
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiRefreshCw size={14} />
                  Reset
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheck size={14} />
                  Apply {tempActiveFilterCount > 0 && `(${tempActiveFilterCount})`}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;