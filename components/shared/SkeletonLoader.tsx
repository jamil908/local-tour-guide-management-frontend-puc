import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

// Tour Card Skeleton
export function TourCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-56 bg-gray-700">
        <div className="absolute top-4 right-4 bg-gray-600 px-3 py-1 rounded-full w-24 h-6"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded mb-4 w-1/2"></div>
        
        {/* Description */}
        <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>

        {/* Guide Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
          <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
}

// Multiple Tour Card Skeletons
export default function SkeletonLoader({ count = 6, className }: SkeletonLoaderProps) {
  return (
    <div className={cn("grid md:grid-cols-2 xl:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <TourCardSkeleton key={index} />
      ))}
    </div>
  );
}
  


// General Skeleton Component for flexibility
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-700 rounded", className)} />
  );
}

// Loading Container Skeleton
export function LoadingSkeleton() {
  return (
    <div className="flex justify-center py-20">
      <SkeletonLoader count={6} />
    </div>
  );
}
