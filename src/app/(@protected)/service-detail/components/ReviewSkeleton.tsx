
// components/ReviewSkeleton.tsx
export function ReviewSkeleton() {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-6 animate-pulse">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/5"></div>
        </div>
      </div>
    </div>
  );
}