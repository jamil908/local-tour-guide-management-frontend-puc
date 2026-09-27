/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api'; 
import { useAuth } from '@/contexts/AuthContext';
import { Booking, Listing } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FiPlus, FiCalendar, FiUsers, FiStar, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import  { CardBody } from '@/components/ui/Card'; 
import Loading from '@/components/shared/Loading';
import toast from 'react-hot-toast';



const AmberButton = ({ children, onClick, className, size, type, variant, ...props }: any) => {
    const baseStyle = "font-bold transition duration-200 ease-in-out rounded-full flex items-center justify-center";
    const sizeStyle = size === 'lg' ? 'px-8 py-3 text-lg' : size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-6 py-2 text-base';
    
    let colorStyle = "";
    if (variant === 'outline') {
      colorStyle = "border-2 border-amber-600 text-amber-400 hover:bg-amber-600/10";
    } else if (variant === 'danger') {
      colorStyle = "bg-red-700 text-white hover:bg-red-600 focus:ring-red-500/50";
    } else if (variant === 'success') {
      colorStyle = "bg-green-700 text-white hover:bg-green-600 focus:ring-green-500/50";
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

const DarkCard = ({ children, className, hover, ...props }: any) => {
    const baseStyle = "bg-gray-800 rounded-xl shadow-lg border border-gray-700";
    const hoverStyle = hover ? "hover:shadow-amber-500/30 transition-all duration-300 hover:border-amber-500" : "";
    
    return (
        <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
            {children}
        </div>
    );
}


export default function GuideDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings'>('bookings');

  useEffect(() => {
  if (!isAuthenticated) {
    router.push('/auth/login');
    return;
  }

  if (user?.role && user.role !== 'GUIDE') {
    router.push('/');
    return;
  }

  if (isAuthenticated && user?.role === 'GUIDE') {
    fetchData();
  }
  
}, [isAuthenticated, user?.role, router]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, listingsRes] = await Promise.all([
        api.get('/bookings/my-bookings'),
        api.get('/listings/my/listings'),
      ]);
      setBookings(bookingsRes.data.data);
      setListings(listingsRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await api.patch(`/bookings/${bookingId}`, { status });
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${listingId}`);
      toast.success('Listing deleted');
      fetchData();
      
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };
console.log(bookings)
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' && new Date(b.bookingDate) >= new Date()
  );

  const totalEarnings = bookings
    .filter((b) => b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  if (loading) return <Loading color="text-amber-500" className="bg-gray-900 min-h-screen" />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12">
      <div className="container-custom">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-400 mb-2">Guide Dashboard</h1>
            <p className="text-gray-400">Manage your tours and bookings</p>
          </div>
          <Link href="/dashboard/guide/create-listing">
            <AmberButton size="lg">
              <FiPlus className="mr-2" />
              Create New Tour
            </AmberButton>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Pending Requests */}
          <DarkCard>
            <CardBody className="text-center">
              <div className="text-4xl font-bold text-amber-500 mb-2">
                {pendingBookings.length}
              </div>
              <div className="text-gray-400">Pending Requests</div>
            </CardBody>
          </DarkCard>

          {/* Upcoming Tours */}
          <DarkCard>
            <CardBody className="text-center">
              <div className="text-4xl font-bold text-sky-400 mb-2">
                {upcomingBookings.length}
              </div>
              <div className="text-gray-400">Upcoming Tours</div>
            </CardBody>
          </DarkCard>

          {/* Total Earnings */}
          <DarkCard>
            <CardBody className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {formatCurrency(totalEarnings)}
              </div>
              <div className="text-gray-400">Total Earnings</div>
            </CardBody>
          </DarkCard>

          {/* Active Listings */}
          <DarkCard>
            <CardBody className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {listings.length}
              </div>
              <div className="text-gray-400">Active Listings</div>
            </CardBody>
          </DarkCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'bookings'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'listings'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Tours ({listings.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' ? (
          <div className="space-y-8">
            {/* Pending Requests */}
            {pendingBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-amber-500">
                  ⚠️ Pending Requests ({pendingBookings.length})
                </h2>
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <DarkCard key={booking.id}>
                      <CardBody>
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={booking.listing?.images[0] || 'https://via.placeholder.com/400x300?text=Tour+Image'}
                            alt={booking.listing?.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg border border-gray-700"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white">{booking.listing?.title}</h3>
                                <p className="text-gray-400 mt-1">
                                  Requested by: <span className="text-amber-400">{booking.tourist?.name}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-500">
                                  {formatCurrency(booking.totalAmount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  <FiUsers className="inline-block mr-1" />{booking.numberOfPeople} people
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-gray-400">
                              <div className="flex items-center gap-2">
                                <FiCalendar className="text-amber-500" />
                                <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-2 border-t border-gray-700">
                              <AmberButton
                                size="sm"
                                variant="success"
                                onClick={() => handleBookingAction(booking.id, 'CONFIRMED')}
                              >
                                <FiCheck className="mr-2" />
                                Accept
                              </AmberButton>
                              <AmberButton
                                size="sm"
                                variant="danger"
                                onClick={() => handleBookingAction(booking.id, 'CANCELLED')}
                              >
                                <FiX className="mr-2" />
                                Decline
                              </AmberButton>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </DarkCard>
                  ))}
                </div>
              </div>
            )}

            {/* All Bookings */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">All Bookings</h2>
              {bookings.length === 0 ? (
                <DarkCard>
                  <CardBody className="text-center py-12">
                    <div className="text-6xl mb-4 text-amber-500">📅</div>
                    <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-400">
                      Your bookings will appear here once tourists start booking your tours.
                    </p>
                  </CardBody>
                </DarkCard>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <DarkCard key={booking.id} hover>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={booking.tourist?.profilePic || `https://ui-avatars.com/api/?name=${booking.tourist?.name || 'User'}&background=d97706&color=fff`}
                              alt={booking.tourist?.name}
                              className="w-12 h-12 rounded-full border-2 border-amber-500/50"
                            />
                            <div>
                              <h3 className="font-bold text-white">{booking.listing?.title}</h3>
                              <p className="text-sm text-gray-400">
                                {booking.tourist?.name} • {formatDate(booking.bookingDate)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-green-500">{formatCurrency(booking.totalAmount)}</div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  booking.status === 'CONFIRMED'
                                    ? 'bg-green-800/50 text-green-400'
                                    : booking.status === 'PENDING'
                                    ? 'bg-amber-800/50 text-amber-400'
                                    : booking.status === 'COMPLETED'
                                    ? 'bg-sky-800/50 text-sky-400'
                                    : 'bg-red-800/50 text-red-400'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </DarkCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Listings Tab */
          <div className="space-y-6">
            {listings.length === 0 ? (
              <DarkCard>
                <CardBody className="text-center py-12">
                  <div className="text-6xl mb-4 text-amber-500">🎒</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No tours yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first tour and start connecting with travelers!
                  </p>
                  <Link href="/dashboard/guide/create-listing">
                    <AmberButton>
                      <FiPlus className="mr-2" />
                      Create Your First Tour
                    </AmberButton>
                  </Link>
                </CardBody>
              </DarkCard>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <DarkCard key={listing.id} hover>
                    <img
                      src={listing.images[0] || 'https://via.placeholder.com/400x300?text=Tour+Image'}
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <CardBody>
                      <h3 className="text-xl font-bold mb-2 text-white">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiStar className="text-amber-500" />
                            <span className='text-white font-medium'>{listing.averageRating?.toFixed(1) || 'New'}</span>
                          </div>
                          <span>{listing.reviewCount || 0} reviews</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                          {formatCurrency(listing.tourFee)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/tours/${listing.id}`} className="flex-1">
                          <AmberButton variant="outline" size="sm" className="w-full">
                            View
                          </AmberButton>
                        </Link>
                        <Link href={`/dashboard/guide/edit/${listing.id}`} className="flex-1">
                          <AmberButton size="sm" className="w-full">
                            <FiEdit className="mr-2" />
                            Edit
                          </AmberButton>
                        </Link>
                        <AmberButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <FiTrash2 />
                        </AmberButton>
                      </div>
                    </CardBody>
                  </DarkCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}