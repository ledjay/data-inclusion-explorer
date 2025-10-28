/**
 * Filter Type System
 * Defines all types and interfaces for the filter sidebar feature
 */

/**
 * Supported filter types
 */
export type FilterType = 'categorical' | 'numeric' | 'boolean' | 'range';

/**
 * Available filter categories for organization
 */
export type FilterCategoryId = 
  | 'location' 
  | 'service-type' 
  | 'quality' 
  | 'cost' 
  | 'audience' 
  | 'themes' 
  | 'access' 
  | 'source' 
  | 'other';

/**
 * Represents a single selectable value within a categorical filter
 */
export interface FilterOption {
  /** Unique value for this option */
  value: string;

  /** Display label for UI */
  label: string;

  /** Number of services matching this option (optional, for UX enhancement) */
  count?: number;

  /** Whether this option is currently available */
  available: boolean;

  /** Grouping for nested options (optional) */
  group?: string;
}

/**
 * Represents a searchable parameter supported by the Data Inclusion API
 */
export interface Filter {
  /** Unique identifier matching API parameter name */
  id: string;

  /** Display label for UI (human-readable) */
  label: string;

  /** Filter type determines UI control and validation */
  type: FilterType;

  /** Category for grouping in sidebar */
  category: FilterCategoryId;

  /** Description of filter purpose (optional tooltip) */
  description?: string;

  /** For categorical filters: available options */
  options?: FilterOption[];

  /** For numeric/range filters: minimum value constraint */
  min?: number;

  /** For numeric/range filters: maximum value constraint */
  max?: number;

  /** For numeric/range filters: step size for increments */
  step?: number;

  /** For numeric/range filters: unit of measurement */
  unit?: string;

  /** Default value when filter not applied */
  defaultValue: string | number | boolean | null;

  /** Whether filter is required or optional */
  required: boolean;

  /** URL parameter name (may differ from id for legacy reasons) */
  paramName: string;

  /** Validation rules */
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

/**
 * Represents the current state of applied filters in the application
 */
export interface FilterState {
  /** Map of filter ID to applied value(s) */
  applied: Record<string, string | number | boolean | string[]>;

  /** Timestamp of last update */
  updatedAt: number;

  /** Whether filters are currently loading */
  loading: boolean;

  /** Error state if filter fetch failed */
  error?: string;
}

/**
 * Represents a logical grouping of related filters
 */
export interface FilterCategory {
  /** Unique category identifier */
  id: FilterCategoryId;

  /** Display label for category */
  label: string;

  /** Filters in this category */
  filters: Filter[];

  /** Display order (lower numbers appear first) */
  order: number;

  /** Whether category is expanded by default */
  expanded: boolean;
}
