import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

// Define Service type matching the dashboard's simplified version
interface Service {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
  image: string;
}

export const useRecommendedServices = (limit: number = 4) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRecommended = async () => {
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

      // Map to simplified Service type for dashboard
      const formattedServices: Service[] = backendServices.map((service: any) => ({
        id: service.serviceId,
        name: service.serviceName,
        category: service.category,
        rating: service.rating,
        price: service.price,
        image: service.imageUrl || '/img/default-service.jpg',
      }));

      setServices(formattedServices);
    } catch (err: any) {
      if (err.name === 'AbortError' || signal.aborted) return;
      const message = isAxiosError(err) && err.response?.status === 429 
        ? 'Too many requests. Please try again later.' 
        : 'Failed to load recommended services.';
      setError(message);
      toast.error(message);
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []); // Fetch once on mount

  const retryFetch = () => {
    setError(null);
    fetchRecommended();
  };

  return { services, isLoading, error, retryFetch };
};