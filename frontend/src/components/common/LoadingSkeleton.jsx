// frontend/src/components/common/LoadingSkeleton.jsx
import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 w-24 bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <div className="h-6 w-40 bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-700/50 rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <div className="h-6 w-40 bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-700/50 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <div className="h-6 w-40 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-16 bg-gray-700/30 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;