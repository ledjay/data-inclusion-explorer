# Quickstart Guide

**Feature**: Expose All Data Inclusion API Filters to Sidebar  
**Date**: Oct 28, 2025  
**Status**: Complete

## Overview

This guide provides a quick reference for implementing the filter sidebar feature. For detailed information, see the full documentation:
- **Specification**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/filter-api.md](./contracts/filter-api.md)
- **Research**: [research.md](./research.md)

---

## Key Files to Create/Modify

### New Files

```
src/
├── config/
│   └── filters.config.ts           # Filter definitions and categories
├── types/
│   └── filter.ts                   # TypeScript type definitions
├── lib/
│   └── filter-utils.ts             # Utility functions for filter handling
└── components/
    ├── FilterCategory.tsx          # Category grouping component
    └── FilterControl.tsx           # Generic filter control renderer

specs/002-expose-api-filters/
├── plan.md                         # This implementation plan
├── research.md                     # Research and clarifications
├── data-model.md                   # Data model definitions
├── quickstart.md                   # This file
└── contracts/
    └── filter-api.md               # API contracts
```

### Modified Files

```
src/
├── components/
│   └── ServiceFilters.tsx          # Refactor to use new components
└── app/
    └── page.tsx                    # No changes needed (already handles URL params)
```

---

## Implementation Steps

### Step 1: Define Filter Types

Create `src/types/filter.ts`:

```typescript
export type FilterType = 'categorical' | 'numeric' | 'boolean' | 'range';
export type FilterCategoryId = 'location' | 'service-type' | 'quality' | 'cost' | 'other';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  available: boolean;
  group?: string;
}

export interface Filter {
  id: string;
  label: string;
  type: FilterType;
  category: FilterCategoryId;
  description?: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue: string | number | boolean | null;
  required: boolean;
  paramName: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface FilterCategory {
  id: FilterCategoryId;
  label: string;
  filters: Filter[];
  order: number;
  expanded: boolean;
}

export interface FilterState {
  applied: Record<string, string | number | boolean | string[]>;
  updatedAt: number;
  loading: boolean;
  error?: string;
}
```

### Step 2: Create Filter Configuration

Create `src/config/filters.config.ts`:

```typescript
import { FilterCategory } from '~/types/filter';

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
        options: [], // Populated from API
      },
    ],
  },
  {
    id: 'service-type',
    label: 'Service Type',
    order: 2,
    expanded: true,
    filters: [
      {
        id: 'types',
        label: 'Type',
        type: 'categorical',
        category: 'service-type',
        paramName: 'types',
        required: false,
        defaultValue: null,
        options: [
          { value: 'accompagnement', label: 'Accompagnement', available: true },
          { value: 'aide-financiere', label: 'Aide financière', available: true },
          // ... more types
        ],
      },
    ],
  },
  {
    id: 'quality',
    label: 'Quality',
    order: 3,
    expanded: true,
    filters: [
      {
        id: 'score_qualite_minimum',
        label: 'Minimum Quality Score',
        type: 'numeric',
        category: 'quality',
        paramName: 'score_qualite_minimum',
        required: false,
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost',
    order: 4,
    expanded: true,
    filters: [
      {
        id: 'frais',
        label: 'Fees',
        type: 'categorical',
        category: 'cost',
        paramName: 'frais',
        required: false,
        defaultValue: null,
        options: [
          { value: 'gratuit', label: 'Free', available: true },
          { value: 'payant', label: 'Paid', available: true },
        ],
      },
    ],
  },
];

// Flatten for easy lookup
export const ALL_FILTERS = FILTER_CATEGORIES.flatMap(cat => cat.filters);

// Create map for O(1) lookup
export const FILTER_MAP = new Map(ALL_FILTERS.map(f => [f.id, f]));
```

### Step 3: Create Utility Functions

Create `src/lib/filter-utils.ts`:

```typescript
import { Filter, FilterState } from '~/types/filter';
import { FILTER_MAP } from '~/config/filters.config';

export function validateFilterValue(
  filter: Filter,
  value: any
): { valid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { valid: true }; // Null is valid (filter not applied)
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

    default:
      return { valid: true };
  }
}

export function sanitizeUrlParams(
  params: URLSearchParams,
  knownFilters: Filter[] = Array.from(FILTER_MAP.values())
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
        }
      }
    }
  }

  return sanitized;
}

export function urlParamsToFilterState(
  params: URLSearchParams,
  knownFilters: Filter[] = Array.from(FILTER_MAP.values())
): Record<string, any> {
  const state: Record<string, any> = {};

  for (const filter of knownFilters) {
    const value = params.get(filter.paramName);
    if (value !== null) {
      const validation = validateFilterValue(filter, value);
      if (validation.valid) {
        state[filter.id] = filter.type === 'numeric' ? Number(value) : value;
      }
    }
  }

  return state;
}

export function filterStateToUrlParams(
  state: Record<string, any>,
  knownFilters: Filter[] = Array.from(FILTER_MAP.values())
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

export function isFilterDefault(filter: Filter, value: any): boolean {
  return value === null || value === undefined || value === filter.defaultValue;
}
```

### Step 4: Create FilterControl Component

Create `src/components/FilterControl.tsx`:

```typescript
'use client';

import { Filter } from '~/types/filter';
import { Slider } from '~/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { Button } from '~/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '~/lib/utils';

interface FilterControlProps {
  filter: Filter;
  value: string | number | boolean | null;
  onChange: (value: any) => void;
  onClear: () => void;
  loading?: boolean;
  error?: string;
}

export function FilterControl({
  filter,
  value,
  onChange,
  onClear,
  loading,
  error,
}: FilterControlProps) {
  if (filter.type === 'categorical') {
    return (
      <CategoricalFilterControl
        filter={filter}
        value={value}
        onChange={onChange}
        onClear={onClear}
        loading={loading}
      />
    );
  }

  if (filter.type === 'numeric') {
    return (
      <NumericFilterControl
        filter={filter}
        value={value}
        onChange={onChange}
        onClear={onClear}
      />
    );
  }

  if (filter.type === 'boolean') {
    return (
      <BooleanFilterControl
        filter={filter}
        value={value}
        onChange={onChange}
        onClear={onClear}
      />
    );
  }

  return null;
}

// Implement specific control components...
// (See full implementation in actual codebase)
```

### Step 5: Create FilterCategory Component

Create `src/components/FilterCategory.tsx`:

```typescript
'use client';

import { FilterCategory as FilterCategoryType } from '~/types/filter';
import { FilterControl } from './FilterControl';

interface FilterCategoryProps {
  category: FilterCategoryType;
  values: Record<string, any>;
  onChange: (filterId: string, value: any) => void;
  onClear: (filterId: string) => void;
}

export function FilterCategory({
  category,
  values,
  onChange,
  onClear,
}: FilterCategoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">{category.label}</h3>
      <div className="space-y-3">
        {category.filters.map(filter => (
          <FilterControl
            key={filter.id}
            filter={filter}
            value={values[filter.id] ?? null}
            onChange={value => onChange(filter.id, value)}
            onClear={() => onClear(filter.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 6: Refactor ServiceFilters Component

Modify `src/components/ServiceFilters.tsx` to use new components:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FILTER_CATEGORIES, ALL_FILTERS } from '~/config/filters.config';
import { FilterCategory } from './FilterCategory';
import { urlParamsToFilterState, filterStateToUrlParams } from '~/lib/filter-utils';

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterState, setFilterState] = useState<Record<string, any>>({});

  // Initialize from URL
  useEffect(() => {
    const state = urlParamsToFilterState(searchParams, ALL_FILTERS);
    setFilterState(state);
  }, [searchParams]);

  const handleFilterChange = (filterId: string, value: any) => {
    const newState = { ...filterState, [filterId]: value };
    setFilterState(newState);

    // Update URL
    const params = filterStateToUrlParams(newState, ALL_FILTERS);
    params.delete('page'); // Reset to page 1
    router.push(`/?${params.toString()}`);
  };

  const handleClearFilter = (filterId: string) => {
    const newState = { ...filterState };
    delete newState[filterId];
    setFilterState(newState);

    // Update URL
    const params = filterStateToUrlParams(newState, ALL_FILTERS);
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="sticky top-8 self-start space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-4">Data Inclusion Explorer</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore services from the Data Inclusion API with comprehensive filtering options.
        </p>
      </div>

      <div className="space-y-6">
        {FILTER_CATEGORIES.map(category => (
          <FilterCategory
            key={category.id}
            category={category}
            values={filterState}
            onChange={handleFilterChange}
            onClear={handleClearFilter}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] All filter categories display correctly
- [ ] Categorical filters work (dropdown, search, selection)
- [ ] Numeric filters work (slider, min/max)
- [ ] Boolean filters work (radio buttons)
- [ ] Filter changes update URL parameters
- [ ] URL parameters restore filter state on page load
- [ ] Invalid URL parameters are silently ignored
- [ ] Multiple filters work together
- [ ] Clear individual filter works
- [ ] Reset all filters works
- [ ] Mobile drawer displays correctly
- [ ] Desktop sidebar displays correctly
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Performance: filter updates within 500ms

---

## Common Issues & Solutions

### Issue: Filters not persisting in URL

**Solution**: Ensure `filterStateToUrlParams()` is called after every filter change and URL is updated via `router.push()`.

### Issue: URL parameters not restoring filters

**Solution**: Ensure `urlParamsToFilterState()` is called in `useEffect` with `searchParams` dependency.

### Issue: Invalid filter values causing errors

**Solution**: Always validate with `validateFilterValue()` before updating state or URL.

### Issue: Mobile drawer not appearing

**Solution**: Check Tailwind responsive classes (`hidden md:block`) and ensure drawer component is properly imported from shadcn/ui.

---

## Next Steps

1. Review the full specification: [spec.md](./spec.md)
2. Review the data model: [data-model.md](./data-model.md)
3. Review API contracts: [contracts/filter-api.md](./contracts/filter-api.md)
4. Generate tasks: `/speckit.tasks`
5. Implement tasks in order
6. Test against acceptance criteria
7. Deploy to preview environment

