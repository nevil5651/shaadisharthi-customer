'use client';
import { useAuth } from '@/context/useAuth';
import React from 'react';

// This component can be used on specific pages if you need to show a loading
// state while the client-side auth state is being confirmed.
// However, with the server-initialized context, this might not be needed often.
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // This is a client-side check. The primary redirect is handled by middleware.
    // You might not even need to redirect here if middleware is solid.
    // For now, we'll just return null or a message.
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
