-- Rep Dashboard Schema - Products, Stores, Inventory, and Analytics
-- This migration creates the tables needed for the comprehensive rep dashboard

-- Stores table - Information about retail stores
CREATE TABLE stores (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    location text,
    shop_domain text NOT NULL, -- Links to retailer_tokens
    total_items integer DEFAULT 0,
    low_stock_items integer DEFAULT 0,
    out_of_stock integer DEFAULT 0,
    inventory_health integer DEFAULT 100, -- Percentage (0-100)
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Products table - Product catalog
CREATE TABLE products (
    id bigserial PRIMARY KEY,
    sku text NOT NULL UNIQUE,
    name text NOT NULL,
    category text, -- 'Headwear', 'Apparel', 'Outerwear', etc.
    channel text, -- 'western', 'alt sports', 'fashion', 'outdoors', 'resort'
    subcategory text, -- 'hats', 'T\'s', 'wovens', 'knits', 'pants', 'fleece'
    style text,
    color text,
    price decimal(10,2),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Inventory table - Stock levels per store per product
CREATE TABLE inventory (
    id bigserial PRIMARY KEY,
    store_id bigint REFERENCES stores(id) ON DELETE CASCADE,
    product_id bigint REFERENCES products(id) ON DELETE CASCADE,
    current_stock integer DEFAULT 0,
    min_stock integer DEFAULT 0,
    max_stock integer DEFAULT 0,
    last_updated timestamptz DEFAULT now(),
    UNIQUE(store_id, product_id)
);

-- Sales performance table - Track sales metrics
CREATE TABLE sales_performance (
    id bigserial PRIMARY KEY,
    store_id bigint REFERENCES stores(id) ON DELETE CASCADE,
    product_id bigint REFERENCES products(id) ON DELETE CASCADE,
    period_start date NOT NULL,
    period_end date NOT NULL,
    units_sold integer DEFAULT 0,
    revenue decimal(12,2) DEFAULT 0,
    rank_in_category integer,
    trend_percentage decimal(5,2), -- Growth percentage
    created_at timestamptz DEFAULT now()
);

-- Low stock alerts table - Track items needing attention
CREATE TABLE low_stock_alerts (
    id bigserial PRIMARY KEY,
    store_id bigint REFERENCES stores(id) ON DELETE CASCADE,
    product_id bigint REFERENCES products(id) ON DELETE CASCADE,
    current_stock integer NOT NULL,
    min_stock integer NOT NULL,
    severity text CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
    is_acknowledged boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Reports table - Track generated reports
CREATE TABLE reports (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL, -- 'Inventory', 'Analysis', 'Sales', 'Comparison'
    status text CHECK (status IN ('Completed', 'In Progress', 'Failed')) DEFAULT 'In Progress',
    generated_by text, -- Email of user who generated the report
    file_path text, -- Path to generated report file
    created_at timestamptz DEFAULT now()
);

-- Users extended table for dashboard users
CREATE TABLE dashboard_users (
    id bigserial PRIMARY KEY,
    user_id text REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    role text CHECK (role IN ('Admin', 'Manager', 'Buyer', 'Analyst')) DEFAULT 'Analyst',
    status text CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    last_login timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_stores_shop_domain ON stores(shop_domain);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_channel ON products(channel);
CREATE INDEX idx_inventory_store_product ON inventory(store_id, product_id);
CREATE INDEX idx_inventory_current_stock ON inventory(current_stock);
CREATE INDEX idx_sales_performance_store ON sales_performance(store_id);
CREATE INDEX idx_sales_performance_product ON sales_performance(product_id);
CREATE INDEX idx_sales_performance_period ON sales_performance(period_start, period_end);
CREATE INDEX idx_low_stock_alerts_store ON low_stock_alerts(store_id);
CREATE INDEX idx_low_stock_alerts_severity ON low_stock_alerts(severity);

-- Function to update store metrics automatically
CREATE OR REPLACE FUNCTION update_store_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update store metrics when inventory changes
    UPDATE stores SET 
        total_items = (
            SELECT COUNT(*) 
            FROM inventory 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        ),
        low_stock_items = (
            SELECT COUNT(*) 
            FROM inventory 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id) 
            AND current_stock <= min_stock AND current_stock > 0
        ),
        out_of_stock = (
            SELECT COUNT(*) 
            FROM inventory 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id) 
            AND current_stock = 0
        ),
        inventory_health = GREATEST(0, LEAST(100, 
            100 - (
                SELECT COALESCE(
                    ((COUNT(*) FILTER (WHERE current_stock <= min_stock)) * 100.0 / NULLIF(COUNT(*), 0)), 
                    100
                )
                FROM inventory 
                WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
            )
        )),
        updated_at = now()
    WHERE id = COALESCE(NEW.store_id, OLD.store_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update store metrics when inventory changes
CREATE TRIGGER trigger_update_store_metrics
    AFTER INSERT OR UPDATE OR DELETE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_store_metrics();

-- Function to automatically create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete existing alert for this store/product combination
    DELETE FROM low_stock_alerts 
    WHERE store_id = NEW.store_id AND product_id = NEW.product_id;
    
    -- Create new alert if stock is low
    IF NEW.current_stock <= NEW.min_stock AND NEW.current_stock >= 0 THEN
        INSERT INTO low_stock_alerts (store_id, product_id, current_stock, min_stock, severity)
        VALUES (
            NEW.store_id, 
            NEW.product_id, 
            NEW.current_stock, 
            NEW.min_stock,
            CASE 
                WHEN NEW.current_stock = 0 THEN 'high'
                WHEN NEW.current_stock <= (NEW.min_stock * 0.5) THEN 'high'
                ELSE 'medium'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create low stock alerts
CREATE TRIGGER trigger_check_low_stock
    AFTER INSERT OR UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION check_low_stock(); 