'use client'
import { useForm } from 'react-hook-form';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useServiceBooking } from '@/hooks/useServiceBooking';
import { BookingFormData } from '@/lib/serviceBooking';
import { toast } from 'react-toastify';
import { FaSpinner, FaCalendarCheck } from 'react-icons/fa'; // Added missing icons

const ServiceBookingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId') || '';
  const { service, loading, error, submitBooking } = useServiceBooking(serviceId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>();

  // Redirect if serviceId is missing
  useEffect(() => {
    if (!loading && !serviceId) {
      toast.error("No service was selected for booking.");
      router.replace('/services'); // Use replace to not add to history
    }
  }, [serviceId, loading, router]);

  // Set form default values when service data is loaded
  useEffect(() => {
    if (service) {
      setValue('service_id', service.serviceId);
      setValue('service_name', service.serviceName);
      setValue('service_price', service.price);
      setValue('email', service.email || '');
    }
  }, [service, setValue]);

  // Update document title
  useEffect(() => {
    if (service?.serviceName) {
      document.title = `Book ${service.serviceName} | ShaadiSharthi`;
    }
  }, [service?.serviceName]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const result = await submitBooking(data);
      if (result.success) {
        toast.success('Booking submitted successfully! You will receive a confirmation email shortly.');
        router.push('/bookings?fromBooking=true');
      } else {
        toast.error(result.error || 'Booking failed. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 font-['Poppins'] text-black dark:text-white flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-pink-400 mx-auto"></div>
        <p className="mt-4">Loading Service Details...</p>
      </div>
    </div>
    )
  } 
  if (error) return <div className="text-center py-8 text-red-500 dark:text-red-400">{error}</div>;
  if (!service) return <div className="text-center py-8 text-gray-800 dark:text-gray-200">Service not found</div>;

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">

        
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-3xl mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700">

          
          {/* Service Header */}
          <div className="bg-gradient-to-r text-center mb-4 from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-6 border-b border-gray-100 dark:border-gray-700">
                  <h1 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">  Book {service.serviceName} </h1>
                  <p className="opacity-90 text-gray-600 dark:text-gray-400">Complete your booking details below</p>
          </div>
          
          {/* Service Info */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <p className="font-medium text-gray-800 dark:text-white">{service.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                <p className="font-medium text-gray-800 dark:text-white">{service.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p className="font-medium text-gray-800 dark:text-white">₹{service.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <input type="hidden" {...register('service_id')} />
            <input type="hidden" {...register('service_name')} />

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="customer_name"
                  {...register('customer_name', { required: 'Full name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                {errors.customer_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Price Field (Editable) */}
            <div>
              <label htmlFor="service_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Price (₹)
              </label>
              <input
                id="service_price"
                type="number"
                {...register('service_price', { 
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price must be positive'
                  },
                  valueAsNumber: true
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              {errors.service_price && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.service_price.message}</p>
              )}
            </div>

            {/* Event Details */}
            <div>
              <label htmlFor="event_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wedding Venue Address
              </label>
              <input
                id="event_address"
                {...register('event_address', { required: 'Venue address is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              {errors.event_address && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.event_address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="event_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Wedding Date
                </label>
                <input
                  id="event_start_date"
                  type="date"
                  {...register('event_start_date', { required: 'Wedding date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                {errors.event_start_date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.event_start_date.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  id="event_time"
                  type="time"
                  {...register('event_time', { required: 'Event time is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                {errors.event_time && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.event_time.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="event_end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reception Date (Optional)
                </label>
                <input
                  id="event_end_date"
                  type="date"
                  {...register('event_end_date')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Special Requirements
              </label>
              <textarea
                id="notes"
                rows={3}
                {...register('notes')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-pink-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Any specific requirements or customization needed..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-orange-500 dark:from-pink-500 dark:to-orange-400 text-white py-3 px-6 rounded-lg font-medium hover:from-pink-700 hover:to-orange-600 dark:hover:from-pink-600 dark:hover:to-orange-500 transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaCalendarCheck className="mr-2" /> Confirm Booking
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

const ServiceBookingPage = () => {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-800 dark:text-gray-200">Loading Booking Page...</div>}>
      <ServiceBookingForm />
    </Suspense>
  );
};

export default ServiceBookingPage;