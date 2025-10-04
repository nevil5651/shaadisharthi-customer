// lib/session.ts
import 'server-only';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

// Simple in-memory cache for session validation (resets on server restart)
const sessionCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

export async function validateSession(): Promise<{ isValid: boolean; payload: SessionPayload | null }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie?.value) {
    return { isValid: false, payload: null };
  }

  // Check cache first
  const cached = sessionCache.get(sessionCookie.value);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { isValid: true, payload: cached.payload };
  }

  try {
    const payload = decodeJwt<SessionPayload>(sessionCookie.value);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // Validate token expiration
    if (!payload.exp || payload.exp < nowInSeconds) {
      await deleteSession();
      return { isValid: false, payload: null };
    }

    // Cache valid session
    sessionCache.set(sessionCookie.value, {
      payload,
      timestamp: Date.now()
    });

    return { isValid: true, payload };
  } catch (error) {
    console.error('Session validation error:', error);
    await deleteSession();
    return { isValid: false, payload: null };
  }
}

export async function createSession(token: string): Promise<boolean> {
  try {
    const payload = decodeJwt<SessionPayload>(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < nowInSeconds) {
      console.error('Token expired or invalid expiration');
      return false;
    }

    const expiresAt = new Date(payload.exp * 1000);
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });

    // Cache the new session
    sessionCache.set(token, {
      payload,
      timestamp: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Session creation error:', error);
    return false;
  }
}

export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie?.value) {
      sessionCache.delete(sessionCookie.value);
    }
    
    cookieStore.delete('session');
  } catch (error) {
    console.error('Session deletion error:', error);
  }
}

export async function getSession() {
  const { isValid, payload } = await validateSession();
  
  if (!isValid || !payload) {
    return null;
  }

  return {
    customerId: payload.sub,
    expiresAt: payload.exp,
  };
}