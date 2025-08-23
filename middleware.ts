import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { publicRoutes } from "@/lib/auth-routes";


// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard','service-detail'];
// const publicRoutes = ['/login', '/signup','/verify-email', '/register', '/cstmr-verify-email', '/forgot-password', '/reset-password'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await getSession();

  // Check if this is a register page with valid token
  const isRegisterWithToken = path === '/register' && req.nextUrl.searchParams.has('token');
  const isResetPasswordWithToken = path === '/reset-password' && req.nextUrl.searchParams.has('token');

  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path) || isRegisterWithToken || isResetPasswordWithToken;
 

  // Allow register with token even without session
  if (isRegisterWithToken && !session) {
    return NextResponse.next();
  }
  // Allow reset password with token even without session
  if (isResetPasswordWithToken && !session) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session && !isRegisterWithToken && !isResetPasswordWithToken) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
