import React, { memo } from "react";

//Shared Styles
const skeletonBase =
  "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

//Base Wrapper
const BaseSkeleton = memo(({ children }) => (
  <div className="animate-pulse">{children}</div>
));

//Individual Skeletons
const Card = memo(() => (
  <BaseSkeleton>
    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
      <div className={`aspect-square mb-3 ${skeletonBase}`} />
      <div className={`h-4 w-3/4 mb-2 ${skeletonBase}`} />
      <div className={`h-4 w-1/2 ${skeletonBase}`} />
    </div>
  </BaseSkeleton>
));

const Text = memo(() => (
  <BaseSkeleton>
    <div className="space-y-2">
      <div className={`h-4 w-full ${skeletonBase}`} />
      <div className={`h-4 w-5/6 ${skeletonBase}`} />
      <div className={`h-4 w-4/6 ${skeletonBase}`} />
    </div>
  </BaseSkeleton>
));

const Avatar = memo(() => (
  <BaseSkeleton>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${skeletonBase}`} />
      <div className="flex-1">
        <div className={`h-4 w-1/3 mb-2 ${skeletonBase}`} />
        <div className={`h-3 w-1/4 ${skeletonBase}`} />
      </div>
    </div>
  </BaseSkeleton>
));

const List = memo(() => (
  <BaseSkeleton>
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`h-10 ${skeletonBase}`} />
      ))}
    </div>
  </BaseSkeleton>
));

const Chart = memo(() => (
  <BaseSkeleton>
    <div>
      <div className={`h-4 w-1/4 mb-4 ${skeletonBase}`} />
      <div className={`h-32 ${skeletonBase}`} />
    </div>
  </BaseSkeleton>
));


//Skeleton Map
const skeletonMap = {
  card: Card,
  text: Text,
  avatar: Avatar,
  list: List,
  chart: Chart,
};


//Main Component
const LoadingSkeleton = ({
  type = "card",
  count = 1,
  className = "",
}) => {
  const SkeletonComponent =
    skeletonMap[type] || skeletonMap.card;

  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

//Named Exports
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

export default memo(LoadingSkeleton);