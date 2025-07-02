'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import RoleSelector from '@/components/auth/RoleSelector'
import SignUpFields from '@/components/auth/SignUpFields'
import AuthDebugPanel from '@/components/auth/AuthDebugPanel'
import { UserRole } from '@/lib/database.types'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [shopDomain, setShopDomain] = useState('')
  const [role, setRole] = useState<UserRole>('rep')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in - ONLY redirect based on actual user profile
  useEffect(() => {
    console.log('🔍 LOGIN PAGE - Auth state change detected:', { 
      user: !!user, 
      userId: user?.id,
      profile: profile?.role, 
      authLoading,
      currentLoading: loading,
      timestamp: new Date().toISOString()
    })
    
    if (user && profile && !authLoading) {
      console.log('✅ LOGIN PAGE - All conditions met for redirect:', {
        hasUser: !!user,
        hasProfile: !!profile,
        profileRole: profile.role,
        authLoadingDone: !authLoading
      })
      const redirectPath = profile.role === 'company' ? '/dashboard/company' : '/dashboard/rep'
      console.log('🔄 LOGIN PAGE - Redirecting to:', redirectPath)
      router.push(redirectPath)
    } else if (user && !profile && !authLoading) {
      console.log('❌ LOGIN PAGE - User exists but no profile found - this should not happen')
      setError('User profile not found. Please contact support.')
    } else {
      console.log('⏳ LOGIN PAGE - Waiting for conditions:', {
        needsUser: !user,
        needsProfile: !profile,
        waitingForAuth: authLoading
      })
    }
  }, [user, profile, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        const userData = {
          role,
          full_name: fullName,
          ...(role === 'company' && { 
            company_name: companyName,
            shop_domain: shopDomain 
          })
        }

        const { error: signUpError } = await signUp(email, password, userData)
        
        if (signUpError) {
          setError(signUpError.message)
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.')
        }
      } else {
        // Sign in - let the useEffect handle the redirect based on actual user profile
        const { error: signInError } = await signIn(email, password)
        
        if (signInError) {
          setError(signInError.message)
        }
        // DO NOT manually redirect here - let useEffect handle it based on actual profile
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setCompanyName('')
    setShopDomain('')
    setRole('rep')
    setError('')
    setSuccess('')
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  // Show loading state if user exists but we're still loading profile
  const isAuthenticating = (user && !profile && authLoading) || loading

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">RepOrder</h1>
          <p className="mt-2 text-gray-600">Professional Sales Rep Management</p>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        
        {/* Show authentication status */}
        {isAuthenticating && (
          <div className="mt-4 text-center">
            <div className="text-sm text-blue-600">
              {user && !profile ? 'Loading your profile...' : 'Signing you in...'}
            </div>
          </div>
        )}
        
        <AuthDebugPanel 
          user={user}
          profile={profile}
          authLoading={authLoading}
          loading={loading}
          isAuthenticating={isAuthenticating}
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <RoleSelector 
              role={role}
              isSignUp={isSignUp}
              disabled={isAuthenticating}
              onChange={setRole}
            />

            {isSignUp && (
              <SignUpFields
                role={role}
                fullName={fullName}
                companyName={companyName}
                shopDomain={shopDomain}
                onFullNameChange={setFullName}
                onCompanyNameChange={setCompanyName}
                onShopDomainChange={setShopDomain}
              />
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {user && !profile ? 'Loading profile...' : 'Signing in...'}
                  </div>
                ) : (isSignUp ? 'Sign up' : `Sign in as ${role === 'rep' ? 'Sales Rep' : 'Store Owner'}`)}
              </button>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                disabled={isAuthenticating}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 