'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/useAuth'
import { usePathname } from 'next/navigation'

// Constants for better maintainability and clarity
const ACCOUNT_RELATED_PATHS = [
  '/dashboard',
  '/account'
]
const USER_CACHE_KEY = 'user_profile_cache'
const CACHE_EXPIRATION_MS = 60 * 1000 // 1 minute

export default function AuthHandler() {
  const { user, fetchProfile } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // This component is only concerned with refreshing the user profile on navigation.
    // It should only run if a user is logged in.
    if (!user) {
      return
    }

    const isAccountPage = ACCOUNT_RELATED_PATHS.some(path =>
      pathname.startsWith(path)
    )

    if (!isAccountPage) {
      return
    }

    const refreshProfile = async () => {
      try {
        console.log('AuthHandler: Refreshing user profile...');
        await fetchProfile(true) // Force refresh
        // Update cache timestamp after successful fetch
        const cacheData = { timestamp: Date.now() }
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cacheData))
      } catch (error) {
        console.error('Failed to refresh user profile:', error)
      }
    }

    const cachedItem = localStorage.getItem(USER_CACHE_KEY)
    if (!cachedItem) {
      // No cache, fetch immediately
      //console.log('AuthHandler: No user profile cache found. Fetching profile.');
      refreshProfile()
      return
    }

    try {
      const parsedCache = JSON.parse(cachedItem)
      const timestamp = parsedCache?.timestamp

      if (typeof timestamp !== 'number') {
        // Invalid cache format, fetch again
        // console.warn('AuthHandler: Invalid user profile cache format. Refreshing profile.', parsedCache);
        refreshProfile()
        return
      }

      // Refresh if cache is older than the defined expiration time
      if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
       // console.log(`AuthHandler: User profile cache is stale (older than ${CACHE_EXPIRATION_MS / 1000}s). Refreshing.`);
        refreshProfile()
      }
    } catch (error) {
      // Error parsing cache, likely invalid format. Refresh to be safe.
      console.error('Failed to parse user cache:', error)
      refreshProfile()
    }
  }, [pathname, user, fetchProfile])

  return null
}