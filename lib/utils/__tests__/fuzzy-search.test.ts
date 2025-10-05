/**
 * Tests for fuzzy search utilities
 */

import { fuzzySearch, highlightMatches, rankSearchResults, smartSearch } from '../fuzzy-search';
import type { ComboboxOption } from '@/lib/types/combobox';

describe('fuzzySearch', () => {
  const options: ComboboxOption[] = [
    { value: '1', label: 'Nike Air Max' },
    { value: '2', label: 'Adidas Ultraboost' },
    { value: '3', label: 'Puma Suede' },
    { value: '4', label: 'Nike Air Force' },
    { value: '5', label: 'New Balance 990' },
  ];

  it('should return all options when query is empty', () => {
    const results = fuzzySearch('', options);
    expect(results).toEqual(options);
  });

  it('should find exact matches', () => {
    const results = fuzzySearch('Nike', options);
    expect(results).toHaveLength(2);
    expect(results[0].label).toContain('Nike');
  });

  it('should find fuzzy matches', () => {
    const results = fuzzySearch('nke', options);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].label).toContain('Nike');
  });

  it('should handle case-insensitive search', () => {
    const results = fuzzySearch('NIKE', options);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('highlightMatches', () => {
  it('should return non-highlighted text when query is empty', () => {
    const result = highlightMatches('Nike Air Max', '');
    expect(result).toEqual([{ text: 'Nike Air Max', isMatch: false }]);
  });

  it('should highlight matched characters', () => {
    const result = highlightMatches('Nike Air Max', 'Nike');
    expect(result.some(segment => segment.isMatch)).toBe(true);
  });

  it('should handle no matches', () => {
    const result = highlightMatches('Nike Air Max', 'xyz');
    expect(result).toEqual([{ text: 'Nike Air Max', isMatch: false }]);
  });
});

describe('rankSearchResults', () => {
  const options: ComboboxOption[] = [
    { value: '1', label: 'Nike Air Max' },
    { value: '2', label: 'Air Jordan' },
    { value: '3', label: 'Adidas Air' },
    { value: '4', label: 'Nike' },
  ];

  it('should prioritize exact matches', () => {
    const results = rankSearchResults('Nike', options);
    expect(results[0].label).toBe('Nike');
  });

  it('should prioritize prefix matches over fuzzy matches', () => {
    const results = rankSearchResults('Air', options);
    expect(results[0].label).toContain('Air');
  });

  it('should return all options when query is empty', () => {
    const results = rankSearchResults('', options);
    expect(results).toEqual(options);
  });
});

describe('smartSearch', () => {
  const options: ComboboxOption[] = [
    { value: '1', label: 'Nike Air Max 90' },
    { value: '2', label: 'Nike Air Max 95' },
    { value: '3', label: 'Adidas Ultraboost' },
    { value: '4', label: 'Puma Suede Classic' },
  ];

  it('should handle multi-token search', () => {
    const results = smartSearch('Nike Air', options);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].label).toContain('Nike');
    expect(results[0].label).toContain('Air');
  });

  it('should rank results appropriately', () => {
    const results = smartSearch('Nike', options);
    expect(results[0].label).toContain('Nike');
  });

  it('should return all options when query is empty', () => {
    const results = smartSearch('', options);
    expect(results).toEqual(options);
  });
});

