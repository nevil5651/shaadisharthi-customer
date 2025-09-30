import { FaCalendarAlt, FaUserTie, FaClock } from 'react-icons/fa';

export default function BookingCard({ booking }: {
  booking: {
    id: number;
    serviceName: string;
    date: string;
    time: string;
    providerName: string;
    status: string;
  }
}) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-black-200', 
    confirmed: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-500', 
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-500' 
  };

  // Convert backend status to lowercase for consistency
  let normalizedStatus = booking.status.toLowerCase();
  if (normalizedStatus === 'accepted') {
    normalizedStatus = 'confirmed';
  }
  

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{booking.serviceName}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[normalizedStatus as keyof typeof statusColors]}`}>
          {normalizedStatus.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <FaUserTie className="text-primary mr-3" />
          <span>{booking.providerName}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <FaCalendarAlt className="text-primary mr-3" />
          <span>{new Date(booking.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <FaClock className="text-primary mr-3" />
          <span>{booking.time}</span>
        </div>
      </div>
    </div>
  );
}