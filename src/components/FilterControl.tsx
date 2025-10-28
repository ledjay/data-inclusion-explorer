"use client";

/**
 * FilterControl Component
 * Renders a single filter control appropriate to the filter type
 * Supports categorical, numeric, boolean, and range filters
 */

import React, { useMemo } from "react";
import { Filter } from "~/types/filter";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Slider } from "~/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

interface FilterControlProps {
  /** Filter definition */
  filter: Filter;

  /** Current value (or null if not applied) */
  value: string | number | boolean | null;

  /** Callback when value changes */
  onChange: (value: string | number | boolean) => void;

  /** Callback when filter is cleared */
  onClear: () => void;

  /** Callback for search input (for dynamic filtering) */
  onSearch?: (searchTerm: string) => void;

  /** Loading state */
  loading?: boolean;

  /** Error message */
  error?: string;
}

/**
 * Categorical filter control with search
 */
function CategoricalFilterControl({
  filter,
  value,
  onChange,
  onClear,
  onSearch,
  loading,
}: Omit<FilterControlProps, "error">) {
  // Initialize hooks unconditionally (required by React)
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");

  const selectedLabel = useMemo(() => {
    if (value === null || value === undefined) return "Sélectionner...";
    const found = filter.options?.find((opt) => opt.value === value);
    return found?.label || "Sélectionner...";
  }, [value, filter.options]);

  // Trigger search when input changes
  React.useEffect(() => {
    if (filter.id === "code_commune" && onSearch && searchInput) {
      const timer = setTimeout(() => {
        onSearch(searchInput);
      }, 300); // Debounce search by 300ms
      return () => clearTimeout(timer);
    }
  }, [searchInput, onSearch, filter.id]);

  // Check if this filter should use radio buttons (2 options only)
  const shouldUseRadioButtons = filter.options?.length === 2;

  // Radio button rendering for 2-option filters
  if (shouldUseRadioButtons) {
    // Ensure value is a string for RadioGroup comparison
    const radioValue = value === null || value === undefined ? "all" : String(value);

    const handleRadioChange = (val: string) => {
      if (val === "all") {
        onClear();
      } else {
        // Pass the value directly to onChange
        onChange(val);
      }
    };

    return (
      <div className="space-y-2">
        <RadioGroup
          value={radioValue}
          onValueChange={handleRadioChange}
        >
          {/* "All" option to clear the filter */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id={`${filter.id}-all`} />
            <Label htmlFor={`${filter.id}-all`} className="cursor-pointer">
              Tous
            </Label>
          </div>

          {/* Render each filter option */}
          {filter.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${filter.id}-${option.value}`} />
              <Label htmlFor={`${filter.id}-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Existing dropdown code for filters with 3+ options

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selectedLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          align="start"
          side="bottom"
        >
          <Command shouldFilter={filter.id === "code_commune" ? false : true}>
            {/* Show search input if there are 5+ options or if it's a searchable filter (like communes) */}
            {((filter.options?.length ?? 0) >= 5 ||
              filter.id === "code_commune") && (
              <CommandInput
                placeholder={`Rechercher ${filter.label.toLowerCase()}...`}
                value={searchInput}
                onValueChange={setSearchInput}
              />
            )}
            <CommandList key={`${filter.id}-${filter.options?.length || 0}`}>
              <CommandEmpty>Aucune option trouvée.</CommandEmpty>
              <CommandGroup>
                {filter.options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="text-left"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-20"
                      )}
                    />
                    {option.label}
                    {option.count !== undefined && (
                      <span className="ml-auto text-xs text-gray-500">
                        ({option.count})
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value !== null && value !== undefined && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          x Re-initialiser
        </button>
      )}
    </div>
  );
}

/**
 * Numeric filter control with slider
 */
function NumericFilterControl({
  filter,
  value,
  onChange,
  onClear,
}: Omit<FilterControlProps, "error" | "loading">) {
  const numValue =
    value === null || value === undefined ? filter.min ?? 0 : (value as number);
  const min = filter.min ?? 0;
  const max = filter.max ?? 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {filter.label}: {numValue.toFixed(filter.step === 0.01 ? 2 : 0)}
          {filter.unit && ` ${filter.unit}`}
        </span>
      </div>
      <Slider
        value={[numValue]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={filter.step ?? 1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {value !== filter.defaultValue && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Reset
        </button>
      )}
    </div>
  );
}

/**
 * Boolean filter control with radio buttons
 */
function BooleanFilterControl({
  filter,
  value,
  onChange,
  onClear,
}: Omit<FilterControlProps, "error" | "loading">) {
  const boolValue =
    value === null || value === undefined ? "all" : value ? "true" : "false";

  return (
    <div className="space-y-2">
      <RadioGroup
        value={boolValue}
        onValueChange={(val) => {
          if (val === "all") {
            onClear();
          } else {
            onChange(val === "true");
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id={`${filter.id}-all`} />
          <Label htmlFor={`${filter.id}-all`} className="cursor-pointer">
            All
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id={`${filter.id}-true`} />
          <Label htmlFor={`${filter.id}-true`} className="cursor-pointer">
            Yes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id={`${filter.id}-false`} />
          <Label htmlFor={`${filter.id}-false`} className="cursor-pointer">
            No
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

/**
 * Generic filter control component
 * Routes to type-specific implementations
 */
export const FilterControl = React.memo(function FilterControl({
  filter,
  value,
  onChange,
  onClear,
  onSearch,
  loading,
  error,
}: FilterControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && !error && (
        <>
          {filter.type === "categorical" && (
            <CategoricalFilterControl
              filter={filter}
              value={value}
              onChange={onChange}
              onClear={onClear}
              onSearch={onSearch}
              loading={loading}
            />
          )}
          {filter.type === "numeric" && (
            <NumericFilterControl
              filter={filter}
              value={value}
              onChange={onChange}
              onClear={onClear}
            />
          )}
          {filter.type === "boolean" && (
            <BooleanFilterControl
              filter={filter}
              value={value}
              onChange={onChange}
              onClear={onClear}
            />
          )}
        </>
      )}
    </div>
  );
});

FilterControl.displayName = "FilterControl";
