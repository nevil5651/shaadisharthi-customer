'use client';
import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ErrorBoundary from './components/ErrorBoundary';
import VendorGridSkeleton from './components/VendorGridSkeleton';
import EmptyState from './components/EmptyState';
import { useServices, useServiceCategories } from '@/hooks/useServicesQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ServiceFilters } from '@/hooks/useServicesQuery';
import { ChevronDownIcon, ChevronUpIcon } from './components/Icons';
import { useQueryClient } from '@tanstack/react-query';

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

const ServicePageContent: React.FC = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  //const debouncedFilters = useDebounce(filters, 300);
  const initialFilters: ServiceFilters = {
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'popular',
  };

  const [filters, setFilters] = useState(initialFilters);
  const queryClient = useQueryClient();
  const previousFiltersRef = useRef(filters);
  const isLinux = typeof window !== 'undefined' && 
  window.navigator.userAgent.toLowerCase().includes('linux');
  
  const debouncedFilters = useDebounce(filters, isLinux ? 500 : 300);
  const { data: categories = [] } = useServiceCategories();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useServices(debouncedFilters);

  const mainRef = useRef<HTMLElement>(null);

  // Flatten all pages of services
  const services = useMemo(() => {
    return data?.pages.flatMap(page => page.services) || [];
  }, [data]);

  // Reset filters function
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleCategoryClick = (category: string) => { // Fix: Ensure prev has all properties of ServiceFilters
    setFilters((prev: ServiceFilters) => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  // Infinite scroll observer
  const [observedLoaderRef, isLoaderIntersecting] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isLoaderIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoaderIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);


   useEffect(() => {

    const prev = previousFiltersRef.current;

    const isMajorChange = 
      prev.category !== filters.category || 
      prev.location !== filters.location || 
      prev.sortBy !== filters.sortBy;


  if (isMajorChange) {
      // COMPLETELY clear the services cache
      queryClient.removeQueries({ 
        queryKey: ['services'] 
      });
      
      // Force immediate refetch by resetting page state
      queryClient.setQueryData(
        ['services', 
          filters.category, 
          filters.location, 
          filters.sortBy,
          filters.minPrice,
          filters.maxPrice, 
          filters.rating
        ],
        undefined
      );
    }
    
    previousFiltersRef.current = filters;
  }, [filters, queryClient]);

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
            filters={filters}
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
                  isSelected={filters.category === category.name}
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
            {filters.category ? `${filters.category} Vendors` : 'All Vendors'}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({services.length} results)
            </span>
          </h2>
        </div>

        {/* Vendors Grid */}
        {isLoading && services.length === 0 ? (
          // Initial load or major filter change
          <VendorGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load vendors</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        ) : services.length > 0 ? (
          <>
            {/* Show loading indicator during background updates */}
            {isLoading && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 dark:text-blue-400 text-sm">Updating results...</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {services.map((vendor, index) => (
                  <motion.div
                    key={`${vendor.serviceId}-${filters.category}-${filters.location}-${filters.sortBy}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VendorCard service={vendor} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>


            {/* Load more indicator */}
            <div
              ref={observedLoaderRef}
              className="text-center py-8 min-h-[50px]"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full w-6 h-6 border-b-2 border-pink-600"></div>
                  <span className="text-pink-600 font-medium">Loading more vendors...</span>
                </div>
              ) : hasNextPage ? (
                <span className="text-gray-600 dark:text-gray-400">Scroll to load more</span>
              ) : services.length > 0 ? (
                <span className="text-gray-600 dark:text-gray-400">All vendors loaded</span>
              ) : null}
            </div>
          </>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
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