/**
 * ETag-based cache layer with sessionStorage persistence
 * Implements LRU eviction and efficient revalidation
 */

import type { CacheEntry, CacheConfig, ComboboxOption } from '@/lib/types/combobox';

const DEFAULT_CONFIG: CacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxEntries: 50,
  keyPrefix: 'combobox_cache_',
};

/**
 * Generate a cache key from endpoint and filters
 */
export function generateCacheKey(endpoint: string, filters?: Record<string, unknown>): string {
  const filterString = filters ? JSON.stringify(filters) : '';
  return `${endpoint}:${filterString}`;
}

/**
 * Get cache entry from sessionStorage
 */
export function getCacheEntry(key: string, config: Partial<CacheConfig> = {}): CacheEntry | null {
  const { ttl, keyPrefix } = { ...DEFAULT_CONFIG, ...config };
  const storageKey = `${keyPrefix}${key}`;

  try {
    const item = sessionStorage.getItem(storageKey);
    if (!item) return null;

    const entry: CacheEntry = JSON.parse(item);

    // Check if cache entry is expired
    const now = Date.now();
    if (now - entry.timestamp > ttl) {
      sessionStorage.removeItem(storageKey);
      return null;
    }

    return entry;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Set cache entry in sessionStorage
 */
export function setCacheEntry(
  key: string,
  data: ComboboxOption[],
  etag: string,
  config: Partial<CacheConfig> = {}
): void {
  const { keyPrefix, maxEntries } = { ...DEFAULT_CONFIG, ...config };
  const storageKey = `${keyPrefix}${key}`;

  try {
    const entry: CacheEntry = {
      data,
      etag,
      timestamp: Date.now(),
      key,
    };

    // Implement LRU eviction if needed
    evictOldEntries(maxEntries, keyPrefix);

    sessionStorage.setItem(storageKey, JSON.stringify(entry));
  } catch (error) {
    console.error('Error writing to cache:', error);
    // If quota exceeded, clear old entries and retry
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      evictOldEntries(Math.floor(maxEntries / 2), keyPrefix);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          data,
          etag,
          timestamp: Date.now(),
          key,
        }));
      } catch (retryError) {
        console.error('Failed to write to cache after eviction:', retryError);
      }
    }
  }
}

/**
 * Evict old cache entries using LRU strategy
 */
function evictOldEntries(maxEntries: number, keyPrefix: string): void {
  try {
    const entries: Array<{ key: string; timestamp: number }> = [];

    // Collect all cache entries
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        const item = sessionStorage.getItem(key);
        if (item) {
          const entry: CacheEntry = JSON.parse(item);
          entries.push({ key, timestamp: entry.timestamp });
        }
      }
    }

    // If we have more entries than allowed, remove oldest ones
    if (entries.length >= maxEntries) {
      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = entries.slice(0, entries.length - maxEntries + 1);
      toRemove.forEach(({ key }) => sessionStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Error evicting cache entries:', error);
  }
}

/**
 * Clear all cache entries
 */
export function clearCache(config: Partial<CacheConfig> = {}): void {
  const { keyPrefix } = { ...DEFAULT_CONFIG, ...config };

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get all cache entries (for debugging)
 */
export function getAllCacheEntries(config: Partial<CacheConfig> = {}): CacheEntry[] {
  const { keyPrefix } = { ...DEFAULT_CONFIG, ...config };
  const entries: CacheEntry[] = [];

  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        const item = sessionStorage.getItem(key);
        if (item) {
          entries.push(JSON.parse(item));
        }
      }
    }
  } catch (error) {
    console.error('Error getting all cache entries:', error);
  }

  return entries;
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats(config: Partial<CacheConfig> = {}): {
  totalEntries: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  const { keyPrefix } = { ...DEFAULT_CONFIG, ...config };
  let totalEntries = 0;
  let totalSize = 0;
  let oldestEntry: number | null = null;
  let newestEntry: number | null = null;

  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        const item = sessionStorage.getItem(key);
        if (item) {
          totalEntries++;
          totalSize += item.length;

          const entry: CacheEntry = JSON.parse(item);
          if (oldestEntry === null || entry.timestamp < oldestEntry) {
            oldestEntry = entry.timestamp;
          }
          if (newestEntry === null || entry.timestamp > newestEntry) {
            newestEntry = entry.timestamp;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting cache stats:', error);
  }

  return {
    totalEntries,
    totalSize,
    oldestEntry,
    newestEntry,
  };
}

/**
 * Validate cache entry with ETag
 * Returns true if cache is still valid (304 Not Modified)
 */
export async function validateCacheWithETag(
  endpoint: string,
  etag: string,
  filters?: Record<string, unknown>
): Promise<boolean> {
  try {
    const url = new URL(endpoint, window.location.origin);
    
    // Add filters as query parameters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'HEAD',
      headers: {
        'If-None-Match': etag,
      },
    });

    // 304 Not Modified means cache is still valid
    return response.status === 304;
  } catch (error) {
    console.error('Error validating cache with ETag:', error);
    return false;
  }
}

