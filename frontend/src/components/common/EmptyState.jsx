import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiBox, FiShoppingCart } from 'react-icons/fi';

const icons = {
  orders: FiShoppingBag,
  wishlist: FiHeart,
  products: FiBox,
  cart: FiShoppingCart,
};

const messages = {
  orders: "You haven't placed any sneaker orders yet. Ready to step up?",
  wishlist: "Found something you love? Save it here ❤️",
  products: "No sneakers available. Check back later!",
  cart: "Your cart is empty. Start shopping!",
  admin_products: "No sneakers available. Add your first product.",
  admin_orders: "No orders yet.",
  admin_users: "No users found.",
};

const EmptyState = ({ type = 'products', action }) => {
  const Icon = icons[type] || FiBox;
  const message = messages[type] || messages[type.split('_')[1]] || "Nothing to see here.";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
        className="w-24 h-24 mb-6 text-gray-400 dark:text-gray-500"
      >
        <Icon size={96} />
      </motion.div>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;