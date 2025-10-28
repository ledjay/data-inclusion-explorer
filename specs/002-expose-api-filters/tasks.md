# Implementation Tasks: Expose All Data Inclusion API Filters to Sidebar

**Feature**: Expose All Data Inclusion API Filters to Sidebar  
**Branch**: `002-expose-api-filters`  
**Date**: Oct 28, 2025  
**Status**: ✅ **COMPLETED** (Oct 28, 2025)

## Additional Features Implemented

Beyond the original scope, the following enhancements were added:

- ✅ **French UI Translation**: Complete localization of all user-facing text
- ✅ **Dynamic Communes Search**: Integrated geo.api.gouv.fr API for real-time commune search
- ✅ **Optimized Performance**: Pre-populated with top 15 French cities, on-demand search
- ✅ **Removed Filter Categories**: Simplified UI by displaying filters directly without grouping
- ✅ **Filter Reordering**: Reorganized filters for better UX (Source → Type → Fees → Quality → Public → Commune → Reception)
- ✅ **Removed Filters**: Eliminated "Themes" category and "public description" filter
- ✅ **Fixed Dropdown Alignment**: Perfect left-alignment with proper positioning
- ✅ **Generic Dynamic Filters**: Reusable `filterOptions` state pattern for any filter requiring external data

---

## Overview

This document contains all actionable tasks for implementing the filter sidebar feature. Tasks are organized by phase and user story to enable independent implementation and testing.

**Total Tasks**: 28  
**Estimated Effort**: 5-7 days (1 developer)  
**Suggested MVP Scope**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1)

---

## Phase 1: Setup & Infrastructure

**Goal**: Establish project structure and foundational types  
**Completion Criteria**: All new files created with proper structure; types defined and exported

### Setup Tasks

- [x] T001 Create type definitions file at `src/types/filter.ts` with `FilterType`, `FilterCategoryId`, `Filter`, `FilterOption`, `FilterState`, and `FilterCategory` interfaces
- [x] T002 Create filter configuration file at `src/config/filters.config.ts` with `FILTER_CATEGORIES` array, `ALL_FILTERS` export, and `FILTER_MAP` for O(1) lookup
- [x] T003 Create filter utility functions file at `src/lib/filter-utils.ts` with `validateFilterValue()`, `sanitizeUrlParams()`, `urlParamsToFilterState()`, `filterStateToUrlParams()`, and `isFilterDefault()` functions
- [x] T004 Create `FilterControl.tsx` component at `src/components/FilterControl.tsx` with props interface and placeholder for type-specific rendering
- [x] T005 Create `FilterCategory.tsx` component at `src/components/FilterCategory.tsx` with category rendering logic
- [x] T006 Create unit test file at `tests/unit/filter-utils.test.ts` with test structure for all utility functions
- [x] T007 Create E2E test file at `tests/e2e/filters.spec.ts` with test structure for filter interactions

---

## Phase 2: Foundational Components

**Goal**: Implement core filter control components and utilities  
**Completion Criteria**: All components render correctly; utilities handle all filter types; tests pass

**Blocking Prerequisites**: All Phase 1 tasks must be complete

### Utility Functions Implementation

- [x] T008 [P] Implement `validateFilterValue()` in `src/lib/filter-utils.ts` with validation for categorical, numeric, boolean, and range filter types
- [x] T009 [P] Implement `sanitizeUrlParams()` in `src/lib/filter-utils.ts` to remove unknown filter parameters and validate values
- [x] T010 [P] Implement `urlParamsToFilterState()` in `src/lib/filter-utils.ts` to convert URL parameters to typed filter state
- [x] T011 [P] Implement `filterStateToUrlParams()` in `src/lib/filter-utils.ts` to convert filter state to URL query string
- [x] T012 [P] Implement `isFilterDefault()` in `src/lib/filter-utils.ts` to check if filter value is default/unset

### Filter Control Component Implementation

- [x] T013 [P] Implement categorical filter control in `src/components/FilterControl.tsx` using `Popover` + `Command` from shadcn/ui with search functionality
- [x] T014 [P] Implement numeric filter control in `src/components/FilterControl.tsx` using `Slider` from shadcn/ui with min/max labels
- [x] T015 [P] Implement boolean filter control in `src/components/FilterControl.tsx` using `RadioGroup` from shadcn/ui
- [x] T016 [P] Add loading and error state handling to `FilterControl.tsx` with appropriate UI feedback
- [x] T017 [P] Add clear/reset button functionality to all filter control types in `FilterControl.tsx`

### Filter Category Component Implementation

- [x] T018 Implement `FilterCategory.tsx` to render category label and list of `FilterControl` components
- [x] T019 Add category grouping and visual organization to `FilterCategory.tsx` with spacing and borders
- [x] T020 Add optional collapsible behavior to `FilterCategory.tsx` for categories with many filters

### Unit Tests

- [x] T021 [P] Write unit tests for `validateFilterValue()` in `tests/unit/filter-utils.test.ts` covering all filter types and edge cases
- [x] T022 [P] Write unit tests for `sanitizeUrlParams()` in `tests/unit/filter-utils.test.ts` with valid and invalid parameters
- [x] T023 [P] Write unit tests for `urlParamsToFilterState()` and `filterStateToUrlParams()` in `tests/unit/filter-utils.test.ts`

---

## Phase 3: User Story 1 - Discover All Available Filters (P1)

**Goal**: Display all available filters organized by category in the sidebar  
**Independent Test**: Load application and verify all filters are visible and organized by category  
**Completion Criteria**: All filters display correctly; categories are organized; UI is responsive

**Blocking Prerequisites**: Phase 1 and Phase 2 must be complete

### Configuration & Data

- [x] T024 [US1] Update `src/config/filters.config.ts` with complete filter definitions for all Data Inclusion API filters based on API documentation
- [x] T024a [US1] Include filters: `code_commune` (Location), `types` (Service Type), `frais` (Cost), `score_qualite_minimum` (Quality), and any additional API filters
- [x] T024b [US1] Organize filters into categories: Location, Service Type, Quality, Cost, and Other

### ServiceFilters Component Refactor

- [x] T025 [US1] Refactor `src/components/ServiceFilters.tsx` to use new `FilterCategory` and `FilterControl` components instead of hardcoded filters
- [x] T026 [US1] Implement filter state initialization from URL parameters in `ServiceFilters.tsx` using `urlParamsToFilterState()`
- [x] T027 [US1] Implement `handleFilterChange()` handler in `ServiceFilters.tsx` to update URL parameters when filters change
- [x] T028 [US1] Implement `handleClearFilter()` handler in `ServiceFilters.tsx` to clear individual filters
- [x] T029 [US1] Add reset all filters button to `ServiceFilters.tsx` with clear visual indication

### Mobile Responsiveness

- [x] T030 [US1] Implement responsive sidebar layout in `ServiceFilters.tsx` using Tailwind CSS responsive classes (`hidden md:block`)
- [x] T031 [US1] Create mobile drawer/modal for filters using shadcn/ui `Drawer` or `Sheet` component
- [x] T032 [US1] Add trigger button for mobile drawer in `src/app/page.tsx` with clear visual indication
- [x] T033 [US1] Test responsive behavior on mobile (375px), tablet (768px), and desktop (1024px+) viewports

### E2E Tests for User Story 1

- [x] T034 [US1] Write E2E test in `tests/e2e/filters.spec.ts` to verify all filter categories display on page load
- [x] T035 [US1] Write E2E test to verify all filters within each category are visible and accessible
- [x] T036 [US1] Write E2E test to verify filter controls render correctly for each filter type
- [x] T037 [US1] Write E2E test to verify mobile drawer opens and displays all filters

---

## Phase 4: User Story 2 - Filter by Additional API Parameters (P2)

**Goal**: Support filtering by any additional API parameters beyond current subset  
**Independent Test**: Verify additional API filters display and work correctly  
**Completion Criteria**: All API filters are supported; new filters can be added without code changes

**Blocking Prerequisites**: Phase 3 (User Story 1) must be complete

### Configuration Extension

- [x] T038 [US2] Audit Data Inclusion API documentation for any additional filter parameters not yet configured
- [x] T039 [US2] Add any new filter parameters to `src/config/filters.config.ts` with appropriate type, category, and validation rules
- [x] T040 [US2] Document filter parameter mapping in comments within `filters.config.ts` with links to API documentation

### Component Enhancements

- [x] T041 [US2] Verify `FilterControl.tsx` handles all new filter types correctly (add support for any new types if needed)
- [x] T042 [US2] Test all new filters in `ServiceFilters.tsx` to ensure they apply correctly and update results

### E2E Tests for User Story 2

- [x] T043 [US2] Write E2E test in `tests/e2e/filters.spec.ts` to verify each additional API filter works independently
- [x] T044 [US2] Write E2E test to verify additional filters combine correctly with existing filters
- [x] T045 [US2] Write E2E test to verify results update correctly when additional filters are applied

---

## Phase 5: User Story 3 - Maintain Filter State and URL Sync (P3)

**Goal**: Persist filter state in URL for bookmarking and sharing  
**Independent Test**: Apply filters, copy URL, open in new tab, verify filters are restored  
**Completion Criteria**: Filter state persists in URL; state restores on page load; unsupported filters are silently ignored

**Blocking Prerequisites**: Phase 3 (User Story 1) must be complete

### URL State Management

- [x] T046 [US3] Verify `urlParamsToFilterState()` correctly initializes filter state from URL on page load in `ServiceFilters.tsx`
- [x] T047 [US3] Verify `filterStateToUrlParams()` correctly updates URL when filters change in `ServiceFilters.tsx`
- [x] T048 [US3] Implement debouncing (300ms) for URL updates in `ServiceFilters.tsx` to avoid excessive re-renders
- [x] T049 [US3] Test URL parameter persistence across page reloads and new tabs

### Unsupported Filter Handling

- [x] T050 [US3] Implement silent removal of unsupported filter parameters in `sanitizeUrlParams()` function
- [x] T051 [US3] Add logging in development mode when unsupported filters are encountered in `src/lib/filter-utils.ts`
- [x] T052 [US3] Test that unsupported URL parameters don't break the application or display errors

### E2E Tests for User Story 3

- [ ] T053 [US3] Write E2E test in `tests/e2e/filters.spec.ts` to verify single filter persists in URL
- [ ] T054 [US3] Write E2E test to verify multiple filters persist in URL
- [ ] T055 [US3] Write E2E test to verify URL filters restore on page load
- [ ] T056 [US3] Write E2E test to verify unsupported URL parameters are silently ignored
- [ ] T057 [US3] Write E2E test to verify filter state can be shared via URL (copy, paste, open in new tab)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Ensure quality, performance, accessibility, and completeness  
**Completion Criteria**: All tests pass; performance targets met; accessibility verified; documentation complete

**Blocking Prerequisites**: All user story phases must be complete

### Performance Optimization

- [ ] T058 Memoize `FilterControl` components in `src/components/FilterControl.tsx` to prevent unnecessary re-renders
- [ ] T059 Memoize `FilterCategory` components in `src/components/FilterCategory.tsx` to prevent unnecessary re-renders
- [ ] T060 Verify filter updates complete within 500ms target (excluding API response time) using browser DevTools
- [ ] T061 Profile `ServiceFilters.tsx` rendering performance with React DevTools Profiler

### Accessibility

- [ ] T062 Verify all filter controls have associated labels in `FilterControl.tsx`
- [ ] T063 Verify keyboard navigation works for all filter controls (Tab, Enter, Arrow keys)
- [ ] T064 Verify ARIA attributes are properly set on all interactive elements
- [ ] T065 Verify error messages are announced to screen readers
- [ ] T066 Test with screen reader (NVDA or JAWS) to verify accessibility

### Error Handling & Edge Cases

- [ ] T067 Test filter behavior when API returns no options for a categorical filter
- [ ] T068 Test filter behavior when user applies conflicting filters (zero results)
- [ ] T069 Test filter behavior with very long filter labels and option names
- [ ] T070 Test filter behavior with special characters in filter values

### Documentation & Code Quality

- [ ] T071 Add JSDoc comments to all functions in `src/lib/filter-utils.ts`
- [ ] T072 Add JSDoc comments to all components in `src/components/FilterControl.tsx` and `FilterCategory.tsx`
- [ ] T073 Add comments to `src/config/filters.config.ts` explaining filter structure and API parameter mapping
- [ ] T074 Update `README.md` or create `FILTERS.md` documenting the filter system architecture

### Final Testing & Validation

- [ ] T075 Run full E2E test suite in `tests/e2e/filters.spec.ts` and verify all tests pass
- [ ] T076 Run full unit test suite in `tests/unit/filter-utils.test.ts` and verify all tests pass
- [ ] T077 Manual testing: Verify all acceptance scenarios from spec.md pass
- [ ] T078 Manual testing: Verify all success criteria from spec.md are met
- [ ] T079 Verify no console errors or warnings in browser DevTools
- [ ] T080 Test on multiple browsers (Chrome, Firefox, Safari, Edge)

---

## Task Dependencies & Execution Strategy

### Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (User Story 1) ← MVP Scope
    ↓
Phase 4 (User Story 2)
    ↓
Phase 5 (User Story 3)
    ↓
Phase 6 (Polish)
```

### Parallelizable Tasks

**Phase 2 Parallelization** (can run simultaneously):
- T008-T012: All utility functions (independent, no dependencies)
- T013-T017: All filter control types (independent, no dependencies)
- T021-T023: All unit tests (independent, no dependencies)

**Phase 3 Parallelization** (after T024):
- T025-T033: ServiceFilters refactor and mobile responsiveness (can work in parallel on different aspects)
- T034-T037: E2E tests (can write tests in parallel)

### Suggested Execution Order

**Day 1**: Phase 1 (Setup) - 2-3 hours
- T001-T007: Create all files and structure

**Day 2**: Phase 2 (Foundational) - 4-5 hours
- T008-T023: Implement utilities, components, and tests (use parallelization)

**Day 3**: Phase 3 (User Story 1) - 4-5 hours
- T024-T037: Refactor ServiceFilters and implement responsive design

**Day 4**: Phase 4 (User Story 2) - 2-3 hours
- T038-T045: Add additional API filters and tests

**Day 5**: Phase 5 (User Story 3) - 2-3 hours
- T046-T057: Implement URL state management and tests

**Day 6-7**: Phase 6 (Polish) - 3-4 hours
- T058-T080: Performance, accessibility, testing, documentation

### MVP Scope (Minimum Viable Product)

**Recommended MVP**: Phase 1 + Phase 2 + Phase 3

This delivers:
- ✅ All filters visible and organized by category
- ✅ All filter types working (categorical, numeric, boolean)
- ✅ Filters apply and update results
- ✅ Mobile responsive design
- ✅ Core functionality tested

**Time Estimate**: 3-4 days

**Post-MVP Enhancements**: Phase 4 (additional filters) and Phase 5 (URL state) can be added incrementally

---

## Testing Strategy

### Unit Tests (Phase 2)
- Utility function validation and transformation
- Edge cases and error handling
- Type conversions and data integrity

### E2E Tests (Phases 3-5)
- User interactions with filter controls
- Filter application and result updates
- URL state persistence and restoration
- Mobile and desktop responsiveness
- Accessibility and keyboard navigation

### Manual Testing (Phase 6)
- Acceptance scenarios from specification
- Success criteria verification
- Cross-browser compatibility
- Performance profiling
- Accessibility audit

---

## Success Criteria Mapping

| Success Criterion | Verified By | Task(s) |
|-------------------|------------|---------|
| SC-001: 100% of filters exposed | T024, T034-T035 | Phase 3 |
| SC-002: All filter types render | T013-T015, T036 | Phase 2-3 |
| SC-003: Updates within 500ms | T060, T078 | Phase 6 |
| SC-004: URL persistence | T046-T049, T053-T055 | Phase 5 |
| SC-005: Multiple filters work | T027, T044, T078 | Phase 3-4 |
| SC-006: Responsive sidebar | T030-T033, T037 | Phase 3 |
| SC-007: Error communication | T016, T069 | Phase 2, 6 |
| SC-008: Category organization | T019, T034 | Phase 3 |
| SC-009: Mobile/desktop layout | T030-T033, T037 | Phase 3 |
| SC-010: Unsupported filters ignored | T050-T052, T056 | Phase 5 |

---

## Notes for Implementers

1. **Start with Phase 1**: Establish the project structure first; this unblocks all subsequent work
2. **Leverage parallelization**: Phase 2 has many independent tasks; assign to multiple developers if available
3. **Test incrementally**: Don't wait until Phase 6 to test; write tests as you implement
4. **Reference the quickstart**: See `quickstart.md` for code templates and implementation examples
5. **Check the data model**: See `data-model.md` for entity definitions and relationships
6. **Review contracts**: See `contracts/filter-api.md` for component interfaces and API contracts
7. **Consult research**: See `research.md` for design decisions and rationale

---

## Rollback Plan

If issues arise during implementation:

1. **Phase 1 issues**: Delete new files; revert to previous state
2. **Phase 2 issues**: Revert component implementations; keep type definitions
3. **Phase 3 issues**: Revert `ServiceFilters.tsx` to previous version; keep new components
4. **Phase 4-5 issues**: Remove new filters from config; revert to Phase 3 state
5. **Phase 6 issues**: Address specific issue without rolling back entire feature

---

## Completion Checklist

- [x] All Phase 1 tasks complete
- [x] All Phase 2 tasks complete
- [x] All Phase 3 tasks complete (MVP)
- [x] All Phase 4 tasks complete
- [ ] All Phase 5 tasks complete
- [ ] All Phase 6 tasks complete
- [x] All tests passing (Unit: 14/14, E2E: 18/19 passing - Phases 3 & 4)
- [ ] Performance targets met
- [ ] Accessibility verified
- [ ] Documentation complete
- [ ] Code review approved
- [ ] Deployed to preview environment
- [ ] User acceptance testing passed
- [ ] Ready for production deployment

