'use client'

import React, { createContext, useState, useEffect, useRef, useCallback } from 'react'
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

// Cache key for localStorage
const USER_CACHE_KEY = 'user_cache'
const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname();
  const fetchInProgress = useRef(false) // To prevent concurrent fetches

  // Helper functions for cache management
  const getCachedUser = (): { user: User, timestamp: number } | null => {
    if (typeof window === 'undefined') return null
    const cached = localStorage.getItem(USER_CACHE_KEY)
    if (!cached) return null
    
    try {
      return JSON.parse(cached)
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
  if (isLoggingOut) return // Prevent multiple clicks

  setIsLoggingOut(true)
  const toastId = toast.loading('Logging out...')

  try {
    // Then attempt to call the logout API
    await fetch('api/auth/logout', {
      method: 'POST',
      credentials: 'include' // Ensure cookies are sent
    })
    
    // On success, set a flag for the login page to show the success toast
    // and redirect immediately. The loading toast will disappear with the page.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('logout_status', 'success')
    }
    
    setUser(null)
    clearCachedUser()
    // window.location.assign('login')
    router.push('/login')
    toast.update(toastId, { render: 'Logged out successfully', type: 'success', isLoading: false, autoClose: 3000 })
    setIsLoggingOut(false)
    
  } catch (error) {
    console.error('Logout error:', error)
    // On failure, just show an error and allow the user to retry.
    toast.update(toastId, { render: 'Logout failed. Please try again.', type: 'error', isLoading: false, autoClose: 3000 })
    setIsLoggingOut(false) // Re-enable the button
  }
}, [isLoggingOut, router]);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current) return
    if (publicRoutes.includes(pathname)) {
        setUser(null);
        setIsLoading(false);
        return;
      }
    fetchInProgress.current = true
    
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cached = getCachedUser()
        if (cached && Date.now() - cached.timestamp < CACHE_MAX_AGE) {
          setUser(cached.user)
          setIsLoading(false)
          fetchInProgress.current = false
          return
        }
      }

      const res = await fetch('api/auth/me', {
        credentials: 'include',
        cache: forceRefresh ? 'no-cache' : 'default'
      })
      
      // Don't redirect if we're on register page with token
      const isRegisterWithToken = typeof window !== 'undefined' && 
        window.location.pathname === '/register' && 
        new URLSearchParams(window.location.search).has('token')

      const isResetPasswordWithToken = typeof window !== 'undefined' && 
        window.location.pathname === '/reset-password' && 
        new URLSearchParams(window.location.search).has('token')
      
      
      if (res.status === 401 && !isRegisterWithToken && !isResetPasswordWithToken) {
        await logout()
        router.push('/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch profile')

      const userData = await res.json()
      setUser(userData)
      setCachedUser(userData) // Update cache
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      // Don't throw error for register page with token
      const isRegisterWithToken = typeof window !== 'undefined' && 
        window.location.pathname === '/register' && 
        new URLSearchParams(window.location.search).has('token')

      const isResetPasswordWithToken = typeof window !== 'undefined' && 
        window.location.pathname === '/reset-password' && 
        new URLSearchParams(window.location.search).has('token')

      if (!isRegisterWithToken && !isResetPasswordWithToken) {
        throw error
      }
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [pathname, router, logout]);

  useEffect(() => {
    // Initial load - check if user is logged in
    fetchProfile().catch(() => {/* Error handled in fetchProfile */})
  }, [fetchProfile])

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

      const sessionRes = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!sessionRes.ok) return { success: false, error: 'Failed to create session' }

      router.push('/dashboard')
      toast.success('Logged in successfully')
      fetchProfile(true).catch(error => console.error('Background profile fetch failed:', error))
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }, [fetchProfile, router]);

  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const newUser = {
        ...prev,
        ...updatedData,
        name: updatedData.name || prev.name,
        email: prev.email // Always keep original email
      }
      setCachedUser(newUser) // Update cache
      return newUser
    })
  }, []);

  const updateAccountDetails = useCallback(async (updatedData: Partial<User>) => {
  try {
    setIsLoading(true)
    
    // Remove email if present (shouldn't be editable)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    
    // Handle both response formats (direct user object or wrapped response)
    const updatedUser = responseData.data || responseData
    
    // Update both state and cache
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
}, []);

  const value = {
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