import { useState } from "react";
import { FiArrowUp, FiArrowDown, FiActivity, FiZap } from "react-icons/fi";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color,
  gradient = true,
  subtitle,
  progress,
  footer,
  onClick,
  badge,
  comparison,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if trend is positive
  const isPositive = trend?.startsWith("+");
  const TrendIcon = isPositive ? FiArrowUp : FiArrowDown;

  // Premium color schemes
  const colorSchemes = {
    "from-green-500 to-emerald-500": {
      gradient: "from-emerald-400 via-green-500 to-teal-500",
      icon: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      accent: "text-emerald-500",
    },
    "from-blue-500 to-cyan-500": {
      gradient: "from-blue-500 via-sky-500 to-cyan-500",
      icon: "text-blue-600 dark:text-blue-300",
      bg: "bg-blue-50 dark:bg-blue-950/50",
      accent: "text-blue-500",
    },
    "from-purple-500 to-pink-500": {
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      icon: "text-purple-600 dark:text-purple-300",
      bg: "bg-purple-50 dark:bg-purple-950/50",
      accent: "text-purple-500",
    },
    "from-orange-500 to-red-500": {
      gradient: "from-orange-500 via-rose-500 to-red-500",
      icon: "text-orange-600 dark:text-orange-300",
      bg: "bg-orange-50 dark:bg-orange-950/50",
      accent: "text-orange-500",
    },
  };

  const scheme =
    colorSchemes[color] || colorSchemes["from-blue-500 to-cyan-500"];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
        isHovered ? "shadow-xl -translate-y-1" : "shadow-md"
      } ${gradient ? `bg-gradient-to-br ${scheme.gradient}` : scheme.bg}`}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,white,transparent_50%)] opacity-20" />

      {/* Hover Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-20">
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          
          {/* Icon with Premium Styling */}
          <div className="relative">
            <div
              className={`p-2.5 rounded-xl backdrop-blur-sm ${
                gradient
                  ? "bg-white/20 border border-white/30"
                  : "bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30"
              } shadow-lg`}
            >
              <Icon
                className={`w-5 h-5 ${gradient ? "text-white drop-shadow-lg" : scheme.icon}`}
              />
            </div>
            
            {/* Icon Glow */}
            <div
              className={`absolute inset-0 bg-white rounded-xl blur-md transition-opacity duration-300 ${
                isHovered ? "opacity-50" : "opacity-20"
              }`}
            />
          </div>

          {/* Trend Badge */}
          {trend && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                isHovered ? "translate-x-0.5 shadow-lg" : ""
              } ${
                gradient
                  ? "bg-white/20 border border-white/30"
                  : "bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30"
              }`}
            >
              <TrendIcon
                className={`w-3.5 h-3.5 drop-shadow ${
                  gradient ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              />
              <span
                className={`text-sm font-black tracking-wide drop-shadow ${
                  gradient ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {trend}
              </span>
              <FiZap
                className={`w-3 h-3 ${
                  gradient
                    ? "text-white/60"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-xs font-extrabold tracking-[0.15em] uppercase mb-1 drop-shadow ${
            gradient ? "text-white/80" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className={`text-3xl font-black tracking-tight ${
              gradient ? "text-white" : "text-gray-900 dark:text-white"
            }`}
            style={{
              textShadow: isHovered
                ? gradient
                  ? "0 4px 15px rgba(255,255,255,0.5)"
                  : "0 4px 15px rgba(0,0,0,0.25)"
                : gradient
                  ? "0 2px 8px rgba(255,255,255,0.3)"
                  : "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {value}
          </span>
          {subtitle && (
            <span
              className={`text-sm font-bold ${
                gradient ? "text-white/70" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Trend Label */}
        {trendLabel && (
          <div
            className={`flex items-center gap-1.5 text-xs font-bold transition-all duration-300 ${
              isHovered ? "translate-x-0.5" : ""
            } ${
              gradient ? "text-white/80" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FiActivity className="w-3.5 h-3.5 opacity-80" />
            <span className="font-extrabold tracking-wide">{trendLabel}</span>

            {/* Comparison Badge */}
            {comparison && (
              <span
                className={`ml-1 px-2 py-0.5 text-[10px] font-black rounded-full backdrop-blur-sm ${
                  gradient
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300/30 dark:border-gray-600/30"
                }`}
              >
                {comparison}
              </span>
            )}
          </div>
        )}

        {/* Premium Progress Bar */}
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-extrabold mb-1">
              <span
                className={`tracking-wide ${
                  gradient
                    ? "text-white/70"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                PROGRESS
              </span>
              <span
                className={`font-black ${
                  gradient ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {progress}%
              </span>
            </div>
            <div
              className={`h-1.5 rounded-full overflow-hidden backdrop-blur-sm ${
                gradient ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <div
                style={{ width: `${progress}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${
                  gradient
                    ? "from-white via-white to-white/90"
                    : scheme.gradient
                } relative overflow-hidden`}
              >
                {/* Progress Shine Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 ${
                    isHovered ? "animate-shine" : ""
                  }`}
                  style={{
                    transform: "skewX(-20deg)",
                    animation: isHovered ? "shine 1.5s infinite" : "none",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div
            className={`mt-4 pt-3 border-t backdrop-blur-sm ${
              gradient
                ? "border-white/15"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-extrabold tracking-wide ${
                  gradient
                    ? "text-white/60"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {footer}
              </span>
              {badge && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-sm ${
                    gradient
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300/30 dark:border-gray-600/30"
                  }`}
                >
                  {badge}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div
        className={`absolute top-2 right-2 w-8 h-8 border border-white/10 rounded-full transition-all duration-300 ${
          isHovered ? "scale-150 opacity-30" : "scale-100 opacity-10"
        }`}
      />
      <div
        className={`absolute bottom-2 left-2 w-8 h-8 border border-white/10 rounded-full transition-all duration-300 ${
          isHovered ? "scale-150 opacity-30" : "scale-100 opacity-10"
        }`}
      />

      {/* Add shine animation keyframes */}
      <style>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default StatsCard;
