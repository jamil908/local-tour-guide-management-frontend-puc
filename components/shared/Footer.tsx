// components/Footer.tsx
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  
  const linkHoverClass = "hover:text-amber-500 transition duration-150";

  return (
    // Keep the dark background
    <footer className="bg-gray-900 text-gray-300 border-t border-amber-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About */}
          <div>
            {/* --- DESIGN CHANGE 1: Amber Logo --- */}
            <h3 className="text-xl font-bold mb-4 text-amber-500">🗺️ LocalGuide</h3>
            <p className="text-gray-400 text-sm">
              Connect with passionate local experts for authentic travel experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            {/* --- DESIGN CHANGE 2: Link Titles in Lighter Color --- */}
            <h4 className="font-semibold mb-4 text-gray-50">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className={`text-gray-400 ${linkHoverClass}`}>
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link href="/register?role=guide" className={`text-gray-400 ${linkHoverClass}`}>
                  Become a Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className={`text-gray-400 ${linkHoverClass}`}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-50">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className={`text-gray-400 ${linkHoverClass}`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-gray-400 ${linkHoverClass}`}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className={`text-gray-400 ${linkHoverClass}`}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-50">Follow Us</h4>
            <div className="flex space-x-4">
              {/* --- DESIGN CHANGE 3: Amber hover state for icons --- */}
              <a href="#" className={`text-gray-400 ${linkHoverClass}`}>
                <FiFacebook size={20} />
              </a>
              <a href="#" className={`text-gray-400 ${linkHoverClass}`}>
                <FiTwitter size={20} />
              </a>
              <a href="#" className={`text-gray-400 ${linkHoverClass}`}>
                <FiInstagram size={20} />
              </a>
              <a href="#" className={`text-gray-400 ${linkHoverClass}`}>
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LocalGuide Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}