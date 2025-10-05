/**
 * Custom hook for debounced API calls with AbortController for request cancellation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ComboboxOption, ParentFilters } from '@/lib/types/combobox';
import { generateCacheKey, getCacheEntry, setCacheEntry } from '@/lib/utils/cache';

interface UseDebouncedSearchOptions {
  endpoint: string;
  debounceMs?: number;
  minChars?: number;
  parentFilters?: ParentFilters;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

interface UseDebouncedSearchResult {
  data: ComboboxOption[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for debounced search with caching and request cancellation
 */
export function useDebouncedSearch(
  query: string,
  options: UseDebouncedSearchOptions
): UseDebouncedSearchResult {
  const {
    endpoint,
    debounceMs = 300,
    minChars = 2,
    parentFilters = {},
    enabled = true,
    onError,
  } = options;

  const [data, setData] = useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (searchQuery: string, signal: AbortSignal) => {
    try {
      // Generate cache key
      const cacheKey = generateCacheKey(endpoint, { ...parentFilters, q: searchQuery });

      // Check cache first
      const cachedEntry = getCacheEntry(cacheKey);
      if (cachedEntry) {
        setData(cachedEntry.data);
        setIsLoading(false);
        return;
      }

      // Build URL with query parameters
      const url = new URL(endpoint, window.location.origin);
      if (searchQuery) {
        url.searchParams.append('q', searchQuery);
      }

      // Add parent filters
      Object.entries(parentFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });

      // Fetch data
      const response = await fetch(url.toString(), { signal });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const etag = response.headers.get('ETag') || '';

      // Cache the result
      if (result.data) {
        setCacheEntry(cacheKey, result.data, etag);
        setData(result.data);
      } else {
        setData([]);
      }

      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        setError(err);
        if (onError) {
          onError(err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, parentFilters, onError]);

  const refetch = useCallback(() => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check minimum characters
    if (query.length < minChars) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current) {
        fetchData(query, abortControllerRef.current.signal);
      }
    }, debounceMs);
  }, [query, minChars, debounceMs, enabled, fetchData]);

  // Trigger search when query or dependencies change
  useEffect(() => {
    refetch();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for prefetching data on mount
 */
export function usePrefetch(
  endpoint: string,
  parentFilters?: ParentFilters,
  enabled: boolean = true
): {
  data: ComboboxOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Generate cache key
        const cacheKey = generateCacheKey(endpoint, parentFilters);

        // Check cache first
        const cachedEntry = getCacheEntry(cacheKey);
        if (cachedEntry) {
          setData(cachedEntry.data);
          setIsLoading(false);
          return;
        }

        // Build URL with query parameters
        const url = new URL(endpoint, window.location.origin);

        // Add parent filters
        if (parentFilters) {
          Object.entries(parentFilters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              url.searchParams.append(key, String(value));
            }
          });
        }

        // Fetch data
        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const etag = response.headers.get('ETag') || '';

        // Cache the result
        if (result.data) {
          setCacheEntry(cacheKey, result.data, etag);
          setData(result.data);
        } else {
          setData([]);
        }

        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, parentFilters, enabled]);

  return {
    data,
    isLoading,
    error,
  };
}

