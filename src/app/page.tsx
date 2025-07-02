'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        // Redirect authenticated users to their appropriate dashboard
        if (profile.role === 'company') {
          router.push('/dashboard/company')
        } else if (profile.role === 'rep') {
          router.push('/dashboard/rep')
        }
      }
    }
  }, [user, profile, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </main>
    )
  }

  // Show homepage for non-authenticated users
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* RepOrder Logo - Optimized with Next.js Image */}
      <div className="mb-8">
        <Image
          src="/reporder-logo.svg"
          alt="RepOrder"
          width={120}
          height={80}
          priority
          className="h-20 w-auto"
        />
      </div>
      
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          Welcome to RepOrder
        </h1>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600 mb-6">
          Professional sales rep and inventory management platform
        </p>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
} 