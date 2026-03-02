import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBell,
  FiMoon,
  FiSun,
  FiGlobe,
  FiShield,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiMonitor,
  FiTrash2,
  FiLogOut,
  FiSave,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiInfo,
  FiDownload,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiVolume2,
  FiVolumeX,
  FiWifi,
  FiBluetooth,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiPercent,
  FiGift,
  FiAward,
  FiHeart,
  FiStar,
  FiEdit2,
  FiCamera,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiSettings,
  FiTool,
  FiCpu,
  FiDatabase,
  FiCloud,
  FiServer,
  FiKey,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    isLoading,
  } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  // State for different sections
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "Sneaker enthusiast | Premium member",
    location: user?.location || "New York, USA",
    birthday: user?.birthday || "1995-06-15",
    gender: user?.gender || "prefer-not-to-say",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

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
    theme: theme || "light",
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
    darkMode: theme === "dark",
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

  // state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sections configuration
  const sections = [
    {
      id: "profile",
      label: "Profile Information",
      icon: FiUser,
      color: "from-blue-500 to-blue-600",
      description: "Manage your personal information",
    },
    {
      id: "account",
      label: "Account Security",
      icon: FiShield,
      color: "from-green-500 to-green-600",
      description: "Password, 2FA, and security settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: FiBell,
      color: "from-yellow-500 to-yellow-600",
      description: "Control how we contact you",
    },
    {
      id: "privacy",
      label: "Privacy & Data",
      icon: FiEye,
      color: "from-purple-500 to-purple-600",
      description: "Manage your privacy preferences",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: FiMoon,
      color: "from-indigo-500 to-indigo-600",
      description: "Customize your viewing experience",
    },
    {
      id: "payments",
      label: "Payment Methods",
      icon: FiCreditCard,
      color: "from-pink-500 to-pink-600",
      description: "Manage your payment options",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: FiMapPin,
      color: "from-red-500 to-red-600",
      description: "Shipping and billing addresses",
    },
    {
      id: "devices",
      label: "Connected Devices",
      icon: FiCpu,
      color: "from-cyan-500 to-cyan-600",
      description: "Manage your connected devices",
    },
    {
      id: "data",
      label: "Data & Storage",
      icon: FiDatabase,
      color: "from-emerald-500 to-emerald-600",
      description: "Manage your data and downloads",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: FiSettings,
      color: "from-orange-500 to-orange-600",
      description: "Language, currency, and regional settings",
    },
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {
      current: "",
      new: "",
      confirm: "",
    };
    let isValid = true;

    if (!passwordData.current) {
      errors.current = "Current password is required";
      isValid = false;
    }

    if (!passwordData.new) {
      errors.new = "New password is required";
      isValid = false;
    } else if (passwordData.new.length < 6) {
      errors.new = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!passwordData.confirm) {
      errors.confirm = "Please confirm your new password";
      isValid = false;
    } else if (passwordData.new !== passwordData.confirm) {
      errors.confirm = "Passwords do not match";
      isValid = false;
    }

    if (
      passwordData.current &&
      passwordData.new &&
      passwordData.current === passwordData.new
    ) {
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

    setLoading(true);
    try {
      await changePassword(passwordData.current, passwordData.new);
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordErrors({ current: "", new: "", confirm: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      if (message.toLowerCase().includes("current password")) {
        setPasswordErrors((prev) => ({ ...prev, current: message }));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setShow2FA(!show2FA);
    toast.success(`2FA ${!show2FA ? "enabled" : "disabled"} (Demo)`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(deletePassword);
      setShowDeleteConfirm(false);
      setDeletePassword("");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success(
      "Data export started. You will receive an email shortly. (Demo)",
    );
  };

  const handleClearData = () => {
    toast.success("Cache cleared successfully (Demo)");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Render section content
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                  Profile Information
                </h2>
                <p className="text-xs sm:text-sm text-white/80">
                  Manage your personal details and public profile
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Details
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg transition-all text-sm"
                  >
                    <FiEdit2 size={14} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col xs:flex-row gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          bio:
                            user?.bio || "Sneaker enthusiast | Premium member",
                          location: user?.location || "New York, USA",
                          birthday: user?.birthday || "1995-06-15",
                          gender: user?.gender || "prefer-not-to-say",
                        });
                      }}
                      className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 rounded-lg transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50"
                    >
                      {loading ? (
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
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                          size={14}
                        />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            birthday: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Gender
                      </label>
                      <select
                        value={profileData.gender}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            gender: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Full Name
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {profileData.name}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Email Address
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {profileData.email}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Phone Number
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {profileData.phone || "Not provided"}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {profileData.location}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Birthday
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(profileData.birthday).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Member Since
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )
                          : "January 2024"}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl">
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Bio
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      {profileData.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Completion Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Profile Completion
              </h3>
              <div className="flex flex-col xs:flex-row items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="85, 100"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-base sm:text-xl font-bold">
                    85%
                  </span>
                </div>
                <div className="flex-1 text-center xs:text-left">
                  <p className="text-xs sm:text-sm text-white/90 mb-2">
                    Complete your profile to unlock premium features
                  </p>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm transition-colors">
                    Complete Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "account":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                Account Security
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Manage your password and security settings
              </p>
            </div>

            {/* Password Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Password
              </h3>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm sm:text-base"
                >
                  <FiLock size={16} />
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
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
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
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
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
                        value={passwordData.confirm}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 text-gray-900 dark:text-white ${
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
                  {passwordData.new && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full ${
                              passwordData.new.length >= 6
                                ? level <=
                                  Math.min(
                                    4,
                                    Math.floor(passwordData.new.length / 2),
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
                        {passwordData.new.length < 6
                          ? "Too short"
                          : passwordData.new.length < 8
                            ? "Weak"
                            : passwordData.new.length < 12
                              ? "Medium"
                              : "Strong"}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex-1 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
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
                        setPasswordData({ current: "", new: "", confirm: "" });
                        setPasswordErrors({
                          current: "",
                          new: "",
                          confirm: "",
                        });
                      }}
                      className="px-3 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    show2FA ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      show2FA ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {show2FA && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                >
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 dark:bg-gray-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <FiShield className="text-3xl sm:text-4xl text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    Backup code: XXXX-XXXX-XXXX-XXXX
                  </p>
                </motion.div>
              )}
            </div>

            {/* Login History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Recent Login Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    device: "iPhone 14 Pro",
                    location: "New York, USA",
                    time: "Now",
                    current: true,
                  },
                  {
                    device: "MacBook Pro",
                    location: "New York, USA",
                    time: "2 hours ago",
                    current: false,
                  },
                  {
                    device: "Samsung Galaxy S23",
                    location: "Brooklyn, USA",
                    time: "Yesterday",
                    current: false,
                  },
                ].map((login, index) => (
                  <div
                    key={index}
                    className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${login.current ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {login.device}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {login.location} • {login.time}
                        </p>
                      </div>
                    </div>
                    {login.current && (
                      <span className="text-[10px] sm:text-xs text-primary-600 dark:text-primary-400 font-medium">
                        Current Session
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select a section from the sidebar
            </p>
          </motion.div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - ShoeVerse Premium</title>
        <meta
          name="description"
          content="Manage your ShoeVerse account settings"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header with Back Button for Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <FiChevronRight className="rotate-180" size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1">
                Customize your experience and manage your account
              </p>
            </div>
          </div>

          {/* Mobile Section Selector */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                    sections.find((s) => s.id === activeSection)?.color ||
                    "from-primary-600 to-accent"
                  } flex items-center justify-center`}
                >
                  {sections.find((s) => s.id === activeSection)?.icon &&
                    (() => {
                      const Icon = sections.find(
                        (s) => s.id === activeSection,
                      ).icon;
                      return <Icon className="text-white" size={16} />;
                    })()}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {sections.find((s) => s.id === activeSection)?.label}
                </span>
              </div>
              <FiChevronDown
                className={`text-gray-400 dark:text-gray-500 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
                size={18}
              />
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 mt-2 w-full max-w-[calc(100%-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 transition-colors ${
                          activeSection === section.id
                            ? `bg-gradient-to-r ${section.color} text-white`
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            activeSection === section.id
                              ? "bg-white/20"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Icon
                            size={14}
                            className={
                              activeSection === section.id ? "text-white" : ""
                            }
                          />
                        </div>
                        <span className="text-sm">{section.label}</span>
                      </button>
                    );
                  })}

                  {/* Logout Button in Mobile Menu */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <FiLogOut size={14} className="text-red-600" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            
            {/* Sidebar Hidden on mobile, visible on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:w-80 xl:w-96"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-primary-600 to-accent">
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    Quick Settings
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80">
                    Manage your preferences
                  </p>
                </div>

                <div className="p-2 sm:p-3">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all mb-0.5 sm:mb-1 ${
                          isActive
                            ? `bg-gradient-to-r ${section.color} text-white shadow-md`
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                            isActive
                              ? "bg-white/20"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Icon
                            size={14}
                            className={isActive ? "text-white" : ""}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs sm:text-sm font-medium">
                            {section.label}
                          </p>
                          <p
                            className={`text-[10px] sm:text-xs ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {section.description}
                          </p>
                        </div>
                        <FiChevronRight
                          size={14}
                          className={
                            isActive
                              ? "text-white"
                              : "text-gray-400 dark:text-gray-500"
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Logout Button - Desktop */}
                <div className="p-2 sm:p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <FiLogOut size={14} className="text-red-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
            </motion.div>
          </div>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FiAlertCircle className="text-xl sm:text-2xl text-red-600" />
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white text-center mb-1 sm:mb-2">
                Delete Account
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-5">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>

              {/* Password input field */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium mb-1 sm:mb-2">
                  This will permanently delete:
                </p>
                <ul className="space-y-0.5 sm:space-y-1 text-[8px] sm:text-xs text-red-600 dark:text-red-400">
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
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || !deletePassword}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
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

export default Settings;
