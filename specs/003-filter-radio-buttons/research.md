# Research: Filter Radio Button UX Enhancement

**Feature**: Filter Radio Button UX Enhancement  
**Branch**: `003-filter-radio-buttons`  
**Date**: Oct 28, 2025

## Overview

This document consolidates research findings for converting Frais and Mode d'accueil filters from dropdowns to radio buttons. Since this is a straightforward UI enhancement using existing components, research focuses on implementation patterns and UX best practices.

## Research Questions

### Q1: When should categorical filters use radio buttons vs dropdowns?

**Decision**: Use radio buttons for categorical filters with 2-3 options, dropdowns for 4+ options

**Rationale**:
- **UX Best Practice**: Radio buttons are optimal for 2-7 mutually exclusive options where users benefit from seeing all choices simultaneously
- **Interaction Cost**: Dropdowns require 2 clicks (open + select), radio buttons require 1 click
- **Cognitive Load**: Radio buttons reduce cognitive load by eliminating the need to remember hidden options
- **Accessibility**: Radio buttons provide better keyboard navigation and screen reader support
- **Visual Hierarchy**: For 2 options specifically, radio buttons create a cleaner, more scannable interface

**Alternatives Considered**:
- **Keep dropdowns for all filters**: Rejected because it misses UX optimization opportunity for simple binary/ternary choices
- **Convert all categorical filters to radio buttons**: Rejected because filters with many options (e.g., Sources: 16 options, Publics: 14 options) would create visual clutter
- **Use toggle switches for 2-option filters**: Rejected because toggles imply on/off state, not mutually exclusive selection with a "none" option

**Sources**:
- Nielsen Norman Group: "Radio Buttons: Select One by Default or Leave All Unselected?"
- Material Design Guidelines: "Selection Controls"
- WCAG 2.1: Radio button accessibility patterns

---

### Q2: How should radio button filters handle the "no selection" state?

**Decision**: Add a third "Tous" (All) radio option to allow clearing the filter

**Rationale**:
- **User Control**: Users need a way to remove filter constraints without using the global "Réinitialiser tous les filtres" button
- **Consistency**: Matches existing dropdown behavior where no selection means "show all"
- **Discoverability**: Explicit "Tous" option is more discoverable than relying on clicking the selected radio again (which doesn't work in standard radio groups)
- **URL State**: Aligns with existing URL parameter behavior where absence of parameter means "no filter"

**Alternatives Considered**:
- **No "All" option, require global reset**: Rejected because it reduces user control and requires extra clicks
- **Allow clicking selected radio to deselect**: Rejected because it violates standard radio button behavior and confuses users
- **Use checkboxes instead**: Rejected because checkboxes imply multi-select, not mutually exclusive selection

**Implementation Pattern**:
```tsx
<RadioGroup value={value || "all"}>
  <RadioGroupItem value="all" label="Tous" />
  <RadioGroupItem value="gratuit" label="Gratuit" />
  <RadioGroupItem value="payant" label="Payant" />
</RadioGroup>
```

---

### Q3: Should the radio button rendering be automatic or explicit?

**Decision**: Automatic detection based on option count (if options.length === 2, render as radio buttons)

**Rationale**:
- **Simplicity**: No changes needed to filter configuration (filters.config.ts)
- **Maintainability**: Single source of truth for filter definitions
- **Future-Proof**: If API adds a 3rd option to Frais or Mode d'accueil, dropdown will automatically render (graceful degradation)
- **DRY Principle**: Avoids duplicating filter metadata

**Alternatives Considered**:
- **Add `renderAs: 'radio'` property to filter config**: Rejected because it adds configuration complexity and requires manual maintenance
- **Create separate radio filter type**: Rejected because radio buttons are just a rendering variation of categorical filters, not a distinct type
- **Hardcode filter IDs**: Rejected because it couples component logic to specific filter names

**Implementation Logic**:
```tsx
// In FilterControl.tsx CategoricalFilterControl
if (filter.options?.length === 2) {
  return <RadioButtonGroup ... />;
}
return <DropdownCombobox ... />;
```

---

### Q4: How should radio buttons be styled to match the existing design system?

**Decision**: Use existing shadcn/ui RadioGroup component with Tailwind CSS classes matching current filter styling

**Rationale**:
- **Consistency**: shadcn/ui RadioGroup already matches the design system (same as boolean filters)
- **Accessibility**: Radix UI RadioGroup provides ARIA labels, keyboard navigation, and focus management out of the box
- **Dark Mode**: Automatic dark mode support via Tailwind CSS
- **No Dependencies**: RadioGroup component already exists in the project

**Styling Pattern**:
- Use same spacing as existing filters (`space-y-2`)
- Use same label typography (`text-sm font-medium`)
- Use same clear button styling (`text-xs text-gray-500 hover:text-gray-700`)
- Maintain consistent vertical rhythm in filter sidebar

**Reference Implementation**: See `BooleanFilterControl` in FilterControl.tsx (lines 209-250) for existing radio button pattern

---

### Q5: How should mobile responsiveness be handled?

**Decision**: Radio buttons stack vertically on all screen sizes (no horizontal layout)

**Rationale**:
- **Touch Targets**: Vertical stacking ensures adequate touch target size (minimum 44x44px) on mobile
- **Readability**: Vertical layout is more readable on narrow screens
- **Consistency**: Matches existing filter layout patterns (all filters stack vertically)
- **Simplicity**: No need for responsive breakpoints or layout shifts

**Implementation**:
- Use flexbox with `flex-col` (vertical stacking)
- Maintain `space-y-2` spacing between radio options
- No changes needed for different screen sizes

---

## Technical Decisions

### Component Architecture

**Decision**: Modify existing `CategoricalFilterControl` function to conditionally render radio buttons

**Files Affected**:
- `src/components/FilterControl.tsx` - Add radio button rendering branch

**No Changes Needed**:
- `src/components/ServiceFilters.tsx` - Uses FilterControl, no awareness of rendering mode
- `src/config/filters.config.ts` - Filter definitions unchanged
- `src/types/filter.ts` - Filter type unchanged
- `src/lib/filter-utils.ts` - URL sync logic unchanged

---

### State Management

**Decision**: No changes to filter state management

**Rationale**:
- Radio button selections use the same value format as dropdown selections (string)
- URL synchronization logic remains unchanged
- Filter state in ServiceFilters component remains unchanged
- Only the rendering layer changes

---

### Accessibility

**Decision**: Use Radix UI RadioGroup with proper ARIA labels

**Implementation Requirements**:
- Each RadioGroupItem must have a unique `id` and corresponding `<Label htmlFor>`
- RadioGroup must have `aria-label` or `aria-labelledby`
- Keyboard navigation: Tab (move between groups), Arrow keys (move within group), Space/Enter (select)
- Focus indicators must be visible

**Testing**: Manual keyboard navigation testing required

---

## Implementation Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API adds 3rd option to Frais/Mode d'accueil | Low | Medium | Automatic fallback to dropdown when options.length > 2 |
| Radio buttons cause layout shift | Low | Low | Use consistent spacing with existing filters |
| Keyboard navigation breaks | Low | High | Use Radix UI RadioGroup (tested and accessible) |
| URL state desync | Very Low | High | No changes to URL sync logic, thoroughly test |
| Mobile touch targets too small | Very Low | Medium | Use vertical stacking with adequate spacing |

---

## Performance Considerations

**Expected Performance Impact**: Positive

- **Reduced DOM Complexity**: Radio buttons simpler than Popover + Command + CommandList
- **No Async Operations**: No search/filter logic needed for 2 options
- **Faster Rendering**: Fewer React components in the tree
- **Better Perceived Performance**: Immediate visibility of options (no dropdown open delay)

**Measurements**:
- Current dropdown render: ~15-20 components (Popover, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandGroup, CommandItem x2)
- Radio button render: ~5-7 components (RadioGroup, RadioGroupItem x3, Label x3)

---

## Testing Strategy

### Manual Testing Checklist

1. **Visual Testing**:
   - [ ] Frais filter displays as radio buttons (Tous, Gratuit, Payant)
   - [ ] Mode d'accueil filter displays as radio buttons (Tous, À distance, En présentiel)
   - [ ] All other filters remain as dropdowns
   - [ ] Spacing and alignment match existing filters
   - [ ] Dark mode renders correctly

2. **Functional Testing**:
   - [ ] Selecting a radio option applies the filter
   - [ ] Service list updates when radio option selected
   - [ ] URL parameter updates when radio option selected
   - [ ] "Tous" option clears the filter
   - [ ] "Réinitialiser tous les filtres" button resets radio buttons to "Tous"
   - [ ] Page reload preserves radio button state from URL

3. **Accessibility Testing**:
   - [ ] Tab key moves between filter groups
   - [ ] Arrow keys move within radio group
   - [ ] Space/Enter selects radio option
   - [ ] Screen reader announces radio group label and options
   - [ ] Focus indicators visible on all radio buttons

4. **Responsive Testing**:
   - [ ] Radio buttons stack vertically on mobile (< 768px)
   - [ ] Touch targets adequate size on mobile
   - [ ] No horizontal scrolling on narrow screens

5. **Edge Case Testing**:
   - [ ] Invalid URL parameter value (e.g., `?frais=invalid`) defaults to "Tous"
   - [ ] Rapid clicking doesn't cause state issues
   - [ ] Multiple filter changes in quick succession work correctly

---

## Dependencies

### Existing Dependencies (No Installation Needed)

- **shadcn/ui RadioGroup**: Already installed and used in BooleanFilterControl
- **Radix UI Radio**: Underlying primitive for RadioGroup
- **Tailwind CSS**: For styling
- **Lucide React**: For icons (if needed)

### No New Dependencies Required

This feature uses only existing components and libraries.

---

## Rollback Plan

If issues arise after deployment:

1. **Immediate Rollback**: Revert FilterControl.tsx to previous version
2. **Partial Rollback**: Add feature flag to disable radio button rendering
3. **Graceful Degradation**: Change condition from `options.length === 2` to `options.length === 0` (effectively disabling radio buttons)

**Rollback Risk**: Very low - changes are isolated to a single component with no data model changes

---

## Conclusion

This is a low-risk, high-value UX enhancement that:
- Improves user experience by reducing clicks and increasing option visibility
- Uses existing components and patterns (no new dependencies)
- Maintains all existing functionality (URL sync, state management, accessibility)
- Provides automatic graceful degradation if API changes
- Aligns with all constitutional principles (especially Minimalism & Simplicity)

**Recommendation**: Proceed to Phase 1 (Design & Contracts)
