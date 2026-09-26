/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User, Listing, Booking } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FiUsers, FiMap, FiCalendar, FiDollarSign, FiTrash2, FiEdit2, FiTrendingUp, FiActivity } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import DarkCard, { DarkCardBody } from '@/components/ui/Card2';
import Loading from '@/components/shared/Loading';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Helper function for Role Badge styling
const getRoleBadgeClasses = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-amber-900/50 text-amber-300';
    case 'GUIDE':
      return 'bg-blue-900/50 text-blue-300';
    case 'TOURIST':
    default:
      return 'bg-green-900/50 text-green-300';
  }
};

// Helper function for Booking Status Badge styling
const getStatusBadgeClasses = (status: string) => {
    switch (status) {
        case 'CONFIRMED':
            return 'bg-green-900/50 text-green-300';
        case 'PENDING':
            return 'bg-yellow-900/50 text-yellow-300';
        case 'COMPLETED':
            return 'bg-amber-900/50 text-amber-300';
        case 'CANCELLED':
        default:
            return 'bg-red-900/50 text-red-300';
    }
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'bookings' | 'revenue'>('users');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      toast.error('Admin access required');
      return;
    }
    fetchData();
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      const [usersRes, listingsRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/listings'),
        api.get('/bookings'),
      ]);
      setUsers(usersRes.data.data);
      setListings(listingsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
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

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      setEditingUserId(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const startEditingRole = (userId: string, currentRole: string) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const cancelEditingRole = () => {
    setEditingUserId(null);
    setSelectedRole('');
  };

  // Revenue Analytics Calculations
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const completedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');

  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const confirmedRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const todayRevenue = completedBookings
    .filter(b => new Date(b.bookingDate) >= todayStart)
    .reduce((sum, b) => sum + b.totalAmount, 0);
  
  const weekRevenue = completedBookings
    .filter(b => new Date(b.bookingDate) >= weekStart)
    .reduce((sum, b) => sum + b.totalAmount, 0);
  
  const monthRevenue = completedBookings
    .filter(b => new Date(b.bookingDate) >= monthStart)
    .reduce((sum, b) => sum + b.totalAmount, 0);
  
  const yearRevenue = completedBookings
    .filter(b => new Date(b.bookingDate) >= yearStart)
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const averageBookingValue = completedBookings.length > 0 
    ? totalRevenue / completedBookings.length 
    : 0;

  // Top Guides by Revenue
  const guideRevenue = completedBookings.reduce((acc, booking) => {
    const guideId = booking.guide?.id;
    if (guideId) {
      acc[guideId] = (acc[guideId] || 0) + booking.totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topGuides = Object.entries(guideRevenue)
    .map(([guideId, revenue]) => ({
      guide: bookings.find(b => b.guide?.id === guideId)?.guide,
      revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top Tours by Revenue
  const tourRevenue = completedBookings.reduce((acc, booking) => {
    const listingId = booking.listing?.id;
    if (listingId) {
      acc[listingId] = (acc[listingId] || 0) + booking.totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topTours = Object.entries(tourRevenue)
    .map(([listingId, revenue]) => ({
      listing: bookings.find(b => b.listing?.id === listingId)?.listing,
      revenue,
      bookings: completedBookings.filter(b => b.listing?.id === listingId).length
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) return <Loading />;
  
  // Custom Card component for stats
  const AdminStatCard = ({ icon: Icon, title, value, subtext }: { icon: React.ElementType, title: string, value: string | number, subtext: ReactNode }) => (
    <DarkCard hover={true} className="shadow-lg">
      <DarkCardBody className="text-center">
        <Icon className="mx-auto text-amber-500 mb-2" size={32} />
        <div className="text-3xl font-extrabold text-gray-50 mb-1">{value}</div>
        <div className="text-gray-400">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{subtext}</div>
      </DarkCardBody>
    </DarkCard>
  );

  // Tab Button Class Helper
  const TabButton = ({ tab, label, count }: { tab: typeof activeTab, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base w-full sm:w-auto ${
        activeTab === tab
          ? 'bg-amber-600 text-gray-900 shadow-lg shadow-amber-500/30'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-amber-500 border border-gray-700'
      }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-amber-500 mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage platform users, listings, and financial data</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <AdminStatCard 
            icon={FiUsers} 
            title="Total Users" 
            value={users.length} 
            subtext={
              <>
                <span className="text-blue-400">{users.filter((u) => u.role === 'GUIDE').length} Guides</span> •{' '}
                <span className="text-green-400">{users.filter((u) => u.role === 'TOURIST').length} Tourists</span>
              </>
            }
          />

          <AdminStatCard 
            icon={FiMap} 
            title="Total Tours" 
            value={listings.length} 
            subtext={
              <>
                <span className="text-amber-400">{listings.filter((l) => l.isActive).length} Active</span>
                {' / '}
                <span>{listings.filter((l) => !l.isActive).length} Drafts</span>
              </>
            }
          />

          <AdminStatCard 
            icon={FiCalendar} 
            title="Total Bookings" 
            value={bookings.length} 
            subtext={
              <>
                <span className="text-amber-400">{completedBookings.length} Completed</span>
              </>
            }
          />

          <AdminStatCard 
            icon={FiDollarSign} 
            title="Total Revenue" 
            value={formatCurrency(totalRevenue)} 
            subtext="From completed bookings"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <TabButton tab="users" label="Users" count={users.length} />
          <TabButton tab="listings" label="Listings" count={listings.length} />
          <TabButton tab="bookings" label="Bookings" count={bookings.length} />
          <TabButton tab="revenue" label="Revenue Analytics" />
        </div>

        {/* Revenue Analytics Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue by Period */}
            <DarkCard hover={false} className="shadow-xl">
              <DarkCardBody>
                <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                  <FiTrendingUp /> Revenue by Period
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Today</div>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(todayRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {completedBookings.filter(b => new Date(b.bookingDate) >= todayStart).length} bookings
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">This Week</div>
                    <div className="text-2xl font-bold text-blue-400">{formatCurrency(weekRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {completedBookings.filter(b => new Date(b.bookingDate) >= weekStart).length} bookings
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">This Month</div>
                    <div className="text-2xl font-bold text-purple-400">{formatCurrency(monthRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {completedBookings.filter(b => new Date(b.bookingDate) >= monthStart).length} bookings
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">This Year</div>
                    <div className="text-2xl font-bold text-amber-400">{formatCurrency(yearRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {completedBookings.filter(b => new Date(b.bookingDate) >= yearStart).length} bookings
                    </div>
                  </div>
                </div>
              </DarkCardBody>
            </DarkCard>

            {/* Revenue by Status */}
            <DarkCard hover={false} className="shadow-xl">
              <DarkCardBody>
                <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                  <FiActivity /> Revenue by Booking Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-400">Completed</div>
                      <span className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-xs font-semibold">
                        {completedBookings.length} bookings
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-400">{formatCurrency(totalRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Avg: {formatCurrency(averageBookingValue)}
                    </div>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-400">Confirmed</div>
                      <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold">
                        {confirmedBookings.length} bookings
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{formatCurrency(confirmedRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-2">Expected revenue</div>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-400">Pending</div>
                      <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-xs font-semibold">
                        {pendingBookings.length} bookings
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{formatCurrency(pendingRevenue)}</div>
                    <div className="text-xs text-gray-500 mt-2">Awaiting confirmation</div>
                  </div>
                </div>
              </DarkCardBody>
            </DarkCard>

            {/* Top Performing Guides & Tours */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Guides */}
              <DarkCard hover={false} className="shadow-xl">
                <DarkCardBody>
                  <h2 className="text-xl font-bold text-amber-500 mb-4">Top 5 Guides by Revenue</h2>
                  <div className="space-y-3">
                    {topGuides.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-amber-500">#{index + 1}</div>
                          <div>
                            <Link href={`/profile/${item.guide?.id}`} className="font-semibold text-gray-100 hover:text-amber-500">
                              {item.guide?.name}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {completedBookings.filter(b => b.guide?.id === item.guide?.id).length} completed bookings
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(item.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </DarkCardBody>
              </DarkCard>

              {/* Top Tours */}
              <DarkCard hover={false} className="shadow-xl">
                <DarkCardBody>
                  <h2 className="text-xl font-bold text-amber-500 mb-4">Top 5 Tours by Revenue</h2>
                  <div className="space-y-3">
                    {topTours.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-amber-500">#{index + 1}</div>
                          <div>
                            <Link href={`/tours/${item.listing?.id}`} className="font-semibold text-gray-100 hover:text-amber-500">
                              {item.listing?.title}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {item.bookings} completed bookings
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(item.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </DarkCardBody>
              </DarkCard>
            </div>
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <DarkCard hover={false} className="shadow-xl"> 
            <DarkCardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-700 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={u.profilePic || `https://ui-avatars.com/api/?name=${u.name}&background=fde68a&color=78350f`}
                              alt={u.name}
                              className="w-10 h-10 rounded-full mr-3 border border-amber-500/50"
                            />
                            <div>
                              <div className="font-medium text-gray-100">{u.name}</div>
                              <Link href={`/profile/${u.id}`} className="text-xs text-amber-500 hover:underline">
                                View Profile
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUserId === u.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-gray-800 text-gray-100 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-500"
                              >
                                <option value="TOURIST">TOURIST</option>
                                <option value="GUIDE">GUIDE</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              <button
                                onClick={() => handleUpdateUserRole(u.id, selectedRole)}
                                className="text-green-400 hover:text-green-300 text-xs font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingRole}
                                className="text-red-400 hover:text-red-300 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClasses(u.role)}`}>
                                {u.role}
                              </span>
                              {u.id !== user?.id && (
                                <button
                                  onClick={() => startEditingRole(u.id, u.role)}
                                  className="text-amber-500 hover:text-amber-400"
                                  title="Edit role"
                                >
                                  <FiEdit2 size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === user?.id}
                            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiTrash2 />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DarkCardBody>
          </DarkCard>
        )}

        {/* Listings Tab Content */}
        {activeTab === 'listings' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <DarkCard key={listing.id} hover={true} className="shadow-xl">
                <img
                  src={listing.images[0] || '/placeholder.jpg'}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <DarkCardBody>
                  <h3 className="font-bold text-xl mb-2 text-amber-500">{listing.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{listing.city} • {listing.category}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 border-t border-gray-700 pt-3">
                    <span className="text-2xl font-extrabold text-green-400">
                      {formatCurrency(listing.tourFee)}
                    </span>
                    <span className="text-xs text-gray-500">by <Link href={`/profile/${listing.guide.id}`} className="text-blue-400 hover:underline">{listing.guide.name}</Link></span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-gray-900"
                      onClick={() => router.push(`/tours/${listing.id}`)}
                    >
                      View Tour
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </DarkCardBody>
              </DarkCard>
            ))}
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <DarkCard hover={false} className="shadow-xl">
            <DarkCardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tourist</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Guide</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-100">
                          {booking.listing?.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          <Link href={`/profile/${booking.tourist?.id}`} className="hover:text-amber-500">
                            {booking.tourist?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          <Link href={`/profile/${booking.guide?.id}`} className="hover:text-amber-500">
                            {booking.guide?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDate(booking.bookingDate)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-400">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DarkCardBody>
          </DarkCard>
        )}
      </div>
    </div>
  );
}