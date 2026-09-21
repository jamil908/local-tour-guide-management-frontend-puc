
// components/FeaturedToursSection.tsx (NEW COMPONENT)
'use client';

import Link from 'next/link';
import { useGetListings } from '@/hooks/useGetListings';
import SkeletonLoader from '@/components/shared/SkeletonLoader';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import { Listing } from '@/types';

export default function FeaturedToursSection() {
  const { data: allListings = [], isLoading, error } = useGetListings();

  if (isLoading) {
    return <SkeletonLoader count={6} />;
  }

  if (error || allListings.length === 0) {
    return null; // Silently fail - don't show section if error
  }

  // Get 6 featured tours (you can add sorting logic here)
  const featuredTours = allListings.slice(0, 6);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {featuredTours.map((listing: Listing) => (
        <Link
          key={listing.id}
          href={`/tours/${listing.id}`}
          className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-amber-500"
        >
          <div className="relative h-56 overflow-hidden">
            <img
              src={listing.images[0] || 'https://via.placeholder.com/400x300?text=Image+Coming+Soon'}
              alt={listing.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 opacity-80"
            />
            <div className="absolute top-4 right-4 bg-amber-500 px-3 py-1 rounded-full text-sm font-bold text-gray-900">
              {listing.category}
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-xl mb-2 line-clamp-2 text-white">
              {listing.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {listing.description}
            </p>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
              <img
                src={listing.guide.profilePic || `https://ui-avatars.com/api/?name=${listing.guide.name}&background=d97706&color=fff`}
                alt={listing.guide.name}
                className="w-8 h-8 rounded-full border-2 border-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-white">
                  {listing.guide.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-1 text-amber-500">
                <FiStar className="fill-current" />
                <span className="text-white font-semibold">
                  {listing.averageRating?.toFixed(1) || 'New'}
                </span>
                {listing.reviewCount! > 0 && (
                  <span className="text-gray-500">
                    ({listing.reviewCount})
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-1">
                  <FiClock className="text-amber-500" />
                  <span>{listing.duration}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-amber-500" />
                  <span>{listing.city}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-amber-400">
                  {formatCurrency(listing.tourFee)}
                </span>
                <span className="text-gray-500 text-sm ml-1">/ person</span>
              </div>
              <button className="px-4 py-1.5 bg-amber-500 text-gray-900 rounded-full text-sm font-bold hover:bg-amber-400 transition">
                View
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}