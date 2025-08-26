import React from 'react';
import { motion } from 'framer-motion';
import VendorCardSkeleton from './VendorCardSkeleton';

interface VendorGridSkeletonProps {
  count?: number;
}

const VendorGridSkeleton: React.FC<VendorGridSkeletonProps> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <VendorCardSkeleton />
      </motion.div>
    ))}
  </div>
);

export default VendorGridSkeleton;