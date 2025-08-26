import React from 'react';
import Link from 'next/link';
import { HeartIcon } from './Icons';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <HeartIcon className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No vendors found</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        We couldn't find any vendors matching your criteria
      </p>
      <Link 
        href="/service" 
        className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Browse All Vendors 
      </Link>
    </div>
  );
};

export default EmptyState;