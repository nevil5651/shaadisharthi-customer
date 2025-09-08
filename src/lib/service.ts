import axios from 'axios';
import api from './axios';

export interface Service {
    serviceId: number;
    providerId: string; // <-- add this
    imageUrl: string; 
    name: string;
    businessName: string;
    description: string;
    price: number;
    email: string | null;
    phone: string | null;
    location: string;
    category: string;
    media: Media[];
    rating: number;
    reviewCount: number;
}

export interface Media {
    type: string;
    url: string;
}

export interface Review {
    reviewId: string; // Changed to string to handle temp IDs
    customerName: string;
    rating: number;
    text: string;
    createdAt: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    totalCount: number;
    hasMore: boolean;
}



const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 2,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // If it's a rate limit error, wait longer
      const waitTime = axios.isAxiosError(error) && error.response?.status === 429 
        ? delay * (i + 1) * 2 
        : delay * (i + 1);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
};

export async function fetchService(id: string): Promise<Service> {
  return retryRequest(async () => {
    const response = await api.get<Service>(`Customer/service-detail/${id}`);
    return response.data;
  });
}

export async function fetchReviews(serviceId: string, page: number = 1, limit: number = 10): Promise<ReviewsResponse> {
  return retryRequest(async () => {
    const response = await api.get<ReviewsResponse>(`Customer/service-detail/${serviceId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  });
}


export async function submitReview(serviceId: string, data: { rating: number; reviewText: string }): Promise<void> {
    if (!serviceId || serviceId === 'undefined') {
        throw new Error('Invalid service ID');
    }
    try {
        await api.post(`/Customer/reviews/${serviceId}`, data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || 'Failed to submit review';
            throw new Error(message);
        }
        throw new Error('An unexpected error occurred');
    }
}

