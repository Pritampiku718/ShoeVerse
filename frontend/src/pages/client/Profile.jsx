import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEdit2,
  FiSave,
  FiCamera,
  FiLogOut,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiAward,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiArrowLeft,
  FiSettings,
  FiBell,
  FiShoppingBag,
  FiDollarSign,
  FiGift,
  FiRefreshCw,
  FiAlertCircle,
  FiTruck,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiSun,
  FiGlobe,
  FiCreditCard,
  FiSmartphone,
  FiMonitor,
  FiCpu,
  FiDatabase,
  FiCloud,
  FiDownload,
  FiKey,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-hot-toast";

const Profile = () => {
  const {
    user,
    logout,
    updateProfile,
    updateAvatar,
    changePassword,
    deleteAccount,
    isLoading,
  } = useAuthStore();
  const { orders, fetchMyOrders } = useOrderStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarHover, setAvatarHover] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      orders: true,
      promotions: true,
      newsletter: false,
      productAlerts: true,
      priceDrops: true,
      restocks: true,
      reviews: false,
    },
    push: {
      orders: true,
      promotions: false,
      productAlerts: true,
      priceDrops: true,
      restocks: true,
    },
    sms: {
      orders: true,
      promotions: false,
      delivery: true,
    },
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showBirthday: false,
    showOrderHistory: true,
    showWishlist: true,
    allowDataCollection: true,
    allowCookies: true,
    allowTracking: false,
  });

  const [appSettings, setAppSettings] = useState({
    theme: localStorage.getItem("theme") || "light",
    language: "en",
    currency: "USD",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    animations: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
    compactView: false,
    autoPlay: true,
    wifiOnly: true,
    darkMode: localStorage.getItem("theme") === "dark",
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "visa",
      last4: "4242",
      exp: "12/25",
      name: user?.name || "John Doe",
      default: true,
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      exp: "08/24",
      name: user?.name || "John Doe",
      default: false,
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      name: "Home",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      default: true,
    },
    {
      id: 2,
      type: "work",
      name: "Work",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "USA",
      default: false,
    },
  ]);

  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 1,
      name: "iPhone 14 Pro",
      type: "mobile",
      lastActive: "Now",
      location: "New York, USA",
      icon: FiSmartphone,
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "desktop",
      lastActive: "2 hours ago",
      location: "New York, USA",
      icon: FiMonitor,
    },
  ]);

  const [dataUsage, setDataUsage] = useState({
    storageUsed: "245 MB",
    lastBackup: "2024-01-15",
    devices: 2,
    downloads: 45,
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    memberSince: "",
    reviews: 0,
    loyaltyPoints: 0,
  });

  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      const totalSpent = orders
        .filter((order) => order.orderStatus === "Delivered")
        .reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlistItems.length,
        memberSince: user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "2026",
        reviews: 12,
        loyaltyPoints: Math.floor(totalSpent * 10),
      });
    }
  }, [orders, wishlistItems, user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (avatarRef.current) {
          avatarRef.current.src = reader.result;
        }
      };
      reader.readAsDataURL(file);

      await updateAvatar(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    await updateProfile({ name, email, phone });
    setIsEditing(false);
  };

  const validatePassword = () => {
    const errors = {
      current: "",
      new: "",
      confirm: "",
    };
    let isValid = true;

    if (!currentPassword) {
      errors.current = "Current password is required";
      isValid = false;
    }

    if (!newPassword) {
      errors.new = "New password is required";
      isValid = false;
    } else if (newPassword.length < 6) {
      errors.new = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirm = "Please confirm your new password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match";
      isValid = false;
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.new = "New password must be different from current password";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setPasswordErrors({ current: "", new: "", confirm: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      if (message.toLowerCase().includes("current password")) {
        setPasswordErrors((prev) => ({ ...prev, current: message }));
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!deletePassword) {
        toast.error("Please enter your password to confirm");
        return;
      }

      await deleteAccount(deletePassword);
      setShowDeleteConfirm(false);
      setDeletePassword("");
      navigate("/");
    } catch (error) {
      console.error("Delete account failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleToggleTheme = () => {
    const newTheme = appSettings.theme === "light" ? "dark" : "light";
    setAppSettings({
      ...appSettings,
      theme: newTheme,
      darkMode: newTheme === "dark",
    });
    localStorage.setItem("theme", newTheme);
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  };

  const handleExportData = () => {
    toast.success("Data export started. You will receive an email shortly.");
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully");
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: FiUser,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "orders",
      label: "Orders",
      icon: FiPackage,
      color: "from-green-500 to-green-600",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: FiHeart,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const recentOrders = orders.slice(0, 3);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Delivered: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        icon: FiCheckCircle,
      },
      Shipped: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        icon: FiTruck,
      },
      Processing: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-600 dark:text-yellow-400",
        icon: FiClock,
      },
      Cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        icon: FiXCircle,
      },
    };
    return statusConfig[status] || statusConfig.Processing;
  };

  return (
    <>
      <Helmet>
        <title>My Profile - ShoeVerse Premium</title>
        <meta
          name="description"
          content="Manage your ShoeVerse account, view orders, and update preferences."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
         
          {/* Header with Back Button */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-accent rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
             
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 sm:border-4 border-white shadow-xl cursor-pointer group"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  onClick={handleAvatarClick}
                >
                  <img
                    ref={avatarRef}
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.name?.replace(" ", "+")}&background=ffffff&color=3b82f6&size=96`
                    }
                    alt={user?.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${user?.name?.replace(" ", "+")}&background=3b82f6&color=fff&size=96`;
                    }}
                  />

                  <AnimatePresence>
                    {avatarHover && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                      >
                        <FiCamera className="text-white text-lg sm:text-xl md:text-2xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                  {user?.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    <FiMail size={12} />
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {user?.email}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    <span>Member since {stats.memberSince}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiAward size={12} />
                    <span>{user?.isAdmin ? "Admin" : "Premium Member"}</span>
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-0">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">
                    {stats.totalOrders}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-white/70">
                    Orders
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">
                    ${stats.totalSpent.toFixed(0)}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-white/70">
                    Spent
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">
                    {stats.wishlistCount}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-white/70">
                    Wishlist
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-1 sm:gap-2 mb-4 sm:mb-6 pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg sm:rounded-xl`}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 ${isActive ? "text-white" : ""}`}
                    size={14}
                  />
                  <span className="relative z-10 hidden xs:inline">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1 sm:gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs sm:text-sm"
                        >
                          <FiEdit2 size={14} />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xs sm:text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                            Phone Number (Optional)
                          </label>
                          <div className="relative">
                            <FiPhone
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={14}
                            />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave size={14} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                          <FiUser
                            className="text-primary-600 mt-0.5"
                            size={14}
                          />
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              Full Name
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {user?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                          <FiMail
                            className="text-primary-600 mt-0.5"
                            size={14}
                          />
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              Email Address
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        {phone && (
                          <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                            <FiPhone
                              className="text-primary-600 mt-0.5"
                              size={14}
                            />
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Phone Number
                              </p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                {phone}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                          <FiCalendar
                            className="text-primary-600 mt-0.5"
                            size={14}
                          />
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              Member Since
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {stats.memberSince}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Statistics */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      Account Statistics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                        <FiPackage className="text-primary-600 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                          {stats.totalOrders}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                          Total Orders
                        </p>
                      </div>
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                        <FiDollarSign className="text-green-600 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                          ${stats.totalSpent}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                          Total Spent
                        </p>
                      </div>
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                        <FiHeart className="text-pink-600 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                          {stats.wishlistCount}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                          Wishlist
                        </p>
                      </div>
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                        <FiAward className="text-yellow-600 text-base sm:text-lg md:text-xl mx-auto mb-1 sm:mb-2" />
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                          {stats.loyaltyPoints}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                          Loyalty Points
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                 
                  {/* Recent Orders */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Orders
                      </h3>
                      <Link
                        to="/orders"
                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                      >
                        View All
                        <FiChevronRight size={14} />
                      </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                      <div className="text-center py-6 sm:py-8">
                        <FiPackage className="text-3xl sm:text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          No orders yet
                        </p>
                        <Link
                          to="/products"
                          className="text-primary-600 dark:text-primary-400 text-xs sm:text-sm hover:underline mt-2 inline-block"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {recentOrders.map((order) => {
                          const statusConfig = getStatusBadge(
                            order.orderStatus,
                          );
                          const StatusIcon = statusConfig.icon;

                          return (
                            <Link
                              key={order._id}
                              to={`/orders/${order._id}`}
                              className="block p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] sm:text-xs font-mono text-gray-500 dark:text-gray-400">
                                  #{order._id?.slice(-8)}
                                </span>
                                <span
                                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                                >
                                  <StatusIcon size={10} />
                                  {order.orderStatus}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                <span className="text-gray-600 dark:text-gray-300">
                                  {new Date(
                                    order.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${order.totalPrice?.toFixed(2)}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Wishlist Preview */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Wishlist
                      </h3>
                      <Link
                        to="/wishlist"
                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                      >
                        View All
                        <FiChevronRight size={14} />
                      </Link>
                    </div>

                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-6 sm:py-8">
                        <FiHeart className="text-3xl sm:text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Your wishlist is empty
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {wishlistItems.slice(0, 3).map((item) => (
                          <Link
                            key={item._id}
                            to={`/product/${item._id}`}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <img
                              src={
                                item.images?.[0]?.url ||
                                item.image ||
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E"
                              }
                              alt={item.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                                ${item.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Loyalty Card */}
                  <div className="bg-gradient-to-br from-primary-600 to-accent rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <FiAward size={20} />
                      <span className="text-xs sm:text-sm opacity-90">
                        Premium Member
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                      {stats.loyaltyPoints} Points
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-90">
                      Earn 10 points per $1 spent
                    </p>
                    <div className="mt-3 sm:mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Order History
                </h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-10 md:py-12">
                    <FiPackage className="text-4xl sm:text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                      You haven't placed any orders yet
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => {
                      const statusConfig = getStatusBadge(order.orderStatus);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <Link
                          key={order._id}
                          to={`/orders/${order._id}`}
                          className="block p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 sm:gap-4">
                            <div>
                              <p className="text-[10px] sm:text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
                                Order #{order._id?.slice(-8)}
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center justify-between xs:justify-end gap-2 sm:gap-4">
                              <span
                                className={`flex items-center gap-1 px-2 sm:px-3 py-1 text-[8px] sm:text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                              >
                                <StatusIcon size={12} />
                                {order.orderStatus}
                              </span>
                              <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white">
                                ${order.totalPrice?.toFixed(2)}
                              </span>
                              <FiChevronRight
                                className="text-gray-400 dark:text-gray-500"
                                size={16}
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                    My Wishlist
                  </h3>
                  <Link
                    to="/wishlist"
                    className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Manage Wishlist
                  </Link>
                </div>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8 sm:py-10 md:py-12">
                    <FiHeart className="text-4xl sm:text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                      Your wishlist is empty
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {wishlistItems.slice(0, 4).map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <img
                          src={
                            item.images?.[0]?.url ||
                            item.image ||
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E"
                          }
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3C/svg%3E";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            {item.name}
                          </p>
                          <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {item.brand}
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-primary-600">
                            ${item.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* Security Settings - Password Change */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiLock className="text-primary-600" />
                    Security Settings
                  </h3>

                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs sm:text-sm"
                    >
                      <FiKey size={14} />
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
                              passwordErrors.current
                                ? "border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword.current ? (
                              <FiEyeOff size={16} />
                            ) : (
                              <FiEye size={16} />
                            )}
                          </button>
                        </div>
                        {passwordErrors.current && (
                          <p className="mt-1 text-xs text-red-500">
                            {passwordErrors.current}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
                              passwordErrors.new
                                ? "border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword.new ? (
                              <FiEyeOff size={16} />
                            ) : (
                              <FiEye size={16} />
                            )}
                          </button>
                        </div>
                        {passwordErrors.new && (
                          <p className="mt-1 text-xs text-red-500">
                            {passwordErrors.new}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
                              passwordErrors.confirm
                                ? "border-red-500"
                                : "border-gray-200 dark:border-gray-600"
                            }`}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword.confirm ? (
                              <FiEyeOff size={16} />
                            ) : (
                              <FiEye size={16} />
                            )}
                          </button>
                        </div>
                        {passwordErrors.confirm && (
                          <p className="mt-1 text-xs text-red-500">
                            {passwordErrors.confirm}
                          </p>
                        )}
                      </div>

                      {/* Password strength indicator */}
                      {newPassword && (
                        <div className="space-y-1">
                          <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`flex-1 rounded-full ${
                                  newPassword.length >= 6
                                    ? level <=
                                      Math.min(
                                        4,
                                        Math.floor(newPassword.length / 2),
                                      )
                                      ? "bg-green-500"
                                      : "bg-gray-200 dark:bg-gray-700"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Password strength:{" "}
                            {newPassword.length < 6
                              ? "Too short"
                              : newPassword.length < 8
                                ? "Weak"
                                : newPassword.length < 12
                                  ? "Medium"
                                  : "Strong"}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-2">
                        <button
                          onClick={handleChangePassword}
                          disabled={isLoading}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setPasswordErrors({
                              current: "",
                              new: "",
                              confirm: "",
                            });
                          }}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <FiShield
                          className="text-green-600 dark:text-green-400"
                          size={16}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShow2FA(!show2FA);
                        toast.success(
                          `2FA ${!show2FA ? "enabled" : "disabled"} (Demo)`,
                        );
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        show2FA
                          ? "bg-primary-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          show2FA ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiMoon className="text-primary-600" />
                    Appearance
                  </h3>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-3">
                      {appSettings.darkMode ? (
                        <FiMoon className="text-indigo-600" size={18} />
                      ) : (
                        <FiSun className="text-yellow-600" size={18} />
                      )}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Dark Mode
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Toggle between light and dark theme
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleTheme}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        appSettings.darkMode
                          ? "bg-primary-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          appSettings.darkMode
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="flex gap-2">
                      {["small", "medium", "large"].map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setAppSettings({ ...appSettings, fontSize: size })
                          }
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            appSettings.fontSize === size
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiBell className="text-primary-600" />
                    Notification Preferences
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Order Updates
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Receive notifications about your orders
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.orders}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              orders: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Promotions & Offers
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Get updates on sales and new arrivals
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.promotions}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              promotions: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Price Drops
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Get notified when items in your wishlist drop in price
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.priceDrops}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              priceDrops: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Restock Alerts
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Get notified when out-of-stock items are back
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.restocks}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              restocks: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Newsletter
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Weekly newsletter with sneaker news
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.newsletter}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: {
                              ...notificationSettings.email,
                              newsletter: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiEye className="text-primary-600" />
                    Privacy Settings
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Show Email
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Display your email on your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showEmail: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Show Location
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Display your location on your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showLocation}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showLocation: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Show Order History
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Make your order history visible to others
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showOrderHistory}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showOrderHistory: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl cursor-pointer">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          Show Wishlist
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Make your wishlist visible to others
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showWishlist}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showWishlist: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Payment Methods Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiCreditCard className="text-primary-600" />
                      Payment Methods
                    </h3>
                    <button className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                      Manage
                    </button>
                  </div>

                  <div className="space-y-2">
                    {paymentMethods.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-6 rounded ${
                              card.type === "visa"
                                ? "bg-blue-600"
                                : "bg-orange-600"
                            } flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {card.type === "visa" ? "VISA" : "MC"}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              •••• {card.last4}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              Expires {card.exp}
                            </p>
                          </div>
                        </div>
                        {card.default && (
                          <span className="text-[10px] bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addresses Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiMapPin className="text-primary-600" />
                      Saved Addresses
                    </h3>
                    <button className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                      Manage
                    </button>
                  </div>

                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {address.name}
                          </span>
                          {address.default && (
                            <span className="text-[10px] bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                          {address.address}, {address.city}, {address.state}{" "}
                          {address.zip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data & Storage */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiDatabase className="text-primary-600" />
                    Data & Storage
                  </h3>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Used Storage
                      </span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {dataUsage.storageUsed} / 1 GB
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: "24%" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      {
                        label: "Last Backup",
                        value: dataUsage.lastBackup,
                        icon: FiCloud,
                      },
                      {
                        label: "Devices",
                        value: dataUsage.devices,
                        icon: FiSmartphone,
                      },
                      {
                        label: "Downloads",
                        value: dataUsage.downloads,
                        icon: FiDownload,
                      },
                      { label: "Cache", value: "128 MB", icon: FiRefreshCw },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <Icon className="text-primary-600 mb-1" size={14} />
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {item.label}
                          </p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportData}
                      className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs flex items-center justify-center gap-1"
                    >
                      <FiDownload size={12} />
                      Export
                    </button>
                    <button
                      onClick={handleClearCache}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300"
                    >
                      <FiRefreshCw size={12} />
                      Clear Cache
                    </button>
                  </div>
                </div>

                {/* Connected Devices */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiCpu className="text-primary-600" />
                    Connected Devices
                  </h3>

                  <div className="space-y-2">
                    {connectedDevices.map((device) => {
                      const Icon = device.icon;
                      return (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="text-primary-600" size={16} />
                            <div>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">
                                {device.name}
                              </p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                {device.location} • {device.lastActive}
                              </p>
                            </div>
                          </div>
                          {device.lastActive === "Now" && (
                            <span className="text-[10px] text-green-600 dark:text-green-400">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-red-200 dark:border-red-800">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-red-600 dark:text-red-400 mb-3 sm:mb-4">
                    Danger Zone
                  </h3>
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <FiAlertCircle size={14} />
                      Delete Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <FiLogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeletePassword("");
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="text-2xl text-red-600" />
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Delete Account
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-5 md:mb-6">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>

              {/* Password input field */}
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium mb-2">
                  This will permanently delete:
                </p>
                <ul className="space-y-1 text-[8px] sm:text-xs text-red-600 dark:text-red-400">
                  <li>• Your profile and personal information</li>
                  <li>• Order history and preferences</li>
                  <li>• Wishlist and saved items</li>
                  <li>• Payment methods and addresses</li>
                </ul>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading || !deletePassword}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
