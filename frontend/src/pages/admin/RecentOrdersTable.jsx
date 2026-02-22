// frontend/src/pages/admin/RecentOrdersTable.jsx
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RecentOrdersTable = ({ data }) => {
  const navigate = useNavigate();
  
  const defaultOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 245, status: 'Delivered', date: '2024-02-20' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 189, status: 'Processing', date: '2024-02-20' },
    { id: '#ORD-003', customer: 'Bob Johnson', amount: 399, status: 'Shipped', date: '2024-02-19' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: 129, status: 'Pending', date: '2024-02-19' },
    { id: '#ORD-005', customer: 'Charlie Wilson', amount: 567, status: 'Delivered', date: '2024-02-18' },
  ];

  const orders = data && data.length > 0 ? data : defaultOrders;

  const getStatusColor = (status) => {
    // Safely handle undefined or null status
    if (!status) return 'bg-gray-500/20 text-gray-400';
    
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      case 'refunded':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    return `$${amount}`;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            // Ensure order has all required properties
            const orderId = order.orderNumber || order.id || `#ORD-${String(index + 1).padStart(3, '0')}`;
            const customerName = order.user?.name || order.customer || 'Guest';
            const amount = order.totalPrice || order.amount || 0;
            const status = order.orderStatus || order.status || 'Pending';
            const date = order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString() 
              : order.date || new Date().toLocaleDateString();

            return (
              <motion.tr
                key={order._id || order.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">{orderId}</td>
                <td className="px-4 py-3 text-gray-300">{customerName}</td>
                <td className="px-4 py-3 text-white font-medium">{formatAmount(amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{date}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleViewOrder(order._id || order.id)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                    title="View Order Details"
                  >
                    <FiEye size={16} />
                  </button>
                </td>
              </motion.tr>
            );
          })}
          
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;