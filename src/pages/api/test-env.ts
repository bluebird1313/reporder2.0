import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' })
  }

  const envCheck = {
    shopify_client_id: !!process.env.SHOPIFY_CLIENT_ID ? '✅ Set' : '❌ Missing',
    shopify_client_secret: !!process.env.SHOPIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    supabase_url: !!process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabase_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    next_public_base_url: !!process.env.NEXT_PUBLIC_BASE_URL ? '✅ Set' : '❌ Missing',
    
    // Show partial values for verification (first 4 chars only)
    shopify_client_id_preview: process.env.SHOPIFY_CLIENT_ID ? 
      process.env.SHOPIFY_CLIENT_ID.substring(0, 4) + '...' : 'Not set',
  }

  res.json(envCheck)
} 