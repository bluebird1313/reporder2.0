'use client'
import { UserRole } from '@/lib/database.types'

interface RoleSelectorProps {
  role: UserRole
  isSignUp: boolean
  disabled: boolean
  onChange: (role: UserRole) => void
}

export default function RoleSelector({ role, isSignUp, disabled, onChange }: RoleSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {isSignUp ? 'I am a:' : 'Sign in as:'}
      </label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <label className={`
          relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
          ${role === 'rep' 
            ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50' 
            : 'border-gray-300 bg-white hover:bg-gray-50'
          }
        `}>
          <input
            type="radio"
            value="rep"
            checked={role === 'rep'}
            onChange={(e) => onChange(e.target.value as UserRole)}
            className="sr-only"
            disabled={disabled}
          />
          <div className="flex flex-col items-center text-center">
            <svg className="h-8 w-8 mb-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Sales Rep</span>
            <span className="text-xs text-gray-500">Manage inventory</span>
          </div>
        </label>
        
        <label className={`
          relative flex cursor-pointer rounded-lg border p-4 focus:outline-none
          ${role === 'company' 
            ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50' 
            : 'border-gray-300 bg-white hover:bg-gray-50'
          }
        `}>
          <input
            type="radio"
            value="company"
            checked={role === 'company'}
            onChange={(e) => onChange(e.target.value as UserRole)}
            className="sr-only"
            disabled={disabled}
          />
          <div className="flex flex-col items-center text-center">
            <svg className="h-8 w-8 mb-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Store Owner</span>
            <span className="text-xs text-gray-500">Manage business</span>
          </div>
        </label>
      </div>
    </div>
  )
} 