import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';

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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-48">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        )}
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 dark:text-white">{service.name}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{service.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-yellow-500">
            <FaStar className="mr-1" />
            <span className="text-gray-700 dark:text-gray-300">{service.rating}</span>
          </div>
          <span className="font-medium text-gray-800 dark:text-white">₹{service.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}