import api from './axios';

export interface Booking {
  id: string;
  serviceName: string;
  serviceImage: string;
  providerName: string;
  date: string;
  time: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'unpaid';
}

// Mock API calls
// export const fetchBookings = async (filters?: {
//   status?: string;
//   search?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }): Promise<Booking[]> => {
//   const response = await api.get<Booking[]>('/bookings', { params: filters });
//   return response.data;
// };

// export const cancelBooking = async (bookingId: string): Promise<void> => {
//   // Using PATCH or POST is common for state changes like cancellation.
//   // The endpoint should handle setting the status to 'cancelled'.
//   // A successful call will resolve, an error will throw, which should be
//   // handled in the UI component.
//   await api.patch(`/bookings/${bookingId}/cancel`);
// };