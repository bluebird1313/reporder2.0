/**
 * Main Supabase Client with Auth Helpers
 * Uses new SSR-compatible browser client
 */

import { supabase } from './supabase-browser'
import { authLogger } from './logger'

// Re-export the supabase client
export { supabase }

// Auth helper functions (updated to use structured logging)
export const auth = {
  // Sign up with role
  signUp: async (email: string, password: string, userData: {
    role: 'company' | 'rep',
    full_name?: string,
    company_name?: string,
    shop_domain?: string
  }) => {
    authLogger.info('Starting user registration', { email, role: userData.role })
    
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (result.error) {
      authLogger.error('Registration failed', result.error, { email })
    } else {
      authLogger.info('Registration successful', { email, userId: result.data.user?.id })
    }

    return result
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    authLogger.info('Starting user login', { email })
    
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (result.error) {
      authLogger.error('Login failed', result.error, { email })
    } else {
      authLogger.info('Login successful', { email, userId: result.data.user?.id })
    }

    return result
  },

  // Sign out
  signOut: async () => {
    authLogger.info('Starting user logout')
    
    const result = await supabase.auth.signOut()
    
    if (result.error) {
      authLogger.error('Logout failed', result.error)
    } else {
      authLogger.info('Logout successful')
    }
    
    return result
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Get user profile with role
  getUserProfile: async () => {
    authLogger.debug('Fetching user profile')
    
    const { data: { user } } = await supabase.auth.getUser()
    authLogger.debug('Current user retrieved', { userId: user?.id, email: user?.email })
    
    if (!user) {
      authLogger.debug('No user found, returning null')
      return null
    }

    authLogger.debug('Querying users table', { userId: user.id })
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      authLogger.error('Failed to fetch user profile', error, { userId: user.id })
      return null
    }

    if (!profile) {
      authLogger.warn('No profile found in database', { userId: user.id })
      return null
    }

    authLogger.debug('User profile retrieved successfully', { userId: user.id, role: profile.role })
    return profile
  },

  // Get user profile for a specific user (avoids circular dependency)
  getUserProfileForUser: async (user: any) => {
    authLogger.debug('Fetching profile for specific user', { userId: user?.id })
    
    if (!user) {
      authLogger.debug('No user provided, returning null')
      return null
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      authLogger.error('Failed to fetch user profile for user', error, { userId: user.id })
      return null
    }

    if (!profile) {
      authLogger.warn('No profile found for user', { userId: user.id })
      return null
    }

    authLogger.debug('Profile retrieved for user', { userId: user.id, role: profile.role })
    return profile
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    authLogger.debug('Setting up auth state change listener')
    return supabase.auth.onAuthStateChange(callback)
  }
}

// User role checks
export const userRoles = {
  isCompany: async () => {
    const profile = await auth.getUserProfile()
    return profile?.role === 'company'
  },

  isRep: async () => {
    const profile = await auth.getUserProfile()
    return profile?.role === 'rep'
  },

  getRole: async () => {
    const profile = await auth.getUserProfile()
    return profile?.role || null
  }
} 