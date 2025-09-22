import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useState } from 'react';
import { Service } from '@/lib/types';

export default function ServiceCard({ service }: { service: Service }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format price with proper Indian numbering system
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      const crores = (price / 10000000).toFixed(1);
      return `${crores.endsWith('.0') ? crores.slice(0, -2) : crores} Cr`;
    }
    if (price >= 100000) {
      const lakhs = (price / 100000).toFixed(1);
      return `${lakhs.endsWith('.0') ? lakhs.slice(0, -2) : lakhs} L`;
    }
    if (price >= 1000) {
      const thousands = (price / 1000).toFixed(1);
      return `${thousands.endsWith('.0') ? thousands.slice(0, -2) : thousands} K`;
    }
    return price.toString();
  };

  // Generate star ratings (full and empty stars)
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-sm opacity-80" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500 text-sm opacity-50" />);
      }
    }
    
    return stars;
  };

  // Handle image URL formatting
  const getImageUrl = (imgUrl: string) => {
    if (imageError) return '/img/default-service.jpg';
    
    if (imgUrl.startsWith('http') || imgUrl.startsWith('/')) {
      return imgUrl;
    }
    return `/${imgUrl}`;
  };

  const imageUrl = getImageUrl(service.imageUrl);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700">
      <div className="relative h-48 w-full">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
        )}
        <Image
          src={imageUrl}
          alt={service.serviceName}
          fill
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow">
          <span className="text-xs font-semibold text-gray-800 dark:text-white">{service.category}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 line-clamp-2">
          {service.serviceName}
        </h3>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex text-yellow-500 mr-1">
                {renderStars(service.rating)}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 ml-1">
                {service.rating.toFixed(1)}
              </span>
            </div>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
              ₹{formatPrice(service.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}