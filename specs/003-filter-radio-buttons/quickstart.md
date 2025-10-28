# Quickstart Guide: Filter Radio Button UX Enhancement

**Feature**: Filter Radio Button UX Enhancement  
**Branch**: `003-filter-radio-buttons`  
**Date**: Oct 28, 2025

## Quick Summary

Convert Frais and Mode d'accueil filters from dropdowns to radio buttons by modifying `FilterControl.tsx` to conditionally render radio buttons when a categorical filter has exactly 2 options.

**Estimated Time**: 1-2 hours  
**Complexity**: Low  
**Files Modified**: 1 (`src/components/FilterControl.tsx`)

---

## Prerequisites

- Node.js 18+ and pnpm installed
- Development server running (`pnpm dev`)
- Familiarity with React, TypeScript, and shadcn/ui components

---

## Implementation Steps

### Step 1: Understand the Current Implementation

**File**: `src/components/FilterControl.tsx`

The `CategoricalFilterControl` function currently renders all categorical filters as dropdowns using the Popover + Command pattern:

```tsx
function CategoricalFilterControl({ filter, value, onChange, onClear, ... }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>...</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            {filter.options?.map(option => (
              <CommandItem key={option.value} onSelect={() => onChange(option.value)}>
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

### Step 2: Add Radio Button Rendering Logic

**Location**: `src/components/FilterControl.tsx` in the `CategoricalFilterControl` function

**Goal**: Detect 2-option filters and render radio buttons instead of dropdowns.

**Implementation**:

```tsx
function CategoricalFilterControl({
  filter,
  value,
  onChange,
  onClear,
  onSearch,
  loading,
}: Omit<FilterControlProps, "error">) {
  // NEW: Check if this filter should use radio buttons
  const shouldUseRadioButtons = filter.options?.length === 2;

  // NEW: Radio button rendering for 2-option filters
  if (shouldUseRadioButtons) {
    const radioValue = value === null || value === undefined ? "all" : String(value);

    return (
      <div className="space-y-2">
        <RadioGroup
          value={radioValue}
          onValueChange={(val) => {
            if (val === "all") {
              onClear();
            } else {
              onChange(val);
            }
          }}
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

  // EXISTING: Dropdown rendering for filters with 3+ options
  const [open, setOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");

  // ... rest of existing dropdown code ...
}
```

---

### Step 3: Verify Imports

Ensure these imports are present at the top of `FilterControl.tsx`:

```tsx
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
```

These components already exist in the project (used by `BooleanFilterControl`).

---

### Step 4: Test the Implementation

#### Manual Testing Checklist

1. **Visual Verification**:
   ```bash
   pnpm dev
   # Open http://localhost:3000
   ```
   - [ ] Frais filter shows 3 radio buttons: Tous, Gratuit, Payant
   - [ ] Mode d'accueil filter shows 3 radio buttons: Tous, À distance, En présentiel
   - [ ] All other filters (Sources, Types, Publics, Commune, Score) remain as dropdowns

2. **Functional Testing**:
   - [ ] Click "Gratuit" → URL updates to `?frais=gratuit`
   - [ ] Click "Payant" → URL updates to `?frais=payant`
   - [ ] Click "Tous" → URL parameter `frais` is removed
   - [ ] Service list updates when radio option is selected
   - [ ] Refresh page with `?frais=gratuit` in URL → "Gratuit" radio is selected

3. **Interaction Testing**:
   - [ ] Click "Réinitialiser tous les filtres" → radio buttons reset to "Tous"
   - [ ] Select multiple filters → all work together correctly
   - [ ] Rapidly click different radio options → no state issues

4. **Accessibility Testing**:
   - [ ] Tab key moves between filter groups
   - [ ] Arrow keys move within radio group
   - [ ] Space/Enter selects radio option
   - [ ] Focus indicators visible

5. **Responsive Testing**:
   - [ ] Open DevTools, toggle device toolbar
   - [ ] Test on mobile viewport (375px width)
   - [ ] Radio buttons stack vertically, no horizontal scroll

---

### Step 5: Edge Case Testing

Test these scenarios to ensure robustness:

1. **Invalid URL Parameter**:
   ```
   http://localhost:3000/?frais=invalid
   ```
   - [ ] Radio buttons default to "Tous" (no selection)

2. **Multiple Filter Changes**:
   - [ ] Select Frais → Select Mode d'accueil → Select Frais again
   - [ ] Verify URL updates correctly each time

3. **Browser Back/Forward**:
   - [ ] Select "Gratuit" → Select "Payant" → Click browser back button
   - [ ] Verify radio button returns to "Gratuit"

---

## Code Templates

### Complete CategoricalFilterControl Implementation

```tsx
function CategoricalFilterControl({
  filter,
  value,
  onChange,
  onClear,
  onSearch,
  loading,
}: Omit<FilterControlProps, "error">) {
  // Check if this filter should use radio buttons (2 options only)
  const shouldUseRadioButtons = filter.options?.length === 2;

  // Radio button rendering for 2-option filters
  if (shouldUseRadioButtons) {
    const radioValue = value === null || value === undefined ? "all" : String(value);

    return (
      <div className="space-y-2">
        <RadioGroup
          value={radioValue}
          onValueChange={(val) => {
            if (val === "all") {
              onClear();
            } else {
              onChange(val);
            }
          }}
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchInput, onSearch, filter.id]);

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
```

---

## Troubleshooting

### Issue: Radio buttons not showing

**Cause**: Filter options array might not have exactly 2 items.

**Solution**: Check `src/config/filters.config.ts`:
```typescript
// Frais filter should have exactly 2 options
{
  id: 'frais',
  options: [
    { value: 'gratuit', label: 'Gratuit', available: true },
    { value: 'payant', label: 'Payant', available: true }
  ]
}
```

---

### Issue: Radio buttons not updating URL

**Cause**: `onChange` callback not being called correctly.

**Solution**: Verify the `onValueChange` handler:
```tsx
onValueChange={(val) => {
  if (val === "all") {
    onClear();  // This should remove the URL parameter
  } else {
    onChange(val);  // This should add/update the URL parameter
  }
}}
```

---

### Issue: "Tous" option not clearing the filter

**Cause**: `onClear` callback not working.

**Solution**: Check that `onClear` is passed down from `ServiceFilters`:
```tsx
<FilterControl
  filter={filter}
  value={filterState[filter.id] ?? filter.defaultValue}
  onChange={(value) => handleFilterChange(filter.id, value)}
  onClear={() => handleClearFilter(filter.id)}  // ← Must be present
/>
```

---

### Issue: TypeScript errors

**Cause**: Missing imports or type mismatches.

**Solution**: Ensure these imports are present:
```tsx
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
```

---

## Performance Considerations

**Before** (Dropdown):
- 15-20 React components rendered
- Popover portal overhead
- Command component search logic

**After** (Radio Buttons):
- 5-7 React components rendered
- No portal overhead
- No search logic

**Expected Performance Improvement**: ~10-15% faster render time for 2-option filters.

---

## Rollback Instructions

If you need to revert this change:

1. **Quick Rollback**: Change the condition to never trigger:
   ```tsx
   const shouldUseRadioButtons = false; // Disable radio buttons
   ```

2. **Full Rollback**: Use git to revert the commit:
   ```bash
   git log --oneline  # Find the commit hash
   git revert <commit-hash>
   ```

---

## Next Steps

After implementing and testing:

1. **Create Pull Request**: Include screenshots of before/after
2. **Request Code Review**: Focus on accessibility and edge cases
3. **Deploy to Staging**: Test in production-like environment
4. **Monitor Metrics**: Check for any user feedback or issues
5. **Document in Changelog**: Note the UX improvement

---

## Additional Resources

- [Radix UI Radio Group Docs](https://www.radix-ui.com/primitives/docs/components/radio-group)
- [shadcn/ui Radio Group](https://ui.shadcn.com/docs/components/radio-group)
- [WCAG Radio Button Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Nielsen Norman Group: Radio Buttons](https://www.nngroup.com/articles/radio-buttons-default-selection/)

---

## Success Criteria Verification

After implementation, verify these success criteria from the spec:

- [ ] **SC-001**: Users can see all Frais and Mode d'accueil options without clicking (0 clicks)
- [ ] **SC-002**: Users can select an option with 1 click (down from 2)
- [ ] **SC-003**: Radio buttons display inline on screens ≥768px without scrolling
- [ ] **SC-004**: Radio button state syncs with URL parameters (100% accuracy)
- [ ] **SC-005**: Radio buttons are keyboard accessible
- [ ] **SC-006**: All other 7 filters remain unchanged

---

## Conclusion

This quickstart guide provides everything needed to implement the filter radio button enhancement. The change is minimal, low-risk, and provides immediate UX benefits. Follow the steps, test thoroughly, and you'll have radio buttons working in 1-2 hours.

**Happy coding! 🚀**
