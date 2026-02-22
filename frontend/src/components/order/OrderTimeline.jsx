import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiTruck, FiPackage, FiXCircle, FiCopy } from 'react-icons/fi';
import { getStatusConfig } from '../../utils/statusConfig';
import { toast } from 'react-hot-toast';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: FiCheckCircle },
  { key: 'confirmed', label: 'Payment Confirmed', icon: FiCheckCircle },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiPackage },
];

const cancelledStep = { key: 'cancelled', label: 'Cancelled', icon: FiXCircle };

const OrderTimeline = ({ order }) => {
  const { status, estimatedDelivery, trackingId, shippingPartner, shippingAddress } = order;
  const isCancelled = status === 'cancelled';
  const currentStepIndex = steps.findIndex(s => s.key === status);
  const progress = isCancelled ? 0 : (currentStepIndex + 1) / steps.length * 100;

  const timelineSteps = isCancelled ? [cancelledStep] : steps;

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    toast.success('Tracking ID copied to clipboard');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiClock /> Order Timeline
      </h3>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{progress.toFixed(0)}% complete</p>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = isCancelled ? step.key === status : index <= currentStepIndex;
          const isCompleted = !isCancelled && index < currentStepIndex;
          const isCurrent = !isCancelled && index === currentStepIndex;

          return (
            <div key={step.key} className="flex items-start">
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              } ${isCurrent ? 'ring-4 ring-primary-200 dark:ring-primary-900' : ''}`}>
                <StepIcon size={16} />
              </div>
              <div className="ml-4 flex-1">
                <p className={`font-medium ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {status === 'placed' && 'Your order has been placed. We\'re processing it.'}
                    {status === 'confirmed' && 'Payment confirmed. We are preparing your order.'}
                    {status === 'shipped' && 'Your order is on the way!'}
                    {status === 'delivered' && 'Your sneakers have arrived! Enjoy!'}
                  </p>
                )}
                {step.key === 'shipped' && trackingId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tracking: {trackingId}
                    </span>
                    <button
                      onClick={copyTrackingId}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Copy tracking ID"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping info */}
      {shippingAddress && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Shipping Address</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </p>
        </div>
      )}

      {estimatedDelivery && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estimated Delivery: {new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      )}

      {shippingPartner && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Shipping Partner: {shippingPartner}
          </p>
        </div>
      )}
    </div>
  );
};
export default OrderTimeline;