'use client'
import { User } from '@supabase/supabase-js'

import { Database } from '@/lib/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthDebugPanelProps {
  user: User | null
  profile: UserProfile | null
  authLoading: boolean
  loading: boolean
  isAuthenticating: boolean
}

export default function AuthDebugPanel({ 
  user, 
  profile, 
  authLoading, 
  loading, 
  isAuthenticating, 
}: AuthDebugPanelProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
      <div className="font-semibold mb-2">🐛 Debug Info:</div>
      <div>User: {user ? '✅ Yes' : '❌ No'} {user && `(${user.id?.slice(0, 8)}...)`}</div>
      <div>Profile: {profile ? '✅ Yes' : '❌ No'} {profile && `(role: ${profile.role})`}</div>
      <div>Auth Loading: {authLoading ? '🔄 Yes' : '✅ No'}</div>
      <div>Form Loading: {loading ? '🔄 Yes' : '✅ No'}</div>
      <div>Is Authenticating: {isAuthenticating ? '🔄 Yes' : '✅ No'}</div>
      <div className="mt-2 text-xs text-gray-600">
        {user && profile && !authLoading ? '🎯 Should redirect now!' : '⏳ Waiting...'}
      </div>
    </div>
  )
} 