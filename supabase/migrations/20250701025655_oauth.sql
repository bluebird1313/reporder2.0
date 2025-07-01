-- OAuth states table for tracking OAuth flow state
CREATE TABLE oauth_states (
    state uuid PRIMARY KEY,
    shop_domain text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Retailer tokens table for storing access tokens from different platforms
CREATE TABLE retailer_tokens (
    id bigserial PRIMARY KEY,
    platform text CHECK (platform IN ('shopify', 'lightspeed')) NOT NULL,
    shop_domain text NOT NULL,
    access_token text NOT NULL,
    scope text,
    refresh_token text,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_oauth_states_shop_domain ON oauth_states(shop_domain);
CREATE INDEX idx_retailer_tokens_platform ON retailer_tokens(platform);
CREATE INDEX idx_retailer_tokens_shop_domain ON retailer_tokens(shop_domain);

-- Create unique constraint to prevent duplicate tokens per shop/platform
CREATE UNIQUE INDEX idx_retailer_tokens_unique ON retailer_tokens(platform, shop_domain); 