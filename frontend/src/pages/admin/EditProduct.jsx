import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiImage,
  FiPackage,
  FiDollarSign,
  FiPercent,
  FiEdit3,
  FiLoader,
  FiArrowLeft,
  FiAlertCircle,
  FiTag,
  FiBox,
  FiShoppingBag,
  FiToggleLeft,
  FiToggleRight,
  FiGrid,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useProducts } from "../../hooks/useProducts";
import { uploadImage } from "../../services/cloudinary";
import { useThemeStore } from "../../store/themeStore";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProductById, updateProduct } = useProducts();
  const { darkMode } = useThemeStore();

  const [formLoading, setFormLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [validationErrors, setValidationErrors] = useState({});

  // Use ref to track if data is already loaded
  const dataLoadedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "running",
    sizes: [],
    stock: {},
    colors: [],
    images: [],
    currentPrice: "",
    sellPrice: "",
    description: "",
    isActive: true,
  });

  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  const categories = ["running", "sports", "casual", "formal"];
  const sizeOptions = ["US 6", "US 7", "US 8", "US 9", "US 10"];

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FiEdit3 },
    { id: "inventory", label: "Inventory", icon: FiPackage },
  ];

  useEffect(() => {
    console.log("Active tab:", activeTab);
    console.log("Form data state:", {
      name: formData.name,
      brand: formData.brand,
      currentPrice: formData.currentPrice,
      sellPrice: formData.sellPrice,
      sizesCount: formData.sizes.length,
      colorsCount: formData.colors.length,
      description: formData.description ? "present" : "empty",
    });
  }, [activeTab, formData]);

  // Fetch product data only once on mount
  useEffect(() => {
    if (!dataLoadedRef.current) {
      fetchProduct();
    }
    return () => {
    };
  }, []);

  const fetchProduct = async () => {
    setFormLoading(true);
    try {
      const product = await getProductById(id);

      console.log("Fetched product:", product);

      // Safe data extraction with fallbacks
      const safeProduct = {
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "running",
        sizes: product.sizes || [],
        stock: product.stock || {},
        colors: product.colors || [],
        images: product.images || [],
        currentPrice: product.currentPrice || "",
        sellPrice: product.sellPrice || "",
        description: product.description || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
      };

      setFormData(safeProduct);
      setSelectedSizes(product.sizes || []);
      setStockInputs(product.stock || {});

      // Mark as loaded
      dataLoadedRef.current = true;
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle tab change, just update active tab, don't reset data
  const handleTabChange = (tabId) => {
    console.log("🔄 Switching to tab:", tabId);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));

      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully`,
      );
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const handleAddColor = () => {
    if (!colorInput.name.trim()) {
      toast.error("Please enter a color name");
      return;
    }

    const isDuplicate = formData.colors.some(
      (c) => c.name.toLowerCase() === colorInput.name.toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("Color already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: colorInput.name,
          hex: colorInput.hex,
        },
      ],
    }));

    setColorInput({ name: "", hex: "#000000" });
    toast.success(`Added color: ${colorInput.name}`);
  };

  const handleRemoveColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) => {
      const newSizes = prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size];

      setFormData((prevForm) => {
        const newFormData = {
          ...prevForm,
          sizes: newSizes,
        };

        if (prev.includes(size)) {
          const newStock = { ...prevForm.stock };
          delete newStock[size];
          newFormData.stock = newStock;

          setStockInputs((prevStock) => {
            const newStockInputs = { ...prevStock };
            delete newStockInputs[size];
            return newStockInputs;
          });
        }

        return newFormData;
      });

      return newSizes;
    });
  };

  const handleStockChange = (size, value) => {
    const numValue = value === "" ? 0 : Math.max(0, parseInt(value) || 0);

    setStockInputs((prev) => ({
      ...prev,
      [size]: numValue,
    }));

    setFormData((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: numValue,
      },
    }));
  };

  const handlePriceChange = (field, value) => {
    const numValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);

    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const calculateDiscount = () => {
    if (formData.currentPrice && formData.sellPrice) {
      const current = parseFloat(formData.currentPrice);
      const sell = parseFloat(formData.sellPrice);
      if (current > 0 && sell > 0 && sell < current) {
        const discount = (((current - sell) / current) * 100).toFixed(0);
        return discount;
      }
    }
    return 0;
  };

  const calculateTotalStock = () => {
    return Object.values(stockInputs).reduce(
      (sum, stock) => sum + (stock || 0),
      0,
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.brand.trim()) errors.brand = "Brand name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";

    if (formData.sizes.length === 0) {
      errors.sizes = "Select at least one size";
    } else {
      const missingStock = formData.sizes.some(
        (size) => !formData.stock[size] || formData.stock[size] <= 0,
      );
      if (missingStock) {
        errors.stock = "Enter stock quantity for all selected sizes";
      }
    }

    if (formData.currentPrice <= 0) {
      errors.currentPrice = "Current price must be greater than 0";
    }
    if (formData.sellPrice <= 0) {
      errors.sellPrice = "Sell price must be greater than 0";
    }
    if (formData.sellPrice > formData.currentPrice) {
      errors.sellPrice = "Sell price cannot be higher than current price";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        currentPrice: parseFloat(formData.currentPrice),
        sellPrice: parseFloat(formData.sellPrice),
        discount: parseInt(calculateDiscount()),
        totalStock: calculateTotalStock(),
      };

      console.log("Submitting product data:", productData);

      await updateProduct(id, productData);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (formLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center px-4">
          <FiLoader className="animate-spin text-primary-500 text-4xl sm:text-5xl mx-auto mb-4" />
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <FiArrowLeft size={18} sm:size={20} />
          </button>
          <div>
            <h1
              className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Product
            </h1>
            <p
              className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Update your product information
            </p>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div
          className={`sm:hidden mb-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-1 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
         
          {/* Single Column Layout */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Desktop Tabs */}
            <div
              className={`hidden sm:flex gap-2 border-b pb-4 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-primary-600 text-white"
                        : darkMode
                          ? "text-gray-400 hover:bg-gray-800"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content with AnimatePresence */}
            <AnimatePresence mode="wait">
              
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <motion.div
                  key="basic-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                    darkMode
                      ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                      : "bg-white border-gray-200 shadow-lg"
                  }`}
                >
                  <h2
                    className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FiEdit3 className="text-primary-500" />
                    Basic Information
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="e.g., Nike Air Max 270"
                          required
                        />
                        {validationErrors.name && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <FiAlertCircle size={12} />
                            {validationErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Brand Name *
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                          }
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="e.g., Nike"
                          required
                        />
                        {validationErrors.brand && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <FiAlertCircle size={12} />
                            {validationErrors.brand}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Category *
                      </label>
                      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, category: cat })
                            }
                            className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              formData.category === cat
                                ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                                : darkMode
                                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows="4"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder="Enter product description..."
                        required
                      />
                      {validationErrors.description && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          {validationErrors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Inventory Tab */}
              {activeTab === "inventory" && (
                <motion.div
                  key="inventory-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Sizes & Stock Section */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <h2
                      className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FiBox className="text-blue-500" />
                      Sizes & Stock *
                    </h2>

                    {validationErrors.sizes && (
                      <p className="mb-3 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {validationErrors.sizes}
                      </p>
                    )}
                    {validationErrors.stock && (
                      <p className="mb-3 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {validationErrors.stock}
                      </p>
                    )}

                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                      {sizeOptions.map((size) => (
                        <div key={size} className="space-y-1 sm:space-y-2">
                          <button
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              selectedSizes.includes(size)
                                ? "bg-gradient-to-r from-primary-600 to-accent text-white shadow-lg"
                                : darkMode
                                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {size}
                          </button>
                          {selectedSizes.includes(size) && (
                            <input
                              type="number"
                              min="0"
                              value={stockInputs[size] || ""}
                              onChange={(e) =>
                                handleStockChange(size, e.target.value)
                              }
                              placeholder="Qty"
                              className={`w-full px-2 py-1.5 sm:py-2 rounded-lg border text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                darkMode
                                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div
                      className={`mt-4 p-3 sm:p-4 rounded-xl ${
                        darkMode ? "bg-gray-700/30" : "bg-gray-100"
                      }`}
                    >
                      <p
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Stock
                      </p>
                      <p
                        className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {calculateTotalStock()} units
                      </p>
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <h2
                      className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FiGrid className="text-purple-500" />
                      Colors
                    </h2>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={colorInput.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const colorMap = {
                              red: "#FF0000",
                              blue: "#0000FF",
                              green: "#00FF00",
                              yellow: "#FFFF00",
                              purple: "#800080",
                              orange: "#FFA500",
                              pink: "#FFC0CB",
                              brown: "#A52A2A",
                              black: "#000000",
                              white: "#FFFFFF",
                              gray: "#808080",
                              grey: "#808080",
                              navy: "#000080",
                              teal: "#008080",
                              maroon: "#800000",
                              olive: "#808000",
                              lime: "#00FF00",
                              aqua: "#00FFFF",
                              fuchsia: "#FF00FF",
                              silver: "#C0C0C0",
                              gold: "#FFD700",
                              indigo: "#4B0082",
                              violet: "#EE82EE",
                              cyan: "#00FFFF",
                              magenta: "#FF00FF",
                              coral: "#FF7F50",
                              salmon: "#FA8072",
                              beige: "#F5F5DC",
                              ivory: "#FFFFF0",
                              khaki: "#F0E68C",
                              lavender: "#E6E6FA",
                              turquoise: "#40E0D0",
                              peach: "#FFDAB9",
                              mint: "#98FB98",
                            };
                            const lowerName = name.toLowerCase();
                            let hex = "#000000";
                            if (colorMap[lowerName]) {
                              hex = colorMap[lowerName];
                            }
                            setColorInput({ name: name, hex: hex });
                          }}
                          placeholder="Enter color name (e.g., Red, Blue, Green)"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      </div>

                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 shadow-lg"
                          style={{ backgroundColor: colorInput.hex }}
                        />
                        <button
                          type="button"
                          onClick={handleAddColor}
                          className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                        >
                          <FiPlus size={14} />
                          <span className="hidden xs:inline">Add</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <p
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Current colors ({formData.colors.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                              darkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-gray-100 border-gray-200"
                            }`}
                          >
                            <div
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-lg"
                              style={{
                                backgroundColor: color.hex,
                                border:
                                  color.hex === "#FFFFFF"
                                    ? "1px solid rgba(0,0,0,0.1)"
                                    : "none",
                              }}
                            />
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {color.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(index)}
                              className={`p-0.5 sm:p-1 rounded-full transition-colors ${
                                darkMode
                                  ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                  : "text-gray-500 hover:text-red-600 hover:bg-gray-200"
                              }`}
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {formData.colors.length === 0 && (
                        <div
                          className={`p-6 sm:p-8 text-center border border-dashed rounded-lg ${
                            darkMode
                              ? "border-gray-700 text-gray-500"
                              : "border-gray-200 text-gray-400"
                          }`}
                        >
                          No colors added yet
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p
                        className={`text-xs mb-2 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Suggested colors:
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {[
                          "Red",
                          "Blue",
                          "Green",
                          "Yellow",
                          "Purple",
                          "Orange",
                          "Pink",
                          "Black",
                          "White",
                        ].map((colorName) => (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => {
                              const colorMap = {
                                Red: "#FF0000",
                                Blue: "#0000FF",
                                Green: "#00FF00",
                                Yellow: "#FFFF00",
                                Purple: "#800080",
                                Orange: "#FFA500",
                                Pink: "#FFC0CB",
                                Black: "#000000",
                                White: "#FFFFFF",
                              };
                              setColorInput({
                                name: colorName,
                                hex: colorMap[colorName],
                              });
                            }}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs transition-colors ${
                              darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {colorName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <h2
                      className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FiDollarSign className="text-yellow-500" />
                      Pricing
                    </h2>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Current Price ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.currentPrice}
                          onChange={(e) =>
                            handlePriceChange("currentPrice", e.target.value)
                          }
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="99.99"
                          required
                        />
                        {validationErrors.currentPrice && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <FiAlertCircle size={12} />
                            {validationErrors.currentPrice}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Sell Price ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.sellPrice}
                          onChange={(e) =>
                            handlePriceChange("sellPrice", e.target.value)
                          }
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="79.99"
                          required
                        />
                        {validationErrors.sellPrice && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <FiAlertCircle size={12} />
                            {validationErrors.sellPrice}
                          </p>
                        )}
                      </div>

                      <div
                        className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${
                          darkMode
                            ? "from-green-500/20 to-emerald-500/20"
                            : "from-green-500/10 to-emerald-500/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs sm:text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Discount
                          </span>
                          <span
                            className={`text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-1 ${
                              darkMode ? "text-green-400" : "text-green-600"
                            }`}
                          >
                            {calculateDiscount()}%
                            <FiPercent size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Images Section */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <h2
                      className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FiImage className="text-purple-500" />
                      Product Images
                    </h2>

                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiTrash2 size={10} className="text-white" />
                          </button>
                        </div>
                      ))}

                      {formData.images.length < 5 && (
                        <label
                          className={`border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            darkMode
                              ? "border-gray-600 hover:border-primary-500"
                              : "border-gray-300 hover:border-primary-500"
                          }`}
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                          {uploading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
                          ) : (
                            <>
                              <FiUpload
                                className="text-gray-400 mb-1"
                                size={16}
                              />
                              <span className="text-[10px] text-gray-400">
                                Upload
                              </span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                    <p
                      className={`text-[10px] ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {formData.images.length}/5 images (JPEG, PNG)
                    </p>
                  </div>

                  {/* Status Section */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-xl border-gray-700/50"
                        : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <h2
                      className={`text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FiShoppingBag className="text-green-500" />
                      Product Status
                    </h2>

                    <div
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                        darkMode ? "bg-gray-700/30" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Active Product
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            isActive: !formData.isActive,
                          })
                        }
                        className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${
                          formData.isActive
                            ? "bg-green-500"
                            : darkMode
                              ? "bg-gray-600"
                              : "bg-gray-400"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 sm:w-4 sm:h-4 bg-white rounded-full transition-transform ${
                            formData.isActive
                              ? "translate-x-5 sm:translate-x-6"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className={`w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiSave size={14} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
