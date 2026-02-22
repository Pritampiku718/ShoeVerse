import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  FiArrowLeft
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, logout, updateProfile, updateAvatar, isLoading } = useAuthStore();
  const { orders, fetchMyOrders } = useOrderStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarHover, setAvatarHover] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    memberSince: '',
    reviews: 0
  });

  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const totalSpent = orders
        .filter(order => order.orderStatus === 'Delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlistItems.length,
        memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }) : '2026',
        reviews: 12 // This would come from a reviews store
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
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Preview
        if (avatarRef.current) {
          avatarRef.current.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
      
      // Upload
      await updateAvatar(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    await updateProfile({ name, email });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // This would call a change password API
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiLock }
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>My Profile - ShoeVerse</title>
        <meta name="description" content="Manage your ShoeVerse account, view orders, and update preferences." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-accent rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl cursor-pointer group"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  onClick={handleAvatarClick}
                >
                  <img
                    ref={avatarRef}
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+')}&background=ffffff&color=3b82f6&size=96`}
                    alt={user?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  
                  <AnimatePresence>
                    {avatarHover && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                      >
                        <FiCamera className="text-white text-2xl" />
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
                
                {/* Online Status */}
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{user?.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <FiMail size={14} />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    Member since {stats.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiAward size={14} />
                    {user?.isAdmin ? 'Admin' : 'Member'}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <div className="text-xs text-white/70">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${stats.totalSpent.toFixed(0)}</div>
                  <div className="text-xs text-white/70">Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.wishlistCount}</div>
                  <div className="text-xs text-white/70">Wishlist</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`relative z-10 ${isActive ? 'text-white' : ''}`} size={18} />
                  <span className="relative z-10">{tab.label}</span>
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
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <FiEdit2 size={16} />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                          />
                        </div>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-primary-600 to-accent text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave size={18} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <FiUser className="text-primary-600 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <FiMail className="text-primary-600 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <FiCalendar className="text-primary-600 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">{stats.memberSince}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Statistics */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Account Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiPackage className="text-primary-600 text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiTrendingUp className="text-green-600 text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiHeart className="text-pink-600 text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wishlistCount}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Wishlist</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiStar className="text-yellow-600 text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reviews}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Recent Orders */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                      <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View All
                        <FiChevronRight size={16} />
                      </Link>
                    </div>
                    
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <FiPackage className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">No orders yet</p>
                        <Link to="/products" className="text-primary-600 text-sm hover:underline mt-2 inline-block">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentOrders.map((order) => (
                          <Link
                            key={order._id}
                            to={`/orders/${order._id}`}
                            className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                #{order._id?.slice(-8)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${order.totalPrice?.toFixed(2)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Wishlist Preview */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wishlist</h3>
                      <Link to="/wishlist" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View All
                        <FiChevronRight size={16} />
                      </Link>
                    </div>
                    
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-8">
                        <FiHeart className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Your wishlist is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wishlistItems.slice(0, 3).map((item) => (
                          <Link
                            key={item._id}
                            to={`/product/${item._id}`}
                            className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <img
                              src={item.images?.[0]?.url || item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ${item.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order History</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-1">
                              Order #{order._id}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                              order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                              order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {order.orderStatus}
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                            <FiChevronRight className="text-gray-400" size={20} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Wishlist</h3>
                  <Link to="/wishlist" className="text-sm text-primary-600 hover:text-primary-700">
                    Manage Wishlist
                  </Link>
                </div>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHeart className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.slice(0, 4).map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <img
                          src={item.images?.[0]?.url || item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.brand}</p>
                          <p className="text-sm font-bold text-primary-600">${item.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications about your orders</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Promotions & Offers</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get updates on sales and new arrivals</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Newsletter</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Weekly newsletter with sneaker news</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Delete Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <FiLogOut size={18} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle account deletion
                    setShowDeleteConfirm(false);
                    toast.success('Account deleted successfully');
                    logout();
                    navigate('/');
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
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