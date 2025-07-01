import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create Supabase client for frontend use
// This client respects RLS policies and is used for user authentication
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Auth helper functions
export const auth = {
  // Sign up with role
  signUp: async (email: string, password: string, userData: {
    role: 'company' | 'rep',
    full_name?: string,
    company_name?: string,
    shop_domain?: string
  }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return profile
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
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