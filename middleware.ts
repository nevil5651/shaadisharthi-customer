// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/session';

// Security headers for all responses
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};

const protectedRoutes = ['/dashboard', '/service-detail', '/services', '/bookings', '/account', '/service-booking'];
const publicRoutes = ['/login', '/signup', '/verify-email', '/register', '/cstmr-verify-email', '/forgot-password', '/reset-password'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  // Apply security headers to all responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Check for token-secured routes (register/reset-password with token)
  const isRegisterWithToken = path === '/register' && searchParams.has('token');
  const isResetPasswordWithToken = path === '/reset-password' && searchParams.has('token');
  const isTokenSecuredRoute = isRegisterWithToken || isResetPasswordWithToken;

  // Allow token-secured routes without session validation
  if (isTokenSecuredRoute) {
    return response;
  }

  // Validate session for other routes
  const { isValid: hasValidSession } = await validateSession();
  
  const isProtectedRoute = protectedRoutes.some(prefix => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect to login if accessing protected route without valid session
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('returnUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing public route with valid session
  if (isPublicRoute && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};