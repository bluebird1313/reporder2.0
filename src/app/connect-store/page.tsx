'use client'

import { useState } from 'react'

export default function ConnectStore() {
  const [shopDomain, setShopDomain] = useState('')
  const [platform, setPlatform] = useState<'shopify' | 'lightspeed'>('shopify')
  const [isLoading, setIsLoading] = useState(false)


  const handleConnect = async () => {
    if (!shopDomain.trim()) {
      alert('Please enter a shop domain')
      return
    }

    setIsLoading(true)
    
    try {
      if (platform === 'shopify') {
        // Redirect to Shopify OAuth start
        window.location.href = `/api/oauth/shopify/start?shop=${shopDomain}`
      } else {
        // Placeholder for Lightspeed OAuth (to be implemented)
        alert('Lightspeed integration coming soon!')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Connection error:', error)
      alert('Failed to connect. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* RepOrder Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/reporder-logo.svg"
            alt="RepOrder"
            className="h-16 w-auto"
          />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect Your Store
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your store to RepOrder for seamless inventory and sales management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'shopify' | 'lightspeed')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="shopify">Shopify</option>
                <option value="lightspeed">Lightspeed (Coming Soon)</option>
              </select>
            </div>

            <div>
              <label htmlFor="shop-domain" className="block text-sm font-medium text-gray-700">
                {platform === 'shopify' ? 'Shop Domain' : 'Store URL'}
              </label>
              <div className="mt-1">
                <input
                  id="shop-domain"
                  name="shop-domain"
                  type="text"
                  placeholder={
                    platform === 'shopify' 
                      ? 'your-shop.myshopify.com' 
                      : 'your-store-url.com'
                  }
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleConnect}
                disabled={isLoading || !shopDomain.trim() || platform === 'lightspeed'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : `Connect ${platform === 'shopify' ? 'Shopify' : 'Lightspeed'} Store`}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                For Shopify: Enter your full shop domain (e.g., your-shop.myshopify.com)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 