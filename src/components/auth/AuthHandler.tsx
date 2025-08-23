'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/useAuth'
import { usePathname } from 'next/navigation'

export default function AuthHandler() {
  const { user, fetchProfile } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Refresh user data when navigating to account-related pages
    const shouldRefresh = [
      '/dashboard',
      '/account',
      '/profile',
      '/settings'
    ].some(path => pathname.startsWith(path))
    
    if (shouldRefresh && user) {
      // Use a shorter cache time for account-related pages
      const cacheKey = 'user_cache'
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        const { timestamp } = JSON.parse(cached)
        // Refresh if cache is older than 1 minute for account pages
        if (Date.now() - timestamp > 60 * 1000) {
          fetchProfile(true)
        }
      } else {
        fetchProfile(true)
      }
    }
  }, [pathname, user, fetchProfile])

  return null
}