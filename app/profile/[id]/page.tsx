/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User, Listing, Review } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { FiEdit, FiMail, FiMapPin, FiStar, FiGlobe, FiDollarSign } from 'react-icons/fi';
// NOTE: Assuming original Button, Card, and Loading components are adaptable or replaced below.
import Button from '@/components/ui/Button'; 
import Card, { CardBody } from '@/components/ui/Card'; 
import Loading, { LoadingSpinner } from '@/components/shared/Loading';
import toast from 'react-hot-toast';

const AmberButton = ({ children, onClick, className, size, type, variant, ...props }: any) => {
    const baseStyle = "font-bold transition duration-200 ease-in-out rounded-full flex items-center justify-center";
    const sizeStyle = size === 'lg' ? 'px-8 py-3 text-lg' : size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-6 py-2 text-base';
    
    let colorStyle = "";
    if (variant === 'outline') {
      colorStyle = "border-2 border-amber-600 text-amber-400 hover:bg-amber-600/10";
    } else if (variant === 'danger') {
      colorStyle = "bg-red-700 text-white hover:bg-red-600 focus:ring-red-500/50";
    } else {
      colorStyle = "bg-amber-500 text-gray-900 hover:bg-amber-400 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50";
    }
  
    return (
      <button
        onClick={onClick}
        type={type}
        className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
};

// Custom Card for Dark Theme
const DarkCard = ({ children, className, hover, ...props }: any) => {
    const baseStyle = "bg-gray-800 rounded-xl shadow-lg border border-gray-700";
    const hoverStyle = hover ? "hover:shadow-amber-500/30 transition-all duration-300 hover:border-amber-500" : "";
    
    return (
        <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
            {children}
        </div>
    );
}
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const profileId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  useEffect(() => {
    if (profileId) {
        fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${profileId}`);
      setProfile(response.data.data);

      
      if (response.data.data.role === 'GUIDE') {
        try {
          const listingsRes = await api.get(`/listings?guideId=${profileId}`);
          setListings(listingsRes.data.data || []);
        } catch (error) {
          console.error('Error fetching listings:', error);
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = currentUser?.id === profileId;
console.log('Profile Data:', profile);
  if (loading) return <LoadingSpinner size="lg"></LoadingSpinner>;
  if (!profile) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          
       
          <DarkCard className="mb-10">
            <CardBody className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {profile.profilePic ? (
                    <img
                      src={profile.profilePic}
                      alt={profile.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-amber-600"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-700">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-extrabold text-amber-400 mb-2">
                        {profile.name}
                      </h1>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            profile.role === 'GUIDE'
                              ? 'bg-amber-800/50 text-amber-400 border border-amber-700'
                              : profile.role === 'ADMIN'
                              ? 'bg-purple-800/50 text-purple-400 border border-purple-700'
                              : 'bg-sky-800/50 text-sky-400 border border-sky-700'
                          }`}
                        >
                          {profile.role}
                        </span>
                        {profile.role === 'GUIDE' && profile.dailyRate && (
                          <span className="text-xl font-bold text-green-500 flex items-center">
                            <FiDollarSign className="mr-1" />{profile.dailyRate}/day
                          </span>
                        )}
                      </div>
                    </div>

                    {isOwnProfile && (
                      <Link href={`/profile/${profileId}/edit`}>
                        <AmberButton size="sm">
                          <FiEdit className="mr-2" />
                          Edit Profile
                        </AmberButton>
                      </Link>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-gray-400 mb-6 leading-relaxed border-l-4 border-amber-600 pl-4">
                      {profile.bio}
                    </p>
                  )}
                  
                  {/* Contact & Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMail className="text-amber-500" />
                      <span className='text-white'>{profile.email}</span>
                    </div>

                    {/* Languages */}
                    {profile.languages && profile.languages.length > 0 && (
                      <div className="flex items-start gap-2">
                        <FiGlobe className="text-amber-500 mt-1 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.map((lang, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 font-medium"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guide Expertise */}
                    {profile.role === 'GUIDE' && profile.expertise && profile.expertise.length > 0 && (
                      <div className="flex items-start gap-2">
                        <FiStar className="text-amber-500 mt-1 flex-shrink-0" />
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise.map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-amber-900/40 border border-amber-700 rounded-full text-sm text-amber-300 font-medium"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tourist Preferences */}
                    {profile.role === 'TOURIST' && profile.travelPreferences && (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-amber-500" />
                        <span className="text-gray-300">
                          Travel Interests: <span className='font-medium'>{profile.travelPreferences}</span>
                        </span>
                      </div>
                    )}

                    {/* Member Since */}
                    <p className="text-sm text-gray-500 pt-2 border-t border-gray-700 mt-4">
                      Member since **{formatDate(profile.createdAt)}**
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </DarkCard>

          {/* Guide's Tours */}
          {profile.role === 'GUIDE' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
                {isOwnProfile ? '🎒 My Tours' : `🗺️ ${profile.name.split(' ')[0]}'s Tours`}
              </h2>
              
              {listings.length === 0 ? (
                <DarkCard>
                  <CardBody className="text-center py-12">
                    <div className="text-6xl mb-4 text-amber-500">😔</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No tours yet
                    </h3>
                    <p className="text-gray-400">
                      {isOwnProfile
                        ? 'Start creating tours to showcase your expertise!'
                        : 'This guide hasn\'t created any tours yet.'}
                    </p>
                    {isOwnProfile && (
                        <div className='mt-6'>
                            <Link href="/dashboard/guide/create-listing">
                                <AmberButton>
                                    <FiEdit className="mr-2" />
                                    Create First Tour
                                </AmberButton>
                            </Link>
                        </div>
                    )}
                  </CardBody>
                </DarkCard>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/tours/${listing.id}`}
                      className="card hover:-translate-y-1 transition-all duration-300"
                    >
                      <DarkCard hover>
                        <img
                          src={listing.images[0] || 'https://via.placeholder.com/400x300?text=Tour+Image'}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <CardBody>
                          <h3 className="font-bold text-xl mb-2 line-clamp-2 text-white">
                            {listing.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {listing.description}
                          </p>
                          
                          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                            <div className="flex items-center gap-2 text-gray-400">
                              <FiStar className="text-amber-500" />
                              <span className="font-semibold text-white">
                                {listing.averageRating?.toFixed(1) || 'New'}
                              </span>
                              {(listing.reviewCount ?? 0) > 0 && (
                                <span className="text-sm text-gray-500">
                                  ({listing.reviewCount})
                                </span>
                              )}
                            </div>
                            <span className="text-2xl font-bold text-green-500">
                              ${listing.tourFee}
                            </span>
                          </div>
                        </CardBody>
                      </DarkCard>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}