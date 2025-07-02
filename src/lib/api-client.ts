/**
 * Simplified API client for Supabase operations
 * Provides basic error handling and consistent response formatting
 */

import { supabase } from './supabase'
import { apiLogger } from './logger'

// Response wrapper for consistent API responses
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  success: boolean
  timestamp: string
}

/**
 * Wraps a response in our standard API response format
 */
function createResponse<T>(
  data: T | null,
  error: string | null = null
): ApiResponse<T> {
  return {
    data,
    error,
    success: !error,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Simplified API client class
 */
export class ApiClient {
  /**
   * Get user dashboard data
   */
  async getDashboardData(userId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        apiLogger.error('Dashboard data query failed', error)
        return createResponse(null, error.message)
      }

      apiLogger.debug('Dashboard data retrieved successfully')
      return createResponse(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      apiLogger.error('Dashboard data request failed', error as Error)
      return createResponse(null, message)
    }
  }

  /**
   * Get store inventory data
   */
  async getStoreInventory(storeId: number): Promise<ApiResponse<any[] | null>> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, products(*), stores(*)')
        .eq('store_id', storeId)

      if (error) {
        apiLogger.error('Store inventory query failed', error)
        return createResponse(null, error.message)
      }

      apiLogger.debug('Store inventory retrieved successfully', { count: data.length })
      return createResponse(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      apiLogger.error('Store inventory request failed', error as Error)
      return createResponse(null, message)
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<ApiResponse<any[] | null>> {
    try {
      const { data, error } = await supabase
        .from('low_stock_alerts')
        .select('*, products(*), stores(*)')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false })

      if (error) {
        apiLogger.error('Low stock alerts query failed', error)
        return createResponse(null, error.message)
      }

      apiLogger.debug('Low stock alerts retrieved successfully', { count: data.length })
      return createResponse(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      apiLogger.error('Low stock alerts request failed', error as Error)
      return createResponse(null, message)
    }
  }

  /**
   * Update inventory levels
   */
  async updateInventory(inventoryId: number, updates: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', inventoryId)
        .select()
        .single()

      if (error) {
        apiLogger.error('Inventory update failed', error)
        return createResponse(null, error.message)
      }

      apiLogger.info('Inventory updated successfully', { inventoryId })
      return createResponse(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      apiLogger.error('Inventory update request failed', error as Error)
      return createResponse(null, message)
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export convenience functions for common operations
export const dashboardApi = {
  getData: (userId: string) => apiClient.getDashboardData(userId),
  getStoreInventory: (storeId: number) => apiClient.getStoreInventory(storeId),
  getLowStockAlerts: () => apiClient.getLowStockAlerts(),
}

export const inventoryApi = {
  update: (id: number, updates: any) => apiClient.updateInventory(id, updates),
  getByStore: (storeId: number) => apiClient.getStoreInventory(storeId),
} 