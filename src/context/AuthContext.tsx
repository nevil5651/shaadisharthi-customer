// context/AuthContext.tsx
'use client'

import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/lib/auth-routes";

interface User {
  id: string
  name: string
  email: string
  phone_no: string
  address?: string
  created_at: string
  avatar?: string
}

interface Credentials {
  [key: string]: string;
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isLoggingOut: boolean
  login: (credentials: Credentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (updatedData: Partial<User>) => Promise<void>
  fetchProfile: (forceRefresh?: boolean) => Promise<void>
  updateAccountDetails: (updatedData: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache management
const USER_CACHE_KEY = 'user_cache'
const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname();
  const fetchInProgress = useRef(false)

  // Cache helpers
  const getCachedUser = (): { user: User, timestamp: number } | null => {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }

  const setCachedUser = (user: User) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
      user,
      timestamp: Date.now()
    }))
  }

  const clearCachedUser = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_CACHE_KEY)
  }

  const logout = useCallback(async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      // Call logout API but don't wait too long
      const logoutPromise = fetch('api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Timeout after 3 seconds to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 3000)
      );

      await Promise.race([logoutPromise, timeoutPromise]);
      
      // Clear client state regardless of backend response
      setUser(null)
      clearCachedUser()
      
      // Set logout status for login page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logout_status', 'success')
      }
      
      // Redirect to login
      router.push('/login')
      toast.success('Logged out successfully')
      
    } catch (error) {
      console.error('Logout error:', error)
      // Even on error, clear client state and redirect
      setUser(null)
      clearCachedUser()
      router.push('/login')
      toast.error('Logout out successful')
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut]);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (fetchInProgress.current) return
    
    // Don't fetch profile on public routes
    if (publicRoutes.includes(pathname)) {
      setUser(null)
      setIsLoading(false)
      return
    }

    fetchInProgress.current = true
    setIsLoading(true)

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedUser()
        if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
          setUser(cached.user)
          setIsLoading(false)
          fetchInProgress.current = false
          return
        }
      }

      const res = await fetch('/customer/api/auth/me', {
        credentials: 'include',
        cache: forceRefresh ? 'no-cache' : 'default',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      // Handle token-secured routes
      const isTokenSecuredRoute = typeof window !== 'undefined' && 
        (window.location.pathname === '/register' || window.location.pathname === '/reset-password') && 
        new URLSearchParams(window.location.search).has('token')

      if (res.status === 401 && !isTokenSecuredRoute) {
        await logout()
        return
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`)
      }

      const userData = await res.json()
      setUser(userData)
      setCachedUser(userData)
    } catch (error) {
      console.error('Profile fetch error:', error)
      
      const isTokenSecuredRoute = typeof window !== 'undefined' && 
        (window.location.pathname === '/register' || window.location.pathname === '/reset-password') && 
        new URLSearchParams(window.location.search).has('token')

      if (!isTokenSecuredRoute) {
        // Only throw error for non-token routes
        throw error
      }
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [pathname, logout])

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
      if (!apiUrl) {
        throw new Error("API URL is not configured")
      }

      const backendRes = await fetch(`${apiUrl}/Customer/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!backendRes.ok) {
        const errorData = await backendRes.json()
        return { success: false, error: errorData.message || 'Authentication failed' }
      }

      const { token } = await backendRes.json()

      // Create session with the token
      const sessionRes = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!sessionRes.ok) {
        return { success: false, error: 'Failed to create session' }
      }

      // Fetch user profile
      await fetchProfile(true)
      
      // Redirect to dashboard or returnUrl
      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = urlParams.get('returnUrl') || '/dashboard'
      router.push(returnUrl)
      
      toast.success('Logged in successfully')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [fetchProfile, router])

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const newUser = {
        ...prev,
        ...updatedData,
        name: updatedData.name || prev.name,
        email: prev.email // Keep original email
      }
      setCachedUser(newUser)
      return newUser
    })
  }, [])

  const updateAccountDetails = useCallback(async (updatedData: Partial<User>) => {
    try {
      setIsLoading(true)
      
      // Remove email if present (shouldn't be editable)
      const { email, ...updatePayload } = updatedData
      
      const response = await fetch('api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update account')
      }

      const responseData = await response.json()
      const updatedUser = responseData.data || responseData
      
      setUser(updatedUser)
      setCachedUser(updatedUser)
      
      return { success: true }
    } catch (error) {
      console.error('Update account error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchProfile().catch(() => {
      // Error handled in fetchProfile
    })
  }, [fetchProfile])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isLoggingOut,
    login,
    logout,
    updateUser,
    updateAccountDetails,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}