/* eslint-disable react/display-name */


/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  
  FiClock,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";
import Loading from "@/components/shared/Loading";
import toast from "react-hot-toast";
import ReviewModal from "@/components/ui/ReviewModal";


const AmberButton = ({ children, onClick, className, size, type, variant, ...props }: any) => {
  const baseStyle = "font-bold transition duration-200 ease-in-out rounded-lg";
  const sizeStyle = size === 'lg' ? 'px-8 py-3 text-lg' : size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-2.5 text-base';
  
  let colorStyle = "";
  if (variant === 'outline') {
    colorStyle = "border-2 border-amber-600 text-amber-400 hover:bg-amber-600/10 hover:text-white bg-gray-900";
  } else if (variant === 'danger') {
    colorStyle = "bg-red-700 text-white hover:bg-red-600";
  } else if (variant === 'secondary') {
    colorStyle = "bg-gray-700 text-gray-200 hover:bg-gray-600";
  } else {
    // Default/Primary Amber
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

// 2. Dark/Amber Card Component (Replacement for standard Card)
const DarkCard = ({ children, className, hover, ...props }: any) => {
  const hoverStyle = hover ? 'hover:shadow-amber-500/30 hover:border-amber-500 transition-all duration-300' : '';
  return (
    <div 
      className={`bg-gray-800 rounded-xl shadow-lg border border-gray-700 ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
DarkCard.CardBody = ({ children, className }: any) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
DarkCard.CardHeader = ({ children, className }: any) => (
  <div className={`p-6 border-b border-gray-700 ${className}`}>{children}</div>
);

// 3. Loading Component Style Update (Assuming Loading is passed as component)
const AmberLoading = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading /> {/* Assuming internal component handles spinner style */}
    </div>
)


export default function TouristDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  console.log(bookings)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (user?.role !== "TOURIST") {
      router.push("/");
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, router]); // Added router to dependency array for correctness

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: any) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      fetchBookings(); // Refresh bookings
    } catch (error: any) {
      toast.error('Failed to delete review');
    }
  };
const handleCancelBooking = async (bookingId: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    await api.patch(`/bookings/${bookingId}/cancel`);
    toast.success('Booking cancelled');
    fetchBookings();
  } catch (error: any) {
    toast.error('Failed to cancel booking');
  }
};
  const getStatusColor = (status: string) => {
    switch (status) {
      // Adjusted colors for Dark Theme contrast
      case "CONFIRMED":
        return "bg-green-700 text-white"; // Darker green for dark background
      case "PENDING":
        return "bg-yellow-700 text-white"; // Darker yellow for dark background
      case "COMPLETED":
        return "bg-amber-600 text-gray-900"; // Amber for completed
      case "CANCELLED":
        return "bg-red-700 text-white"; // Darker red for dark background
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const currentDate = new Date(); // Use current date for logic

  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.bookingDate) > currentDate && // Date is strictly in the future
      b.status !== "CANCELLED"
  );
  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.bookingDate) <= currentDate || // Date is in the past or today
      b.status === "COMPLETED" || // Or status is manually marked completed
      b.status === "CANCELLED"
  );

  
  if (loading) return <AmberLoading />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your upcoming and past tours</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DarkCard>
            <DarkCard.CardBody className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {upcomingBookings.length}
              </div>
              <div className="text-gray-300">Upcoming Tours</div>
            </DarkCard.CardBody>
          </DarkCard>

          <DarkCard>
            <DarkCard.CardBody className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {bookings.filter((b) => b.status === "COMPLETED").length}
              </div>
              <div className="text-gray-300">Completed</div>
            </DarkCard.CardBody>
          </DarkCard>

          <DarkCard>
            <DarkCard.CardBody className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {bookings.filter((b) => b.status === "PENDING").length}
              </div>
              <div className="text-gray-300">Pending</div>
            </DarkCard.CardBody>
          </DarkCard>

          <DarkCard>
            <DarkCard.CardBody className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {formatCurrency(
                  bookings
                    .filter((b) => b.status === "CONFIRMED")
                    .reduce((sum, b) => sum + b.totalAmount, 0)
                )}
              </div>
              <div className="text-gray-300">Total Spent</div>
            </DarkCard.CardBody>
          </DarkCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 font-semibold transition relative ${
              activeTab === "upcoming"
                ? "text-amber-400 border-b-2 border-amber-500" // Active style
                : "text-gray-400 hover:text-amber-300" // Inactive style
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 font-semibold transition relative ${
              activeTab === "past"
                ? "text-amber-400 border-b-2 border-amber-500" // Active style
                : "text-gray-400 hover:text-amber-300" // Inactive style
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {(activeTab === "upcoming" ? upcomingBookings : pastBookings)
            .length === 0 ? (
            <DarkCard>
              <DarkCard.CardBody className="text-center py-12">
                <div className="text-6xl mb-4 text-amber-500">🗺️</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No {activeTab} bookings
                </h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === "upcoming"
                    ? "Start exploring and book your next adventure!"
                    : "Your completed and cancelled bookings will appear here."}
                </p>
                {activeTab === "upcoming" && (
                  <Link href="/explore">
                    <AmberButton>Explore Tours</AmberButton>
                  </Link>
                )}
              </DarkCard.CardBody>
            </DarkCard>
          ) : (
            (activeTab === "upcoming" ? upcomingBookings : pastBookings).map(
              (booking) => (
                <DarkCard key={booking.id} hover>
                  <DarkCard.CardBody>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tour Image */}
                      <div className="md:w-64 flex-shrink-0">
                        <img
                          // eslint-disable-next-line @next/next/no-img-element
                          src={booking.listing?.images[0] || "/placeholder.jpg"}
                          alt={booking.listing?.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Link
                              href={`/tours/${booking.listingId}`}
                              className="text-xl font-bold text-white hover:text-amber-400 transition"
                            >
                              {booking.listing?.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>
                              {booking.paymentStatus === "COMPLETED" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-700 text-white">
                                  Paid
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400">
                              {formatCurrency(booking.totalAmount)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {booking.numberOfPeople}{" "}
                              {booking.numberOfPeople === 1
                                ? "person"
                                : "people"}
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 border-b border-gray-700 pb-4">
                          <div className="flex items-center gap-3 text-gray-400">
                            <FiCalendar className="text-amber-500" />
                            <div>
                              <div className="text-sm text-gray-500">Date</div>
                              <div className="font-semibold text-gray-200">
                                {formatDate(booking.bookingDate)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-400">
                            <FiMapPin className="text-amber-500" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Location
                              </div>
                              <div className="font-semibold text-gray-200">
                                {booking.listing?.city}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-400">
                            <FiUser className="text-amber-500" />
                            <div>
                              <div className="text-sm text-gray-500">Guide</div>
                              <div className="font-semibold text-gray-200">
                                {booking.guide?.name}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-400">
                            <FiClock className="text-amber-500" />
                            <div>
                              <div className="text-sm text-gray-500">
                                Duration
                              </div>
                              <div className="font-semibold text-gray-200">
                                {booking.listing?.duration} hours
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <Link href={`/tours/${booking.listingId}`} passHref>
                            <AmberButton variant="outline" size="sm" className="flex items-center">
                              View Tour
                              <FiChevronRight className="ml-1" />
                            </AmberButton>
                          </Link>

                          {/* Write, Edit, or Delete Review Logic (Primarily for Past/Completed Tours) */}
                          {booking.review ? (
                            // Has Review: Show Edit & Delete
                            <>
                              <AmberButton
                                variant="secondary"
                                size="sm"
                                onClick={(e: any) => {
                                    e.preventDefault(); // Prevent Card Link from activating
                                    setSelectedBooking(booking);
                                    setReviewModalOpen(true);
                                }}
                                className="flex items-center"
                              >
                                <FiStar className="mr-2 text-yellow-300 fill-current" />
                                Edit Review
                              </AmberButton>
                              <AmberButton
                                variant="danger"
                                size="sm"
                                onClick={(e: any) => {
                                    e.preventDefault(); // Prevent Card Link from activating
                                    handleDeleteReview(booking?.review?.id);
                                }}
                              >
                                Delete Review
                              </AmberButton>
                            </>
                          ) : (
                            // No Review: Check if it's eligible for 'Write Review'
                            (new Date(booking.bookingDate) <= currentDate && // Only if the tour date has passed
                              booking.status !== "CANCELLED") && ( // And it wasn't cancelled
                              <AmberButton
                                size="sm"
                                onClick={(e: any) => {
                                    e.preventDefault(); // Prevent Card Link from activating
                                    setSelectedBooking(booking);
                                    setReviewModalOpen(true);
                                }}
                                className="flex items-center"
                              >
                                <FiStar className="mr-2" />
                                Write Review
                              </AmberButton>
                            )
                          )}

                          {/* PENDING / Cancel Logic */}
                          {booking.status === "PENDING" && (
                            <AmberButton variant="danger" size="sm"     onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </AmberButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </DarkCard.CardBody>
                </DarkCard>
              )
            )
          )}
        </div>
      </div>

      {/* Review Modal - Kept as per your original code block */}
      {selectedBooking && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          listingId={selectedBooking.listingId}
          listingTitle={selectedBooking.listing?.title || 'Tour'}
          existingReview={selectedBooking.review || null}
          mode={selectedBooking.review ? 'edit' : 'create'}
          onReviewSubmitted={() => { 
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}