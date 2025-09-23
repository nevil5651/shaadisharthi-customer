import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RatingStars } from './RatingStars';
import { BackendService as Service } from '../../../../hooks/useServices';
import {
  CameraIcon,
  BuildingIcon,
  VolumeUpIcon,
  UtensilsIcon,
  PaintBrushIcon,
  TShirtIcon,
  GemIcon,
  GiftIcon,
  ClipboardListIcon,
  MagicIcon,
  VideoIcon,
  UserTieIcon,
  BirthdayCakeIcon,
  EnvelopeIcon,
  MusicIcon,
  StarIcon,
  MapMarkerIcon,
  ArrowRightIcon,
} from './Icons';



interface VendorCardProps {
  service: Service;
}

const VendorCard: React.FC<VendorCardProps> = ({ service }) => {
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      Photography: { color: 'bg-indigo-600 dark:bg-indigo-800', icon: <CameraIcon className="text-xs" /> },
      Venues: { color: 'bg-purple-600 dark:bg-purple-800', icon: <BuildingIcon className="text-xs" /> },
      Sound: { color: 'bg-purple-600 dark:bg-purple-800', icon: <VolumeUpIcon className="text-xs" /> },
      Catering: { color: 'bg-green-600 dark:bg-green-800', icon: <UtensilsIcon className="text-xs" /> },
      Decoration: { color: 'bg-pink-600 dark:bg-pink-800', icon: <PaintBrushIcon className="text-xs" /> },
      'Bridal Wear': { color: 'bg-red-600 dark:bg-red-800', icon: <TShirtIcon className="text-xs" /> },
      Jewellery: { color: 'bg-yellow-600 dark:bg-yellow-800', icon: <GemIcon className="text-xs" /> },
      Favors: { color: 'bg-blue-600 dark:bg-blue-800', icon: <GiftIcon className="text-xs" /> },
      Planners: { color: 'bg-teal-600 dark:bg-teal-800', icon: <ClipboardListIcon className="text-xs" /> },
      'Bridal Makeup': { color: 'bg-pink-600 dark:bg-pink-800', icon: <MagicIcon className="text-xs" /> },
      Videographers: { color: 'bg-indigo-600 dark:bg-indigo-800', icon: <VideoIcon className="text-xs" /> },
      'Groom Wear': { color: 'bg-blue-600 dark:bg-blue-800', icon: <UserTieIcon className="text-xs" /> },
      'Mehendi Artists': { color: 'bg-orange-600 dark:bg-orange-800', icon: <PaintBrushIcon className="text-xs" /> },
      Cakes: { color: 'bg-pink-600 dark:bg-pink-800', icon: <BirthdayCakeIcon className="text-xs" /> },
      Cards: { color: 'bg-red-600 dark:bg-red-800', icon: <EnvelopeIcon className="text-xs" /> },
      Choreographers: { color: 'bg-purple-600 dark:bg-purple-800', icon: <MusicIcon className="text-xs" /> },
      Entertainment: { color: 'bg-yellow-600 dark:bg-yellow-800', icon: <StarIcon className="text-xs" /> },
      Beauty: { color: 'bg-pink-600 dark:bg-pink-800', icon: <MagicIcon className="text-xs" /> },
      default: { color: 'bg-gray-600 dark:bg-gray-800', icon: <StarIcon className="text-xs" /> },
    };
    return categoryMap[category as keyof typeof categoryMap] || categoryMap['default'];
  };

  // Memoize price formatting
  const { formattedPrice, fullPrice } = useMemo(() => {
    const formatPrice = (price: number) => {
      if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
      if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
      return new Intl.NumberFormat('en-IN').format(price);
    };

    return {
      formattedPrice: formatPrice(service.price),
      fullPrice: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(service.price)
    };
  }, [service.price]);

  const categoryInfo = getCategoryInfo(service.category);

  // Normalize image URL to prevent invalid paths
  const imageUrl = useMemo(() => {
    let url = service.imageUrl || '/img/default-vendor.jpg';
    if (url === '/img/default-service.jpg' || url === 'img/default-service.jpg') {
      url = 'https://res.cloudinary.com/jdscloud/image/upload/v1744811259/shaadisharthi/images/1744811255778_IMG_20191101_180029.jpg.jpg';
    }
    if (!url.startsWith('http') && !url.startsWith('/')) {
      url = `/${url}`;
    }
    return url;
  }, [service.imageUrl]);

  return (
    <div className="vendor-card bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={service.serviceName || service.businessName || 'Vendor Image'}
          width={300}
          height={200}
          className="object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMkO0LdajMqLq2obdUyCqgwDW8nK3PkHdMpSN3lRcTl6FVLWnMkKhMpIq6ruE2VLFTBpJpJpJpbXkH//Z"
          onError={(e) => {
            e.currentTarget.src = 'https://res.cloudinary.com/jdscloud/image/upload/v1744811259/shaadisharthi/images/1744811255778_IMG_20191101_180029.jpg.jpg';
          }}
        />
        <span className={`category-tag absolute top-3 right-3 text-white dark:text-gray-200 text-xs px-2 py-1 rounded-full ${categoryInfo.color} flex items-center`}>
          {categoryInfo.icon}
          <span className="truncate max-w-[100px] ml-1">{service.category}</span>
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-2 h-12 overflow-hidden">
          {service.serviceName || service.businessName || 'Service Name'}
        </h3>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2 h-6 overflow-hidden">
          <MapMarkerIcon className="mr-1 text-xs shrink-0" />
          <span className="truncate">{service.location}</span>
        </div>

        <div className="flex items-center mb-3 h-6">
          <RatingStars rating={service.rating} />
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({service.reviewCount})</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-end min-h-[60px]">
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold text-primary dark:text-pink-400 truncate" title={fullPrice}>
              ₹{formattedPrice}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">starting price</span>
          </div>

          <Link
            href={`/service-detail/${service.serviceId}`}
            className="text-primary dark:text-pink-400 hover:text-opacity-80 dark:hover:text-opacity-80 font-medium text-sm whitespace-nowrap px-3 py-2 rounded-md hover:bg-primary dark:hover:bg-pink-900 hover:bg-opacity-10 dark:hover:bg-opacity-20 transition-colors flex items-center shrink-0"
            prefetch={false} // Improve performance
          >
            View <ArrowRightIcon className="ml-1.5 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const areEqual = (prevProps: VendorCardProps, nextProps: VendorCardProps) => {
  const prevVendor = prevProps.service;
  const nextVendor = nextProps.service;

  return (
    prevVendor.serviceId === nextVendor.serviceId &&
    prevVendor.serviceName === nextVendor.serviceName &&
    prevVendor.businessName === nextVendor.businessName &&
    prevVendor.category === nextVendor.category &&
    prevVendor.location === nextVendor.location &&
    prevVendor.rating === nextVendor.rating &&
    prevVendor.reviewCount === nextVendor.reviewCount &&
    prevVendor.price === nextVendor.price &&
    prevVendor.imageUrl === nextVendor.imageUrl
  );
};

export default memo(VendorCard, areEqual);