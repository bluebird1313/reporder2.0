import 'dotenv/config'
import { randomUUID } from 'crypto'

import { NextApiRequest, NextApiResponse } from 'next'

import { OAuthStateManager } from '@/lib/database.helpers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { shop } = req.query

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({ error: 'Shop parameter is required' })
    }

    // Validate shop domain format
    if (!shop.endsWith('.myshopify.com') && !shop.includes('.')) {
      return res.status(400).json({ error: 'Invalid shop domain format' })
    }

    // Generate random state for OAuth flow
    const state = randomUUID()
    
    // Create OAuth state for CSRF protection using helper
    try {
      await OAuthStateManager.create(shop, state)
    } catch (error) {
      console.error('Error creating OAuth state:', error)
      return res.status(500).json({ error: 'Failed to initialize OAuth flow' })
    }

    // Shopify OAuth parameters
    const clientId = process.env.SHOPIFY_CLIENT_ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    
    if (!clientId || !baseUrl) {
      return res.status(500).json({ error: 'Missing required environment variables' })
    }

    const scope = 'read_products,read_inventory,read_orders'
    const redirectUri = `${baseUrl}/api/oauth/shopify/callback`
    
    // Construct Shopify OAuth URL
    const shopifyAuthUrl = new URL(`https://${shop}/admin/oauth/authorize`)
    shopifyAuthUrl.searchParams.set('client_id', clientId)
    shopifyAuthUrl.searchParams.set('scope', scope)
    shopifyAuthUrl.searchParams.set('redirect_uri', redirectUri)
    shopifyAuthUrl.searchParams.set('state', state)

    // Redirect to Shopify for authorization
    res.redirect(302, shopifyAuthUrl.toString())
  } catch (error) {
    console.error('OAuth start error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 