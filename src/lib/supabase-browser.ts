/**
 * Supabase Browser Client (SSR-compatible)
 * Uses @supabase/ssr for proper session handling
 */

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// ✅ CORRECT: Using @supabase/ssr createBrowserClient
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// Export singleton for client-side use
export const supabase = createClient() 