import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FiPackage, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiDownload,
  FiPrinter,
  FiMessageCircle
} from 'react-icons/fi';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const Orders = () => {
  const { orders, fetchMyOrders, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const total = orders.length;
      const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;
      const processing = orders.filter(o => o.orderStatus === 'Processing').length;
      const shipped = orders.filter(o => o.orderStatus === 'Shipped').length;
      const cancelled = orders.filter(o => o.orderStatus === 'Cancelled').length;
      const totalSpent = orders
        .filter(o => o.orderStatus === 'Delivered')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({ total, delivered, processing, shipped, cancelled, totalSpent });
    }
  }, [orders]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <FiCheckCircle className="text-green-500" size={20} />;
      case 'Shipped': return <FiTruck className="text-blue-500" size={20} />;
      case 'Processing': return <FiPackage className="text-yellow-500" size={20} />;
      case 'Cancelled': return <FiXCircle className="text-red-500" size={20} />;
      default: return <FiClock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusProgress = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    if (status === 'Cancelled') return 0;
    const index = steps.indexOf(status);
    return index === -1 ? 0 : ((index + 1) / steps.length) * 100;
  };

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'all' && order.orderStatus !== filterStatus) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id?.toLowerCase().includes(searchLower) ||
        order.orderItems?.some(item => item.name?.toLowerCase().includes(searchLower))
      );
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === '30' && daysDiff > 30) return false;
      if (dateRange === '90' && daysDiff > 90) return false;
      if (dateRange === '365' && daysDiff > 365) return false;
    }
    
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'highest') {
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    } else if (sortBy === 'lowest') {
      return (a.totalPrice || 0) - (b.totalPrice || 0);
    }
    return 0;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleTrackOrder = (orderId) => {
    // Implement tracking logic
    console.log('Track order:', orderId);
  };

  const handleReorder = (order) => {
    // Implement reorder logic
    console.log('Reorder:', order);
  };

  const handleDownloadInvoice = (orderId) => {
    // Implement invoice download
    console.log('Download invoice:', orderId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - ShoeVerse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track, manage, and review your orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiShoppingBag className="text-primary-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">All Orders</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign className="text-green-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Spent</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiCheckCircle className="text-green-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.delivered}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivered}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Delivered</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiPackage className="text-yellow-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.processing}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.processing}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Processing</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiTruck className="text-blue-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.shipped}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shipped}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Shipped</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <FiXCircle className="text-red-600" size={20} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{stats.cancelled}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cancelled}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Cancelled</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <FiRefreshCw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Total</option>
                  <option value="lowest">Lowest Total</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {sortedOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your filters'
                  : "You haven't placed any orders yet"}
              </p>
              {!searchTerm && filterStatus === 'all' && dateRange === 'all' && (
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  <FiShoppingBag size={18} />
                  Start Shopping
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {getStatusIcon(order.orderStatus)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                              #{order._id?.slice(-8)}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${order.totalPrice?.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {expandedOrder === order._id ? (
                            <FiChevronUp size={20} />
                          ) : (
                            <FiChevronDown size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.orderStatus !== 'Cancelled' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Order Progress</span>
                          <span className="text-xs font-medium text-primary-600">
                            {getStatusProgress(order.orderStatus)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getStatusProgress(order.orderStatus)}%` }}
                            className="h-full bg-gradient-to-r from-primary-600 to-accent rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700"
                      >
                        <div className="p-6 space-y-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              Items ({order.orderItems?.length})
                            </h4>
                            <div className="space-y-3">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity}
                                      </span>
                                      {item.size && (
                                        <>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Size: {item.size}
                                          </span>
                                        </>
                                      )}
                                      {item.color && (
                                        <>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <span 
                                              className="w-2 h-2 rounded-full" 
                                              style={{ backgroundColor: item.color.toLowerCase() }}
                                            />
                                            {item.color}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FiMapPin className="text-primary-600" size={16} />
                                Shipping Address
                              </h4>
                              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {order.shippingAddress?.fullName}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                  {order.shippingAddress?.address}<br />
                                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                                  {order.shippingAddress?.country}
                                </p>
                                {order.shippingAddress?.phoneNumber && (
                                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Phone: {order.shippingAddress.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FiDollarSign className="text-primary-600" size={16} />
                                Payment Information
                              </h4>
                              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">${order.itemsPrice?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="text-gray-900 dark:text-white">${order.shippingPrice?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="text-gray-900 dark:text-white">${order.taxPrice?.toFixed(2)}</span>
                                  </div>
                                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                      <span className="text-gray-900 dark:text-white">Total</span>
                                      <span className="text-primary-600">${order.totalPrice?.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                  Payment Method: {order.paymentMethod || 'Cash on Delivery'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Timeline */}
                          {order.orderStatus !== 'Cancelled' && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiClock className="text-primary-600" size={16} />
                                Order Timeline
                              </h4>
                              <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-4">
                                  <div className="relative flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 z-10`}>
                                      <FiCheckCircle className="text-green-600" size={16} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? (
                                    <div className="relative flex items-start gap-4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 z-10`}>
                                        <FiTruck className="text-blue-600" size={16} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Shipped</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          Estimated delivery: {
                                            new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric'
                                            })
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  ) : order.orderStatus === 'Delivered' ? (
                                    <div className="relative flex items-start gap-4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 z-10`}>
                                        <FiCheckCircle className="text-green-600" size={16} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Delivered</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {format(new Date(order.deliveredAt || Date.now()), 'MMM dd, yyyy')}
                                        </p>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                            >
                              <FiEye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => handleTrackOrder(order._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                              <FiTruck size={16} />
                              Track Order
                            </button>
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                              <FiRefreshCw size={16} />
                              Reorder
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                              <FiDownload size={16} />
                              Invoice
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                              <FiMessageCircle size={16} />
                              Support
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Order #{selectedOrder._id?.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placed on {format(new Date(selectedOrder.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiXCircle size={20} />
                </button>
              </div>

              {/* Modal Content - Similar to expanded view but more detailed */}
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className={`p-4 rounded-lg ${getStatusColor(selectedOrder.orderStatus)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedOrder.orderStatus)}
                    <div>
                      <p className="font-medium">Order Status: {selectedOrder.orderStatus}</p>
                      <p className="text-sm opacity-80">
                        {selectedOrder.orderStatus === 'Delivered' && 'Your order has been delivered'}
                        {selectedOrder.orderStatus === 'Shipped' && 'Your order is on the way'}
                        {selectedOrder.orderStatus === 'Processing' && 'Your order is being processed'}
                        {selectedOrder.orderStatus === 'Cancelled' && 'This order has been cancelled'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rest of modal content similar to expanded view */}
                {/* ... */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Orders;