/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TourCardProps {
  listing: Listing;
}

export default function TourCard({ listing }: TourCardProps) {
  return (
    <Link
      href={`/tours/${listing.id}`}
      className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-amber-500"
    >
      {/* Image Section */}
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

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-white">
          {listing.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Guide Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
          <img
            src={listing.guide.profilePic || `https://ui-avatars.com/api/?name=${listing.guide.name}&background=d97706&color=fff`}
            alt={listing.guide.name}
            className="w-8 h-8 rounded-full border-2 border-amber-500"
          />
          <p className="text-sm font-medium text-white">{listing.guide.name}</p>
        </div>

        {/* Rating & Details */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1 text-amber-500">
            <FiStar className="fill-current" />
            <span className="text-white font-semibold">
              {listing.averageRating?.toFixed(1) || 'New'}
            </span>
            {listing.reviewCount! > 0 && (
              <span className="text-gray-500">({listing.reviewCount})</span>
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

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-amber-400">
              {formatCurrency(listing.tourFee)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/ person</span>
          </div>
          <button className="px-4 py-1.5 bg-amber-500 text-gray-900 rounded-full text-sm font-bold hover:bg-amber-400 transition duration-200">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}