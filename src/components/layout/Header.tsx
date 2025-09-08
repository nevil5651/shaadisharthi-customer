'use client'
import { useAuth } from '@/context/useAuth';
import { useState, useCallback, memo } from 'react';
import { 
  FaBell, 
  FaShoppingBag, 
  FaUser,
  FaRing
} from 'react-icons/fa';
import Link from 'next/link'; // Added import

const NotificationDropdown = memo(({ notifOpen }: { notifOpen: boolean }) => {
  if (!notifOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
      {/* Notification content */}
    </div>
  );
});

NotificationDropdown.displayName = 'NotificationDropdown';

const UserDropdown = memo(({ 
  userMenuOpen, 
  logout, 
  isLoggingOut 
}: { 
  userMenuOpen: boolean; 
  logout: () => void;
  isLoggingOut: boolean;
}) => {
  if (!userMenuOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-lg py-2 z-50">
      <Link href="/account" className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        My Profile
      </Link>
      <Link href="/bookings" className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        My Bookings
      </Link>
      <div className="border-t border-gray-200 my-1"></div>
      <button
        onClick={logout}
        disabled={isLoggingOut}
        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
});

UserDropdown.displayName = 'UserDropdown';

function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth();

  // Memoize click handlers to prevent unnecessary re-renders
  const toggleNotif = useCallback(() => setNotifOpen(prev => !prev), []);
  const toggleUserMenu = useCallback(() => setUserMenuOpen(prev => !prev), []);

  return (
    <header className="dashboard-header sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900 dark:text-white dark:shadow-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaRing className="text-pink-500 text-3xl mr-2" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
                ShaadiSharthi
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              Vendors
            </Link>
            <Link href="/bookings" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              My Bookings
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 relative"
                onClick={toggleNotif}
                aria-label="Notifications"
              >
                <FaBell className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <NotificationDropdown notifOpen={notifOpen} />
            </div>

            {/* <div className=" top-4 right-4">
              <ThemeToggle />
            </div> */}

            <Link href="/cart" className="text-gray-600 dark:text-gray-300 hover:text-pink-500" aria-label="Shopping Cart">
              <FaShoppingBag className="text-xl" />
            </Link>

            <div className="relative">
              <button 
                className="user-avatar cursor-pointer flex items-center space-x-2"
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <span className="hidden md:inline text-gray-700 dark:text-gray-300">My Account</span>
              </button>

              <UserDropdown 
                userMenuOpen={userMenuOpen} 
                logout={logout} 
                isLoggingOut={isLoggingOut} 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);