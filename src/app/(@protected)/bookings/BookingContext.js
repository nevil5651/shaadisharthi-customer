import { createContext, useContext, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: ''
    });
    const queryClient = useQueryClient();

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        queryClient.invalidateQueries(['bookings']);
    }, [queryClient]);

    const resetFilters = useCallback(() => {
        setFilters({
            status: 'all',
            search: '',
            dateFrom: '',
            dateTo: ''
        });
        queryClient.invalidateQueries(['bookings']);
    }, [queryClient]);

    return (
        <BookingContext.Provider value={{ filters, updateFilters, resetFilters }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => useContext(BookingContext);