const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text = '',
}) => {
  
  // size map
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorMap = {
    primary: 'border-primary-500',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  const spinnerClass = `${sizeMap[size] || sizeMap.md} ${colorMap[color] || colorMap.primary} rounded-full border-t-transparent animate-spin`;

  const spinner = (
    <div className="flex flex-col items-center gap-2">
      <div className={spinnerClass} />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageSpinner = () => (
  <LoadingSpinner fullScreen size="lg" text="Loading..." />
);

export const ButtonSpinner = () => (
  <LoadingSpinner size="sm" color="white" />
);

export default LoadingSpinner;