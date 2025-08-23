// VendorCard.tsx (updated)
import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RatingStars } from './RatingStars';
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

interface Vendor {
  id: string;
  serviceId: number;
  serviceName: string;
  businessName: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      Photography: { color: 'bg-indigo-600', icon: <CameraIcon className="text-xs" /> },
      Venues: { color: 'bg-purple-600', icon: <BuildingIcon className="text-xs" /> },
      Sound: { color: 'bg-purple-600', icon: <VolumeUpIcon className="text-xs" /> },
      Catering: { color: 'bg-green-600', icon: <UtensilsIcon className="text-xs" /> },
      Decoration: { color: 'bg-pink-600', icon: <PaintBrushIcon className="text-xs" /> },
      'Bridal Wear': { color: 'bg-red-600', icon: <TShirtIcon className="text-xs" /> },
      Jewellery: { color: 'bg-yellow-600', icon: <GemIcon className="text-xs" /> },
      Favors: { color: 'bg-blue-600', icon: <GiftIcon className="text-xs" /> },
      Planners: { color: 'bg-teal-600', icon: <ClipboardListIcon className="text-xs" /> },
      'Bridal Makeup': { color: 'bg-pink-600', icon: <MagicIcon className="text-xs" /> },
      Videographers: { color: 'bg-indigo-600', icon: <VideoIcon className="text-xs" /> },
      'Groom Wear': { color: 'bg-blue-600', icon: <UserTieIcon className="text-xs" /> },
      'Mehendi Artists': { color: 'bg-orange-600', icon: <PaintBrushIcon className="text-xs" /> },
      Cakes: { color: 'bg-pink-600', icon: <BirthdayCakeIcon className="text-xs" /> },
      Cards: { color: 'bg-red-600', icon: <EnvelopeIcon className="text-xs" /> },
      Choreographers: { color: 'bg-purple-600', icon: <MusicIcon className="text-xs" /> },
      Entertainment: { color: 'bg-yellow-600', icon: <StarIcon className="text-xs" /> },
      Beauty: { color: 'bg-pink-600', icon: <MagicIcon className="text-xs" /> },
      default: { color: 'bg-gray-600', icon: <StarIcon className="text-xs" /> },
    };
    return categoryMap[category as keyof typeof categoryMap] || categoryMap['default'];
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      const crores = (price / 10000000).toFixed(1);
      return `${crores} Cr`;
    }
    if (price >= 100000) {
      const lakhs = (price / 100000).toFixed(1);
      return `${lakhs} L`;
    }
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const fullPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(vendor.price);

  const categoryInfo = getCategoryInfo(vendor.category);

  // Normalize image URL to prevent invalid paths
    let imageUrl = vendor.imageUrl || '/img/default-vendor.jpg';
    if (imageUrl === '/img/default-service.jpg' || imageUrl === 'img/default-service.jpg') {
      imageUrl = '/img/default-vendor.jpg';
    }
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = `/${imageUrl}`;
    }

  return (
    <div className="vendor-card bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={vendor.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMkck0YySgjlEenUURVHLiJZMZ/9k="
        />
        <span className={`category-tag absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-full ${categoryInfo.color} flex items-center`}>
          {categoryInfo.icon}
          <span className="truncate max-w-[100px] ml-1">{vendor.category}</span>
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 relative group" title={vendor.serviceName}>
          {vendor.serviceName}
          <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 z-10">
            {vendor.serviceName}
          </span>
        </h3>

        <div className="flex items-center text-gray-500 text-sm mb-2 relative group">
          <MapMarkerIcon className="mr-1 text-xs" />
          <span className="truncate" title={vendor.location}>{vendor.location}</span>
          <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 z-10">
            {vendor.location}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <RatingStars rating={vendor.rating} />
          <span className="text-xs text-gray-500 ml-1">({vendor.reviewCount})</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-end">
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold text-primary truncate" title={fullPrice}>
              ₹{formatPrice(vendor.price)}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">starting price</span>
          </div>

          <Link
            href={`/service-detail/${vendor.serviceId}`}
            className="text-primary hover:text-opacity-80 font-medium text-sm whitespace-nowrap px-3 py-2 rounded-md hover:bg-primary hover:bg-opacity-10 transition-colors flex items-center shrink-0"
          >
            View <ArrowRightIcon className="ml-1.5 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const areEqual = (prevProps: VendorCardProps, nextProps: VendorCardProps) => {
  return (
    prevProps.vendor.id === nextProps.vendor.id &&
    prevProps.vendor.serviceName === nextProps.vendor.serviceName &&
    prevProps.vendor.businessName === nextProps.vendor.businessName &&
    prevProps.vendor.category === nextProps.vendor.category &&
    prevProps.vendor.location === nextProps.vendor.location &&
    prevProps.vendor.rating === nextProps.vendor.rating &&
    prevProps.vendor.reviewCount === nextProps.vendor.reviewCount &&
    prevProps.vendor.price === nextProps.vendor.price &&
    prevProps.vendor.imageUrl === nextProps.vendor.imageUrl
  );
};

export default memo(VendorCard, areEqual);