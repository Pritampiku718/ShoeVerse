import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FiSave,
  FiSettings,
  FiDollarSign,
  FiShoppingBag,
  FiStar,
  FiHeart,
  FiMail,
  FiGlobe,
  FiShield,
  FiBell,
  FiLock,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiToggleLeft,
  FiToggleRight,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiPercent,
  FiMapPin,
  FiClock,
  FiAward,
  FiZap,
  FiChevronDown,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiKey,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";

const Settings = () => {
  const { darkMode } = useThemeStore();
  const { changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [settings, setSettings] = useState({
    // General
    siteName: "ShoeVerse",
    siteEmail: "admin@shoeverse.com",
    sitePhone: "+1 (555) 123-4567",
    siteAddress: "123 Sneaker Street, Fashion District, NY 10001",
    timezone: "America/New_York",

    // Currency & Tax
    currency: "USD",
    currencySymbol: "$",
    taxRate: 10,
    taxIncluded: false,

    // Shipping
    shippingFee: 0,
    freeShippingThreshold: 100,
    internationalShipping: true,
    internationalShippingFee: 25,
    estimatedDeliveryDays: "3-5",

    // Features
    enableReviews: true,
    enableWishlist: true,
    enableNewsletter: true,
    enableCompare: false,
    enableGiftCards: true,
    enableLoyaltyProgram: true,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: true,

    // Security
    twoFactorAuth: false,
    maintenanceMode: false,
    forceSSL: true,
    captchaEnabled: true,

    // Performance
    cacheEnabled: true,
    cacheDuration: 3600,
    imageOptimization: true,
    lazyLoading: true,

    // SEO
    metaTitle: "ShoeVerse - Premium Sneaker Marketplace",
    metaDescription:
      "Discover the world's most exclusive sneakers. From Nike Air Max to Jordan Retro, find your perfect pair at ShoeVerse.",
    metaKeywords: "sneakers, nike, adidas, jordan, yeezy, shoes, footwear",
    googleAnalyticsId: "UA-123456789-1",
  });

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: FiSettings,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "currency",
      label: "Currency & Tax",
      icon: FiDollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: FiTruck,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "features",
      label: "Features",
      icon: FiStar,
      color: "from-yellow-500 to-amber-500",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: FiBell,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "security",
      label: "Security",
      icon: FiShield,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "performance",
      label: "Performance",
      icon: FiZap,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "seo",
      label: "SEO",
      icon: FiGlobe,
      color: "from-violet-500 to-purple-500",
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Saving settings:", settings);
      setShowSuccess(true);
      toast.success("Settings saved successfully!");

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings?")) {
      toast.success("Settings reset to default");
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
      setPasswordErrors(newErrors);
      return;
    }

    setIsChangingPassword(true);
    try {
      // Pass currentPassword and newPassword as separate parameters
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
          {checked ? (
            <FiToggleRight className="text-primary-600 text-lg" />
          ) : (
            <FiToggleLeft className="text-gray-400 text-lg" />
          )}
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  // Input Field Component
  const InputField = ({
    icon: Icon,
    label,
    value,
    onChange,
    type = "text",
    description,
    ...props
  }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 transition-colors"
            size={18}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
          {...props}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );

  // Select Field Component
  const SelectField = ({
    icon: Icon,
    label,
    value,
    onChange,
    options,
    description,
  }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 transition-colors"
            size={18}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          size={18}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Settings - ShoeVerse Admin</title>
        <meta
          name="description"
          content="Configure your ShoeVerse store settings"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
         
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                  Store Settings
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                  Configure and customize your ShoeVerse store
                </p>
              </div>

              {/* Save Button with Status */}
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm"
                    >
                      <FiCheckCircle size={16} />
                      <span>Saved!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <FiRefreshCw className="animate-spin" size={18} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Welcome Message */}
            {!activeTab && !showChangePassword && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-gradient-to-r from-primary-600 to-accent rounded-2xl text-white"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Welcome to Settings
                </h2>
                <p className="text-white/90">
                  Select a category from the sidebar to configure your store
                  settings. Each section contains specific options to customize
                  your ShoeVerse experience.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Tabs Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiSettings className="text-primary-600" />
                    Quick Navigation
                  </h2>
                </div>
                <div className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowChangePassword(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-1 ${
                          isActive
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium flex-1 text-left">
                          {tab.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}

                  {/* Change Password Button */}
                  <button
                    onClick={() => {
                      setShowChangePassword(true);
                      setActiveTab(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-1 ${
                      showChangePassword
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiKey size={18} />
                    <span className="text-sm font-medium flex-1 text-left">
                      Change Password
                    </span>
                    {showChangePassword && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Store Status
                      </p>
                      <p className="text-sm font-semibold text-green-500">
                        Live
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Version
                      </p>
                      <p className="text-sm font-semibold text-primary-600">
                        2.0.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Panels */}
            <AnimatePresence mode="wait">
              {activeTab ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    
                    {/* Panel Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tabs.find((t) => t.id === activeTab)?.label}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Configure your{" "}
                        {tabs
                          .find((t) => t.id === activeTab)
                          ?.label.toLowerCase()}{" "}
                        settings
                      </p>
                    </div>

                    {/* Panel Content */}
                    <div className="p-6">
                     
                      {/* General Settings */}
                      {activeTab === "general" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                              icon={FiGlobe}
                              label="Site Name"
                              value={settings.siteName}
                              onChange={(val) => updateSetting("siteName", val)}
                              description="Your store's public name"
                            />
                            <InputField
                              icon={FiMail}
                              label="Site Email"
                              type="email"
                              value={settings.siteEmail}
                              onChange={(val) =>
                                updateSetting("siteEmail", val)
                              }
                              description="Primary contact email"
                            />
                            <InputField
                              icon={FiPhone}
                              label="Phone Number"
                              value={settings.sitePhone}
                              onChange={(val) =>
                                updateSetting("sitePhone", val)
                              }
                              description="Customer support number"
                            />
                            <InputField
                              icon={FiMapPin}
                              label="Address"
                              value={settings.siteAddress}
                              onChange={(val) =>
                                updateSetting("siteAddress", val)
                              }
                              description="Business address"
                            />
                            <SelectField
                              icon={FiClock}
                              label="Timezone"
                              value={settings.timezone}
                              onChange={(val) => updateSetting("timezone", val)}
                              options={[
                                {
                                  value: "America/New_York",
                                  label: "Eastern Time",
                                },
                                {
                                  value: "America/Chicago",
                                  label: "Central Time",
                                },
                                {
                                  value: "America/Denver",
                                  label: "Mountain Time",
                                },
                                {
                                  value: "America/Los_Angeles",
                                  label: "Pacific Time",
                                },
                                { value: "Europe/London", label: "GMT" },
                                {
                                  value: "Europe/Paris",
                                  label: "Central European",
                                },
                                { value: "Asia/Dubai", label: "Gulf" },
                                { value: "Asia/Singapore", label: "Singapore" },
                                {
                                  value: "Australia/Sydney",
                                  label: "Australian Eastern",
                                },
                              ]}
                            />
                          </div>
                        </div>
                      )}

                      {/* Currency & Tax Settings */}
                      {activeTab === "currency" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                              icon={FiDollarSign}
                              label="Currency"
                              value={settings.currency}
                              onChange={(val) => updateSetting("currency", val)}
                              options={[
                                { value: "USD", label: "USD ($)" },
                                { value: "EUR", label: "EUR (€)" },
                                { value: "GBP", label: "GBP (£)" },
                                { value: "JPY", label: "JPY (¥)" },
                                { value: "CAD", label: "CAD ($)" },
                                { value: "AUD", label: "AUD ($)" },
                                { value: "CHF", label: "CHF (Fr)" },
                                { value: "CNY", label: "CNY (¥)" },
                                { value: "INR", label: "INR (₹)" },
                              ]}
                            />
                            <InputField
                              icon={FiPercent}
                              label="Tax Rate (%)"
                              type="number"
                              value={settings.taxRate}
                              onChange={(val) =>
                                updateSetting("taxRate", parseInt(val) || 0)
                              }
                              min="0"
                              max="100"
                              description="Default tax rate for products"
                            />
                          </div>

                          <ToggleSwitch
                            checked={settings.taxIncluded}
                            onChange={(val) =>
                              updateSetting("taxIncluded", val)
                            }
                            label="Tax Included in Prices"
                            description="Display prices with tax already included"
                          />
                        </div>
                      )}

                      {/* Shipping Settings */}
                      {activeTab === "shipping" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                              icon={FiTruck}
                              label="Standard Shipping Fee ($)"
                              type="number"
                              value={settings.shippingFee}
                              onChange={(val) =>
                                updateSetting("shippingFee", parseInt(val) || 0)
                              }
                              min="0"
                            />
                            <InputField
                              icon={FiAward}
                              label="Free Shipping Threshold ($)"
                              type="number"
                              value={settings.freeShippingThreshold}
                              onChange={(val) =>
                                updateSetting(
                                  "freeShippingThreshold",
                                  parseInt(val) || 0,
                                )
                              }
                              min="0"
                              description="Orders above this amount get free shipping"
                            />
                            <InputField
                              icon={FiGlobe}
                              label="International Shipping Fee ($)"
                              type="number"
                              value={settings.internationalShippingFee}
                              onChange={(val) =>
                                updateSetting(
                                  "internationalShippingFee",
                                  parseInt(val) || 0,
                                )
                              }
                              min="0"
                            />
                            <InputField
                              icon={FiClock}
                              label="Estimated Delivery Days"
                              value={settings.estimatedDeliveryDays}
                              onChange={(val) =>
                                updateSetting("estimatedDeliveryDays", val)
                              }
                              placeholder="3-5"
                            />
                          </div>

                          <ToggleSwitch
                            checked={settings.internationalShipping}
                            onChange={(val) =>
                              updateSetting("internationalShipping", val)
                            }
                            label="International Shipping"
                            description="Allow shipping to international addresses"
                          />
                        </div>
                      )}

                      {/* Features Settings */}
                      {activeTab === "features" && (
                        <div className="space-y-4">
                          <ToggleSwitch
                            checked={settings.enableReviews}
                            onChange={(val) =>
                              updateSetting("enableReviews", val)
                            }
                            label="Product Reviews"
                            description="Allow customers to leave reviews on products"
                          />
                          <ToggleSwitch
                            checked={settings.enableWishlist}
                            onChange={(val) =>
                              updateSetting("enableWishlist", val)
                            }
                            label="Wishlist"
                            description="Enable wishlist functionality for customers"
                          />
                          <ToggleSwitch
                            checked={settings.enableNewsletter}
                            onChange={(val) =>
                              updateSetting("enableNewsletter", val)
                            }
                            label="Newsletter"
                            description="Allow customers to subscribe to newsletters"
                          />
                          <ToggleSwitch
                            checked={settings.enableCompare}
                            onChange={(val) =>
                              updateSetting("enableCompare", val)
                            }
                            label="Product Comparison"
                            description="Enable product comparison feature"
                          />
                          <ToggleSwitch
                            checked={settings.enableGiftCards}
                            onChange={(val) =>
                              updateSetting("enableGiftCards", val)
                            }
                            label="Gift Cards"
                            description="Allow customers to purchase and redeem gift cards"
                          />
                          <ToggleSwitch
                            checked={settings.enableLoyaltyProgram}
                            onChange={(val) =>
                              updateSetting("enableLoyaltyProgram", val)
                            }
                            label="Loyalty Program"
                            description="Enable points-based loyalty program"
                          />
                        </div>
                      )}

                      {/* Notifications Settings */}
                      {activeTab === "notifications" && (
                        <div className="space-y-4">
                          <ToggleSwitch
                            checked={settings.emailNotifications}
                            onChange={(val) =>
                              updateSetting("emailNotifications", val)
                            }
                            label="Email Notifications"
                            description="Receive email notifications for important events"
                          />
                          <ToggleSwitch
                            checked={settings.smsNotifications}
                            onChange={(val) =>
                              updateSetting("smsNotifications", val)
                            }
                            label="SMS Notifications"
                            description="Receive SMS alerts for orders"
                          />
                          <ToggleSwitch
                            checked={settings.orderUpdates}
                            onChange={(val) =>
                              updateSetting("orderUpdates", val)
                            }
                            label="Order Updates"
                            description="Send order status updates to customers"
                          />
                          <ToggleSwitch
                            checked={settings.promotionalEmails}
                            onChange={(val) =>
                              updateSetting("promotionalEmails", val)
                            }
                            label="Promotional Emails"
                            description="Send marketing and promotional emails"
                          />
                        </div>
                      )}

                      {/* Security Settings */}
                      {activeTab === "security" && (
                        <div className="space-y-4">
                          <ToggleSwitch
                            checked={settings.twoFactorAuth}
                            onChange={(val) =>
                              updateSetting("twoFactorAuth", val)
                            }
                            label="Two-Factor Authentication"
                            description="Require 2FA for admin accounts"
                          />
                          <ToggleSwitch
                            checked={settings.maintenanceMode}
                            onChange={(val) =>
                              updateSetting("maintenanceMode", val)
                            }
                            label="Maintenance Mode"
                            description="Only admins can access the site when enabled"
                          />
                          <ToggleSwitch
                            checked={settings.forceSSL}
                            onChange={(val) => updateSetting("forceSSL", val)}
                            label="Force SSL"
                            description="Redirect all traffic to HTTPS"
                          />
                          <ToggleSwitch
                            checked={settings.captchaEnabled}
                            onChange={(val) =>
                              updateSetting("captchaEnabled", val)
                            }
                            label="CAPTCHA Protection"
                            description="Enable CAPTCHA on forms"
                          />
                        </div>
                      )}

                      {/* Performance Settings */}
                      {activeTab === "performance" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-6">
                            <InputField
                              icon={FiClock}
                              label="Cache Duration (seconds)"
                              type="number"
                              value={settings.cacheDuration}
                              onChange={(val) =>
                                updateSetting(
                                  "cacheDuration",
                                  parseInt(val) || 0,
                                )
                              }
                              min="0"
                              description="How long to cache pages (0 to disable)"
                            />
                          </div>

                          <ToggleSwitch
                            checked={settings.cacheEnabled}
                            onChange={(val) =>
                              updateSetting("cacheEnabled", val)
                            }
                            label="Enable Caching"
                            description="Cache pages for faster loading"
                          />
                          <ToggleSwitch
                            checked={settings.imageOptimization}
                            onChange={(val) =>
                              updateSetting("imageOptimization", val)
                            }
                            label="Image Optimization"
                            description="Automatically optimize uploaded images"
                          />
                          <ToggleSwitch
                            checked={settings.lazyLoading}
                            onChange={(val) =>
                              updateSetting("lazyLoading", val)
                            }
                            label="Lazy Loading"
                            description="Load images only when scrolled into view"
                          />
                        </div>
                      )}

                      {/* SEO Settings */}
                      {activeTab === "seo" && (
                        <div className="space-y-6">
                          <InputField
                            icon={FiGlobe}
                            label="Meta Title"
                            value={settings.metaTitle}
                            onChange={(val) => updateSetting("metaTitle", val)}
                            description="Default title for search engines"
                          />
                          <InputField
                            icon={FiMail}
                            label="Meta Description"
                            value={settings.metaDescription}
                            onChange={(val) =>
                              updateSetting("metaDescription", val)
                            }
                            description="Default description for search engines"
                          />
                          <InputField
                            icon={FiStar}
                            label="Meta Keywords"
                            value={settings.metaKeywords}
                            onChange={(val) =>
                              updateSetting("metaKeywords", val)
                            }
                            description="Comma-separated keywords"
                          />
                          <InputField
                            icon={FiTrendingUp}
                            label="Google Analytics ID"
                            value={settings.googleAnalyticsId}
                            onChange={(val) =>
                              updateSetting("googleAnalyticsId", val)
                            }
                            description="Your Google Analytics tracking ID"
                            placeholder="UA-XXXXXXXXX-X"
                          />
                        </div>
                      )}

                      {/* Bottom Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          Reset to Defaults
                        </button>

                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <FiRefreshCw className="animate-spin" size={18} />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <FiSave size={18} />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : showChangePassword ? (
                
                // Change Password Panel
                <motion.div
                  key="change-password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Panel Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiKey className="text-purple-500" />
                        Change Password
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update your admin account password
                      </p>
                    </div>

                    {/* Panel Content */}
                    <div className="p-6">
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-6"
                      >
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <FiLock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={18}
                            />
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showCurrentPassword ? (
                                <FiEyeOff size={18} />
                              ) : (
                                <FiEye size={18} />
                              )}
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="mt-1 text-xs text-red-500">
                              {passwordErrors.currentPassword}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <FiLock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={18}
                            />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showNewPassword ? (
                                <FiEyeOff size={18} />
                              ) : (
                                <FiEye size={18} />
                              )}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-xs text-red-500">
                              {passwordErrors.newPassword}
                            </p>
                          )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <FiLock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                              size={18}
                            />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showConfirmPassword ? (
                                <FiEyeOff size={18} />
                              ) : (
                                <FiEye size={18} />
                              )}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {/* Password Requirements */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password Requirements:
                          </p>
                          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                              <FiCheckCircle
                                className={
                                  passwordData.newPassword.length >= 6
                                    ? "text-green-500"
                                    : "text-gray-400 dark:text-gray-500"
                                }
                                size={12}
                              />
                              <span className="text-gray-600 dark:text-gray-400">
                                At least 6 characters
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <FiCheckCircle
                                className={
                                  /[A-Z]/.test(passwordData.newPassword)
                                    ? "text-green-500"
                                    : "text-gray-400 dark:text-gray-500"
                                }
                                size={12}
                              />
                              <span className="text-gray-600 dark:text-gray-400">
                                One uppercase letter
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <FiCheckCircle
                                className={
                                  /[0-9]/.test(passwordData.newPassword)
                                    ? "text-green-500"
                                    : "text-gray-400 dark:text-gray-500"
                                }
                                size={12}
                              />
                              <span className="text-gray-600 dark:text-gray-400">
                                One number
                              </span>
                            </li>
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowChangePassword(false);
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                              setPasswordErrors({});
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isChangingPassword ? (
                              <>
                                <FiRefreshCw
                                  className="animate-spin"
                                  size={16}
                                />
                                <span>Updating...</span>
                              </>
                            ) : (
                              <>
                                <FiKey size={16} />
                                <span>Update Password</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              ) : (
                
                // Empty state when no tab selected
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary-600 to-accent rounded-3xl flex items-center justify-center">
                      <FiSettings className="text-white text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      No Section Selected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      Choose a category from the sidebar to view and configure
                      your settings, or click "Change Password" to update your
                      admin password.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                      {tabs.slice(0, 4).map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        <FiKey size={16} />
                        <span>Change Password</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Changes are saved automatically. Last updated:{" "}
              {new Date().toLocaleString()}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Settings;
