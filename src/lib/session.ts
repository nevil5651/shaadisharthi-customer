import 'server-only';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';


interface SessionPayload {
  sub: string; //  customerId
  iat: number; // Issued at (in seconds)
  exp: number; // Expiration time (in seconds since epoch)
}

/**
 * Decodes the JWT and checks if it's expired.
 * Does NOT verify the signature, as that's the backend's responsibility.
 * @param token The JWT string from the cookie.
 * @returns The decoded payload if the token is valid and not expired, otherwise null.
 */
function getPayloadFromToken(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }
  try {
    const payload = decodeJwt<SessionPayload>(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // Check if the token is expired
    if (payload.exp < nowInSeconds) {
      console.log('Token expired');
      return null;
    }

    return payload;
  } catch (error) {
    // This can be because the token is malformed
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Sets the session cookie after a successful login.
 * @param token The JWT received from the Java backend.
 */
export async function createSession(token: string) {
  const payload = getPayloadFromToken(token);

  if (!payload || !payload.exp) {
    // Don't set a cookie if the token is invalid or has no expiration
    console.error('Cannot create session: Invalid token or no expiration time.');
    return;
  }

  // The 'exp' claim is in seconds, but cookies().set wants a Date object for 'expires'.
  const expiresAt = new Date(payload.exp * 1000);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Deletes the session cookie upon logout.
 */
export async function deleteSession() {
  (await cookies()).delete('session');
}

/**
 * Gets the current session from the cookie.
 * Returns the payload if the session is valid and not expired.
 * @returns A simplified session object or null.
 */
export async function getSession() {
  const cookie = (await cookies()).get('session')?.value;
  const payload = getPayloadFromToken(cookie);

  if (!payload) {
    return null;
  }

  // We return a simplified object for the rest of the app to use.
  return {
    customerId: payload.sub, // Assuming 'sub' (subject) is the customer ID
  };
}


