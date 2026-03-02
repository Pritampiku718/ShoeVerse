import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiPackage,
  FiXCircle,
  FiCopy,
  FiMapPin,
  FiCalendar,
  FiTruck as FiShipping,
  FiCheck,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { getStatusConfig } from "../../utils/statusConfig";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

const steps = [
  {
    key: "placed",
    label: "Order Placed",
    icon: FiCheckCircle,
    description: "Your order has been placed successfully",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "confirmed",
    label: "Payment Confirmed",
    icon: FiCheck,
    description: "Payment has been confirmed",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: FiTruck,
    description: "Your order is on the way",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: FiPackage,
    description: "Your sneakers have arrived!",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
  },
];

const cancelledStep = {
  key: "cancelled",
  label: "Order Cancelled",
  icon: FiXCircle,
  description: "This order has been cancelled",
  color: "from-red-500 to-rose-500",
  bgColor: "bg-red-100 dark:bg-red-900/30",
  textColor: "text-red-600 dark:text-red-400",
};

const OrderTimeline = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    status,
    estimatedDelivery,
    trackingId,
    shippingPartner,
    shippingAddress,
    orderNumber,
    createdAt,
    updatedAt,
  } = order;

  const isCancelled = status === "cancelled";
  const currentStepIndex = steps.findIndex((s) => s.key === status);
  const progress = isCancelled
    ? 0
    : ((currentStepIndex + 1) / steps.length) * 100;

  const timelineSteps = isCancelled ? [cancelledStep] : steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const StepIcon = currentStep.icon;

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    toast.success("Tracking ID copied to clipboard", {
      icon: "📋",
      style: {
        background: "#10B981",
        color: "#FFFFFF",
        borderRadius: "12px",
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Premium Header with Gradient */}
      <div className="relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isCancelled ? "#ef4444" : "#3b82f6"} 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Header Content */}
        <div
          className={`relative px-4 sm:px-6 py-4 bg-gradient-to-r ${
            isCancelled
              ? "from-red-500 to-rose-500"
              : status === "delivered"
                ? "from-green-500 to-emerald-500"
                : "from-primary-600 to-accent"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              
              {/* Status Icon */}
              <motion.div
                animate={{ rotate: isCancelled ? 0 : [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Order {orderNumber || `#ORD-${order._id?.slice(-6)}`}
                  {isCancelled && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                      Cancelled
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-white/90">
                  Placed on {formatDate(createdAt)}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {status.toUpperCase()}
                </span>
              </div>

              {/* Expand/Collapse Button for Mobile */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="sm:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
              >
                {expanded ? (
                  <FiChevronUp size={18} className="text-white" />
                ) : (
                  <FiChevronDown size={18} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        
        {/* Progress Section - Hidden on Mobile when collapsed */}
        {!isCancelled && (
          <div className={`${!expanded ? "block" : "hidden sm:block"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status === "delivered"
                      ? "bg-green-500"
                      : "bg-primary-500 animate-pulse"
                  }`}
                />
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {status === "delivered"
                    ? "Order completed successfully"
                    : `Estimated delivery: ${estimatedDelivery ? formatDate(estimatedDelivery).split(",")[0] : "Processing"}`}
                </p>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {progress.toFixed(0)}% Complete
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${
                    status === "delivered"
                      ? "from-green-500 to-emerald-500"
                      : "from-primary-600 to-accent"
                  } relative`}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>

              {/* Progress Markers */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-white dark:bg-gray-900 rounded-full"
                    style={{
                      left: `${(index + 1) * (100 / steps.length) - 2}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Steps Timeline */}
        <div className={`space-y-4 sm:space-y-6 ${!expanded && "sm:block"}`}>
          {timelineSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = isCancelled
              ? step.key === status
              : index <= currentStepIndex;
            const isCompleted = !isCancelled && index < currentStepIndex;
            const isCurrent = !isCancelled && index === currentStepIndex;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start group"
              >
                {/* Connector Line */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-4 top-10 w-0.5 h-12 ${
                      index < currentStepIndex
                        ? "bg-gradient-to-b from-primary-500 to-accent"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}

                {/* Icon Container */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${
                      isActive
                        ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    } ${isCurrent ? "ring-4 ring-primary-200 dark:ring-primary-900/50" : ""}`}
                  >
                    <StepIcon size={16} className="sm:w-5 sm:h-5" />

                    {/* Pulse Animation for Current Step */}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl bg-primary-500"
                      />
                    )}
                  </motion.div>

                  {/* Completed Check */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                    >
                      <FiCheck size={8} className="text-white sm:w-3 sm:h-3" />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="ml-3 sm:ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h4>

                    {/* Time Indicator for Current Step */}
                    {isCurrent && (
                      <span className="text-[10px] sm:text-xs font-medium text-primary-600 dark:text-primary-400">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-[10px] sm:text-xs mt-0.5 ${
                      isActive
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Shipping Details - Only for shipped step */}
                  {step.key === "shipped" && trackingId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FiShipping
                            className="text-purple-600 dark:text-purple-400"
                            size={14}
                          />
                          <span className="text-[10px] sm:text-xs font-medium text-purple-700 dark:text-purple-300">
                            {shippingPartner || "Standard Shipping"}
                          </span>
                        </div>

                        {/* Tracking ID with Copy */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs font-mono text-gray-700 dark:text-gray-300">
                            {trackingId}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={copyTrackingId}
                            className={`p-1 rounded-lg transition-colors ${
                              copied
                                ? "bg-green-500 text-white"
                                : "hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400"
                            }`}
                            title="Copy tracking ID"
                          >
                            <FiCopy size={12} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Track Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 w-full sm:w-auto px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] sm:text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        Track Package
                        <FiArrowRight size={12} />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information - Expandable on Mobile */}
        <AnimatePresence>
          {(expanded || window.innerWidth >= 640) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700"
            >
              {/* Shipping Address */}
              {shippingAddress && (
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin
                      className="text-primary-600 dark:text-primary-400"
                      size={16}
                    />
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      Shipping Address
                    </h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {shippingAddress.street}, {shippingAddress.city},{" "}
                    {shippingAddress.state} {shippingAddress.zip}
                  </p>
                </div>
              )}

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {estimatedDelivery && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <FiCalendar
                        className="text-primary-600 dark:text-primary-400"
                        size={14}
                      />
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Est. Delivery
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                      {formatDate(estimatedDelivery).split(",")[0]}
                    </p>
                  </div>
                )}

                {shippingPartner && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <FiShipping
                        className="text-primary-600 dark:text-primary-400"
                        size={14}
                      />
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Carrier
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                      {shippingPartner}
                    </p>
                  </div>
                )}

                {updatedAt && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <FiClock
                        className="text-primary-600 dark:text-primary-400"
                        size={14}
                      />
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Last Updated
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">
                      {formatDate(updatedAt).split(",")[0]}
                    </p>
                  </div>
                )}
              </div>

              {/* Need Help Section */}
              <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300">
                  Having trouble with your order?{" "}
                  <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Contact Support
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Expand/Collapse Hint */}
        <div className="sm:hidden text-center mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-primary-600 dark:text-primary-400 font-medium flex items-center justify-center gap-1 mx-auto"
          >
            {expanded ? "Show less" : "Show more details"}
            {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderTimeline;
