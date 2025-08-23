'use client'

import { useState, useEffect, useCallback } from 'react';
import { FaCalendarCheck, FaHeart, FaComments, FaArrowRight } from 'react-icons/fa';
import { FiBell, FiSearch } from 'react-icons/fi';
import ServiceCard from './components/ServiceCard';
import BookingCard from './components/BookingCard';
import api from '@/lib/axios'; 
import { isAxiosError } from 'axios';
import {  BookingCardSkeleton } from './components/BookingCardSkeleton'; // Import skeleton component

export default function Dashboard() {
  // Define the type for a single booking
  interface Booking {
    id: number;
    serviceName: string;
    date: string;
    time: string;
    providerName: string;
    status: string;
  }
  // Mock data for other sections - replace with real API calls later
  const stats = [
    { title: 'Upcoming', value: 3, icon: <FaCalendarCheck />, color: 'from-primary to-secondary' },
    { title: 'Saved', value: 12, icon: <FaHeart />, color: 'from-purple-500 to-indigo-600' },
    { title: 'Messages', value: 5, icon: <FaComments />, color: 'from-orange-500 to-pink-500' }
  ];

  const recommendedServices = [
    { id: 1, name: 'Premium Photography', category: 'Photography', rating: 4.9, price: 25000, image: '/img/photography.jpg' },
    { id: 2, name: 'Luxury Venue', category: 'Venues', rating: 4.7, price: 150000, image: '/img/venue.jpg' },
    { id: 3, name: 'Gourmet Catering', category: 'Food', rating: 4.8, price: 80000, image: '/img/catering.jpg' },
    { id: 4, name: 'Bridal Makeup', category: 'Beauty', rating: 4.6, price: 15000, image: '/img/makeup.jpg' }
  ];

  // State for upcoming bookings
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch upcoming bookings
  const fetchUpcomingBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/Customer/cstmr-upcoming-bookings');
      setUpcomingBookings(response.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch upcoming bookings:', err);
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingBookings();
  }, [fetchUpcomingBookings]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Plan Your Dream Wedding
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the best vendors, manage your bookings, and create unforgettable memories
          </p>
          <a
            href="/services"
            className="inline-flex items-center bg-primary hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Explore Services <FaArrowRight className="ml-2" />
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">
              You have {upcomingBookings.length} upcoming booking{upcomingBookings.length !== 1 ? 's' : ''}. Let's make your wedding planning journey smooth and memorable.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white`}
                >
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm opacity-80">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Services */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Recommended For You</h2>
            <a href="/services" className="text-primary hover:underline flex items-center">
              View All <FaArrowRight className="ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Upcoming Bookings */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Upcoming Bookings</h2>
            <a href="/bookings" className="text-primary hover:underline flex items-center">
              View All <FaArrowRight className="ml-1" />
            </a>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              // Loading state: Show 3 skeletons to match the display limit
              Array.from({ length: 3 }).map((_, index) => (
                <BookingCardSkeleton key={index} />
              ))
            ) : error ? (
              // Error state with a retry button
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-center">
                <p className="text-red-800 font-semibold mb-2">Failed to load bookings</p>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchUpcomingBookings}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : upcomingBookings.length > 0 ? (
              // Success state
              upcomingBookings.slice(0, 3).map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              // Empty state
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <FaCalendarCheck className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 font-serif">No upcoming bookings</h3>
                <p className="mt-1 text-sm text-gray-500">Book your first vendor to get started</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
