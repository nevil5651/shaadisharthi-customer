'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

// Request cache to prevent duplicate requests
const requestCache = new Map();

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;

  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  
  // Separate refs for mobile and desktop layouts
  const mobileLoaderRef = useRef<HTMLDivElement>(null);
  const desktopLoaderRef = useRef<HTMLDivElement>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const lastPageRef = useRef(0);

  // Memoized data fetching functions
  const loadService = useCallback(async () => {
    if (!serviceId || serviceId === 'undefined') {
      setServiceError('Invalid service ID');
      return;
    }

    // Check cache first
    const cacheKey = `service-${serviceId}`;
    if (requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      if (cachedData.timestamp > Date.now() - 30000) {
        setService(cachedData.data);
        return;
      }
    }

    setServiceLoading(true);
    try {
      const serviceData = await fetchService(serviceId);
      if (!serviceData.serviceId) {
        throw new Error('Service ID missing in response');
      }
      
      requestCache.set(cacheKey, {
        data: serviceData,
        timestamp: Date.now()
      });
      
      setService(serviceData);
      setServiceError(null);
    } catch (err: unknown) {
      console.error('Error loading service:', err);
      setServiceError(err instanceof Error ? err.message : 'Failed to load service');
    } finally {
      setServiceLoading(false);
    }
  }, [serviceId]);

  const loadReviews = useCallback(async (reset: boolean = false) => {
    if (!serviceId || serviceId === 'undefined' || isFetchingRef.current) {
      return;
    }

    const targetPage = reset ? 1 : pageRef.current;
    
    // Don't fetch the same page again
    if (!reset && targetPage === lastPageRef.current) {
      return;
    }
    
    const cacheKey = `reviews-${serviceId}-${targetPage}`;

    // Check cache first
    if (requestCache.has(cacheKey) && !reset) {
      const cachedData = requestCache.get(cacheKey);
      if (cachedData.timestamp > Date.now() - 30000) {
        setReviews(prev => reset ? cachedData.data.reviews : [...prev, ...cachedData.data.reviews]);
        setHasMore(cachedData.data.hasMore);
        pageRef.current = targetPage + 1;
        lastPageRef.current = targetPage;
        return;
      }
    }

    isFetchingRef.current = true;
    setReviewsLoading(true);
    try {
      console.log(`Fetching reviews page ${targetPage} for service ${serviceId}`);
      const reviewsData = await fetchReviews(serviceId, targetPage);
      
      requestCache.set(cacheKey, {
        data: reviewsData,
        timestamp: Date.now()
      });
      
      setReviews(prev => reset ? reviewsData.reviews : [...prev, ...reviewsData.reviews]);
      setHasMore(reviewsData.hasMore);
      pageRef.current = targetPage + 1;
      lastPageRef.current = targetPage;
      setReviewsError(null);
    } catch (err: unknown) {
      console.error('Error loading reviews:', err);
      setReviewsError(err instanceof Error ? err.message : 'Failed to load reviews');
      
      if (err instanceof Error && err.message.includes('429')) {
        setHasMore(false);
      }
    } finally {
      setReviewsLoading(false);
      isFetchingRef.current = false;
    }
  }, [serviceId]);

  // Initial data loading
  useEffect(() => {
    setReviews([]);
    pageRef.current = 1;
    lastPageRef.current = 0;
    setHasMore(true);
    loadService();
    loadReviews(true);
  }, [serviceId, loadService, loadReviews]);

  // Improved infinite scroll setup that handles both layouts
  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Get the currently visible loader based on layout
    const getCurrentLoader = () => {
      // Check which loader is currently in the DOM and visible
      if (mobileLoaderRef.current && window.innerWidth < 1024) {
        return mobileLoaderRef.current;
      }
      if (desktopLoaderRef.current && window.innerWidth >= 1024) {
        return desktopLoaderRef.current;
      }
      return null;
    };

    const currentLoader = getCurrentLoader();

    // Only set up observer if we have more reviews to load and loader exists
    if (hasMore && !reviewsLoading && currentLoader) {
      console.log('Setting up IntersectionObserver for current layout');
      
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !reviewsLoading && !isFetchingRef.current) {
            console.log('Loading more reviews, current page:', pageRef.current);
            loadReviews();
          }
        },
        { 
          threshold: 0.1,
          rootMargin: '50px 0px 50px 0px'
        }
      );

      observer.observe(currentLoader);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, reviewsLoading, loadReviews, serviceId]);

  // Reconnect observer when layout changes (window resize)
  useEffect(() => {
    const handleResize = () => {
      // Re-setup the observer when window is resized (layout change)
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
        
        // Small timeout to allow DOM to update after resize
        setTimeout(() => {
          const getCurrentLoader = () => {
            if (mobileLoaderRef.current && window.innerWidth < 1024) {
              return mobileLoaderRef.current;
            }
            if (desktopLoaderRef.current && window.innerWidth >= 1024) {
              return desktopLoaderRef.current;
            }
            return null;
          };

          const currentLoader = getCurrentLoader();
          
          if (hasMore && !reviewsLoading && currentLoader && observerRef.current === null) {
            const observer = new IntersectionObserver(
              (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !reviewsLoading && !isFetchingRef.current) {
                  console.log('Loading more reviews after resize, page:', pageRef.current);
                  loadReviews();
                }
              },
              { 
                threshold: 0.1,
                rootMargin: '50px 0px 50px 0px'
              }
            );

            observer.observe(currentLoader);
            observerRef.current = observer;
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMore, reviewsLoading, loadReviews]);

  const isTemp = (r: Review) => typeof r.reviewId === 'string' && r.reviewId.startsWith('temp-');

  const handleReviewSubmitted = useCallback((newReview: Review | null) => {
    if (newReview) {
      setReviews((prev) => [newReview, ...prev.filter(r => !isTemp(r))]);
    } else {
      setReviews((prev) => prev.filter(r => !isTemp(r)));
    }
  }, []);

  const handleServerReviews = useCallback((serverList: Review[]) => {
    setReviews(serverList);
    pageRef.current = 2;
    setHasMore(true);
    lastPageRef.current = 1;
    
    setService((prev) => prev ? {
      ...prev,
      reviewCount: prev.reviewCount + 1,
      rating: calcNewAverage(prev.rating, prev.reviewCount, serverList[0]?.rating ?? 0)
    } : prev);
    
    const cacheKeys = Array.from(requestCache.keys()).filter(key => key.startsWith(`reviews-${serviceId}-`));
    cacheKeys.forEach(key => requestCache.delete(key));
  }, [serviceId]);

  if (serviceError) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-600 dark:text-red-400">
        {serviceError}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="container bg-gray-50 dark:bg-gray-900 font-['Poppins'] mx-auto px-4 py-8">
        {!service || serviceLoading ? (
          <ServiceHeroSkeleton />
        ) : (
          <ServiceHero service={service} />
        )}
        
        {/* Mobile Layout - Single Column */}
        <div className="block lg:hidden space-y-8 mb-12">
          {/* Description */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              About This Service
            </h2>
            {!service || serviceLoading ? (
              <>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
            )}
          </section>
          
          {/* Pricing Card */}
          {!service || serviceLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : (
            <PricingCard service={service} />
          )}
          
          {/* Media Gallery */}
          {service && service.media && service.media.length > 0 && (
            <MediaGallery media={service.media} />
          )}
          
          {/* Review Form */}
          {service && (
            <ReviewForm
              serviceId={service.serviceId}
              onSubmitSuccess={handleReviewSubmitted}
              onServerUpdate={handleServerReviews}
            />
          )}
          
          {/* Review List */}
          {reviewsError ? (
            <div className="text-red-600 dark:text-red-400 text-center py-4">{reviewsError}</div>
          ) : (
            <ReviewsList reviews={reviews} />
          )}
          
          {hasMore && (
            <div ref={mobileLoaderRef} className="text-center py-4">
              {reviewsLoading ? (
                <>
                  <ReviewSkeleton />
                  <ReviewSkeleton />
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mt-4"></div>
                </>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Scroll to load more reviews...</span>
              )}
            </div>
          )}
        </div>

        {/* Desktop Layout - Grid Columns */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                About This Service
              </h2>
              {!service || serviceLoading ? (
                <>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
              )}
            </section>
            
            {service && service.media && service.media.length > 0 && (
              <MediaGallery media={service.media} />
            )}
            
            {reviewsError ? (
              <div className="text-red-600 dark:text-red-400 text-center py-4">{reviewsError}</div>
            ) : (
              <ReviewsList reviews={reviews} />
            )}
            
            {hasMore && (
              <div ref={desktopLoaderRef} className="text-center py-4">
                {reviewsLoading ? (
                  <>
                    <ReviewSkeleton />
                    <ReviewSkeleton />
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mt-4"></div>
                  </>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Scroll to load more reviews...</span>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {!service || serviceLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ) : (
              <PricingCard service={service} />
            )}
            
            {service && (
              <ReviewForm
                serviceId={service.serviceId}
                onSubmitSuccess={handleReviewSubmitted}
                onServerUpdate={handleServerReviews}
              />
            )}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

function calcNewAverage(oldAvg: number, oldCount: number, newRating: number) {
  if (oldCount === 0) return newRating;
  return ((oldAvg * oldCount) + newRating) / (oldCount + 1);
}