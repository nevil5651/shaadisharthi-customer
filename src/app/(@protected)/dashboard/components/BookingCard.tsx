import { FaCalendarAlt, FaUserTie, FaClock } from 'react-icons/fa';

export default function BookingCard({ booking }: {
  booking: {
    id: number;
    serviceName: string; // Updated to match API response
    date: string;
    time: string;
    providerName: string; // Updated to match API response
    status: string;
  }
}) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  // Convert backend status to lowercase for consistency
  const normalizedStatus = booking.status.toLowerCase();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">{booking.serviceName}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[normalizedStatus as keyof typeof statusColors]}`}>
          {normalizedStatus.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <FaUserTie className="text-primary mr-3" />
          <span>{booking.providerName}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaCalendarAlt className="text-primary mr-3" />
          <span>{new Date(booking.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaClock className="text-primary mr-3" />
          <span>{booking.time}</span>
        </div>
      </div>
    </div>
  );
}