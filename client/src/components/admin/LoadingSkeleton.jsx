const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const CardSkeleton = () => (
  <div className="premium-card p-5 space-y-4">
    <div className="flex items-center gap-4">
      <SkeletonBlock className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-5 w-32" />
      </div>
    </div>
    <SkeletonBlock className="h-2 w-full" />
    <div className="flex justify-between">
      <SkeletonBlock className="h-3 w-16" />
      <SkeletonBlock className="h-3 w-12" />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex gap-4 px-4 py-3">
      <SkeletonBlock className="h-4 w-8" />
      <SkeletonBlock className="h-4 w-48" />
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-4 w-20" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 px-4 py-4 border-t border-gray-100">
        <SkeletonBlock className="h-4 w-8" />
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
    ))}
  </div>
);

const ListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const TextSkeleton = () => (
  <div className="space-y-3 p-4">
    <SkeletonBlock className="h-4 w-3/4" />
    <SkeletonBlock className="h-4 w-full" />
    <SkeletonBlock className="h-4 w-5/6" />
    <SkeletonBlock className="h-4 w-2/3" />
  </div>
);

const skeletons = {
  card: CardSkeleton,
  table: TableSkeleton,
  list: ListSkeleton,
  text: TextSkeleton,
};

const LoadingSkeleton = ({ type = 'text', count = 1 }) => {
  const SkeletonComponent = skeletons[type] || skeletons.text;

  return (
    <div className="w-full" role="status" aria-label="Loading">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSkeleton;
