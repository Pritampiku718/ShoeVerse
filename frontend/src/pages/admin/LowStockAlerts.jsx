// frontend/src/pages/admin/LowStockAlerts.jsx
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const LowStockAlerts = ({ data }) => {
  const defaultAlerts = [
    { name: 'Nike Air Force 1', stock: 3, size: 'US 9' },
    { name: 'Adidas Stan Smith', stock: 2, size: 'US 10' },
    { name: 'Vans Old Skool', stock: 5, size: 'US 8' },
    { name: 'Converse Chuck Taylor', stock: 4, size: 'US 7' },
  ];

  const alerts = data || defaultAlerts;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <motion.div
          key={`${alert.name}-${alert.size}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="text-yellow-400" size={16} />
            </div>
            <div>
              <p className="text-white font-medium">{alert.name}</p>
              <p className="text-xs text-gray-400">Size {alert.size}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
              {alert.stock} left
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LowStockAlerts; // Add this line