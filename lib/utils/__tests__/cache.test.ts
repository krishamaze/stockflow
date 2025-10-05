/**
 * Tests for cache utilities
 */

import {
  generateCacheKey,
  getCacheEntry,
  setCacheEntry,
  clearCache,
  getCacheStats,
} from '../cache';
import type { ComboboxOption } from '@/lib/types/combobox';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('generateCacheKey', () => {
  it('should generate a key from endpoint', () => {
    const key = generateCacheKey('/api/brands');
    expect(key).toBe('/api/brands:');
  });

  it('should include filters in the key', () => {
    const key = generateCacheKey('/api/models', { brandId: '1' });
    expect(key).toContain('/api/models');
    expect(key).toContain('brandId');
  });

  it('should generate consistent keys for same inputs', () => {
    const key1 = generateCacheKey('/api/brands', { id: '1' });
    const key2 = generateCacheKey('/api/brands', { id: '1' });
    expect(key1).toBe(key2);
  });
});

describe('setCacheEntry and getCacheEntry', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should store and retrieve cache entry', () => {
    const data: ComboboxOption[] = [
      { value: '1', label: 'Nike' },
      { value: '2', label: 'Adidas' },
    ];
    const key = 'test-key';
    const etag = 'abc123';

    setCacheEntry(key, data, etag);
    const entry = getCacheEntry(key);

    expect(entry).not.toBeNull();
    expect(entry?.data).toEqual(data);
    expect(entry?.etag).toBe(etag);
  });

  it('should return null for non-existent key', () => {
    const entry = getCacheEntry('non-existent');
    expect(entry).toBeNull();
  });

  it('should return null for expired entry', () => {
    const data: ComboboxOption[] = [{ value: '1', label: 'Test' }];
    const key = 'test-key';
    const etag = 'abc123';

    setCacheEntry(key, data, etag, { ttl: -1000 }); // Expired
    const entry = getCacheEntry(key);

    expect(entry).toBeNull();
  });
});

describe('clearCache', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should clear all cache entries', () => {
    setCacheEntry('key1', [{ value: '1', label: 'Test1' }], 'etag1');
    setCacheEntry('key2', [{ value: '2', label: 'Test2' }], 'etag2');

    clearCache();

    expect(getCacheEntry('key1')).toBeNull();
    expect(getCacheEntry('key2')).toBeNull();
  });

  it('should only clear entries with matching prefix', () => {
    sessionStorage.setItem('other_key', 'value');
    setCacheEntry('cache_key', [{ value: '1', label: 'Test' }], 'etag');

    clearCache();

    expect(sessionStorage.getItem('other_key')).toBe('value');
    expect(getCacheEntry('cache_key')).toBeNull();
  });
});

describe('getCacheStats', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should return correct statistics', () => {
    setCacheEntry('key1', [{ value: '1', label: 'Test1' }], 'etag1');
    setCacheEntry('key2', [{ value: '2', label: 'Test2' }], 'etag2');

    const stats = getCacheStats();

    expect(stats.totalEntries).toBe(2);
    expect(stats.totalSize).toBeGreaterThan(0);
    expect(stats.oldestEntry).not.toBeNull();
    expect(stats.newestEntry).not.toBeNull();
  });

  it('should return zero stats for empty cache', () => {
    const stats = getCacheStats();

    expect(stats.totalEntries).toBe(0);
    expect(stats.totalSize).toBe(0);
    expect(stats.oldestEntry).toBeNull();
    expect(stats.newestEntry).toBeNull();
  });
});

