/**
 * Type definitions for the Cascading Autocomplete Combobox component
 */

/**
 * Represents a single option in the combobox dropdown
 */
export interface ComboboxOption {
  /** Unique identifier for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Optional metadata for the option */
  metadata?: Record<string, unknown>;
}

/**
 * API response structure for combobox data
 */
export interface ComboboxApiResponse {
  /** Array of options returned from the API */
  data: ComboboxOption[];
  /** ETag header value for cache validation */
  etag?: string;
  /** Total count of available options (for pagination) */
  total?: number;
}

/**
 * Cache entry structure stored in sessionStorage
 */
export interface CacheEntry {
  /** Cached data */
  data: ComboboxOption[];
  /** ETag value from the API response */
  etag: string;
  /** Timestamp when the cache entry was created */
  timestamp: number;
  /** Cache key (combination of endpoint + filters) */
  key: string;
}

/**
 * Parent filter object for cascading dependencies
 */
export interface ParentFilters {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Validation function type
 */
export type ValidationFunction = (value: string) => boolean | string;

/**
 * Error callback function type
 */
export type ErrorCallback = (error: Error) => void;

/**
 * Props for the CascadingCombobox component
 */
export interface CascadingComboboxProps {
  /** Accessible label for the combobox */
  label: string;
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** API endpoint URL for fetching options */
  endpoint: string;
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Parent field values for cascading queries */
  parentFilters?: ParentFilters;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Minimum characters before triggering search (default: 2) */
  minChars?: number;
  /** Validation function or schema */
  validationRules?: ValidationFunction;
  /** Error callback */
  onError?: ErrorCallback;
  /** Whether to allow custom values not in the list */
  allowCustom?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Optional ID for the input element */
  id?: string;
  /** Optional name for the input element */
  name?: string;
  /** Whether to prefetch data on mount */
  prefetch?: boolean;
}

/**
 * State for the combobox component
 */
export interface ComboboxState {
  /** Current input value */
  inputValue: string;
  /** Selected value */
  selectedValue: string;
  /** Available options */
  options: ComboboxOption[];
  /** Filtered options based on search */
  filteredOptions: ComboboxOption[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Whether the popover is open */
  isOpen: boolean;
  /** Validation error message */
  validationError: string | null;
  /** Whether the field has been touched (for validation) */
  isTouched: boolean;
}

/**
 * Actions for the combobox reducer
 */
export type ComboboxAction =
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_SELECTED_VALUE'; payload: string }
  | { type: 'SET_OPTIONS'; payload: ComboboxOption[] }
  | { type: 'SET_FILTERED_OPTIONS'; payload: ComboboxOption[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_VALIDATION_ERROR'; payload: string | null }
  | { type: 'SET_TOUCHED'; payload: boolean }
  | { type: 'RESET' };

/**
 * Fuzzy search configuration
 */
export interface FuzzySearchConfig {
  /** Keys to search in the option object */
  keys: string[];
  /** Threshold for fuzzy matching (0.0 = exact, 1.0 = match anything) */
  threshold: number;
  /** Whether to include score in results */
  includeScore: boolean;
  /** Whether to include matches for highlighting */
  includeMatches: boolean;
  /** Minimum character length for search */
  minMatchCharLength: number;
}

/**
 * Highlighted match for search results
 */
export interface HighlightedMatch {
  /** The matched text */
  text: string;
  /** Whether this segment is a match */
  isMatch: boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Time-to-live in milliseconds (default: 24 hours) */
  ttl: number;
  /** Maximum number of cache entries (LRU eviction) */
  maxEntries: number;
  /** Storage key prefix */
  keyPrefix: string;
}

/**
 * Network request state
 */
export interface NetworkRequest {
  /** Request ID */
  id: string;
  /** Endpoint being called */
  endpoint: string;
  /** Request timestamp */
  timestamp: number;
  /** Request status */
  status: 'pending' | 'success' | 'error';
  /** Response time in milliseconds */
  responseTime?: number;
}

/**
 * Debug panel state (for development)
 */
export interface DebugPanelState {
  /** Current field values */
  values: Record<string, string>;
  /** Cache entries */
  cache: CacheEntry[];
  /** Loading states */
  loadingStates: Record<string, boolean>;
  /** Network requests */
  networkRequests: NetworkRequest[];
}

