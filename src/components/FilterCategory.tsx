'use client';

/**
 * FilterCategory Component
 * Renders a group of related filters organized by category
 * Supports collapsible categories for better UX with many filters
 */

import React, { useState } from 'react';
import { FilterCategory as FilterCategoryType } from '~/types/filter';
import { FilterControl } from './FilterControl';
import { ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';

interface FilterCategoryProps {
  /** Category definition */
  category: FilterCategoryType;

  /** Current filter values */
  values: Record<string, string | number | boolean | null>;

  /** Callback when filter value changes */
  onChange: (filterId: string, value: string | number | boolean) => void;

  /** Callback when filter is cleared */
  onClear: (filterId: string) => void;

  /** Whether category should be collapsible */
  collapsible?: boolean;
}

/**
 * Renders a filter category with all its filters
 * Optionally supports collapsible behavior
 */
export const FilterCategory = React.memo(function FilterCategory({
  category,
  values,
  onChange,
  onClear,
  collapsible = true,
}: FilterCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(category.expanded);

  const shouldCollapse = collapsible && category.filters.length > 3;

  return (
    <div className="space-y-4 border-b pb-4 last:border-b-0">
      {/* Category Header */}
      <div
        className={cn(
          'flex items-center justify-between',
          shouldCollapse && 'cursor-pointer hover:opacity-80'
        )}
        onClick={() => shouldCollapse && setIsExpanded(!isExpanded)}
        role={shouldCollapse ? 'button' : undefined}
        tabIndex={shouldCollapse ? 0 : undefined}
        onKeyDown={
          shouldCollapse
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsExpanded(!isExpanded);
                }
              }
            : undefined
        }
      >
        <h3 className="font-semibold text-sm">{category.label}</h3>
        {shouldCollapse && (
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isExpanded ? 'rotate-0' : '-rotate-90'
            )}
          />
        )}
      </div>

      {/* Filters */}
      {(!shouldCollapse || isExpanded) && (
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
      )}
    </div>
  );
});

FilterCategory.displayName = 'FilterCategory';
