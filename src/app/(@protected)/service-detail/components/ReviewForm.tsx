
'use client';

import { useState, useEffect, useCallback } from 'react';
import { RatingStars } from '@/app/(@protected)/services/components/RatingStars';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { useMutation, useQueryClient, InfiniteData, QueryClient } from '@tanstack/react-query';
// NOTE: Assuming Review and Service types are exported from a central types file.
// If not, you can define them here based on your data structure.
import { Review, Service } from '@/lib/service';

const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5, "Rating cannot exceed 5"),
    reviewText: z.string().min(10, "Review must be at least 10 characters").max(500, "Review cannot exceed 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    serviceId: string;
}

// --- API Submission Function ---
async function submitReview(params: { serviceId: string; review: ReviewFormData }) {
  const { serviceId, review } = params;
  // The API expects an object with `reviewText` and `rating` properties.
  const { data } = await api.post(`/Customer/reviews/${serviceId}`, {
    reviewText: review.reviewText,
    rating: review.rating,
  });
  return data;
}

// --- Context for optimistic updates ---
interface MutationContext {
  previousReviewsData?: InfiniteData<{ reviews: Review[]; hasMore: boolean }>;
  previousService?: Service;
}

export function ReviewForm({ serviceId }: ReviewFormProps) {
    const queryClient = useQueryClient();
    // TODO: Get user from your authentication context/hook for the optimistic update
    // const { user } = useAuth(); 

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { rating: 0, reviewText: '' },
    });

    const { mutate, isPending } = useMutation<
        any, // API response type
        Error, // Error type
        { serviceId: string; review: ReviewFormData }, // Variables type
        MutationContext // Context type
    >({
        mutationFn: submitReview,
        // --- Optimistic Update Logic ---
        onMutate: async (newReviewData) => {
            // 1. Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['reviews', serviceId] });
            await queryClient.cancelQueries({ queryKey: ['service', serviceId] });

            // 2. Snapshot previous values
            const previousReviewsData = queryClient.getQueryData<InfiniteData<{ reviews: Review[]; hasMore: boolean }>>(['reviews', serviceId]);
            const previousService = queryClient.getQueryData<Service>(['service', serviceId]);

            // 3. Create optimistic review
            const optimisticReview: Review = {
                reviewId: `temp-${Date.now()}`,
                // Using a placeholder name. Replace with actual user data if available.
                customerName: 'You', 
                rating: newReviewData.review.rating,
                text: newReviewData.review.reviewText, // Corrected from .comment
                createdAt: new Date().toISOString(),
            };

            // 4. Optimistically update reviews list
            queryClient.setQueryData<InfiniteData<{ reviews: Review[]; hasMore: boolean }>>(
                ['reviews', serviceId],
                (oldData) => {
                    if (!oldData) {
                        return { pages: [{ reviews: [optimisticReview], hasMore: false }], pageParams: [1] };
                    }
                    const newPages = [...oldData.pages];
                    newPages[0] = { ...newPages[0], reviews: [optimisticReview, ...newPages[0].reviews] };
                    return { ...oldData, pages: newPages };
                }
            );

            // 5. Optimistically update service's rating and review count
            queryClient.setQueryData<Service>(['service', serviceId], (oldService) => {
                if (!oldService) return undefined;
                const oldTotalRating = oldService.rating * oldService.reviewCount;
                const newReviewCount = oldService.reviewCount + 1;
                const newAverageRating = (oldTotalRating + newReviewData.review.rating) / newReviewCount;
                return { ...oldService, reviewCount: newReviewCount, rating: newAverageRating };
            });

            // 6. Return context for rollback
            return { previousReviewsData, previousService };
        },
        // --- Rollback on Error ---
        onError: (err, newReview, context) => {
            // If the mutation fails, roll back to the previous state
            if (context?.previousReviewsData) queryClient.setQueryData(['reviews', serviceId], context.previousReviewsData);
            if (context?.previousService) queryClient.setQueryData(['service', serviceId], context.previousService);
            
            const errorMessage = isAxiosError(err) && err.response ? err.response.data?.error || 'Failed to submit review.' : 'An unexpected error occurred.';
            toast.error(errorMessage);
        },
        // --- Refetch on success or error to ensure data is consistent with the server ---
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', serviceId] });
            queryClient.invalidateQueries({ queryKey: ['service', serviceId] });
        },
        onSuccess: () => {
            toast.success('Thank you for your review!');
            reset();
        },
    });

    const [isFormDisabled, setIsFormDisabled] = useState(!serviceId);

    useEffect(() => {
        if (!serviceId) {
            toast.error('Invalid service ID. Cannot submit review.');
            setIsFormDisabled(true);
        } else {
            setIsFormDisabled(false);
        }
    }, [serviceId]);

    const onSubmit = (data: ReviewFormData) => {
        mutate({ serviceId, review: data });
    };

    const reviewText = watch('reviewText');
    const currentRating = watch('rating');
    const maxCharacters = 500;
    const remainingCharacters = maxCharacters - (reviewText?.length || 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <RatingStars 
                                rating={field.value} 
                                interactive 
                                setRating={(rating) => field.onChange(rating)} 
                            />
                        )}
                    />
                    {errors.rating && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rating.message}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="reviewText"
                        {...register('reviewText')}
                        rows={4}
                        maxLength={maxCharacters}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Share your experience..."
                        disabled={isFormDisabled || isPending}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {remainingCharacters} characters remaining
                    </p>
                    {errors.reviewText && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reviewText.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending || isFormDisabled || isSubmitting}
                    className={`gradient-btn ${isPending || isFormDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isPending || isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}