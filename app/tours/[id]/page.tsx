/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Listing, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import PaymentButton from '@/app/payment/cancelled/page'; 
import { FiStar, FiClock, FiMapPin, FiUsers, FiCalendar, FiDollarSign, FiShare2, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import Loading from '@/components/shared/Loading';

import DarkCard, { DarkCardBody } from '@/components/ui/Card2';
const Card = DarkCard;
const CardBody = DarkCardBody;

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [booking, setBooking] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${params.id}`);
      setListing(response.data.data);
    } catch (error) {
      toast.error('Failed to load tour details');
      router.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'TOURIST') {
      toast.error('Only tourists can book tours');
      return;
    }

    if (!bookingDate) {
      toast.error('Please select a date');
      return;
    }

    if (numberOfPeople < 1 || numberOfPeople > listing!.maxGroupSize) {
      toast.error(`Number of people must be between 1 and ${listing!.maxGroupSize}`);
      return;
    }

    try {
      setBooking(true);
      const response = await api.post('/bookings', {
        listingId: listing!.id,
        guideId: listing!.guideId,
        bookingDate: new Date(bookingDate).toISOString(),
        numberOfPeople,
        totalAmount: listing!.tourFee * numberOfPeople,
      });

      const bookingId = response.data.data.id;
      setCreatedBookingId(bookingId);
      setShowPayment(true);
      toast.success('Booking created! Please complete payment.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const shareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const calculateTotalPrice = () => {
    return listing ? listing.tourFee * numberOfPeople : 0;
  };

  const calculateAverageRating = () => {
    if (!listing?.reviews || listing.reviews.length === 0) return 0;
    const sum = listing.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / listing.reviews.length).toFixed(1);
  };

  if (loading) return <Loading />;
  if (!listing) return <div className="container-custom py-20">Tour not found</div>;

  const avgRating = calculateAverageRating();
  const minDate = new Date().toISOString().split('T')[0];

  return (
    // --- CHANGE 2: Set page background to dark gray ---
    <div className="min-h-screen bg-gray-900 text-gray-100"> 
      {/* Image Gallery */}
      <div className="bg-black">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-2 py-2">
            {/* Main Image */}
            <div className="md:col-span-1">
              <img
                src={listing.images[selectedImage] || '/placeholder.jpg'}
                alt={listing.title}
                className="w-full h-96 md:h-[500px] object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(selectedImage)}
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-2">
              {listing.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Tour ${idx + 1}`}
                  className={`w-full h-48 md:h-[246px] object-cover rounded-lg cursor-pointer transition ${
                    // --- CHANGE 3: Use Amber ring for selected image ---
                    selectedImage === idx ? 'ring-4 ring-amber-500' : 'hover:opacity-80' 
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-amber-900 text-amber-300 text-sm font-semibold rounded-full mb-3">
                    {listing.category}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-50 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-amber-500 fill-current" />
                      <span className="font-semibold">{avgRating}</span>
                      <span>({listing.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-amber-600" />
                      <span>{listing.city}</span>
                    </div>
                  </div>
                </div>

                
                <div className="flex gap-2">
                  <button
                    onClick={shareUrl}
                  
                    className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition" 
                  >
                    <FiShare2 />
                  </button>
                  <button 
                   
                    className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
                  >
                    <FiHeart />
                  </button>
                </div>
              </div>

             
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-xl border border-amber-700"> 
                <div className="text-center">
                  <FiClock className="mx-auto text-amber-500 mb-2" size={24} />
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="font-bold">{listing.duration} hours</div>
                </div>
                <div className="text-center">
                  <FiUsers className="mx-auto text-amber-500 mb-2" size={24} />
                  <div className="text-sm text-gray-400">Group Size</div>
                  <div className="font-bold">Max {listing.maxGroupSize}</div>
                </div>
                <div className="text-center">
                  <FiDollarSign className="mx-auto text-amber-500 mb-2" size={24} />
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="font-bold">{formatCurrency(listing.tourFee)}</div>
                </div>
              </div>
            </div>

            
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </CardBody>
            </Card>

            {listing.itinerary && (
              <Card>
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4">What we'll do</h2>
                  <div className="space-y-3">
                    {listing.itinerary.split('\n').map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-amber-400 font-semibold text-sm">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-gray-300 pt-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold mb-4">Where we'll meet</h2>
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-amber-500 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-50">{listing.meetingPoint}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Exact location will be shared after booking confirmation
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold mb-4">Meet your guide</h2>
                <div className="flex items-start gap-4">
                  {listing.guide.profilePic ? (
                    <img
                      src={listing.guide.profilePic}
                      alt={listing.guide.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-gray-900 text-2xl font-bold">
                      {getInitials(listing.guide.name || 'Guide')}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">{listing.guide.name}</h3>
                    {listing.guide.bio && (
                      <p className="text-gray-400 mb-3">{listing.guide.bio}</p>
                    )}
                    {listing.guide.languages && listing.guide.languages.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Languages: </span>
                        <span className="text-sm">{listing.guide.languages.join(', ')}</span>
                      </div>
                    )}
                    {listing.guide.expertise && listing.guide.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {listing.guide.expertise.map((exp, idx) => (
                          <span
                            key={idx}
                           
                            className="px-3 py-1 bg-amber-900 text-amber-300 text-sm rounded-full"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={`/profile/${listing.guide.id}`} className="mt-4 inline-block">
                      
                      <Button variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>


            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <FiStar className="text-amber-500 fill-current" />
                      <span className="font-semibold">{avgRating}</span>
                      <span className="text-gray-400">
                        · {listing.reviews?.length || 0} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {listing.reviews && listing.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {listing.reviews.map((review: Review) => (
                      <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          {review.tourist.profilePic ? (
                            <img
                              src={review.tourist.profilePic}
                              alt={review.tourist.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                         
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-semibold"> 
                              {getInitials(review.tourist.name || 'User')}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">{review.tourist.name}</p>
                                <p className="text-sm text-gray-400">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? 'text-amber-500 fill-current' // Use Amber star color
                                        : 'text-gray-600' // Dark theme empty star color
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiStar size={48} className="mx-auto mb-3 text-gray-600" />
                    <p>No reviews yet. Be the first to review this tour!</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardBody className="p-6">
                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <div className="flex items-baseline gap-2">
                      {/* --- CHANGE 8: Amber price text --- */}
                      <span className="text-3xl font-bold text-amber-500">
                        {formatCurrency(listing.tourFee)}
                      </span>
                      <span className="text-gray-400">/ person</span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  {!showPayment ? (
                    <div className="space-y-4">
                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiCalendar className="inline mr-2" />
                          Select Date
                        </label>
                        
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          min={minDate}
                          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Number of People */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiUsers className="inline mr-2" />
                          Number of People
                        </label>
                       
                        <input
                          type="number"
                          value={numberOfPeople}
                          onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                          min={1}
                          max={listing.maxGroupSize}
                          className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Maximum {listing.maxGroupSize} people
                        </p>
                      </div>

                      {/* Price Breakdown */}
                      <div className="border-t border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {formatCurrency(listing.tourFee)} x {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
                          </span>
                          <span className="font-semibold text-gray-100">
                            {formatCurrency(calculateTotalPrice())}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                          <span>Total</span>
                          <span className="text-amber-500">{formatCurrency(calculateTotalPrice())}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleBooking}
                        isLoading={booking}
                        size="lg"
                        className="w-full bg-amber-600 hover:bg-amber-500 text-gray-900" // Set Amber Button
                        disabled={!bookingDate}
                      >
                        {booking ? 'Creating Booking...' : 'Request to Book'}
                      </Button>

                      <p className="text-xs text-gray-400 text-center">
                        You won't be charged yet
                      </p>
                    </div>
                  ) : (
                    /* Payment Section */
                    <div className="space-y-4">
                    
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <FiAlertCircle className="text-green-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-200">Booking Created!</p>
                            <p className="text-sm text-green-300">
                              Please complete payment to confirm your booking.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                          <span>Amount to Pay</span>
                          <span className="text-amber-500">{formatCurrency(calculateTotalPrice())}</span>
                        </div>

                      
                        <PaymentButton
                          bookingId={createdBookingId!}
                          amount={calculateTotalPrice()}
                        />

                        <button
                          onClick={() => setShowPayment(false)}
                          className="w-full mt-3 text-sm text-gray-400 hover:text-amber-500"
                        >
                          Change booking details
                        </button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Trust Badges */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-amber-800">
                <h3 className="font-semibold mb-3 text-sm text-amber-500">Why book with us?</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <FiStar className="text-amber-500 mt-0.5" size={16} />
                    <span>Verified local guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiStar className="text-amber-500 mt-0.5" size={16} />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiStar className="text-amber-500 mt-0.5" size={16} />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiStar className="text-amber-500 mt-0.5" size={16} />
                    <span>Free cancellation (24h notice)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}