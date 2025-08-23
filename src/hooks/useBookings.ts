'use client'

import { useState, useEffect } from 'react';
import { fetchBookings, cancelBooking, Booking } from '@/lib/bookings';
import { toast } from 'react-toastify';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | Booking['status'],
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings(filters);
      setBookings(data);
    } catch (err) {
      const message = 'Failed to fetch bookings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      await refetch();
      toast.success('Booking cancelled successfully!');
    } catch (err) {
      const message = 'Failed to cancel booking.';
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    refetch();
  }, [filters]);

  return {
    bookings,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    cancelBooking: handleCancelBooking
  };
};