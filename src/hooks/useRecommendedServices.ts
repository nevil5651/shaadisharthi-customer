import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Service } from '@/lib/types';

// This interface represents the shape of the service object coming directly from the backend API.
interface BackendService {
  providerId?: string;
  serviceId: number;
  serviceName: string;
  description?: string;
  price: number;
  rating: number;
  reviewCount?: number;
  location?: string;
  imageUrl?: string;
  category: string;
  businessName?: string;
  email?: string | null;
  phone?: string | null;
}

export const useRecommendedServices = (limit: number = 4) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRecommended = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams({
      page: '1',
      limit: String(limit),
      sortBy: 'popular', // Use 'popular' for "good" services; change to 'rating' if preferred
    }).toString();

    try {
      const response = await api.get(`/Customer/services?${query}`, { signal, timeout: 10000 });
      if (signal.aborted) return;

      const backendServices = response.data.services || [];

      // Map to the canonical Service type
      const formattedServices: Service[] = backendServices.map((service: BackendService) => ({
        providerId: service.providerId || String(service.serviceId), // Fallback
        serviceId: service.serviceId,
        name: service.serviceName,
        description: service.description || '', // Default
        price: service.price,
        rating: service.rating,
        reviewCount: service.reviewCount || 0, // Default
        location: service.location || '', // Default
        imageUrl: service.imageUrl || '/img/default-service.jpg',
        category: service.category,
        businessName: service.businessName || service.serviceName, // Default
        email: service.email || null,
        phone: service.phone || null,
      }));

      setServices(formattedServices);
    } catch (err: unknown) {
      if (signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
        return;
      }
      const message = isAxiosError(err) && err.response?.status === 429 
        ? 'Too many requests. Please try again later.' 
        : 'Failed to load recommended services.';
      setError(message);
      toast.error(message);
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecommended();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchRecommended]);

  const retryFetch = useCallback(() => {
    setError(null);
    fetchRecommended();
  }, [fetchRecommended]);

  return { services, isLoading, error, retryFetch };
};