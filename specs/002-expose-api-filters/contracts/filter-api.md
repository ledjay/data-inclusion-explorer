# Filter API Contracts

**Feature**: Expose All Data Inclusion API Filters to Sidebar  
**Date**: Oct 28, 2025  
**Status**: Complete

## Overview

This document defines the internal API contracts for filter management. These are not external APIs but rather the interfaces between frontend components.

---

## Component Interfaces

### ServiceFilters Component

**Purpose**: Main filter sidebar component that orchestrates filter display and state management.

**Props**:
```typescript
interface ServiceFiltersProps {
  // Optional: callback when filters change
  onFilterChange?: (filters: Record<string, any>) => void;
}
```

**State**:
```typescript
interface ServiceFiltersState {
  // Current filter values from URL
  filters: Record<string, string | number | boolean>;
  
  // Loading state while fetching filter options
  loading: boolean;
  
  // Error message if filter fetch failed
  error: string | null;
  
  // Organized filter categories
  categories: FilterCategory[];
}
```

**Events**:
- `onFilterChange`: Emitted when user changes a filter value
- `onReset`: Emitted when user resets all filters
- `onClearFilter`: Emitted when user clears a single filter

---

### FilterCategory Component

**Purpose**: Renders a group of related filters with optional collapsible behavior.

**Props**:
```typescript
interface FilterCategoryProps {
  // Category definition
  category: FilterCategory;
  
  // Current filter values
  values: Record<string, any>;
  
  // Callback when filter value changes
  onChange: (filterId: string, value: any) => void;
  
  // Callback when filter is cleared
  onClear: (filterId: string) => void;
}
```

**Rendering**:
- Category label with optional expand/collapse icon
- List of FilterControl components for each filter in category
- Visual grouping with spacing or borders

---

### FilterControl Component

**Purpose**: Renders a single filter control appropriate to the filter type.

**Props**:
```typescript
interface FilterControlProps {
  // Filter definition
  filter: Filter;
  
  // Current value (or null if not applied)
  value: string | number | boolean | null;
  
  // Callback when value changes
  onChange: (value: any) => void;
  
  // Callback when filter is cleared
  onClear: () => void;
  
  // Loading state
  loading?: boolean;
  
  // Error message
  error?: string;
}
```

**Rendering by Type**:

#### Categorical Filter
- Component: `Popover` + `Command` (from shadcn/ui)
- Display: Dropdown button with search
- Interaction: Click to open, type to search, click to select
- Clear: "Reset" button below dropdown

#### Numeric Filter
- Component: `Slider` (from shadcn/ui)
- Display: Slider with min/max labels
- Interaction: Drag slider or click on track
- Clear: "Reset" button below slider

#### Boolean Filter
- Component: `RadioGroup` (from shadcn/ui)
- Display: Two radio buttons (Yes/No or On/Off)
- Interaction: Click radio button
- Clear: Select "All" option

#### Range Filter
- Component: Two `Input` fields + visual range display
- Display: Min and max input boxes
- Interaction: Type values or use spinner controls
- Validation: Min ≤ Max

---

## Utility Functions

### filter-utils.ts

```typescript
// Validate a filter value against its definition
export function validateFilterValue(
  filter: Filter,
  value: any
): { valid: boolean; error?: string };

// Sanitize URL parameters to only include known filters
export function sanitizeUrlParams(
  params: URLSearchParams,
  knownFilters: Filter[]
): URLSearchParams;

// Convert filter state to URL query string
export function filterStateToUrlParams(
  state: Record<string, any>,
  filters: Filter[]
): string;

// Convert URL query string to filter state
export function urlParamsToFilterState(
  params: URLSearchParams,
  filters: Filter[]
): Record<string, any>;

// Get all filters organized by category
export function getFiltersByCategory(
  filters: Filter[]
): FilterCategory[];

// Check if a filter value is the default/unset value
export function isFilterDefault(
  filter: Filter,
  value: any
): boolean;
```

---

## Data Transformation Pipeline

### URL → Filter State

```
URL Query String
    ↓
URLSearchParams
    ↓
sanitizeUrlParams() → remove unknown filters
    ↓
urlParamsToFilterState() → convert to typed values
    ↓
validateFilterValue() for each → ensure valid
    ↓
Filter State Object
```

### Filter State → URL

```
Filter State Object
    ↓
filterStateToUrlParams() → convert to strings
    ↓
URLSearchParams
    ↓
URL Query String
```

---

## Error Handling

### Validation Errors

When a filter value fails validation:
1. Log warning in development
2. Silently remove invalid parameter
3. Continue with remaining valid filters
4. Display error state in UI if critical

### Fetch Errors

When filter configuration fails to load:
1. Set `loading = false`, `error = "message"`
2. Display error message to user
3. Provide retry button
4. Fall back to minimal filter set if available

### API Errors

When service search fails due to invalid filters:
1. Log error with filter parameters
2. Display user-friendly error message
3. Suggest clearing filters to retry
4. Maintain current filter state for user to modify

---

## Type Safety

All filter operations are fully typed:

```typescript
// Type-safe filter value getter
export function getFilterValue<T extends Filter>(
  state: Record<string, any>,
  filter: T
): T extends { type: 'numeric' } ? number : string;

// Type-safe filter validation
export function validateFilter<T extends Filter>(
  filter: T,
  value: any
): value is T extends { type: 'numeric' } ? number : string;
```

---

## Performance Considerations

1. **Memoization**: FilterControl components should be memoized to prevent unnecessary re-renders
2. **Debouncing**: URL updates should be debounced (300ms) to avoid excessive re-renders
3. **Lazy Loading**: Filter options for large categorical filters could be virtualized
4. **Caching**: No caching per specification; each interaction fetches fresh state

---

## Accessibility Requirements

1. All filter controls must have associated labels
2. Keyboard navigation must work for all controls
3. ARIA attributes must be properly set
4. Error messages must be announced to screen readers
5. Loading states must be communicated
6. Focus management must be maintained during interactions

---

## Testing Contracts

### Unit Tests

```typescript
// filter-utils.test.ts
describe('validateFilterValue', () => {
  test('accepts valid categorical value');
  test('rejects invalid categorical value');
  test('accepts valid numeric value within range');
  test('rejects numeric value outside range');
});

describe('sanitizeUrlParams', () => {
  test('removes unknown filter parameters');
  test('preserves known filter parameters');
  test('handles empty parameters');
});
```

### E2E Tests

```typescript
// filters.spec.ts
describe('Filter Sidebar', () => {
  test('displays all filter categories');
  test('applies categorical filter and updates results');
  test('applies numeric filter and updates results');
  test('combines multiple filters');
  test('clears individual filter');
  test('resets all filters');
  test('persists filter state in URL');
  test('restores filters from URL on page load');
  test('handles unsupported URL parameters gracefully');
  test('displays error state when filter fetch fails');
});
```

