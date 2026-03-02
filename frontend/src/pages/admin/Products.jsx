import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiPackage,
  FiAlertCircle,
  FiDollarSign,
  FiTag,
  FiPercent,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useProducts } from "../../hooks/useProducts";
import { useThemeStore } from "../../store/themeStore";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import LoadingSpinner from "../../components/common/Loader";
import { exportToCSV } from "../../utils/exportUtils";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    productId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  const { getProducts, deleteProduct, toggleProductStatus } = useProducts();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  const categories = ["all", "running", "sports", "casual", "formal"];

  // Premium category colors with gradients
  const categoryColors = {
    running: {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      light: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
      dark: "bg-blue-500/20 text-blue-300 border-l-4 border-blue-400",
    },
    sports: {
      bg: "bg-gradient-to-r from-green-500 to-emerald-500",
      light: "bg-green-100 text-green-700 border-l-4 border-green-500",
      dark: "bg-green-500/20 text-green-300 border-l-4 border-green-400",
    },
    casual: {
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      light: "bg-purple-100 text-purple-700 border-l-4 border-purple-500",
      dark: "bg-purple-500/20 text-purple-300 border-l-4 border-purple-400",
    },
    formal: {
      bg: "bg-gradient-to-r from-gray-700 to-gray-900",
      light: "bg-gray-100 text-gray-700 border-l-4 border-gray-500",
      dark: "bg-gray-500/20 text-gray-300 border-l-4 border-gray-400",
    },
    default: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-500",
      light: "bg-amber-100 text-amber-700 border-l-4 border-amber-500",
      dark: "bg-amber-500/20 text-amber-300 border-l-4 border-amber-400",
    },
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page: currentPage,
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sort: sortBy,
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteModal.productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteModal({ show: false, productId: null });
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await toggleProductStatus(productId, !currentStatus);
      toast.success(
        `Product ${!currentStatus ? "activated" : "deactivated"} successfully`,
      );
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleExport = () => {
    exportToCSV(products, "products.csv");
    toast.success("Products exported successfully");
  };

  const getStockStatus = (totalStock) => {
    if (totalStock === 0)
      return {
        label: "Out of Stock",
        color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20",
        badge: "bg-gradient-to-r from-red-500 to-red-600",
      };
    if (totalStock < 10)
      return {
        label: "Low Stock",
        color:
          "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20",
        badge: "bg-gradient-to-r from-yellow-500 to-amber-500",
      };
    return {
      label: "In Stock",
      color:
        "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20",
      badge: "bg-gradient-to-r from-green-500 to-emerald-500",
    };
  };

  const getCategoryStyle = (category) => {
    const cat = category?.toLowerCase() || "default";
    return categoryColors[cat] || categoryColors.default;
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === "string") return firstImage;
      if (firstImage.url) return firstImage.url;
    }
    return product.image || null;
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Mobile Card View Component
  const MobileProductCard = ({ product, index }) => {
    const imageUrl = getImageUrl(product);
    const stockStatus = getStockStatus(product.totalStock);
    const categoryStyle = getCategoryStyle(product.category);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl border p-4 mb-3 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        {/* Header with Image and Basic Info */}
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover ring-2 ring-offset-2 ring-offset-gray-900 ring-gray-700/50"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FiImage
                  className={darkMode ? "text-gray-500" : "text-gray-400"}
                  size={24}
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-semibold truncate ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {product.name}
            </h3>
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {product.brand}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold inline-block ${
                  darkMode ? categoryStyle.dark : categoryStyle.light
                }`}
              >
                {capitalize(product.category)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold inline-block text-white ${stockStatus.badge}`}
              >
                {stockStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Price and Discount Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Current Price
            </p>
            <p
              className={`text-sm line-through ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {formatCurrency(product.currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Selling Price
            </p>
            <p
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {formatCurrency(product.sellPrice)}
            </p>
          </div>
        </div>

        {/* Stock and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiPackage
              className={darkMode ? "text-gray-400" : "text-gray-500"}
              size={14}
            />
            <span
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Stock: {product.totalStock || 0}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              product.isActive
                ? darkMode
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-700"
                : darkMode
                  ? "bg-red-500/20 text-red-400"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {product.isActive ? <FiEye size={12} /> : <FiEyeOff size={12} />}
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="mb-3">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
              darkMode
                ? "bg-green-500/20 text-green-400"
                : "bg-green-100 text-green-700"
            }`}
          >
            <FiPercent size={12} />
            {product.discount}% OFF
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-dashed">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggleStatus(product._id, product.isActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              product.isActive
                ? darkMode
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : darkMode
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {product.isActive ? "Deactivate" : "Activate"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode
                ? "hover:bg-gray-600 text-blue-400 hover:text-blue-300"
                : "hover:bg-gray-200 text-blue-600 hover:text-blue-700"
            }`}
          >
            <FiEdit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setDeleteModal({
                show: true,
                productId: product._id,
              })
            }
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode
                ? "hover:bg-gray-600 text-red-400 hover:text-red-300"
                : "hover:bg-gray-200 text-red-600 hover:text-red-700"
            }`}
          >
            <FiTrash2 size={16} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-3 sm:p-4 lg:p-6`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Products
          </h1>
          <p
            className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Manage your product inventory
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
         
          {/* View Toggle for Mobile */}
          <div className="flex items-center gap-1 mr-auto sm:mr-0">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? darkMode
                    ? "bg-primary-600/20 text-primary-400"
                    : "bg-primary-100 text-primary-600"
                  : darkMode
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors sm:hidden ${
                viewMode === "grid"
                  ? darkMode
                    ? "bg-primary-600/20 text-primary-400"
                    : "bg-primary-100 text-primary-600"
                  : darkMode
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiGrid size={18} />
            </button>
          </div>
          <button
            onClick={handleExport}
            className={`px-3 py-2 text-xs sm:text-sm font-medium border rounded-lg transition-all flex items-center gap-1.5 ${
              darkMode
                ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiDownload size={14} />
            <span className="hidden xs:inline">Export</span>
          </button>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="px-3 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg flex items-center gap-1.5 hover:shadow-lg transition-all"
          >
            <FiPlus size={14} />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div
          className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg`}
            >
              <FiPackage size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div>
              <p
                className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Total
              </p>
              <p
                className={`text-base sm:text-lg lg:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {products.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg`}
            >
              <FiAlertCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div>
              <p
                className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Low Stock
              </p>
              <p
                className={`text-base sm:text-lg lg:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {products.filter((p) => p.totalStock < 10).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={`rounded-lg sm:rounded-xl p-2 sm:p-3 border mb-4 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Search Input */}
          <div className="relative w-full">
            <FiSearch
              className={`absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                darkMode
                  ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`flex-1 min-w-[120px] px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                darkMode
                  ? "bg-gray-700/50 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`flex-1 min-w-[120px] px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                darkMode
                  ? "bg-gray-700/50 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div
          className={`text-center py-8 text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
        >
          No products found
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on Mobile */}
          <div
            className={`hidden md:block rounded-xl border overflow-hidden ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`text-xs font-semibold uppercase tracking-wider border-b ${
                    darkMode
                      ? "border-gray-700 bg-gray-900/50 text-gray-200"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <tr>
                    <th className="px-4 py-3 text-left">IMAGE</th>
                    <th className="px-4 py-3 text-left">NAME</th>
                    <th className="px-4 py-3 text-left">BRAND</th>
                    <th className="px-4 py-3 text-left">CATEGORY</th>
                    <th className="px-4 py-3 text-left">STOCK</th>
                    <th className="px-4 py-3 text-left">CURRENT</th>
                    <th className="px-4 py-3 text-left">SELL</th>
                    <th className="px-4 py-3 text-left">DISCOUNT</th>
                    <th className="px-4 py-3 text-left">STATUS</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const imageUrl = getImageUrl(product);
                    const stockStatus = getStockStatus(product.totalStock);
                    const categoryStyle = getCategoryStyle(product.category);

                    return (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b text-sm ${
                          darkMode
                            ? "border-gray-700/50 hover:bg-gray-700/30"
                            : "border-gray-200 hover:bg-gray-50/80"
                        } transition-colors`}
                      >
                        <td className="px-4 py-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover ring-2 ring-offset-2 ring-offset-gray-900 ring-gray-700/50"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <FiImage
                                className={
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }
                                size={16}
                              />
                            </div>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {product.name}
                        </td>
                        <td
                          className={`px-4 py-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                        >
                          {product.brand}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold inline-block ${
                              darkMode
                                ? categoryStyle.dark
                                : categoryStyle.light
                            }`}
                          >
                            {capitalize(product.category)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold inline-block text-white ${stockStatus.badge}`}
                          >
                            {stockStatus.label} ({product.totalStock || 0})
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            darkMode
                              ? "text-gray-400 line-through"
                              : "text-gray-500 line-through"
                          }`}
                        >
                          {formatCurrency(product.currentPrice)}
                        </td>
                        <td
                          className={`px-4 py-3 text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {formatCurrency(product.sellPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit ${
                              darkMode
                                ? "bg-green-500/20 text-green-400"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <FiPercent size={12} />
                            {product.discount}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              handleToggleStatus(product._id, product.isActive)
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              product.isActive
                                ? darkMode
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                                : darkMode
                                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {product.isActive ? (
                              <FiEye size={12} />
                            ) : (
                              <FiEyeOff size={12} />
                            )}
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/products/edit/${product._id}`)
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-600 text-blue-400"
                                  : "hover:bg-gray-200 text-blue-600"
                              }`}
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  show: true,
                                  productId: product._id,
                                })
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-600 text-red-400"
                                  : "hover:bg-gray-200 text-red-600"
                              }`}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="block md:hidden">
            {viewMode === "grid" ? (
              
              // Grid View for Tablets
              <div className="grid grid-cols-2 gap-3">
                {products.map((product, index) => (
                  <MobileProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              
              // List View for Mobile
              <div>
                {products.map((product, index) => (
                  <MobileProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className={`mt-4 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white border-gray-200"
              }`}
            >
              <p
                className={`text-xs sm:text-sm order-2 sm:order-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-1.5 sm:p-2 rounded-lg disabled:opacity-50 ${
                    darkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  <FiChevronLeft size={16} />
                </button>
                <span
                  className={`text-xs sm:text-sm font-medium px-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentPage}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-1.5 sm:p-2 rounded-lg disabled:opacity-50 ${
                    darkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <ConfirmationModal
            title="Delete Product"
            message="Are you sure you want to delete this product? This action cannot be undone."
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal({ show: false, productId: null })}
            type="danger"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
