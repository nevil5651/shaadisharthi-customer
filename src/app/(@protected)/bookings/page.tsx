'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BookingProvider, useBookingContext } from './BookingContext';
import { BookingFilters } from './components/BookingFilters';
import { BookingsList } from './components/BookingsList';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useEffect, useState, useCallback, ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { normalizeBookingStatus, formatDateForAPI } from './bookingUtils';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false
        }
    }
});

export default function BookingsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <BookingProvider>
                <BookingsContent />
            </BookingProvider>
        </QueryClientProvider>
    );
}



function BookingsContent() {
    const searchParams = useSearchParams();
    const { filters, updateFilters, resetFilters } = useBookingContext();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['bookings', filters, currentPage],
        queryFn: () => {
            // Prepare API parameters
            const params = {
                status: filters.status === 'all' ? undefined : filters.status,
                search: filters.search,
                dateFrom: formatDateForAPI(filters.dateFrom),
                dateTo: formatDateForAPI(filters.dateTo),
                page: currentPage,
                limit: 10
            };
            
            // Log request parameters
            console.log('[API Request] Fetching bookings with params:', params);
            
            return api.get('/Customer/cstmr-bookings', { params })
                .then(res => {
                    // Log successful response
                    console.log('[API Response] Bookings data:', {
                        status: res.status,
                        data: res.data
                    });
                    
                    // Normalize statuses in API response
                    const normalizedData = {
                        ...res.data,
                        bookings: (res.data.bookings || []).map((booking: any) => ({
                            ...booking,
                            status: normalizeBookingStatus(booking.status)
                        }))
                    };
                    
                    return normalizedData;
                })
                .catch(err => {
                    // Log error response
                    console.error('[API Error] Failed to fetch bookings:', {
                        status: err.response?.status,
                        message: err.message,
                        config: err.config
                    });
                    throw err;
                });
        },
        enabled: !!filters,
    });

    const debouncedUpdateFilters = useCallback(debounce(updateFilters, 300), [updateFilters]);

    const handleFilterChange = (name: string, value: string) => {
    // Reset to first page only when actual filter values change
    const currentFilterValue = filters[name as keyof typeof filters];
    if (currentFilterValue !== value) {
        setCurrentPage(1);
    }
    
    // Prevent end date before start date
    const newFilters = {...filters, [name]: value};
    if (name === 'dateFrom' && newFilters.dateTo && value > newFilters.dateTo) {
        newFilters.dateTo = value;
    }
    if (name === 'dateTo' && newFilters.dateFrom && value < newFilters.dateFrom) {
        newFilters.dateFrom = value;
    }
    
    debouncedUpdateFilters(newFilters);
};



    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onCancel: ComponentProps<typeof BookingsList>['onCancel'] = async (id) => {
        const reason = window.prompt('Please provide a reason for cancellation:');
        if (reason === null) { // User clicked "Cancel" on the prompt
            return;
        }

        const toastId = toast.loading('Submitting cancellation...');

        try {
            await api.post(`/Customer/cstmr-action/${id}`, {
                action: 'cancel',
                reason,
            });

            toast.update(toastId, {
                render: 'Booking cancelled successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            refetch(); // Refresh the bookings list
        } catch (err: any) {
            console.error('Cancellation failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';
            toast.update(toastId, {
                render: `Cancellation failed: ${errorMessage}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    useEffect(() => {
        if (searchParams.get('fromBooking')) {
            refetch();
        }
    }, [searchParams, refetch]);

    return (
        <div className="container mx-auto px-4 py-8">
            <BookingFilters 
                filters={filters}
                onFilterChange={handleFilterChange} 
                onReset={resetFilters} 
            />
            
            <BookingsList 
                bookings={data?.bookings || []}
                loading={isLoading}
                error={error?.message || null}
                onCancel={onCancel}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                onPageChange={handlePageChange}
            />
        </div>
    );
}