import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FiTarget } from "react-icons/fi";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiAward,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiGlobe,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiZap,
  FiActivity,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { adminAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { user, updateProfile, changePassword, logout } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarHover, setAvatarHover] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "Premium Admin at ShoeVerse",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch dashboard stats for real data
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsStatsLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardData(response.data.data);
      console.log("Dashboard Data:", response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Admin stats - Using real data from dashboard
  const adminStats = [
    {
      label: "Total Revenue",
      value: dashboardData?.overview?.totalRevenue || 0,
      change: "+23.5%",
      icon: FiDollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      path: "/admin/revenue",
    },
    {
      label: "Total Orders",
      value: dashboardData?.orders?.total || 0,
      change: "+12.3%",
      icon: FiShoppingBag,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      path: "/admin/orders",
    },
    {
      label: "Total Users",
      value: dashboardData?.users?.total || 0,
      change: "+8.2%",
      icon: FiUsers,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      path: "/admin/users",
    },
    {
      label: "Total Products",
      value: dashboardData?.products?.total || 0,
      change: "+5.1%",
      icon: FiPackage,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      path: "/admin/products",
    },
  ];

  // Order status stats
  const orderStats = [
    {
      label: "Processing",
      value: dashboardData?.orders?.processing || 0,
      color: "yellow",
      icon: FiClock,
    },
    {
      label: "Delivered",
      value: dashboardData?.orders?.delivered || 0,
      color: "green",
      icon: FiAward,
    },
    {
      label: "Cancelled",
      value: dashboardData?.orders?.cancelled || 0,
      color: "red",
      icon: FiAlertCircle,
    },
    {
      label: "Refunded",
      value: dashboardData?.orders?.refunded || 0,
      color: "purple",
      icon: FiTarget,
    },
  ];

  // Recent activities
  const recentActivities = dashboardData?.recentActivity || [
    {
      action: "Added new product",
      item: "Nike Air Max 270",
      time: "2 minutes ago",
      icon: FiShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      action: "Updated order status",
      item: "Order #ORD-2024-1234",
      time: "15 minutes ago",
      icon: FiPackage,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      action: "Approved vendor",
      item: "Premium Sneakers Co.",
      time: "1 hour ago",
      icon: FiUsers,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Admin badges
  const adminBadges = [
    { name: "Senior Admin", icon: FiShield, color: "text-purple-500" },
    { name: "Top Performer", icon: FiAward, color: "text-yellow-500" },
    { name: "5 Years Club", icon: FiStar, color: "text-blue-500" },
    { name: "Verified", icon: FiCheck, color: "text-green-500" },
  ];

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // Handle card click navigation
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "A";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading skeleton for stats
  if (isStatsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Profile - ShoeVerse</title>
        <meta name="description" content="Manage your admin profile settings" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              Admin Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Manage your account settings and preferences
            </p>
          </motion.div>

          {/* Stats Cards With Real Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {adminStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleCardClick(stat.path)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`${stat.textColor} text-xl`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {stat.label === "Total Revenue"
                          ? formatCurrency(stat.value)
                          : stat.value.toLocaleString()}
                      </p>
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <FiTrendingUp size={10} />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Order Status Cards - Real Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {orderStats.map((item, index) => {
              const Icon = item.icon;
              const colors = {
                yellow: {
                  bg: "bg-yellow-500/10 dark:bg-yellow-500/5",
                  border: "border-yellow-500/20 dark:border-yellow-500/10",
                  text: "text-yellow-700 dark:text-yellow-400",
                  value: "text-yellow-900 dark:text-yellow-300",
                },
                green: {
                  bg: "bg-green-500/10 dark:bg-green-500/5",
                  border: "border-green-500/20 dark:border-green-500/10",
                  text: "text-green-700 dark:text-green-400",
                  value: "text-green-900 dark:text-green-300",
                },
                red: {
                  bg: "bg-red-500/10 dark:bg-red-500/5",
                  border: "border-red-500/20 dark:border-red-500/10",
                  text: "text-red-700 dark:text-red-400",
                  value: "text-red-900 dark:text-red-300",
                },
                purple: {
                  bg: "bg-purple-500/10 dark:bg-purple-500/5",
                  border: "border-purple-500/20 dark:border-purple-500/10",
                  text: "text-purple-700 dark:text-purple-400",
                  value: "text-purple-900 dark:text-purple-300",
                },
              };
              const style = colors[item.color];

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  onClick={() => handleCardClick("/admin/orders")}
                  className={`${style.bg} rounded-xl p-3 sm:p-4 border ${style.border} cursor-pointer hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`${style.text} text-xs font-medium flex items-center gap-1`}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </p>
                  </div>
                  <p className={`text-lg sm:text-xl font-bold ${style.value}`}>
                    {item.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Profile Card  */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                
                {/* Profile Header */}
                <div className="relative h-32 bg-gradient-to-r from-primary-600 via-accent to-primary-600">
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4">
                    <div
                      className="relative"
                      onMouseEnter={() => setAvatarHover(true)}
                      onMouseLeave={() => setAvatarHover(false)}
                    >
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-primary-600 to-accent p-0.5">
                        <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary-600">
                            {getUserInitials()}
                          </span>
                        </div>
                      </div>
                      <AnimatePresence>
                        {avatarHover && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute -bottom-1 -right-1 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                          >
                            <FiCamera size={14} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {user?.email}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {adminBadges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs"
                          >
                            <Icon className={badge.color} size={12} />
                            <span className="text-gray-700 dark:text-gray-300">
                              {badge.name}
                            </span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Admin Info */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FiShield className="text-primary-600" size={16} />
                        <span>
                          Role:{" "}
                          <span className="font-medium text-gray-900 dark:text-white">
                            Super Admin
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FiCalendar className="text-primary-600" size={16} />
                        <span>
                          Joined: {formatDate(user?.createdAt || new Date())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FiActivity className="text-primary-600" size={16} />
                        <span>Last active: Just now</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <FiEdit2 size={16} />
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1 p-4">
                    {[
                      { id: "overview", label: "Overview", icon: FiUser },
                      { id: "security", label: "Security", icon: FiLock },
                      { id: "activity", label: "Activity", icon: FiActivity },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? "bg-primary-600 text-white"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {!isEditing ? (
                          // View Mode
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Personal Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Full Name
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiUser
                                      size={14}
                                      className="text-primary-600"
                                    />
                                    {user?.name}
                                  </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Email Address
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiMail
                                      size={14}
                                      className="text-primary-600"
                                    />
                                    {user?.email}
                                  </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Phone Number
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiPhone
                                      size={14}
                                      className="text-primary-600"
                                    />
                                    {user?.phone || "+1 (555) 123-4567"}
                                  </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Location
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiMapPin
                                      size={14}
                                      className="text-primary-600"
                                    />
                                    {user?.address || "New York, USA"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Bio
                              </h3>
                              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                  {user?.bio ||
                                    "Premium Administrator at ShoeVerse with over 5 years of experience in e-commerce and sneaker culture. Passionate about delivering exceptional customer experiences and managing high-performance teams."}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Edit Mode
                          <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-6"
                          >
                            {/* ... edit form content ... */}
                          </form>
                        )}
                      </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                      <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* ... security content ... */}
                      </motion.div>
                    )}

                    {/* Activity Tab - Using Real Data */}
                    {activeTab === "activity" && (
                      <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Recent Activity
                          </h3>
                          <div className="space-y-3">
                            {recentActivities.map((activity, index) => {
                              const Icon = activity.icon;
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div
                                    className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                                  >
                                    <Icon
                                      className={activity.color}
                                      size={16}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {activity.item}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {activity.time}
                                    </p>
                                  </div>
                                  <FiClock
                                    className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                                    size={14}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>

                          <button className="w-full mt-4 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                            View All Activity
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
