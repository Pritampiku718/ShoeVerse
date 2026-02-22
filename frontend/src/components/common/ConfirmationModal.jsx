// frontend/src/components/common/ConfirmationModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' or 'warning' or 'info'
}) => {
  const getTypeStyles = () => {
    switch(type) {
      case 'danger':
        return {
          icon: <FiAlertTriangle className="text-red-500" size={24} />,
          confirmBg: 'bg-red-500 hover:bg-red-600',
          iconBg: 'bg-red-500/20'
        };
      case 'warning':
        return {
          icon: <FiAlertTriangle className="text-yellow-500" size={24} />,
          confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
          iconBg: 'bg-yellow-500/20'
        };
      default:
        return {
          icon: <FiAlertTriangle className="text-blue-500" size={24} />,
          confirmBg: 'bg-blue-500 hover:bg-blue-600',
          iconBg: 'bg-blue-500/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-700">
              {/* Header */}
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300">{message}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700 bg-gray-800/50 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-2.5 ${styles.confirmBg} text-white rounded-xl transition-colors`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;