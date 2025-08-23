import { RatingStars } from '@/app/(@protected)/services/components/RatingStars';
import { Review } from '@/lib/service';
import { Service } from '@/lib/types';
import Image from 'next/image';

interface ServiceHeroProps {
  service: Service;
  reviews: Review[];
}

export default function ServiceHero({ service, reviews }: ServiceHeroProps) {
  return (
    <div className="service-hero rounded-xl p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center">
        {service.imageUrl && service.imageUrl.trim() !== '' ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            width={160}
            height={160}
            className="rounded-full border-4 border-white shadow-lg mr-0 md:mr-8 mb-4 md:mb-0"
          />
        ) : (
          <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg mr-0 md:mr-8 mb-4 md:mb-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
            {service.name}
          </h1>
          <p className="text-gray-600 mt-2">by {service.businessName}</p>
          <div className="mt-4 flex justify-center md:justify-start items-center">
            <RatingStars rating={Math.round(service.rating)} />
            <span className="ml-2 text-gray-600">
              ({service.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}