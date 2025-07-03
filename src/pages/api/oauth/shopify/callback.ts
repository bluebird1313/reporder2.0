import 'dotenv/config'
import { createHmac } from 'crypto'

import { NextApiRequest, NextApiResponse } from 'next'

import { OAuthStateManager, RetailerTokenManager } from '@/lib/database.helpers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state, shop, hmac, timestamp } = req.query

    if (!code || !state || !shop || !hmac) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Verify and consume OAuth state for CSRF protection
    const isValidState = await OAuthStateManager.verifyAndConsume(state as string, shop as string)
    
    if (!isValidState) {
      return res.status(400).json({ error: 'Invalid or expired state' })
    }

    // Verify HMAC using client secret
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET
    if (!clientSecret) {
      return res.status(500).json({ error: 'Missing client secret' })
    }

    // Construct query string for HMAC verification (excluding hmac and signature)
    const queryString = Object.keys(req.query)
      .filter(key => key !== 'hmac' && key !== 'signature')
      .sort()
      .map(key => `${key}=${req.query[key]}`)
      .join('&')

    const calculatedHmac = createHmac('sha256', clientSecret)
      .update(queryString)
      .digest('hex')

    if (calculatedHmac !== hmac) {
      return res.status(400).json({ error: 'Invalid HMAC verification' })
    }

    // Exchange code for access token
    const tokenUrl = `https://${shop}/admin/oauth/access_token`
    const tokenPayload = {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: clientSecret,
      code: code,
    }

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenPayload),
    })

    if (!tokenResponse.ok) {
      return res.status(400).json({ error: 'Failed to exchange code for token' })
    }

    const tokenData = await tokenResponse.json()
    const { access_token, scope } = tokenData

    // Store the access token using helper
    try {
      await RetailerTokenManager.upsert({
        platform: 'shopify',
        shop_domain: shop as string,
        access_token: access_token,
        scope: scope,
      })
    } catch (error) {
      console.error('Error storing token:', error)
      return res.status(500).json({ error: 'Failed to store access token' })
    }

    // Note: OAuth state was already cleaned up by verifyAndConsume()

    // Redirect to success page
    res.redirect(302, `/connected?shop=${shop}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 