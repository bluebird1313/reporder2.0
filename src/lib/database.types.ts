export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dashboard_users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          last_login: string | null
          name: string
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          last_login?: string | null
          name: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          last_login?: string | null
          name?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'dashboard_users_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      inventory: {
        Row: {
          current_stock: number | null
          id: number
          last_updated: string | null
          max_stock: number | null
          min_stock: number | null
          product_id: number | null
          store_id: number | null
        }
        Insert: {
          current_stock?: number | null
          id?: number
          last_updated?: string | null
          max_stock?: number | null
          min_stock?: number | null
          product_id?: number | null
          store_id?: number | null
        }
        Update: {
          current_stock?: number | null
          id?: number
          last_updated?: string | null
          max_stock?: number | null
          min_stock?: number | null
          product_id?: number | null
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
      }
      low_stock_alerts: {
        Row: {
          created_at: string | null
          current_stock: number
          id: number
          is_acknowledged: boolean | null
          min_stock: number
          product_id: number | null
          severity: string | null
          store_id: number | null
        }
        Insert: {
          created_at?: string | null
          current_stock: number
          id?: number
          is_acknowledged?: boolean | null
          min_stock: number
          product_id?: number | null
          severity?: string | null
          store_id?: number | null
        }
        Update: {
          created_at?: string | null
          current_stock?: number
          id?: number
          is_acknowledged?: boolean | null
          min_stock?: number
          product_id?: number | null
          severity?: string | null
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'low_stock_alerts_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'low_stock_alerts_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
      }
      oauth_states: {
        Row: {
          created_at: string | null
          id: string
          shop_domain: string
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          shop_domain: string
          state: string
        }
        Update: {
          created_at?: string | null
          id?: string
          shop_domain?: string
          state?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          channel: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          price: number | null
          sku: string
          style: string | null
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          price?: number | null
          sku: string
          style?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          price?: number | null
          sku?: string
          style?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_sharing_permissions: {
        Row: {
          collection_id: string | null
          collection_name: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          product_line: string | null
          rep_email: string
          shop_domain: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          collection_id?: string | null
          collection_name?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          product_line?: string | null
          rep_email: string
          shop_domain: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          collection_id?: string | null
          collection_name?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          product_line?: string | null
          rep_email?: string
          shop_domain?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rep_access: {
        Row: {
          access_level: string | null
          created_at: string | null
          granted_by: string | null
          id: number
          is_active: boolean | null
          rep_email: string
          shop_domain: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: number
          is_active?: boolean | null
          rep_email: string
          shop_domain: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: number
          is_active?: boolean | null
          rep_email?: string
          shop_domain?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          file_path: string | null
          generated_by: string | null
          id: number
          name: string
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          generated_by?: string | null
          id?: number
          name: string
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          generated_by?: string | null
          id?: number
          name?: string
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      retailer_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          scope: string | null
          shop_domain: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          scope?: string | null
          shop_domain: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          scope?: string | null
          shop_domain?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_performance: {
        Row: {
          created_at: string | null
          id: number
          period_end: string
          period_start: string
          product_id: number | null
          rank_in_category: number | null
          revenue: number | null
          store_id: number | null
          trend_percentage: number | null
          units_sold: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          period_end: string
          period_start: string
          product_id?: number | null
          rank_in_category?: number | null
          revenue?: number | null
          store_id?: number | null
          trend_percentage?: number | null
          units_sold?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          period_end?: string
          period_start?: string
          product_id?: number | null
          rank_in_category?: number | null
          revenue?: number | null
          store_id?: number | null
          trend_percentage?: number | null
          units_sold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'sales_performance_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sales_performance_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          }
        ]
      }
      stores: {
        Row: {
          created_at: string | null
          id: number
          inventory_health: number | null
          is_active: boolean | null
          location: string | null
          low_stock_items: number | null
          name: string
          out_of_stock: number | null
          shop_domain: string
          total_items: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          inventory_health?: number | null
          is_active?: boolean | null
          location?: string | null
          low_stock_items?: number | null
          name: string
          out_of_stock?: number | null
          shop_domain: string
          total_items?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          inventory_health?: number | null
          is_active?: boolean | null
          location?: string | null
          low_stock_items?: number | null
          name?: string
          out_of_stock?: number | null
          shop_domain?: string
          total_items?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          shop_domain: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role: string
          shop_domain?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          shop_domain?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_oauth_states: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_company_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_rep_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Convenience types for your specific tables
export type OAuthState = Tables<'oauth_states'>
export type OAuthStateInsert = TablesInsert<'oauth_states'>
export type OAuthStateUpdate = TablesUpdate<'oauth_states'>

export type RetailerToken = Tables<'retailer_tokens'>
export type RetailerTokenInsert = TablesInsert<'retailer_tokens'>
export type RetailerTokenUpdate = TablesUpdate<'retailer_tokens'>

export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

export type RepAccess = Tables<'rep_access'>
export type RepAccessInsert = TablesInsert<'rep_access'>
export type RepAccessUpdate = TablesUpdate<'rep_access'>

export type ProductSharingPermission = Tables<'product_sharing_permissions'>
export type ProductSharingPermissionInsert = TablesInsert<'product_sharing_permissions'>
export type ProductSharingPermissionUpdate = TablesUpdate<'product_sharing_permissions'>

export type Store = Tables<'stores'>
export type StoreInsert = TablesInsert<'stores'>
export type StoreUpdate = TablesUpdate<'stores'>

export type Product = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>

export type Inventory = Tables<'inventory'>
export type InventoryInsert = TablesInsert<'inventory'>
export type InventoryUpdate = TablesUpdate<'inventory'>

export type SalesPerformance = Tables<'sales_performance'>
export type SalesPerformanceInsert = TablesInsert<'sales_performance'>
export type SalesPerformanceUpdate = TablesUpdate<'sales_performance'>

export type LowStockAlert = Tables<'low_stock_alerts'>
export type LowStockAlertInsert = TablesInsert<'low_stock_alerts'>
export type LowStockAlertUpdate = TablesUpdate<'low_stock_alerts'>

export type Report = Tables<'reports'>
export type ReportInsert = TablesInsert<'reports'>
export type ReportUpdate = TablesUpdate<'reports'>

export type DashboardUser = Tables<'dashboard_users'>
export type DashboardUserInsert = TablesInsert<'dashboard_users'>
export type DashboardUserUpdate = TablesUpdate<'dashboard_users'>

// Platform types
export type Platform = 'shopify' | 'lightspeed'

// User role types
export type UserRole = 'company' | 'rep'

// Dashboard user role types
export type DashboardUserRole = 'Admin' | 'Manager' | 'Buyer' | 'Analyst'

// Channel types
export type Channel = 'western' | 'alt sports' | 'fashion' | 'outdoors' | 'resort'

// Subcategory types  
export type Subcategory = 'hats' | 'T\'s' | 'wovens' | 'knits' | 'pants' | 'fleece'

// Alert severity types
export type AlertSeverity = 'low' | 'medium' | 'high'

// OAuth scope types for different platforms
export type ShopifyScope = 'read_products' | 'read_inventory' | 'read_orders' | 'read_customers'
export type LightspeedScope = 'read_products' | 'read_sales' | 'read_customers' 