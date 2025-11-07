'use client';

import { useAuth } from '@/context/useAuth';
import { useState, useCallback, memo, useEffect, useRef } from 'react';
import {
  FaUser,
  FaRing,
  FaBell,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';

const NotificationDropdown = memo(({ 
  notifOpen, 
  messages, 
  onClear 
}: { 
  notifOpen: boolean; 
  messages: string[]; 
  onClear: () => void;
}) => {
  if (!notifOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold text-gray-800 dark:text-white">Notifications</h6>
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
            >
              <FaTimes className="text-xs" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto" id="notificationContainer">
        {messages.length === 0 ? (
          <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
            No new notifications
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <FaBell className="text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {msg}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Just now
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {messages.length > 10 && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
          <Link 
            href="/notifications" 
            className="text-sm text-pink-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
});

NotificationDropdown.displayName = 'NotificationDropdown';

const UserDropdown = memo(({ 
  userMenuOpen, 
  logout, 
  isLoggingOut,
  onClose
}: { 
  userMenuOpen: boolean; 
  logout: () => void;
  isLoggingOut: boolean;
  onClose: () => void;
}) => {
  if (!userMenuOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-lg py-2 z-50">
      <Link href="/account" onClick={onClose} className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        My Profile
      </Link>
      <Link href="/dashboard" onClick={onClose} className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        Dashboard
      </Link>
      <Link href="/services" onClick={onClose} className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        Vendors
      </Link>
      <Link href="/bookings" onClick={onClose} className="block px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        My Bookings
      </Link>
      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
      <button
        onClick={() => {
          logout();
          onClose();
        }}
        disabled={isLoggingOut}
        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white dark:hover:bg-gray-600 hover:bg-gray-100">
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
});

UserDropdown.displayName = 'UserDropdown';

function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const { logout, isLoggingOut } = useAuth();

  // Toggle handlers
  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prev => !prev);
    setNotifOpen(false);
  }, []);

  const toggleNotif = useCallback(() => {
    setNotifOpen(prev => !prev);
    setUserMenuOpen(false);
  }, []);

  const closeMenus = useCallback(() => {
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, []);

  const clearNotifications = useCallback(() => {
    setMessages([]);
    setUnreadCount(0);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-container') && !target.closest('.user-container')) {
        closeMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenus]);

  // WebSocket Connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6190/ShaadiSharthi/CustomerSocket");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const msg = event.data;
      setMessages(prev => [...prev, msg]);
      setUnreadCount(prev => prev + 1);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  return (
    <header className="dashboard-header sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900 dark:text-white">
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
            {/* Notification Bell */}
            <div className="relative notification-container">
              <button 
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 relative"
                onClick={toggleNotif}
                aria-label="Notifications"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown 
                notifOpen={notifOpen} 
                messages={messages} 
                onClear={clearNotifications}
              />
            </div>

            {/* User Menu */}
            <div className="relative user-container">
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
                onClose={closeMenus}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);