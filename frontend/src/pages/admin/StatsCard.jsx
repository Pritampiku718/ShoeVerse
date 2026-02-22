// frontend/src/pages/admin/StatsCard.jsx
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, color, gradient }) => {
  // Safely check if trend exists and is a string
  const isPositive = trend && typeof trend === 'string' ? trend.startsWith('+') : false;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 ${
        gradient ? `bg-gradient-to-br ${color}` : ''
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
            <Icon className="text-white" size={24} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">
          {typeof value === 'number' && title.includes('Revenue') ? '$' : ''}
          {value ? value.toLocaleString() : '0'}
        </p>
        {trendLabel && (
          <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;