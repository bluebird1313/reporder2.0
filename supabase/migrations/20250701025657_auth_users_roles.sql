-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create public users table to store user profile data including roles
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    role text CHECK (role IN ('company', 'rep')) NOT NULL,
    full_name text,
    company_name text, -- For company users
    shop_domain text, -- For company users - their store domain
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public.users
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow inserts during signup (handled by trigger)
CREATE POLICY "Allow user creation during signup" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, full_name, company_name, shop_domain)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'role', 'rep'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'shop_domain'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing rep_access and product_sharing_permissions tables to use user IDs instead of emails
-- First, add user_id columns
ALTER TABLE rep_access ADD COLUMN user_id uuid REFERENCES auth.users(id);
ALTER TABLE product_sharing_permissions ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_shop_domain ON public.users(shop_domain);
CREATE INDEX idx_rep_access_user_id ON rep_access(user_id);
CREATE INDEX idx_product_sharing_user_id ON product_sharing_permissions(user_id);

-- Enhanced RLS policies for rep_access table
ALTER TABLE rep_access ENABLE ROW LEVEL SECURITY;

-- Reps can only see their own access records
CREATE POLICY "Reps can read own access" ON rep_access
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (rep_email = (SELECT email FROM public.users WHERE id = auth.uid()))
    );

-- Company users can see all access records for their shop
CREATE POLICY "Companies can read shop access" ON rep_access
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'company' 
            AND shop_domain = rep_access.shop_domain
        )
    );

-- Only companies can insert/update/delete rep access
CREATE POLICY "Companies can manage rep access" ON rep_access
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'company' 
            AND shop_domain = rep_access.shop_domain
        )
    );

-- Enhanced RLS policies for product_sharing_permissions table
ALTER TABLE product_sharing_permissions ENABLE ROW LEVEL SECURITY;

-- Reps can only see their own permissions
CREATE POLICY "Reps can read own permissions" ON product_sharing_permissions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (rep_email = (SELECT email FROM public.users WHERE id = auth.uid()))
    );

-- Company users can see all permissions for their shop
CREATE POLICY "Companies can read shop permissions" ON product_sharing_permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'company' 
            AND shop_domain = product_sharing_permissions.shop_domain
        )
    );

-- Only companies can insert/update/delete permissions
CREATE POLICY "Companies can manage permissions" ON product_sharing_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'company' 
            AND shop_domain = product_sharing_permissions.shop_domain
        )
    );

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has company role
CREATE OR REPLACE FUNCTION public.is_company_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role = 'company' FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has rep role  
CREATE OR REPLACE FUNCTION public.is_rep_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role = 'rep' FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 