'use client'
import { UserRole } from '@/lib/database.types'

interface SignUpFieldsProps {
  role: UserRole
  fullName: string
  companyName: string
  shopDomain: string
  onFullNameChange: (value: string) => void
  onCompanyNameChange: (value: string) => void
  onShopDomainChange: (value: string) => void
}

export default function SignUpFields({
  role,
  fullName,
  companyName,
  shopDomain,
  onFullNameChange,
  onCompanyNameChange,
  onShopDomainChange,
}: SignUpFieldsProps) {
  return (
    <>
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Company-specific fields */}
      {role === 'company' && (
        <>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shopDomain" className="block text-sm font-medium text-gray-700">
              Shop Domain
            </label>
            <input
              id="shopDomain"
              type="text"
              value={shopDomain}
              onChange={(e) => onShopDomainChange(e.target.value)}
              placeholder="your-store.myshopify.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </>
      )}
    </>
  )
} 