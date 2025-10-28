# Phase 1: Data Model

**Feature**: Expose All Data Inclusion API Filters to Sidebar  
**Date**: Oct 28, 2025  
**Status**: Complete

## Entity Definitions

### Filter

Represents a searchable parameter supported by the Data Inclusion API.

```typescript
interface Filter {
  // Unique identifier matching API parameter name
  id: string;
  
  // Display label for UI (human-readable)
  label: string;
  
  // Filter type determines UI control and validation
  type: 'categorical' | 'numeric' | 'boolean' | 'range';
  
  // Category for grouping in sidebar
  category: 'location' | 'service-type' | 'quality' | 'cost' | 'other';
  
  // Description of filter purpose (optional tooltip)
  description?: string;
  
  // For categorical filters: available options
  options?: FilterOption[];
  
  // For numeric/range filters: constraints
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  
  // Default value when filter not applied
  defaultValue: string | number | boolean | null;
  
  // Whether filter is required or optional
  required: boolean;
  
  // URL parameter name (may differ from id for legacy reasons)
  paramName: string;
  
  // Validation rules
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}
```

### FilterOption

Represents a single selectable value within a categorical filter.

```typescript
interface FilterOption {
  // Unique value for this option
  value: string;
  
  // Display label for UI
  label: string;
  
  // Number of services matching this option (optional, for UX enhancement)
  count?: number;
  
  // Whether this option is currently available
  available: boolean;
  
  // Grouping for nested options (optional)
  group?: string;
}
```

### FilterState

Represents the current state of applied filters in the application.

```typescript
interface FilterState {
  // Map of filter ID to applied value(s)
  applied: Record<string, string | number | boolean | string[]>;
  
  // Timestamp of last update
  updatedAt: number;
  
  // Whether filters are currently loading
  loading: boolean;
  
  // Error state if filter fetch failed
  error?: string;
}
```

### FilterCategory

Represents a logical grouping of related filters.

```typescript
interface FilterCategory {
  // Unique category identifier
  id: 'location' | 'service-type' | 'quality' | 'cost' | 'other';
  
  // Display label for category
  label: string;
  
  // Filters in this category
  filters: Filter[];
  
  // Display order (lower numbers appear first)
  order: number;
  
  // Whether category is expanded by default
  expanded: boolean;
}
```

---

## Data Relationships

```
FilterCategory (1) ──→ (many) Filter
                              ↓
                        FilterOption (many)
                        
FilterState
  └─→ applied: Record<Filter.id, value>
```

---

## State Transitions

### Filter Application Flow

```
User selects filter value
    ↓
FilterControl validates value
    ↓
ServiceFilters updates URL params
    ↓
page.tsx detects URL change
    ↓
fetchServices() called with new filters
    ↓
Results updated
    ↓
FilterState.loading = false
```

### Error Handling Flow

```
Filter fetch fails
    ↓
FilterState.error = "message"
    ↓
UI displays error state
    ↓
User can retry or modify filters
    ↓
Error cleared on successful fetch
```

---

## Validation Rules

### Filter Value Validation

- **Categorical**: Value must be in `options` array
- **Numeric**: Value must be between `min` and `max`, respect `step`
- **Boolean**: Value must be `true` or `false`
- **Range**: Both min and max must be valid numbers, min ≤ max

### URL Parameter Validation

- Unknown filter parameters are silently removed
- Invalid values are sanitized or removed
- Multiple values for single-value filters use first value only
- Empty parameters are treated as filter not applied

---

## Configuration Structure

Filters are defined in `src/config/filters.config.ts`:

```typescript
export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'location',
    label: 'Location',
    order: 1,
    expanded: true,
    filters: [
      {
        id: 'code_commune',
        label: 'Commune',
        type: 'categorical',
        category: 'location',
        paramName: 'code_commune',
        required: false,
        defaultValue: null,
        options: [], // Populated dynamically from API
      },
      // ... more filters
    ],
  },
  // ... more categories
];
```

---

## Type Definitions

All types are defined in `src/types/filter.ts`:

```typescript
export type FilterType = 'categorical' | 'numeric' | 'boolean' | 'range';
export type FilterCategory = 'location' | 'service-type' | 'quality' | 'cost' | 'other';

export interface Filter { /* ... */ }
export interface FilterOption { /* ... */ }
export interface FilterState { /* ... */ }
export interface FilterCategory { /* ... */ }
```

---

## Key Constraints

1. **Immutability**: Filter configuration is read-only; changes require code update
2. **Uniqueness**: Filter IDs must be unique within a category
3. **Consistency**: `paramName` must match actual API parameter names
4. **Validation**: All filter values must be validated before passing to API
5. **Accessibility**: All filters must have human-readable labels
6. **Performance**: Filter metadata should be loaded once per session
7. **Graceful Degradation**: Unknown filters should be silently ignored

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ ServiceFilters Component                                    │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Load filters.config.ts                                   ││
│ │ Group by FilterCategory                                  ││
│ │ Render FilterCategory components                         ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ FilterCategory Component (per category)                     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Render category label                                    ││
│ │ Render FilterControl for each filter in category         ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ FilterControl Component (per filter)                        │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Determine control type based on filter.type              ││
│ │ Render appropriate UI (dropdown, slider, radio, etc.)    ││
│ │ Handle user interaction                                  ││
│ │ Validate value                                           ││
│ │ Update URL params                                        ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ page.tsx (HomeContent)                                      │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Detect URL parameter changes                             ││
│ │ Call fetchServices() with updated filters                ││
│ │ Update service results                                   ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Data Inclusion API                                          │
│ /search/services?code_commune=...&types=...&...            │
└─────────────────────────────────────────────────────────────┘
```

