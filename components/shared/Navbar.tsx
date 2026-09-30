
// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiGlobe, FiBriefcase, FiAperture, FiSquare, FiHeadphones } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setIsOpen(false);
  };

  // Define shared link classes for the new theme
  const linkClasses = "text-gray-300 hover:text-amber-500 transition duration-150";
  const mobileLinkClasses = "block text-gray-300 hover:text-amber-500 py-2 transition duration-150";

  return (
    // --- DESIGN CHANGE 1: Dark background and subtle shadow ---
    <nav className="bg-gray-900 shadow-lg shadow-black/50 sticky top-0 z-50 border-b border-amber-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              {/* --- DESIGN CHANGE 2: Amber logo text --- */}
              <span className="text-2xl font-extrabold text-amber-500">🗺️ LocalGuide</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className={linkClasses}>
              Explore Tours
            </Link>
            <Link href="/about" className={linkClasses}>About</Link>
<Link href="/faq" className={linkClasses}>FAQ</Link>
<Link href="/contact" className={linkClasses}>Contact</Link>
            
            {!user ? (
              <>
                <Link href="/auth/register?role=guide" className={linkClasses}>
                  Become a Guide
                </Link>
                <Link href="/auth/login" className={linkClasses}>
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  // --- DESIGN CHANGE 3: Amber primary button style ---
                  className="bg-amber-600 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === 'TOURIST' && (
                  <Link href="/dashboard/tourist" className={linkClasses}>
                    My Bookings
                  </Link>
                )}
                {user.role === 'GUIDE' && (
                  <Link href="/dashboard/guide" className={linkClasses}>
                    <FiBriefcase className="inline mr-1" /> Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/dashboard/admin" className={linkClasses}>
                    <FiAperture className="inline mr-1" /> Admin Panel
                  </Link>
                )}
                
                {/* Profile Link */}
                <Link href={`/profile/${user.id}`} className={`flex items-center ${linkClasses} border-l border-gray-700 pl-4`}>
                  <FiUser className="mr-2" /> Profile
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-400 transition"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              // --- DESIGN CHANGE 4: White/Amber button icons ---
              className="text-gray-300 hover:text-amber-500"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          // --- DESIGN CHANGE 5: Mobile menu background ---
          <div className="md:hidden pb-4 bg-gray-900 border-t border-amber-900">
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                href="/explore" 
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                <FiGlobe className="inline mr-2" /> Explore Tours
              </Link>
              <Link 
              href="/faq"
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                <FiSquare className="inline mr-2" />Faq
              </Link>
              <Link 
                href="/contact" 
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                <FiHeadphones className="inline mr-2" /> Contact
              </Link>
              <Link href="/about">About</Link>

              {!user ? (
                <>
                  <Link 
                    href="/auth/register?role=guide" 
                    className={mobileLinkClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiBriefcase className="inline mr-2" /> Become a Guide
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className={mobileLinkClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiLogOut className="inline mr-2" /> Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    // Amber button style for mobile signup link
                    className="block text-center bg-amber-600 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-amber-500 transition mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Logged in links */}
                  {user.role === 'TOURIST' && (
                    <Link 
                      href="/dashboard/tourist" 
                      className={mobileLinkClasses}
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}
                  {user.role === 'GUIDE' && (
                    <Link 
                      href="/dashboard/guide" 
                      className={mobileLinkClasses}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/dashboard/admin" 
                      className={mobileLinkClasses}
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    href={`/profile/${user.id}`} 
                    className={mobileLinkClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="inline mr-2" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left text-red-500 hover:text-red-400 py-2">
                    <FiLogOut className="inline mr-2" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}