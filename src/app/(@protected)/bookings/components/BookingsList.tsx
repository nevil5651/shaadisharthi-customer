'use client'
import { FaSearch } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BookingCard } from './BookingCard';
import { Booking } from '@/lib/bookings';
import { useState } from 'react';
import { normalizeBookingStatus } from '../bookingUtils';

type BookingsListProps = {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onCancel: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const BookingsList = ({
  bookings,
  loading,
  error,
  onCancel,
  currentPage,
  totalPages,
  onPageChange,
}: BookingsListProps) => {

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !error && normalizeBookingStatus.length === 0) {
    return (
      <div className="text-center py-12">
        <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {bookings.map(booking => (
            <BookingCard 
              key={booking.id}
              booking={booking} 
              onCancel={onCancel} 
            />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-pink-50 transition"
            >
              <FiChevronLeft />
            </button>
            
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
  onClick={() => onPageChange(currentPage - 1)}
  disabled={currentPage === 1 || loading}
  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-pink-50 transition"
>
  <FiChevronLeft />
</button>

<button 
  onClick={() => onPageChange(currentPage + 1)}
  disabled={currentPage === totalPages || loading}
  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-pink-50 transition"
>
  <FiChevronRight />
</button>
          </div>
        </div>
      )}
    </div>
  );
};