'use client'

import { useSearchParams } from 'next/navigation'

export default function Connected() {
  const searchParams = useSearchParams()
  const shop = searchParams?.get('shop')


  const handleViewDashboard = () => {
    // Navigate to main dashboard (to be implemented)
    window.location.href = '/dashboard'
  }

  const handleConnectAnother = () => {
    window.location.href = '/connect-store'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Store Connected Successfully!
          </h2>
          
          {shop && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Your store <span className="font-medium text-gray-900">{shop}</span> has been connected to RepOrder
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What's Next?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your store data will sync automatically. You can now view your dashboard or connect additional stores.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleViewDashboard}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Dashboard
              </button>
              
              <button
                onClick={handleConnectAnother}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Another Store
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Integration Status
              </h4>
              <div className="flex items-center justify-center text-sm text-green-600">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected and syncing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 