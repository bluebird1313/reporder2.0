import type { 
  OAuthState, 
  OAuthStateInsert, 
  RetailerToken, 
  RetailerTokenInsert,
  Platform, 
} from './database.types'
import { supabaseAdmin } from './supabaseAdmin'

/**
 * OAuth State Management
 * Used for CSRF protection during OAuth flows
 */
export class OAuthStateManager {
  /**
   * Create a new OAuth state for CSRF protection
   */
  static async create(shopDomain: string, state: string): Promise<OAuthState> {
    const { data, error } = await supabaseAdmin
      .from('oauth_states')
      .insert({
        state,
        shop_domain: shopDomain,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create OAuth state: ${error.message}`)
    }

    return data
  }

  /**
   * Verify and consume an OAuth state (deletes after verification)
   */
  static async verifyAndConsume(state: string, shopDomain: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('oauth_states')
      .select()
      .eq('state', state)
      .eq('shop_domain', shopDomain)
      .single()

    if (error || !data) {
      return false
    }

    // Delete the state after verification (single use)
    await supabaseAdmin
      .from('oauth_states')
      .delete()
      .eq('state', state)

    return true
  }

  /**
   * Clean up expired OAuth states (older than 1 hour)
   */
  static async cleanup(): Promise<void> {
    await supabaseAdmin.rpc('cleanup_expired_oauth_states')
  }
}

/**
 * Retailer Token Management
 * Stores and manages OAuth access tokens for connected platforms
 */
export class RetailerTokenManager {
  /**
   * Store or update a retailer's OAuth token
   */
  static async upsert(token: Omit<RetailerTokenInsert, 'id' | 'created_at' | 'updated_at'>): Promise<RetailerToken> {
    const { data, error } = await supabaseAdmin
      .from('retailer_tokens')
      .upsert({
        ...token,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'platform,shop_domain',
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to upsert retailer token: ${error.message}`)
    }

    return data
  }

  /**
   * Get a retailer's token by platform and shop domain
   */
  static async get(platform: Platform, shopDomain: string): Promise<RetailerToken | null> {
    const { data, error } = await supabaseAdmin
      .from('retailer_tokens')
      .select()
      .eq('platform', platform)
      .eq('shop_domain', shopDomain)
      .single()

    if (error) {
      return null
    }

    return data
  }

  /**
   * Get all tokens for a specific platform
   */
  static async getByPlatform(platform: Platform): Promise<RetailerToken[]> {
    const { data, error } = await supabaseAdmin
      .from('retailer_tokens')
      .select()
      .eq('platform', platform)

    if (error) {
      throw new Error(`Failed to get tokens for platform ${platform}: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get all tokens for a specific shop (across all platforms)
   */
  static async getByShop(shopDomain: string): Promise<RetailerToken[]> {
    const { data, error } = await supabaseAdmin
      .from('retailer_tokens')
      .select()
      .eq('shop_domain', shopDomain)

    if (error) {
      throw new Error(`Failed to get tokens for shop ${shopDomain}: ${error.message}`)
    }

    return data || []
  }

  /**
   * Check if a token exists and is valid (not expired)
   */
  static async isValidToken(platform: Platform, shopDomain: string): Promise<boolean> {
    const token = await this.get(platform, shopDomain)
    
    if (!token) {
      return false
    }

    // Check if token is expired (if expires_at is set)
    if (token.expires_at) {
      const expiresAt = new Date(token.expires_at)
      const now = new Date()
      return expiresAt > now
    }

    // If no expiration date, assume token is valid
    return true
  }

  /**
   * Remove a retailer's token
   */
  static async remove(platform: Platform, shopDomain: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('retailer_tokens')
      .delete()
      .eq('platform', platform)
      .eq('shop_domain', shopDomain)

    if (error) {
      throw new Error(`Failed to remove token: ${error.message}`)
    }
  }

  /**
   * Get all connected shops grouped by platform
   */
  static async getConnectedShops(): Promise<Record<Platform, string[]>> {
    const { data, error } = await supabaseAdmin
      .from('retailer_tokens')
      .select('platform, shop_domain')

    if (error) {
      throw new Error(`Failed to get connected shops: ${error.message}`)
    }

    const result: Record<Platform, string[]> = {
      shopify: [],
      lightspeed: [],
    }

    data?.forEach(token => {
      if (token.platform === 'shopify' || token.platform === 'lightspeed') {
        result[token.platform as Platform].push(token.shop_domain)
      }
    })

    return result
  }
} 