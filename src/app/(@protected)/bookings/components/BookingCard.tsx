'use client'
import { Booking } from '@/lib/bookings';
import { FaUserTie, FaCalendarAlt, FaClock, FaRupeeSign, FaTimes, FaCheck } from 'react-icons/fa';
import { normalizeBookingStatus, isCancellable, showPaymentButton } from '../bookingUtils';

type BookingCardProps = {
  booking: Booking;
  onCancel: (id: string) => void;
  onPay: (id: string) => void;
};

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

export const BookingCard = ({ 
  booking,
  onCancel,
  onPay
}: BookingCardProps) => {
    // Normalize status for consistent UI
    const normalizedStatus = normalizeBookingStatus(booking.status);
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 relative">
                    <img
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizedStatus as keyof typeof statusColors]}`}>
                        {normalizedStatus.toUpperCase()}
                    </span>
                </div>
                
                <div className="p-6 md:w-2/3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{booking.serviceName}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FaUserTie className="text-pink-500 mr-2" />
                            <span className="font-medium mr-1">Provider:</span>
                            {booking.providerName}
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FaCalendarAlt className="text-pink-500 mr-2" />
                            <span className="font-medium mr-1">Date:</span>
                            {new Date(booking.date).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FaClock className="text-pink-500 mr-2" />
                            <span className="font-medium mr-1">Time:</span>
                            {booking.time}
                        </div>
                        
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FaRupeeSign className="text-pink-500 mr-2" />
                            <span className="font-medium mr-1">Amount:</span>
                            ₹{booking.amount.toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-end gap-2">
                        {isCancellable(normalizedStatus) && (
                            <button
                                onClick={() => onCancel(booking.id)}
                                className="flex items-center px-4 py-2 border border-red-500 text-red-500 dark:text-red-400 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                            >
                                <FaTimes className="mr-2" /> Cancel
                            </button>
                        )}
                        
                        {showPaymentButton(booking.paymentStatus, normalizedStatus) && (
                            <button 
                                onClick={() => onPay(booking.id)}
                                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                                <FaCheck className="mr-2" /> Pay Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};