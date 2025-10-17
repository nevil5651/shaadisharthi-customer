'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const SESSION_CHECK_INTERVAL = 60000; // 1 minute
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function AuthHandler() {
  const { isAuthenticated, logout, fetchProfile } = useAuth();
  const pathname = usePathname();
  const inactivityTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const sessionCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    inactivityTimer.current = setTimeout(() => {
      console.log('Auto logout due to inactivity');
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  const checkSessionValidity = async () => {
    if (!isAuthenticated) return;

    try {
      await fetchProfile(true);
    } catch (error) {
      console.error('Session validation failed, logging out:', error);
      logout();
    }
  };

  // Set up activity listeners for inactivity timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [isAuthenticated, logout]);

  // Set up periodic session checks
  useEffect(() => {
    if (!isAuthenticated) return;

    sessionCheckInterval.current = setInterval(checkSessionValidity, SESSION_CHECK_INTERVAL);

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [isAuthenticated]);

  // Check session on route changes
  useEffect(() => {
    if (isAuthenticated) {
      checkSessionValidity();
    }
  }, [pathname]);

  return null;
}