import { motion } from 'framer-motion';
import { FiBox } from 'react-icons/fi';

const messages = {
  orders: "You haven't placed any sneaker orders yet. Ready to step up?",
  wishlist: "Found something you love? Save it here ❤️",
  products: "No sneakers available. Check back later!",
  cart: "Your cart is empty. Start shopping!",
  admin_products: "No sneakers available. Add your first product.",
  admin_orders: "No orders yet.",
  admin_users: "No users found.",
  default: "Nothing to see here."
};

const EmptyState = ({ 
  type = 'products', 
  action,
  icon: CustomIcon,
}) => {
  const message = messages[type] || messages[type.split('_')[1]] || messages.default;
  const Icon = CustomIcon || FiBox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <Icon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
      
      <p className="text-base text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;