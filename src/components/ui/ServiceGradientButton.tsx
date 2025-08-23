import GradientButton from '@/components/ui/GradientButton';
import { Service } from '@/lib/service';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
 
interface PricingCardProps {
  service: Pick<Service, 'id' | 'price' | 'phone' | 'email' | 'serviceName'>;
}

export default function PricingCard({ service }: PricingCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
        Pricing
      </h3>
      <div className="flex items-end mb-4">
        <span className="text-3xl font-bold text-primary">
          ₹{service.price.toFixed(2)}
        </span>
        <span className="text-gray-500 ml-2">+ taxes</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <PhoneIcon className="text-primary mr-3 w-5 h-5" />
          <span className="text-gray-700">{service.phone}</span>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="text-primary mr-3 w-5 h-5" />
          <span className="text-gray-700">{service.email}</span>
        </div>
      </div>

      <GradientButton>
        Book Now
      </GradientButton>
    </div>
  );
}