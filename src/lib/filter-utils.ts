/**
 * Filter Utility Functions
 * Handles validation, transformation, and state management for filters
 */

import { Filter } from '~/types/filter';
import { FILTER_MAP, PARAM_NAME_MAP, ALL_FILTERS } from '~/config/filters.config';

/**
 * Validates a filter value against its definition
 * @param filter - The filter definition
 * @param value - The value to validate
 * @returns Validation result with error message if invalid
 */
export function validateFilterValue(
  filter: Filter,
  value: string | number | boolean | null | undefined
): { valid: boolean; error?: string } {
  // Null/undefined is valid (filter not applied)
  if (value === null || value === undefined) {
    return { valid: true };
  }

  switch (filter.type) {
    case 'categorical':
      if (!filter.options?.some(opt => opt.value === value)) {
        return { valid: false, error: `Invalid option: ${value}` };
      }
      return { valid: true };

    case 'numeric':
      const num = Number(value);
      if (isNaN(num)) {
        return { valid: false, error: 'Must be a number' };
      }
      if (filter.min !== undefined && num < filter.min) {
        return { valid: false, error: `Must be >= ${filter.min}` };
      }
      if (filter.max !== undefined && num > filter.max) {
        return { valid: false, error: `Must be <= ${filter.max}` };
      }
      return { valid: true };

    case 'boolean':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Must be true or false' };
      }
      return { valid: true };

    case 'range':
      // Range validation would go here
      return { valid: true };

    default:
      return { valid: true };
  }
}

/**
 * Sanitizes URL parameters to only include known filters
 * Removes unsupported parameters and validates values
 * @param params - URLSearchParams to sanitize
 * @param knownFilters - List of known filters (defaults to ALL_FILTERS)
 * @returns Sanitized URLSearchParams
 */
export function sanitizeUrlParams(
  params: URLSearchParams,
  knownFilters: Filter[] = ALL_FILTERS
): URLSearchParams {
  const sanitized = new URLSearchParams();
  const knownParamNames = new Set(knownFilters.map(f => f.paramName));

  for (const [key, value] of params) {
    if (knownParamNames.has(key)) {
      const filter = knownFilters.find(f => f.paramName === key);
      if (filter) {
        const validation = validateFilterValue(filter, value);
        if (validation.valid) {
          sanitized.set(key, value);
        } else if (process.env.NODE_ENV === 'development') {
          console.warn(`Invalid filter value for ${key}: ${value}`, validation.error);
        }
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown filter parameter: ${key}`);
    }
  }

  return sanitized;
}

/**
 * Converts URL parameters to typed filter state
 * @param params - URLSearchParams to convert
 * @param knownFilters - List of known filters (defaults to ALL_FILTERS)
 * @returns Filter state object with typed values
 */
export function urlParamsToFilterState(
  params: URLSearchParams,
  knownFilters: Filter[] = ALL_FILTERS
): Record<string, string | number | boolean> {
  const state: Record<string, string | number | boolean> = {};

  for (const filter of knownFilters) {
    const value = params.get(filter.paramName);
    if (value !== null) {
      const validation = validateFilterValue(filter, value);
      if (validation.valid) {
        // Convert to appropriate type
        if (filter.type === 'numeric') {
          state[filter.id] = Number(value);
        } else if (filter.type === 'boolean') {
          state[filter.id] = value === 'true';
        } else {
          state[filter.id] = value;
        }
      }
    }
  }

  return state;
}

/**
 * Converts filter state to URL query parameters
 * Only includes non-default values
 * @param state - Filter state object
 * @param knownFilters - List of known filters (defaults to ALL_FILTERS)
 * @returns URLSearchParams with filter values
 */
export function filterStateToUrlParams(
  state: Record<string, string | number | boolean | null | undefined>,
  knownFilters: Filter[] = ALL_FILTERS
): URLSearchParams {
  const params = new URLSearchParams();

  for (const filter of knownFilters) {
    const value = state[filter.id];
    if (value !== null && value !== undefined && value !== filter.defaultValue) {
      const validation = validateFilterValue(filter, value);
      if (validation.valid) {
        params.set(filter.paramName, String(value));
      }
    }
  }

  return params;
}

/**
 * Checks if a filter value is the default/unset value
 * @param filter - The filter definition
 * @param value - The value to check
 * @returns True if value is default or unset
 */
export function isFilterDefault(filter: Filter, value: string | number | boolean | null | undefined): boolean {
  return value === null || value === undefined || value === filter.defaultValue;
}

/**
 * Gets a filter definition by ID
 * @param filterId - The filter ID
 * @returns The filter definition or undefined
 */
export function getFilterById(filterId: string): Filter | undefined {
  return FILTER_MAP.get(filterId);
}

/**
 * Gets a filter definition by parameter name
 * @param paramName - The parameter name
 * @returns The filter definition or undefined
 */
export function getFilterByParamName(paramName: string): Filter | undefined {
  return PARAM_NAME_MAP.get(paramName);
}
