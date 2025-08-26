import { Service } from '@/lib/service';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
  service: Service;
}

export function PricingCard({ service }: PricingCardProps) {
  const router = useRouter();
  const displayPrice = service.price || 0;
  const formattedPrice = `₹${displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} + taxes`;
  const phoneNumber = service.phone ? `📞 +91 ${service.phone}` : '📞 Not available';
  const email = service.email || '✉️ Not available';

  const handleBookNow = () => {
    const serviceString = JSON.stringify(service);
    const encodedService = btoa(unescape(encodeURIComponent(serviceString)));
    router.push(`/service-booking?serviceData=${encodeURIComponent(encodedService)}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Pricing</h3>
      <p className="text-2xl font-bold text-primary mb-4">{formattedPrice}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{phoneNumber}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{email}</p>
      <button onClick={handleBookNow} className="gradient-btn">
        Book Now
      </button>
    </div>
  );
}