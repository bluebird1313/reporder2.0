-- Product sharing permissions table
-- Allows store owners to control which product lines/collections their reps can access
CREATE TABLE product_sharing_permissions (
    id bigserial PRIMARY KEY,
    shop_domain text NOT NULL,
    rep_email text NOT NULL, -- The rep's email who gets access
    collection_id text, -- Shopify collection ID (null = all products)
    collection_name text, -- Human readable collection name
    product_line text, -- Custom product line identifier
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Rep access tokens table  
-- Links reps to the stores they have permission to access
CREATE TABLE rep_access (
    id bigserial PRIMARY KEY,
    rep_email text NOT NULL,
    shop_domain text NOT NULL,
    access_level text CHECK (access_level IN ('full', 'limited', 'collection_only')) DEFAULT 'limited',
    is_active boolean DEFAULT true,
    granted_by text, -- Email of store owner who granted access
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_product_sharing_shop_domain ON product_sharing_permissions(shop_domain);
CREATE INDEX idx_product_sharing_rep_email ON product_sharing_permissions(rep_email);
CREATE INDEX idx_rep_access_rep_email ON rep_access(rep_email);
CREATE INDEX idx_rep_access_shop_domain ON rep_access(shop_domain);

-- Unique constraint to prevent duplicate permissions
CREATE UNIQUE INDEX idx_product_sharing_unique ON product_sharing_permissions(shop_domain, rep_email, collection_id, product_line);
CREATE UNIQUE INDEX idx_rep_access_unique ON rep_access(rep_email, shop_domain); 