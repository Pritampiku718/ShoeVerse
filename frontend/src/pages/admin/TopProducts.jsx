// frontend/src/pages/admin/TopProducts.jsx
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

const TopProducts = ({ data }) => {
  const defaultProducts = [
    { name: 'Nike Air Max 270', sales: 234, revenue: 45678 },
    { name: 'Adidas Ultraboost', sales: 189, revenue: 37654 },
    { name: 'Jordan Retro 4', sales: 156, revenue: 35432 },
    { name: 'New Balance 990v5', sales: 134, revenue: 28765 },
    { name: 'Puma RS-X', sales: 98, revenue: 19876 },
  ];

  const products = data || defaultProducts;

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <motion.div
          key={product.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-white" size={16} />
            </div>
            <div>
              <p className="text-white font-medium">{product.name}</p>
              <p className="text-xs text-gray-400">{product.sales} units sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">${product.revenue.toLocaleString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TopProducts;