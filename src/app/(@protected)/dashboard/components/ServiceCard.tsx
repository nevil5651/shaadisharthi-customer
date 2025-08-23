import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

export default function ServiceCard({ service }: {
  service: {
    id: number;
    name: string;
    category: string;
    rating: number;
    price: number;
    image: string;
  }
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-48">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800">{service.name}</h3>
          <span className="text-sm text-gray-500">{service.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-yellow-500">
            <FaStar className="mr-1" />
            <span className="text-gray-700">{service.rating}</span>
          </div>
          <span className="font-medium">₹{service.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}