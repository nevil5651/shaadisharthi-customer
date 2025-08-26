'use client'
import { useAuth } from '@/context/useAuth';
import { useState, useCallback, memo } from 'react';
import { 
  FaBell, 
  FaShoppingBag, 
  FaUser,
  FaRing
} from 'react-icons/fa';

// Extract dropdown components to prevent unnecessary re-renders
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
        disabled={isLoggingOut}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
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
            <a href="/" className="flex items-center">
              <FaRing className="text-pink-500 text-3xl mr-2" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white font-serif">
                ShaadiSharthi
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              Home
            </a>
            <a href="/services" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              Vendors
            </a>
            <a href="/bookings" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 font-medium">
              My Bookings
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 relative"
                onClick={toggleNotif}
              >
                <FaBell className="text-xl" />
                <span className="notification-badge bg-pink-500 text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <NotificationDropdown notifOpen={notifOpen} />
            </div>

            <a href="/cart" className="text-gray-600 dark:text-gray-300 hover:text-pink-500">
              <FaShoppingBag className="text-xl" />
            </a>

            <div className="relative">
              <button 
                className="user-avatar cursor-pointer flex items-center space-x-2"
                onClick={toggleUserMenu}
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