'use client'
import { useAuth } from '@/context/useAuth';
import { useState } from 'react';
import { 
  FaBell, 
  FaShoppingBag, 
  FaUser,
  FaRing
} from 'react-icons/fa';

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAuth()

  return (
    <header className="dashboard-header sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <FaRing className="text-pink-500 text-3xl mr-2" />
              <span className="text-2xl font-bold text-gray-800 font-serif">
                ShaadiSharthi
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/dashboard" className="text-gray-700 hover:text-pink-500 font-medium">
              Home
            </a>
            <a href="/services" className="text-gray-700 hover:text-pink-500 font-medium">
              Vendors
            </a>
            <a href="/bookings" className="text-gray-700 hover:text-pink-500 font-medium">
              My Bookings
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                className="text-gray-600 hover:text-pink-500 relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <FaBell className="text-xl" />
                <span className="notification-badge bg-pink-500 text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                  {/* Notification content */}
                </div>
              )}
            </div>

            <a href="/cart" className="text-gray-600 hover:text-pink-500">
              <FaShoppingBag className="text-xl" />
            </a>

            <div className="relative">
              <button 
                className="user-avatar cursor-pointer flex items-center space-x-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <span className="hidden md:inline text-gray-700">My Account</span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <a href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Profile
                  </a>
                  <a href="/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}