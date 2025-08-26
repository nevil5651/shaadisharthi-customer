// components/ServiceHeroSkeleton.tsx
export function ServiceHeroSkeleton() {
  return (
    <div className="service-hero rounded-xl p-8 mb-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 animate-pulse">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700 mr-0 md:mr-8 mb-4 md:mb-0"></div>
        <div className="text-center md:text-left flex-1">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto md:mx-0 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto md:mx-0 mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mx-auto md:mx-0"></div>
        </div>
      </div>
    </div>
  );
}