'use client';
import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ErrorBoundary from './components/ErrorBoundary';
import VendorGridSkeleton from './components/VendorGridSkeleton';
import EmptyState from './components/EmptyState';
import { useServices, ServiceFilters } from '@/hooks/useServices';
import { ChevronDownIcon, ChevronUpIcon } from './components/Icons';

// Dynamically import heavy components
const FilterSection = dynamic(() => import('./components/FilterSection'), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />,
  ssr: false
});

const CategoryCard = dynamic(() => import('./components/CategoryCard'), {
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />,
});

const VendorCard = dynamic(() => import('./components/VendorCard'), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
});

const categories = [
  { name: 'Photography', icon: 'fa-camera', color: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-600 dark:text-indigo-300' } },
  { name: 'Venues', icon: 'fa-building', color: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600 dark:text-purple-300' } },
  { name: 'Sound', icon: 'fa-volume-up', color: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600 dark:text-purple-300' } },
  { name: 'Caterers', icon: 'fa-utensils', color: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600 dark:text-green-300' } },
  { name: 'Decoration', icon: 'fa-paint-brush', color: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-600 dark:text-pink-300' } },
  { name: 'Bridal Wear', icon: 'fa-tshirt', color: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-600 dark:text-red-300' } },
  { name: 'Jewellery', icon: 'fa-gem', color: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600 dark:text-yellow-300' } },
  { name: 'Favors', icon: 'fa-gift', color: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600 dark:text-blue-300' } },
  { name: 'Planners', icon: 'fa-clipboard-list', color: { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-600 dark:text-teal-300' } },
  { name: 'Bridal Makeup', icon: 'fa-magic', color: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-600 dark:text-pink-300' } },
  { name: 'Videographers', icon: 'fa-video', color: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-600 dark:text-indigo-300' } },
  { name: 'Groom Wear', icon: 'fa-user-tie', color: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600 dark:text-blue-300' } },
  { name: 'Mehendi Artists', icon: 'fa-paint-brush', color: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-600 dark:text-orange-300' } },
  { name: 'Cakes', icon: 'fa-birthday-cake', color: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-600 dark:text-pink-300' } },
  { name: 'Cards', icon: 'fa-envelope', color: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-600 dark:text-red-300' } },
  { name: 'Choreographers', icon: 'fa-music', color: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600 dark:text-purple-300' } },
  { name: 'Entertainment', icon: 'fa-star', color: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600 dark:text-yellow-300' } },
];

const ServicePageContent: React.FC = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const initialFilters: ServiceFilters = {
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'popular',
  };
  
  const { 
    services, 
    filters, 
    setFilters, 
    isLoading, 
    error, 
    hasMore, 
    loaderRef,
    retryFetch,
    resetFilters 
  } = useServices(initialFilters);
  
  const mainRef = useRef<HTMLElement>(null);

  const memoizedFilters = useMemo(() => filters, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...memoizedFilters, [name]: value });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleCategoryClick = (category: string) => {
    setFilters({
      ...memoizedFilters,
      category: memoizedFilters.category === category ? '' : category,
    });
  };

  const handleRetry = () => {
    retryFetch();
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Wedding Vendors | ShaadiSharthi</title>
        <meta name="description" content="Discover the perfect vendors for your dream wedding" />
      </Head>

      <main ref={mainRef} className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-gray-200">
            Wedding Vendors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the perfect vendors for your dream wedding
          </p>
        </div>

        {/* Filter Section - Sticky */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pt-4 pb-2">
          <FilterSection
            filters={memoizedFilters}
            setFilters={setFilters}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Vendor Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Browse by Category
          </h2>
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {displayedCategories.map((category) => (
                <CategoryCard
                  key={category.name}
                  category={category.name}
                  icon={category.icon}
                  colorClass={category.color}
                  isSelected={memoizedFilters.category === category.name}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 px-3 py-1 text-primary dark:text-pink-400 font-medium rounded-md shadow-sm"
              aria-expanded={showAllCategories}
              aria-label={showAllCategories ? 'Show fewer categories' : 'Show all categories'}
            >
              {showAllCategories ? 'See Less' : 'See More'}
              {showAllCategories ? <ChevronUpIcon className="ml-1" /> : <ChevronDownIcon className="ml-1" />}
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {memoizedFilters.category ? `${memoizedFilters.category} Vendors` : 'All Vendors'}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({services.length} results)
            </span>
          </h2>
        </div>

        {/* Vendors Grid */}
        {services.length > 0 || isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {services.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VendorCard vendor={vendor as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Loading State */}
        {isLoading && <VendorGridSkeleton count={8} />}

        {/* Loader */}
        <div
          ref={loaderRef}
          className="text-center py-8 min-h-[50px]"
          style={{ minHeight: '50px', visibility: 'visible', position: 'relative' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full w-6 h-6 border-b-2 border-pink-600"></div>
              <span className="text-pink-600 font-medium">Fetching more wedding vendors...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <span className="text-red-600 dark:text-red-400">{error}</span>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Retry
              </button>
            </div>
          ) : hasMore ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full w-6 h-6 border-b-2 border-pink-600"></div>
              <span className="text-pink-600 font-medium">Scroll to discover more vendors...</span>
            </div>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">No more vendors to show</span>
          )}
        </div>
      </main>
    </div>
  );
};

const ServicePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full w-12 h-12 border-b-2 border-pink-600"></div>
        </div>
      }>
        <ServicePageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ServicePage;