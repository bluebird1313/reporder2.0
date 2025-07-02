'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth } from './supabase'
import { authLogger } from './logger'
import { Database } from './database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    role: 'company' | 'rep',
    full_name?: string,
    company_name?: string,
    shop_domain?: string
  }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  isCompany: boolean
  isRep: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        authLogger.debug('Getting initial session')
        const session = await auth.getSession()
        authLogger.info('Initial session retrieved', { hasSession: !!session, userEmail: session?.user?.email })
        setSession(session)
        setUser(session?.user || null)

        if (session?.user) {
          authLogger.debug('Loading user profile for initial session')
          const userProfile = await auth.getUserProfile()
          authLogger.info('Initial profile loaded', { role: userProfile?.role })
          setProfile(userProfile)
        }
      } catch (error) {
        authLogger.error('Failed to get initial session', error as Error)
      } finally {
        authLogger.debug('Initial session loading complete')
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    authLogger.debug('Setting up auth state change listener')
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      authLogger.info('Auth state change detected', { event, userId: session?.user?.id })
      
      // Set loading to true for any auth state change
      setLoading(true)
      
      setSession(session)
      setUser(session?.user || null)

      if (session?.user) {
        authLogger.debug('Fetching user profile', { userId: session.user.id })
        try {
          const userProfile = await auth.getUserProfileForUser(session.user)
          
          if (userProfile) {
            authLogger.info('Profile loaded successfully', { role: userProfile.role })
            setProfile(userProfile)
          } else {
            authLogger.warn('Profile not found for user')
            setProfile(null)
          }
        } catch (error) {
          authLogger.error('Failed to load user profile', error as Error)
          setProfile(null)
        }
      } else {
        authLogger.debug('No user session, clearing profile')
        setProfile(null)
      }

      authLogger.debug('Auth state change processing complete')
      setLoading(false)
    })

    authLogger.debug('Auth state change listener configured')

    return () => {
      authLogger.debug('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: {
    role: 'company' | 'rep',
    full_name?: string,
    company_name?: string,
    shop_domain?: string
  }) => {
    authLogger.info('Starting user sign up', { email, role: userData.role })
    return await auth.signUp(email, password, userData)
  }

  const signIn = async (email: string, password: string) => {
    authLogger.info('Starting user sign in', { email })
    return await auth.signIn(email, password)
  }

  const signOut = async () => {
    authLogger.info('Starting user sign out')
    await auth.signOut()
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isCompany: profile?.role === 'company',
    isRep: profile?.role === 'rep'
  }

  // Log auth context state for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    authLogger.debug('Auth context state', { 
      hasUser: !!user, 
      hasProfile: !!profile, 
      profileRole: profile?.role,
      loading 
    })
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 