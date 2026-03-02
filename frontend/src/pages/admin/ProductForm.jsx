import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiImage,
  FiSave,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiPercent,
  FiBox,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useProducts } from "../../hooks/useProducts";
import { uploadImage } from "../../services/cloudinary";
import { useThemeStore } from "../../store/themeStore";

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { darkMode } = useThemeStore();
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
  const [activeTab, setActiveTab] = useState("basic");

  const { createProduct, updateProduct } = useProducts();

  const categories = ["running", "sports", "casual", "formal"];
  const sizeOptions = ["US 6", "US 7", "US 8", "US 9", "US 10"];

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSelectedSizes(product.sizes || []);
      setStockInputs(product.stock || {});
    }
  }, [product]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));

      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    if (colorInput.name && colorInput.hex) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, { ...colorInput }],
      }));
      setColorInput({ name: "", hex: "#000000" });
    }
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

      setFormData((prevForm) => ({
        ...prevForm,
        sizes: newSizes,
      }));

      return newSizes;
    });
  };

  const handleStockChange = (size, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [size]: parseInt(value) || 0,
    }));

    setFormData((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0,
      },
    }));
  };

  const calculateDiscount = () => {
    if (formData.currentPrice && formData.sellPrice) {
      const current = Number(formData.currentPrice);
      const sell = Number(formData.sellPrice);
      if (current > sell) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        discount: calculateDiscount(),
        totalStock: calculateTotalStock(),
        currentPrice: Number(formData.currentPrice),
        sellPrice: Number(formData.sellPrice),
      };

      if (product) {
        await updateProduct(product._id, productData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }

      onSuccess();
    } catch (error) {
      toast.error(
        product ? "Failed to update product" : "Failed to create product",
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FiPackage },
    { id: "inventory", label: "Inventory", icon: FiBox },
    { id: "pricing", label: "Pricing", icon: FiDollarSign },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`sticky top-0 p-4 sm:p-6 border-b flex justify-between items-center z-10 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FiPackage
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
            </div>
            <h2
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {product ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <FiX size={18} sm:size={20} />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div
          className={`border-b sm:hidden ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex p-2 gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-700"
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Desktop Tabs - Hidden on mobile */}
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="e.g., Nike Air Max 270"
                    required
                  />
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="e.g., Nike"
                    required
                  />
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
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Describe your product..."
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isActive
                        ? "bg-green-500"
                        : "bg-gray-400 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.isActive ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Sizes and Stock */}
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Sizes & Stock *
                </label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                  {sizeOptions.map((size) => (
                    <div key={size} className="space-y-1 sm:space-y-2">
                      <button
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-primary-600 text-white shadow-lg"
                            : darkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                          className={`w-full px-2 py-1.5 sm:py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p
                  className={`text-xs sm:text-sm mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Stock:{" "}
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {calculateTotalStock()}
                  </span>{" "}
                  units
                </p>
              </div>

              {/* Colors */}
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Colors
                </label>
                <div className="flex flex-col xs:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    value={colorInput.name}
                    onChange={(e) =>
                      setColorInput({ ...colorInput, name: e.target.value })
                    }
                    placeholder="Color name"
                    className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={colorInput.hex}
                      onChange={(e) =>
                        setColorInput({ ...colorInput, hex: e.target.value })
                      }
                      className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg border cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      disabled={!colorInput.name}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {color.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="text-gray-400 hover:text-red-400 ml-1"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Product Images
                </label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
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
                        <FiTrash2 size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
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
                        <FiUpload className="text-gray-400 mb-1" size={18} />
                        <span className="text-xs text-gray-400">Upload</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label
                    className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Price ($) *
                  </label>
                  <div className="relative">
                    <FiDollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={14}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPrice: e.target.value,
                        })
                      }
                      className={`w-full pl-8 pr-3 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sell Price ($) *
                  </label>
                  <div className="relative">
                    <FiDollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={14}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, sellPrice: e.target.value })
                      }
                      className={`w-full pl-8 pr-3 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Discount
                  </label>
                  <div
                    className={`relative px-4 py-2 sm:py-2.5 rounded-lg border text-sm flex items-center justify-between ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">
                      {calculateDiscount()}%
                    </span>
                    <FiPercent className="text-gray-400" size={14} />
                  </div>
                </div>
              </div>

              {/* Price Preview */}
              {formData.currentPrice && formData.sellPrice && (
                <div
                  className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <h4
                    className={`text-xs font-medium mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Price Preview
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${formData.sellPrice}
                    </span>
                    {Number(formData.currentPrice) >
                      Number(formData.sellPrice) && (
                      <>
                        <span
                          className={`text-xs sm:text-sm line-through ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          ${formData.currentPrice}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                          Save $
                          {(formData.currentPrice - formData.sellPrice).toFixed(
                            2,
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div
            className={`sticky bottom-0 pt-4 border-t flex flex-col xs:flex-row gap-2 sm:gap-3 justify-end ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm transition-colors ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave size={14} />
                  {product ? "Update Product" : "Save Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;
