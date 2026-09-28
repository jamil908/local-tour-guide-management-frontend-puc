
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Listing } from '@/types';
import { FiFilter, FiX } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import SkeletonLoader from '@/components/shared/SkeletonLoader';
import { useGetListings } from '@/hooks/useGetListings';
import TourCard from '@/components/shared/Card';

const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [locked]);
};

const AmberButton = ({ children, onClick, className, size, type, variant, ...props }: any) => {
  const baseStyle = "font-bold transition duration-200 ease-in-out rounded-full";
  const sizeStyle = size === 'lg' ? 'px-8 py-3 text-lg' : size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-6 py-2 text-base';
  
  let colorStyle = "";
  if (variant === 'outline') {
    colorStyle = "border-2 border-amber-600 text-amber-400 hover:bg-amber-600/10";
  } else if (variant === 'secondary') {
    colorStyle = "bg-gray-700 text-gray-200 hover:bg-gray-600";
  } else {
    colorStyle = "bg-amber-500 text-gray-900 hover:bg-amber-400 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50";
  }

  return (
    <button onClick={onClick} type={type} className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  useBodyScrollLock(showFilters);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const { data: listings = [], isLoading, error } = useGetListings(filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ city: '', category: '', minPrice: '', maxPrice: '' });
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="bg-black text-white py-12 border-b border-amber-500/50">
          <div className="container-custom">
            <h1 className="text-4xl font-extrabold mb-2 text-amber-400">Explore Tours</h1>
            <p className="text-gray-400">Loading amazing experiences...</p>
          </div>
        </div>
        <div className="container-custom py-12">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Tours</h2>
          <p className="text-gray-400 mb-6">Something went wrong. Please try again.</p>
          <AmberButton onClick={() => window.location.reload()}>Retry</AmberButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-black text-white py-12 border-b border-amber-500/50">
        <div className="container-custom">
          <h1 className="text-4xl font-extrabold mb-2 text-amber-400">Explore Tours </h1>
          <p className="text-gray-400">Discover **{listings.length}** amazing experiences with local experts</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 sticky top-24 border border-gray-700">
              <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-2xl font-bold text-white">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-amber-500 hover:text-amber-400 transition">
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">City</label>
                  <Input
                    name="city"
                    type="text"
                    placeholder="e.g., Paris, Tokyo"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 border border-gray-600 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Food & Culinary">Food & Culinary</option>
                    <option value="Photography">Photography</option>
                    <option value="History & Culture">History & Culture</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Wine & Food">Wine & Food</option>
                    <option value="Art & Design">Art & Design</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">Min Price</label>
                    <Input
                      name="minPrice"
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-300">Max Price</label>
                    <Input
                      name="maxPrice"
                      type="number"
                      placeholder="$500"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <AmberButton onClick={() => setShowFilters(!showFilters)} variant="outline" className="w-full">
              <FiFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </AmberButton>

            {showFilters && (
              <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
                <div className="w-full max-w-sm bg-gray-800 h-full p-6 shadow-2xl overflow-y-auto">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
                    <h3 className="text-2xl font-bold text-white">Filter Options</h3>
                    <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-amber-500">
                      <FiX size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">City</label>
                      <Input
                        name="city"
                        type="text"
                        placeholder="e.g., Paris"
                        value={filters.city}
                        onChange={handleFilterChange}
                        className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2.5 border border-gray-600 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">All Categories</option>
                        <option value="Food & Culinary">Food & Culinary</option>
                        <option value="Photography">Photography</option>
                        <option value="History & Culture">History & Culture</option>
                        <option value="Adventure">Adventure</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Min</label>
                        <Input
                          name="minPrice"
                          type="number"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                          className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Max</label>
                        <Input
                          name="maxPrice"
                          type="number"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                          className="w-full bg-gray-700 text-white border-gray-600 focus:ring-amber-500 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <AmberButton onClick={() => setShowFilters(false)} className="flex-1">
                        Apply Filters
                      </AmberButton>
                      <AmberButton onClick={clearFilters} variant="secondary" className="flex-1">
                        Clear
                      </AmberButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No tours found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search in a different city</p>
                <AmberButton onClick={clearFilters}>Clear Filters</AmberButton>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing: Listing) => (
                  <TourCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}