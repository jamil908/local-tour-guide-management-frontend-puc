/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserRole = 'TOURIST' | 'GUIDE' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePic?: string;
  bio?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  itinerary?: string;
  tourFee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
  category: string;
  city: string;
  isActive: boolean;
  guideId: string;
  guide: Partial<User>;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
 review?: Review; 
  id: string;
  bookingDate: string;
  status: BookingStatus;
  numberOfPeople: number;
  totalAmount: number;
  paymentStatus: string;
  transactionId?: string;
  touristId: string;
  tourist?: Partial<User>;
  guideId: string;
  guide?: Partial<User>;
  
  listingId: string;
  listing?: Listing;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  touristId: string;
  tourist: Partial<User>;
  listingId: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  itinerary?: string;
  tourFee: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  images: string[];
  category: string;
  city: string;
}

export interface CreateBookingData {
  listingId: string;
  guideId: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
}

export interface CreateReviewData {
  listingId: string;
  bookingId: string;
  rating: number;
  comment: string;
}