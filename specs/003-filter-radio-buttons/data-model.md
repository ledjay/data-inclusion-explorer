# Data Model: Filter Radio Button UX Enhancement

**Feature**: Filter Radio Button UX Enhancement  
**Branch**: `003-filter-radio-buttons`  
**Date**: Oct 28, 2025

## Overview

This feature is a UI-only enhancement that does not introduce new data models or modify existing ones. All data structures remain unchanged. This document describes the existing entities involved in the feature for reference.

## Existing Entities (Unchanged)

### Filter

Represents a filter configuration used to narrow down service results.

**Purpose**: Defines the metadata and behavior for a single filter in the sidebar.

**Key Attributes**:
- `id` (string): Unique identifier for the filter (e.g., "frais", "modes_accueil")
- `label` (string): Human-readable label displayed in the UI (e.g., "Frais", "Mode d'accueil")
- `type` (string): Filter type - "categorical", "numeric", or "boolean"
- `category` (string): Grouping category (e.g., "cost", "access")
- `paramName` (string): URL parameter name for this filter (e.g., "frais", "modes_accueil")
- `required` (boolean): Whether the filter is required
- `defaultValue` (string | number | boolean | null): Default value when not set
- `description` (string): Description of the filter's purpose
- `options` (FilterOption[]): Array of selectable options (for categorical filters)

**Relationships**:
- Contains multiple `FilterOption` entities (one-to-many)
- Belongs to one `FilterCategory` (many-to-one)

**Validation Rules**:
- `id` must be unique across all filters
- `paramName` must be unique across all filters
- `type` must be one of: "categorical", "numeric", "boolean"
- Categorical filters must have at least one option
- Numeric filters must have `min`, `max`, and `step` properties

**State Transitions**: None (configuration entity, not stateful)

**Example**:
```typescript
{
  id: 'frais',
  label: 'Frais',
  type: 'categorical',
  category: 'cost',
  paramName: 'frais',
  required: false,
  defaultValue: null,
  description: 'Filtrer les services par type de frais',
  options: [
    { value: 'gratuit', label: 'Gratuit', available: true },
    { value: 'payant', label: 'Payant', available: true }
  ]
}
```

---

### FilterOption

Represents a selectable option within a categorical filter.

**Purpose**: Defines a single choice that users can select for a categorical filter.

**Key Attributes**:
- `value` (string): The value sent to the API (e.g., "gratuit", "a-distance")
- `label` (string): Human-readable label displayed in the UI (e.g., "Gratuit", "À distance")
- `available` (boolean): Whether this option is currently available/enabled
- `count` (number, optional): Number of results for this option (if available)

**Relationships**:
- Belongs to one `Filter` entity (many-to-one)

**Validation Rules**:
- `value` must be unique within the parent filter's options
- `label` must not be empty
- `available` defaults to true if not specified

**Example**:
```typescript
{
  value: 'gratuit',
  label: 'Gratuit',
  available: true
}
```

---

### FilterState

Represents the current state of all applied filters in the application.

**Purpose**: Tracks which filters are currently active and their selected values.

**Key Attributes**:
- Dynamic key-value pairs where:
  - Key: Filter ID (string)
  - Value: Selected value (string | number | boolean | null)

**Relationships**:
- References multiple `Filter` entities by ID

**Validation Rules**:
- Keys must correspond to valid filter IDs
- Values must match the filter's type (string for categorical, number for numeric, boolean for boolean)
- Categorical filter values must exist in the filter's options array

**State Transitions**:
1. **Empty State**: No filters applied, all values are null or default
2. **Filtered State**: One or more filters have non-default values
3. **URL Sync**: State is serialized to/from URL parameters

**Example**:
```typescript
{
  frais: 'gratuit',           // Categorical filter
  modes_accueil: 'a-distance', // Categorical filter
  score_qualite_minimum: 0.8,  // Numeric filter
  code_commune: '75056'        // Categorical filter (dynamic options)
}
```

---

### FilterCategory

Represents a grouping of related filters in the sidebar.

**Purpose**: Organizes filters into logical sections for better UX.

**Key Attributes**:
- `id` (string): Unique identifier for the category (e.g., "cost", "access")
- `label` (string): Human-readable label (e.g., "Coût", "Mode d'accueil")
- `order` (number): Display order in the sidebar
- `expanded` (boolean): Whether the category is expanded by default
- `filters` (Filter[]): Array of filters in this category

**Relationships**:
- Contains multiple `Filter` entities (one-to-many)

**Example**:
```typescript
{
  id: 'cost',
  label: 'Coût',
  order: 3,
  expanded: true,
  filters: [
    { id: 'frais', label: 'Frais', type: 'categorical', ... }
  ]
}
```

---

## Data Flow

### Filter Selection Flow

```
User clicks radio button
    ↓
FilterControl.onChange(value)
    ↓
ServiceFilters.handleFilterChange(filterId, value)
    ↓
Update filterState (React state)
    ↓
Debounce 300ms
    ↓
filterStateToUrlParams(newState, filters)
    ↓
router.push(`/?${params.toString()}`)
    ↓
URL updates
    ↓
useEffect in ServiceFilters detects URL change
    ↓
urlParamsToFilterState(searchParams, filters)
    ↓
Update filterState from URL
    ↓
FilterControl receives new value prop
    ↓
Radio button UI updates
```

### URL Synchronization

**URL to State**:
```typescript
// URL: /?frais=gratuit&modes_accueil=a-distance
// Becomes:
{
  frais: 'gratuit',
  modes_accueil: 'a-distance'
}
```

**State to URL**:
```typescript
// State:
{
  frais: 'gratuit',
  modes_accueil: 'a-distance'
}
// Becomes URL: /?frais=gratuit&modes_accueil=a-distance
```

---

## No Schema Changes

This feature does not modify any data schemas, API contracts, or database structures. All changes are purely presentational (UI rendering).

**Unchanged**:
- Filter type definitions (`src/types/filter.ts`)
- Filter configuration (`src/config/filters.config.ts`)
- URL parameter format
- API request/response format
- State management logic

**Changed**:
- UI rendering logic in `FilterControl.tsx` (conditional rendering based on option count)

---

## Type Definitions (Reference)

For completeness, here are the existing TypeScript type definitions:

```typescript
// src/types/filter.ts (existing, unchanged)

export interface FilterOption {
  value: string;
  label: string;
  available: boolean;
  count?: number;
}

export interface Filter {
  id: string;
  label: string;
  type: 'categorical' | 'numeric' | 'boolean';
  category: string;
  paramName: string;
  required: boolean;
  defaultValue: string | number | boolean | null;
  description: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  order: number;
  expanded: boolean;
  filters: Filter[];
}

export type FilterState = Record<string, string | number | boolean | null>;
```

---

## Conclusion

This feature requires **no data model changes**. All existing entities, relationships, and validation rules remain intact. The only change is how categorical filters with 2 options are rendered in the UI (radio buttons instead of dropdowns).
