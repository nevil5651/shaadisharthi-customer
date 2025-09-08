'use client';

import { useEffect, useRef, Fragment } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ServiceHeroSkeleton } from '../components/ServiceHeroSkeleton';
import { ReviewSkeleton } from '../components/ReviewSkeleton';
import ServiceHero from '../components/ServiceHero';
import { PricingCard } from '../components/PricingCard';
import { ReviewsList } from '../components/ReviewsList';
import { ReviewForm } from '../components/ReviewForm';
import { MediaGallery } from '../components/MediaGallery';
import { fetchService, fetchReviews, Service, Review } from '@/lib/service';
import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;
  const loaderRef = useRef<HTMLDivElement>(null);
  
  const { data: service, isLoading: serviceLoading, error: serviceError } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchService(serviceId),
    enabled: !!serviceId,
  });

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isLoading: reviewsLoading,
    isFetchingNextPage,
    error: reviewsError,
  } = useInfiniteQuery({
    queryKey: ['reviews', serviceId],
    queryFn: ({ pageParam = 1 }) => fetchReviews(serviceId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!serviceId,
  });

  const reviews = reviewsData?.pages.flatMap(page => page.reviews) ?? [];

  // Infinite scroll setup with cleanup - SIMPLIFIED
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (serviceError) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-600 dark:text-red-400">
        {serviceError.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="container bg-gray-50 dark:bg-gray-900 font-['Poppins'] mx-auto px-4 py-8">
        {serviceLoading ? (
          <ServiceHeroSkeleton />
        ) : (
          service && <ServiceHero service={service} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                About This Service
              </h2>
              {serviceLoading ? (
                <>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{service?.description}</p>
              )}
            </section>
            
            {service && service.media && service.media.length > 0 && (
              <MediaGallery media={service.media} />
            )}
            
            {reviewsError ? (
              <div className="text-red-600 dark:text-red-400 text-center py-4">{reviewsError.message}</div>
            ) : (
              <ReviewsList reviews={reviews} />
            )}
            
            {hasNextPage && (
              <div ref={loaderRef} className="text-center py-4">
                {isFetchingNextPage ? (
                  <Fragment>
                    <ReviewSkeleton />
                    <ReviewSkeleton />
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mt-4"></div>
                  </Fragment>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Scroll to load more reviews...</span>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {serviceLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ) : (
              service && <PricingCard service={service} />
            )}
            
            {service && (
              <ReviewForm
                serviceId={service.serviceId.toString()}
              />
            )}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
