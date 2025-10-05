/**
 * Fuzzy search utilities using Fuse.js
 * Provides client-side fuzzy matching with configurable options
 */

import Fuse from 'fuse.js';
import type { ComboboxOption, FuzzySearchConfig, HighlightedMatch } from '@/lib/types/combobox';

const DEFAULT_CONFIG: FuzzySearchConfig = {
  keys: ['label', 'value'],
  threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
};

/**
 * Create a Fuse instance with custom configuration
 */
export function createFuzzySearch(
  options: ComboboxOption[],
  config: Partial<FuzzySearchConfig> = {}
): Fuse<ComboboxOption> {
  const fuseConfig = { ...DEFAULT_CONFIG, ...config };
  return new Fuse(options, fuseConfig);
}

/**
 * Search options with fuzzy matching
 */
export function fuzzySearch(
  query: string,
  options: ComboboxOption[],
  config: Partial<FuzzySearchConfig> = {}
): ComboboxOption[] {
  if (!query || query.trim().length === 0) {
    return options;
  }

  const fuse = createFuzzySearch(options, config);
  const results = fuse.search(query);

  // Sort by score (lower is better in Fuse.js)
  return results
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .map(result => result.item);
}

/**
 * Highlight matched characters in a string
 */
export function highlightMatches(
  text: string,
  query: string
): HighlightedMatch[] {
  if (!query || query.trim().length === 0) {
    return [{ text, isMatch: false }];
  }

  const fuse = new Fuse([{ text }], {
    keys: ['text'],
    includeMatches: true,
    threshold: 0.3,
    minMatchCharLength: 1,
  });

  const results = fuse.search(query);

  if (results.length === 0 || !results[0].matches) {
    return [{ text, isMatch: false }];
  }

  const matches = results[0].matches[0];
  if (!matches || !matches.indices) {
    return [{ text, isMatch: false }];
  }

  const highlighted: HighlightedMatch[] = [];
  let lastIndex = 0;

  // Sort indices by start position
  const sortedIndices = [...matches.indices].sort((a, b) => a[0] - b[0]);

  sortedIndices.forEach(([start, end]) => {
    // Add non-matched text before this match
    if (start > lastIndex) {
      highlighted.push({
        text: text.slice(lastIndex, start),
        isMatch: false,
      });
    }

    // Add matched text
    highlighted.push({
      text: text.slice(start, end + 1),
      isMatch: true,
    });

    lastIndex = end + 1;
  });

  // Add remaining non-matched text
  if (lastIndex < text.length) {
    highlighted.push({
      text: text.slice(lastIndex),
      isMatch: false,
    });
  }

  return highlighted;
}

/**
 * Rank search results by relevance
 * Priority: 1. Exact matches, 2. Prefix matches, 3. Fuzzy matches
 */
export function rankSearchResults(
  query: string,
  options: ComboboxOption[]
): ComboboxOption[] {
  if (!query || query.trim().length === 0) {
    return options;
  }

  const lowerQuery = query.toLowerCase();

  const exactMatches: ComboboxOption[] = [];
  const prefixMatches: ComboboxOption[] = [];
  const fuzzyMatches: ComboboxOption[] = [];

  options.forEach(option => {
    const lowerLabel = option.label.toLowerCase();
    const lowerValue = option.value.toLowerCase();

    if (lowerLabel === lowerQuery || lowerValue === lowerQuery) {
      exactMatches.push(option);
    } else if (lowerLabel.startsWith(lowerQuery) || lowerValue.startsWith(lowerQuery)) {
      prefixMatches.push(option);
    } else {
      fuzzyMatches.push(option);
    }
  });

  // Fuzzy search only on the remaining options
  const fuzzyResults = fuzzySearch(query, fuzzyMatches);

  return [...exactMatches, ...prefixMatches, ...fuzzyResults];
}

/**
 * Multi-token search (supports searching with multiple words)
 */
export function multiTokenSearch(
  query: string,
  options: ComboboxOption[]
): ComboboxOption[] {
  if (!query || query.trim().length === 0) {
    return options;
  }

  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

  if (tokens.length === 0) {
    return options;
  }

  // Filter options that match ALL tokens
  return options.filter(option => {
    const searchText = `${option.label} ${option.value}`.toLowerCase();
    return tokens.every(token => searchText.includes(token));
  });
}

/**
 * Combined search: multi-token + fuzzy + ranking
 */
export function smartSearch(
  query: string,
  options: ComboboxOption[],
  config: Partial<FuzzySearchConfig> = {}
): ComboboxOption[] {
  if (!query || query.trim().length === 0) {
    return options;
  }

  // First, apply multi-token filtering
  const tokenFiltered = multiTokenSearch(query, options);

  // Then, rank the results
  return rankSearchResults(query, tokenFiltered);
}

