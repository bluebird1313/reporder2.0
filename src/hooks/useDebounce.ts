import { useState, useEffect } from 'react'

// Inline constant to avoid import issues
const SEARCH_DEBOUNCE_MS = 300

/**
 * Custom hook for debouncing values
 * Useful for search inputs, API calls, and other operations that should be delayed
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (defaults to SEARCH_DEBOUNCE_MS)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search
 *   }
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay ?? SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debouncing callbacks
 * Useful when you want to debounce a function call rather than a value
 * 
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array (like useCallback)
 * @returns The debounced callback
 * 
 * @example
 * const debouncedSearch = useDebounceCallback(
 *   (term: string) => performSearch(term),
 *   300,
 *   []
 * )
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      callback(...args)
    }, delay)

    setDebounceTimer(timer)
  }) as T

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, deps)

  return debouncedCallback
}

/**
 * Custom hook for debouncing async operations
 * Handles cancellation of previous operations when new ones are triggered
 * 
 * @param asyncFn - The async function to debounce
 * @param delay - The delay in milliseconds
 * @returns Object with debounced function and loading state
 * 
 * @example
 * const { debouncedFn: debouncedSearch, isLoading } = useAsyncDebounce(
 *   async (term: string) => {
 *     const results = await searchApi(term)
 *     setResults(results)
 *   },
 *   300
 * )
 */
export function useAsyncDebounce<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  delay: number
) {
  const [isLoading, setIsLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const debouncedFn = ((...args: Parameters<T>) => {
    // Cancel previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Abort previous request
    if (abortController) {
      abortController.abort()
    }

    const timer = setTimeout(async () => {
      const controller = new AbortController()
      setAbortController(controller)
      setIsLoading(true)

      try {
        await asyncFn(...args)
      } catch (error) {
        // Only log if not aborted
        if (!controller.signal.aborted) {
          console.error('Debounced async operation failed:', error)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
        setAbortController(null)
      }
    }, delay)

    setDebounceTimer(timer)
  }) as T

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      if (abortController) {
        abortController.abort()
      }
    }
  }, [])

  return {
    debouncedFn,
    isLoading,
    cancel: () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        setDebounceTimer(null)
      }
      if (abortController) {
        abortController.abort()
        setAbortController(null)
      }
      setIsLoading(false)
    }
  }
} 