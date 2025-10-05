"use client";

/**
 * Debug Panel Component
 * Displays current field values, cache state, and network activity
 */

import React, { useState, useEffect } from 'react';
import { getAllCacheEntries, getCacheStats, clearCache } from '@/lib/utils/cache';
import type { CacheEntry } from '@/lib/types/combobox';

interface DebugPanelProps {
  values: Record<string, string>;
}

export function DebugPanel({ values }: DebugPanelProps) {
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [cacheStats, setCacheStats] = useState({
    totalEntries: 0,
    totalSize: 0,
    oldestEntry: null as number | null,
    newestEntry: null as number | null,
  });
  const [isExpanded, setIsExpanded] = useState(true);

  // Refresh cache data
  const refreshCacheData = () => {
    setCacheEntries(getAllCacheEntries());
    setCacheStats(getCacheStats());
  };

  // Auto-refresh every 2 seconds
  useEffect(() => {
    refreshCacheData();
    const interval = setInterval(refreshCacheData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle clear cache
  const handleClearCache = () => {
    clearCache();
    refreshCacheData();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Format size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Debug Panel</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Current Values */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">Current Values</h3>
            <div className="bg-muted rounded-md p-3 space-y-1">
              {Object.entries(values).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">
                    {value || <em className="text-xs">empty</em>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cache Statistics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-primary">Cache Statistics</h3>
              <button
                onClick={handleClearCache}
                className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:opacity-90"
              >
                Clear Cache
              </button>
            </div>
            <div className="bg-muted rounded-md p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Total Entries:</span>
                <span className="text-muted-foreground">{cacheStats.totalEntries}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Size:</span>
                <span className="text-muted-foreground">{formatSize(cacheStats.totalSize)}</span>
              </div>
              {cacheStats.oldestEntry && (
                <div className="flex justify-between">
                  <span className="font-medium">Oldest Entry:</span>
                  <span className="text-muted-foreground">
                    {formatTimestamp(cacheStats.oldestEntry)}
                  </span>
                </div>
              )}
              {cacheStats.newestEntry && (
                <div className="flex justify-between">
                  <span className="font-medium">Newest Entry:</span>
                  <span className="text-muted-foreground">
                    {formatTimestamp(cacheStats.newestEntry)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cache Entries */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">Cache Entries</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cacheEntries.length === 0 ? (
                <div className="bg-muted rounded-md p-3 text-sm text-muted-foreground text-center">
                  No cache entries
                </div>
              ) : (
                cacheEntries.map((entry, index) => (
                  <div key={index} className="bg-muted rounded-md p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Key:</span>
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {entry.key}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Items:</span>
                      <span className="text-muted-foreground">{entry.data.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ETag:</span>
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {entry.etag}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Cached:</span>
                      <span className="text-muted-foreground">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
            <h3 className="text-sm font-semibold mb-2 text-primary">How to Test</h3>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Type in any field to trigger search</li>
              <li>• Watch cache entries populate</li>
              <li>• Type the same query again to see cache hit</li>
              <li>• Change parent field to see children reset</li>
              <li>• Use keyboard navigation (↑↓ Enter Esc)</li>
              <li>• Try creating custom values</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

