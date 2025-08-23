// components/ReviewSkeleton.tsx
export function ReviewSkeleton() {
  return (
    <div className="border-b border-gray-100 pb-6 animate-pulse">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/5"></div>
        </div>
      </div>
    </div>
  );
}