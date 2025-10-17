'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const SESSION_CHECK_INTERVAL = 60000; // 1 minute
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function AuthHandler() {
  const { isAuthenticated, logout, fetchProfile } = useAuth();
  const pathname = usePathname();
  const inactivityTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const sessionCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      console.log('Auto logout due to inactivity');
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  const checkSessionValidity = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await fetchProfile(true);
    } catch (error) {
      console.error('Session validation failed, logging out:', error);
      logout();
    }
  }, [isAuthenticated, fetchProfile, logout]);

  // Set up activity listeners for inactivity timeout
  useEffect(() => {
    if (!isAuthenticated || typeof document === 'undefined') return;

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
  }, [isAuthenticated, resetInactivityTimer]);

  // Set up periodic session checks
  useEffect(() => {
    if (!isAuthenticated) return;

    sessionCheckInterval.current = setInterval(
      checkSessionValidity,
      SESSION_CHECK_INTERVAL,
    );

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [isAuthenticated, checkSessionValidity]);

  // Check session on route changes
  useEffect(() => {
    checkSessionValidity();
  }, [pathname, checkSessionValidity]);

  return null;
}