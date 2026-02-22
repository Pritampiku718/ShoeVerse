// frontend/src/pages/admin/ActivityFeed.jsx
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUser, FiDollarSign, FiPackage, FiAlertCircle } from 'react-icons/fi';

const ActivityFeed = ({ data }) => {
  const defaultActivities = [
    { type: 'order', message: 'New order #ORD-006', user: 'Sarah Johnson', time: '2 min ago', icon: FiShoppingBag, color: 'text-blue-400 bg-blue-500/20' },
    { type: 'user', message: 'New user registered', user: 'Mike Chen', time: '15 min ago', icon: FiUser, color: 'text-green-400 bg-green-500/20' },
    { type: 'payment', message: 'Payment received', user: 'Order #ORD-004', time: '1 hour ago', icon: FiDollarSign, color: 'text-purple-400 bg-purple-500/20' },
    { type: 'stock', message: 'Low stock alert', user: 'Nike Air Max', time: '2 hours ago', icon: FiAlertCircle, color: 'text-yellow-400 bg-yellow-500/20' },
    { type: 'order', message: 'Order delivered', user: 'Order #ORD-002', time: '3 hours ago', icon: FiShoppingBag, color: 'text-blue-400 bg-blue-500/20' },
  ];

  const activities = data || defaultActivities;

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-xs text-gray-400">{activity.user} • {activity.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed; // Make sure this export exists!