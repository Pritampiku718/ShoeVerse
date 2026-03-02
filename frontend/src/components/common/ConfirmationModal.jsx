import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useEffect, useRef } from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
  disableBackdropClick = false,
}) => {
  const confirmButtonRef = useRef(null);

  // Auto-focus confirm button
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => confirmButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && isOpen && onClose();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const typeStyles = {
    danger: {
      bg: "bg-red-500",
      hover: "hover:bg-red-600",
      icon: "text-red-500",
      iconBg: "bg-red-500/10",
    },
    warning: {
      bg: "bg-yellow-500",
      hover: "hover:bg-yellow-600",
      icon: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
    },
    info: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      icon: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    success: {
      bg: "bg-green-500",
      hover: "hover:bg-green-600",
      icon: "text-green-500",
      iconBg: "bg-green-500/10",
    },
  };

  const styles = typeStyles[type] || typeStyles.info;

  const handleConfirm = async () => {
    if (isLoading) return;
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirmation failed:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disableBackdropClick && !isLoading && onClose()}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="text-gray-500 dark:text-gray-400" size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex gap-3">
                  <div className={`p-2 ${styles.iconBg} rounded-full`}>
                    <FiAlertTriangle className={styles.icon} size={20} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                    {message}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  ref={confirmButtonRef}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-3 py-2 ${styles.bg} ${styles.hover} text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    confirmText
                  )}
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
