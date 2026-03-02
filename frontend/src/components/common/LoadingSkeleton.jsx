const LoadingSkeleton = ({ type = "card", count = 1, className = "" }) => {
  const BaseSkeleton = ({ children }) => (
    <div className="animate-pulse">{children}</div>
  );

  // Card skeleton
  const CardSkeleton = () => (
    <BaseSkeleton>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4">
        <div className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-lg mb-3" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
      </div>
    </BaseSkeleton>
  );

  // Text skeleton
  const TextSkeleton = () => (
    <BaseSkeleton>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </BaseSkeleton>
  );

  // Avatar skeleton 
  const AvatarSkeleton = () => (
    <BaseSkeleton>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    </BaseSkeleton>
  );

  // List skeleton
  const ListSkeleton = () => (
    <BaseSkeleton>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </BaseSkeleton>
  );

  // Chart skeleton
  const ChartSkeleton = () => (
    <BaseSkeleton>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </BaseSkeleton>
  );

  const skeletons = {
    card: CardSkeleton,
    text: TextSkeleton,
    avatar: AvatarSkeleton,
    list: ListSkeleton,
    chart: ChartSkeleton,
  };

  const SkeletonComponent = skeletons[type] || skeletons.card;

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export const CardSkeleton = (props) => (
  <LoadingSkeleton type="card" {...props} />
);
export const TextSkeleton = (props) => (
  <LoadingSkeleton type="text" {...props} />
);
export const AvatarSkeleton = (props) => (
  <LoadingSkeleton type="avatar" {...props} />
);
export const ListSkeleton = (props) => (
  <LoadingSkeleton type="list" {...props} />
);
export const ChartSkeleton = (props) => (
  <LoadingSkeleton type="chart" {...props} />
);

export default LoadingSkeleton;
