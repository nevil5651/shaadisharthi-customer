// components/ReviewsList.tsx
import { Review } from '@/lib/service';
import { RatingStars } from '@/app/(@protected)/services/components/RatingStars';
import Image from 'next/image';
import { memo } from 'react';

interface ReviewsListProps {
  reviews: Review[];
  serviceId: number;
}

// Memoize review item to prevent unnecessary re-renders
const ReviewItem = memo(({ review }: { review: Review }) => {
  return (
    <div
      className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0"
    >
      <div className="flex items-start">
        <Image
          src={`https://ui-avatars.com/api/?name=${review.customerName || 'Unknown'}&background=random`}
          alt={review.customerName || 'Unknown'}
          width={40}
          height={40}
          className="rounded-full mr-4"
          loading="lazy"
        />
        <div>
          <div className="flex items-center mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white mr-2">{review.customerName || 'Anonymous'}</h4>
            <RatingStars rating={review.rating} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{review.text}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
});

ReviewItem.displayName = 'ReviewItem';

export function ReviewsList({ reviews, serviceId }: ReviewsListProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
        {reviews.length > 0 && (
          <span className="text-primary font-medium">
            {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem
              key={review.reviewId || `review-${review.createdAt}-${Math.random().toString(36).substr(2, 9)}`}
              review={review}
            />
          ))}
        </div>
      )}
    </section>
  );
}