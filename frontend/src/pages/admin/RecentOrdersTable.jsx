import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiShoppingBag, 
  FiUser, 
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiArrowRight,
  FiAward,
  FiRefreshCw,
  FiTrendingUp
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RecentOrdersTable = ({ data }) => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  const defaultOrders = [
    { 
      id: 'ORD-001', 
      customer: { name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
      amount: 245.99, 
      status: 'Delivered', 
      date: '2024-02-20T10:30:00Z',
      items: 2,
      paymentMethod: 'Credit Card',
      priority: 'high'
    },
    { 
      id: 'ORD-002', 
      customer: { name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
      amount: 189.50, 
      status: 'Processing', 
      date: '2024-02-20T09:15:00Z',
      items: 1,
      paymentMethod: 'PayPal',
      priority: 'normal'
    },
    { 
      id: 'ORD-003', 
      customer: { name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ' },
      amount: 399.99, 
      status: 'Shipped', 
      date: '2024-02-19T14:45:00Z',
      items: 3,
      paymentMethod: 'Credit Card',
      priority: 'high'
    },
    { 
      id: 'ORD-004', 
      customer: { name: 'Alice Brown', email: 'alice@example.com', avatar: 'AB' },
      amount: 129.99, 
      status: 'Pending', 
      date: '2024-02-19T11:20:00Z',
      items: 1,
      paymentMethod: 'Debit Card',
      priority: 'low'
    },
    { 
      id: 'ORD-005', 
      customer: { name: 'Charlie Wilson', email: 'charlie@example.com', avatar: 'CW' },
      amount: 567.50, 
      status: 'Delivered', 
      date: '2024-02-18T16:30:00Z',
      items: 4,
      paymentMethod: 'PayPal',
      priority: 'normal'
    },
  ];

  const orders = data && data.length > 0 ? data : defaultOrders;

  const getStatusConfig = (status) => {
    if (!status) return {
      color: 'gray',
      bg: 'bg-gray-100 dark:bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-500/20',
      icon: FiClock,
      label: 'Unknown'
    };
    
    const statusLower = status.toLowerCase();
    
    const statusMap = {
      'delivered': {
        color: 'green',
        bg: 'bg-green-100 dark:bg-green-500/10',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-500/20',
        icon: FiCheckCircle,
        label: 'Delivered'
      },
      'shipped': {
        color: 'blue',
        bg: 'bg-blue-100 dark:bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-500/20',
        icon: FiTruck,
        label: 'Shipped'
      },
      'processing': {
        color: 'yellow',
        bg: 'bg-yellow-100 dark:bg-yellow-500/10',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-500/20',
        icon: FiPackage,
        label: 'Processing'
      },
      'pending': {
        color: 'orange',
        bg: 'bg-orange-100 dark:bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-500/20',
        icon: FiClock,
        label: 'Pending'
      },
      'cancelled': {
        color: 'red',
        bg: 'bg-red-100 dark:bg-red-500/10',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-500/20',
        icon: FiXCircle,
        label: 'Cancelled'
      },
      'refunded': {
        color: 'purple',
        bg: 'bg-purple-100 dark:bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-500/20',
        icon: FiRefreshCw,
        label: 'Refunded'
      }
    };
    
    return statusMap[statusLower] || {
      color: 'gray',
      bg: 'bg-gray-100 dark:bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-500/20',
      icon: FiClock,
      label: status
    };
  };

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-500/10',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-500/20',
          label: 'High Priority'
        };
      case 'normal':
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/10',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-500/20',
          label: 'Normal'
        };
      case 'low':
        return {
          bg: 'bg-gray-100 dark:bg-gray-500/10',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-500/20',
          label: 'Low'
        };
      default:
        return null;
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
    return amount;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'amount') {
      const amountA = a.totalPrice || a.amount || 0;
      const amountB = b.totalPrice || b.amount || 0;
      return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA;
    }
    return 0;
  });

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      
      {/* Table Header with Stats */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FiShoppingBag className="text-primary-600 dark:text-primary-400" size={16} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {orders.length} orders
            </span>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              ${orders.reduce((sum, o) => sum + (o.totalPrice || o.amount || 0), 0).toFixed(2)} total
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedOrders.map((order, index) => {
              const orderId = order.orderNumber || order.id || `ORD-${String(index + 1).padStart(3, '0')}`;
              const customer = order.user || order.customer || { name: 'Guest', email: 'guest@example.com' };
              const customerName = customer.name || customer;
              const customerEmail = customer.email || '';
              const amount = order.totalPrice || order.amount || 0;
              const status = order.orderStatus || order.status || 'Pending';
              const date = order.createdAt || order.date;
              const items = order.items || order.orderItems?.length || 1;
              const paymentMethod = order.paymentMethod || 'N/A';
              const priority = order.priority || 'normal';

              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;
              const priorityBadge = getPriorityBadge(priority);

              return (
                <motion.tr
                  key={order._id || order.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredRow(index)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className={`group transition-all duration-200 ${
                    hoveredRow === index 
                      ? 'bg-gray-50 dark:bg-gray-700/50' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        {orderId.slice(-2)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          #{orderId}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FiPackage className="text-gray-400 dark:text-gray-500" size={10} />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {items} {items === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xs">
                        {customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white block">
                          {typeof customerName === 'string' ? customerName : 'Guest'}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {customerEmail || 'No email'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {formatAmount(amount)}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FiDollarSign className="text-gray-400 dark:text-gray-500" size={10} />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {paymentMethod}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                      {priorityBadge && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-medium w-fit ${priorityBadge.bg} ${priorityBadge.text} border ${priorityBadge.border}`}>
                          <FiTrendingUp size={8} className="mr-0.5" />
                          {priorityBadge.label}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(date)}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FiCalendar className="text-gray-400 dark:text-gray-500" size={10} />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {new Date(date || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewOrder(order._id || order.id)}
                        className="p-2 rounded-lg bg-primary-100 dark:bg-primary-500/10 hover:bg-primary-200 dark:hover:bg-primary-500/20 transition-colors group/btn"
                        title="View Order Details"
                      >
                        <FiEye className="text-primary-600 dark:text-primary-400" size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 group/btn"
                        title="Quick View"
                      >
                        <FiArrowRight className="text-gray-600 dark:text-gray-400" size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <FiShoppingBag className="text-gray-400 dark:text-gray-500" size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      No orders found
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      There are no orders to display at the moment.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{orders.length}</span> recent orders
          </p>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
          >
            View All Orders
            <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;