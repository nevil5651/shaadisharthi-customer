// Skeleton loader component with dark mode support
const BookingCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div className="animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

export { BookingCardSkeleton };