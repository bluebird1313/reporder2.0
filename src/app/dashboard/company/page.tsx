'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/lib/auth-context'

import AnalyticsOverview from '../../../components/company/AnalyticsOverview'
import PermissionMatrix from '../../../components/company/PermissionMatrix'
import ProductCollectionSelector from '../../../components/company/ProductCollectionSelector'
import RepInvitationFlow from '../../../components/company/RepInvitationFlow'
import StoreHealthCard from '../../../components/company/StoreHealthCard'

export default function CompanyDashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not a company user
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      if (profile && profile.role !== 'company') {
        router.push('/login?message=rep-dashboard-separate')
        return
      }
    }
  }, [user, profile, loading, router])

  // Show loading while checking auth
  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show access denied if wrong role
  if (profile.role !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/login?message=rep-dashboard-separate')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ['company-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/store-owner/me')
      if (!res.ok) {
throw new Error('Failed to load dashboard')
}
      return res.json()
    },
  })

  if (isLoading) {
return <p className="p-6 text-sm">Loading dashboard...</p>
}
  if (error) {
return <p className="p-6 text-red-500 text-sm">{(error).message}</p>
}

  const { storeStatus, reps, collections, permissions, analytics } = data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Company Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {profile.full_name || profile.email}
            </span>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4 space-y-6">
        <StoreHealthCard status={storeStatus.status} lastSync={storeStatus.lastSync} className="" />
        <ProductCollectionSelector collections={collections} className="" />
        <RepInvitationFlow className="" />
        <PermissionMatrix reps={reps} collections={collections} permissions={permissions} className="" />
        <AnalyticsOverview data={analytics} className="" />
      </div>
    </div>
  )
} 