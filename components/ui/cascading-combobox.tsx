"use client";

/**
 * Cascading Autocomplete Combobox Component
 * 
 * A production-ready autocomplete component with:
 * - Independent and cascading field support
 * - Fuzzy search with match highlighting
 * - ETag-based caching
 * - Full keyboard navigation
 * - WCAG 2.1 AA accessibility
 */

import React, { useReducer, useEffect, useRef, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/lib/utils/cn';
import { smartSearch, highlightMatches } from '@/lib/utils/fuzzy-search';
import { useDebouncedSearch, usePrefetch } from '@/lib/hooks/use-debounced-search';
import type {
  CascadingComboboxProps,
  ComboboxState,
  ComboboxAction,
  ComboboxOption,
} from '@/lib/types/combobox';

/**
 * Reducer for managing combobox state
 */
function comboboxReducer(state: ComboboxState, action: ComboboxAction): ComboboxState {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'SET_SELECTED_VALUE':
      return { ...state, selectedValue: action.payload, inputValue: action.payload };
    case 'SET_OPTIONS':
      return { ...state, options: action.payload };
    case 'SET_FILTERED_OPTIONS':
      return { ...state, filteredOptions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    case 'SET_VALIDATION_ERROR':
      return { ...state, validationError: action.payload };
    case 'SET_TOUCHED':
      return { ...state, isTouched: action.payload };
    case 'RESET':
      return {
        inputValue: '',
        selectedValue: '',
        options: [],
        filteredOptions: [],
        isLoading: false,
        error: null,
        isOpen: false,
        validationError: null,
        isTouched: false,
      };
    default:
      return state;
  }
}

/**
 * Initial state for the combobox
 */
const initialState: ComboboxState = {
  inputValue: '',
  selectedValue: '',
  options: [],
  filteredOptions: [],
  isLoading: false,
  error: null,
  isOpen: false,
  validationError: null,
  isTouched: false,
};

export function CascadingCombobox({
  label,
  placeholder = 'Select or type...',
  endpoint,
  value,
  onChange,
  required = false,
  disabled = false,
  parentFilters = {},
  debounceMs = 300,
  minChars = 2,
  validationRules,
  onError,
  allowCustom = true,
  className,
  id,
  name,
  prefetch = false,
}: CascadingComboboxProps) {
  const [state, dispatch] = useReducer(comboboxReducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  // Determine if parent filters are satisfied
  const hasParentDependencies = Object.keys(parentFilters).length > 0;
  const parentFiltersSatisfied = hasParentDependencies
    ? Object.values(parentFilters).every(v => v !== null && v !== undefined && v !== '')
    : true;

  // Prefetch data if enabled and no parent dependencies
  const prefetchResult = usePrefetch(
    endpoint,
    parentFilters,
    prefetch && parentFiltersSatisfied && !hasParentDependencies
  );

  // Debounced search
  const searchResult = useDebouncedSearch(state.inputValue, {
    endpoint,
    debounceMs,
    minChars,
    parentFilters,
    enabled: !prefetch && parentFiltersSatisfied && state.inputValue.length >= minChars,
    onError,
  });

  // Use prefetch data or search data
  const { data: fetchedData, isLoading: fetchLoading, error: fetchError } = prefetch
    ? prefetchResult
    : searchResult;

  // Update options when data changes
  useEffect(() => {
    dispatch({ type: 'SET_OPTIONS', payload: fetchedData });
    dispatch({ type: 'SET_LOADING', payload: fetchLoading });
    if (fetchError) {
      dispatch({ type: 'SET_ERROR', payload: fetchError.message });
    }
  }, [fetchedData, fetchLoading, fetchError]);

  // Filter options based on input
  const filteredOptions = useMemo(() => {
    if (!state.inputValue || prefetch) {
      return smartSearch(state.inputValue, state.options);
    }
    return state.options;
  }, [state.inputValue, state.options, prefetch]);

  // Update filtered options
  useEffect(() => {
    dispatch({ type: 'SET_FILTERED_OPTIONS', payload: filteredOptions });
  }, [filteredOptions]);

  // Sync external value with internal state
  useEffect(() => {
    if (value !== state.selectedValue) {
      dispatch({ type: 'SET_SELECTED_VALUE', payload: value });
    }
  }, [value]);

  // Reset when parent filters change
  useEffect(() => {
    if (hasParentDependencies) {
      dispatch({ type: 'RESET' });
      onChange('');
    }
  }, [JSON.stringify(parentFilters)]);

  // Validate on blur
  const handleBlur = () => {
    dispatch({ type: 'SET_TOUCHED', payload: true });

    if (validationRules) {
      const result = validationRules(state.selectedValue);
      if (typeof result === 'string') {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: result });
      } else if (!result) {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: 'Invalid value' });
      } else {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: null });
      }
    }

    if (required && !state.selectedValue) {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: 'This field is required' });
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    dispatch({ type: 'SET_INPUT_VALUE', payload: newValue });
    dispatch({ type: 'SET_OPEN', payload: true });
    setHighlightedIndex(0);

    // Clear validation error when user starts typing
    if (state.isTouched && state.validationError) {
      dispatch({ type: 'SET_VALIDATION_ERROR', payload: null });
    }
  };

  // Handle option selection
  const handleSelectOption = (option: ComboboxOption) => {
    dispatch({ type: 'SET_SELECTED_VALUE', payload: option.value });
    dispatch({ type: 'SET_INPUT_VALUE', payload: option.label });
    dispatch({ type: 'SET_OPEN', payload: false });
    onChange(option.value);
  };

  // Handle custom value creation
  const handleCreateCustom = () => {
    if (allowCustom && state.inputValue) {
      dispatch({ type: 'SET_SELECTED_VALUE', payload: state.inputValue });
      dispatch({ type: 'SET_OPEN', payload: false });
      onChange(state.inputValue);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!state.isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        dispatch({ type: 'SET_OPEN', payload: true });
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < state.filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (state.filteredOptions[highlightedIndex]) {
          handleSelectOption(state.filteredOptions[highlightedIndex]);
        } else if (allowCustom && state.inputValue) {
          handleCreateCustom();
        }
        break;
      case 'Escape':
        e.preventDefault();
        dispatch({ type: 'SET_OPEN', payload: false });
        break;
      case 'Tab':
        dispatch({ type: 'SET_OPEN', payload: false });
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (state.isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, state.isOpen]);

  const showError = state.isTouched && state.validationError;
  const isDisabled = disabled || !parentFiltersSatisfied;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label.Root htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label.Root>

      <Popover.Root open={state.isOpen} onOpenChange={(open) => dispatch({ type: 'SET_OPEN', payload: open })}>
        <Popover.Trigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              id={id}
              name={name}
              type="text"
              value={state.inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              placeholder={isDisabled && hasParentDependencies ? 'Select parent field first' : placeholder}
              aria-invalid={showError ? 'true' : 'false'}
              aria-describedby={showError ? `${id}-error` : undefined}
              aria-autocomplete="list"
              aria-controls={`${id}-listbox`}
              aria-expanded={state.isOpen}
              role="combobox"
              className={cn(
                'w-full px-3 py-2 text-sm rounded-md border border-input bg-background',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                showError && 'border-destructive focus:ring-destructive'
              )}
            />
            {state.isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'z-50 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto',
              'rounded-md border border-border bg-popover shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
            sideOffset={4}
            align="start"
          >
            <div
              ref={listRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={label}
              className="p-1"
            >
              {state.filteredOptions.length === 0 && allowCustom && state.inputValue && (
                <button
                  type="button"
                  onClick={handleCreateCustom}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm rounded-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                  )}
                >
                  Create new: <span className="font-semibold">{state.inputValue}</span>
                </button>
              )}

              {state.filteredOptions.map((option, index) => {
                const matches = highlightMatches(option.label, state.inputValue);
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={index === highlightedIndex}
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm rounded-sm',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                      index === highlightedIndex && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {matches.map((match, i) => (
                      <span
                        key={i}
                        className={match.isMatch ? 'font-semibold text-primary' : ''}
                      >
                        {match.text}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {showError && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {state.validationError}
        </p>
      )}

      {state.error && !showError && (
        <p className="text-sm text-muted-foreground">
          Failed to load options. Please try again.
        </p>
      )}
    </div>
  );
}

