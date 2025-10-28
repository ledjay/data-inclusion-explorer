# Implementation Tasks: Filter Radio Button UX Enhancement

**Feature**: Filter Radio Button UX Enhancement  
**Branch**: `003-filter-radio-buttons`  
**Date**: Oct 28, 2025  
**Status**: Ready for Implementation

## Overview

This document contains all actionable tasks for implementing the filter radio button UX enhancement. Tasks are organized by user story priority to enable independent implementation and testing.

**Total Tasks**: 11  
**Estimated Effort**: 1-2 hours (1 developer)  
**Suggested MVP Scope**: Phase 1 (Setup) + Phase 2 (User Story 1 - P1)

---

## Phase 1: Setup & Preparation

**Goal**: Prepare development environment and understand existing code  
**Completion Criteria**: Development environment ready; existing patterns understood; branch created

### Setup Tasks

- [x] T001 Create feature branch `003-filter-radio-buttons` and verify it's checked out
- [x] T002 Review existing `FilterControl.tsx` component to understand current CategoricalFilterControl implementation
- [x] T003 Review `filters.config.ts` to confirm Frais and Mode d'accueil filters have exactly 2 options each
- [x] T004 Verify shadcn/ui RadioGroup and Label components are available in `src/components/ui/`

---

## Phase 2: User Story 1 - Quick Filter Selection with Radio Buttons (Priority: P1)

**Goal**: Display Frais and Mode d'accueil filters as inline radio button groups  
**Independent Test**: Open filter sidebar, verify radio buttons display for both filters, select an option, confirm service list updates and URL changes  
**Completion Criteria**: Both filters render as radio buttons; all options visible inline; filter selection works correctly

### Implementation Tasks

- [x] T005 [P] [US1] Add conditional logic to `CategoricalFilterControl` in `src/components/FilterControl.tsx` to detect 2-option filters
- [x] T006 [P] [US1] Implement radio button rendering branch in `CategoricalFilterControl` using shadcn/ui RadioGroup component in `src/components/FilterControl.tsx`
- [x] T007 [US1] Add "Tous" (All) radio option to allow clearing filters in `src/components/FilterControl.tsx`
- [x] T008 [P] [US1] Test Frais filter renders as radio buttons with 3 options: Tous, Gratuit, Payant
- [x] T009 [P] [US1] Test Mode d'accueil filter renders as radio buttons with 3 options: Tous, À distance, En présentiel
- [x] T010 [US1] Test radio button selection immediately updates URL parameters and service list in browser
- [x] T011 [US1] Test URL state synchronization: load page with `?frais=gratuit` and verify radio button is selected

---

## Phase 3: User Story 2 - Clear Filter Selection (Priority: P2)

**Goal**: Ensure users can clear radio button filters  
**Independent Test**: Apply a radio button filter, click "Tous" option, verify filter is removed and all services show  
**Completion Criteria**: "Tous" option clears filter; "Réinitialiser tous les filtres" button works with radio buttons

### Implementation Tasks

- [x] T012 [US2] Test clicking "Tous" radio option clears the filter and removes URL parameter
- [x] T013 [US2] Test "Réinitialiser tous les filtres" button resets radio buttons to "Tous" state
- [x] T014 [US2] Test multiple filter changes: select Frais → select Mode d'accueil → clear Frais → verify correct state

---

## Phase 4: User Story 3 - Consistent Visual Design (Priority: P3)

**Goal**: Ensure radio buttons match existing design system  
**Independent Test**: Review filter sidebar and verify radio buttons use consistent styling with other filters  
**Completion Criteria**: Spacing, typography, colors consistent; dark mode works; responsive on mobile

### Implementation Tasks

- [x] T015 [P] [US3] Test radio button styling matches existing filter styling (spacing, typography, colors) in light mode
- [x] T016 [P] [US3] Test radio button styling in dark mode and verify proper color contrast
- [x] T017 [US3] Test mobile responsive layout: radio buttons stack vertically on screens < 768px without horizontal scroll

---

## Phase 5: Testing & Validation

**Goal**: Verify all features work correctly and meet success criteria  
**Completion Criteria**: All acceptance scenarios pass; edge cases handled; no regressions

### Manual Testing

- [x] T018 [P] Test invalid URL parameter (e.g., `?frais=invalid`) defaults to "Tous" without errors
- [x] T019 [P] Test rapid successive radio button clicks don't cause state issues
- [x] T020 [P] Test browser back/forward navigation preserves radio button state correctly
- [x] T021 Test all other filters (Sources, Types, Publics, Commune, Score) remain as dropdowns unchanged
- [x] T022 Test keyboard navigation: Tab moves between filters, Arrow keys move within radio group, Space/Enter selects option
- [x] T023 Test screen reader announces radio group label and all options correctly

---

## Phase 6: Polish & Documentation

**Goal**: Ensure code quality and prepare for deployment  
**Completion Criteria**: Code follows patterns; no console errors; documentation complete

### Code Quality

- [x] T024 Verify no TypeScript errors: run `npx tsc --noEmit`
- [x] T025 Verify no ESLint warnings: run `pnpm lint`
- [x] T026 Verify no console errors in browser DevTools when interacting with radio filters
- [x] T027 Create manual test checklist in `tests/manual/filter-radio-buttons.md` documenting all test scenarios

---

## Task Dependencies & Execution Strategy

### Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (User Story 1 - P1) ← MVP Scope
    ↓
Phase 3 (User Story 2 - P2) ← Can run in parallel with Phase 4
    ↓
Phase 4 (User Story 3 - P3) ← Can run in parallel with Phase 3
    ↓
Phase 5 (Testing)
    ↓
Phase 6 (Polish)
```

### Parallelizable Tasks

**Phase 2 Parallelization** (within User Story 1):
- T005: Add conditional logic
- T006: Implement radio rendering
- T008-T011: Testing tasks (can run in parallel after T006 complete)

**Phase 3 & Phase 4 Parallelization**:
- Phase 3 (clear filter) and Phase 4 (visual design) can be done in parallel
- Both are verification/polish tasks that don't conflict

**Phase 5 Parallelization**:
- T018-T023: All testing tasks can run in parallel

### Suggested Execution Order

**Session 1** (30-45 minutes): Phase 1 + Phase 2
- T001-T004: Setup (10 minutes)
- T005-T007: Implementation (20 minutes)
- T008-T011: Testing (15 minutes)

**Session 2** (30-45 minutes): Phase 3 + Phase 4 + Phase 5
- T012-T014: Clear filter testing (10 minutes)
- T015-T017: Visual design testing (10 minutes)
- T018-T023: Comprehensive testing (15 minutes)

**Session 3** (15 minutes): Phase 6
- T024-T027: Code quality and documentation (15 minutes)

### MVP Scope (Minimum Viable Product)

**Recommended MVP**: Phase 1 + Phase 2 (User Story 1)

This delivers:
- ✅ Frais and Mode d'accueil filters display as radio buttons
- ✅ All options visible inline
- ✅ Filter selection works correctly
- ✅ URL synchronization works

**Time Estimate**: 30-45 minutes

**Post-MVP Enhancements**: Phase 3-6 can be added incrementally for polish and validation

---

## Success Criteria Mapping

| Success Criterion | Verified By | Task(s) |
|-------------------|------------|---------|
| SC-001: 0 clicks to view options | T008, T009 | Phase 2 |
| SC-002: 1 click to select option | T010, T012 | Phase 2, 3 |
| SC-003: Inline display on desktop | T015, T017 | Phase 4 |
| SC-004: URL state sync 100% accurate | T011, T020 | Phase 2, 5 |
| SC-005: Keyboard accessible | T022 | Phase 5 |
| SC-006: Other filters unchanged | T021 | Phase 5 |

---

## Implementation Notes

1. **Start with Phase 1**: Understand existing code before making changes
2. **Use quickstart.md**: Reference implementation guide for code templates
3. **Test frequently**: After each task, verify in browser before moving on
4. **Follow existing patterns**: Reuse Tailwind classes and component structure
5. **Maintain accessibility**: Ensure ARIA labels and keyboard navigation work

---

## Rollback Plan

If issues arise during implementation:

1. **Phase 2 issues**: Revert `FilterControl.tsx` to previous version; start over with simpler approach
2. **Phase 3-4 issues**: These are polish tasks; can be skipped if blocking
3. **Phase 5 issues**: Address specific failing tests without rolling back implementation
4. **Phase 6 issues**: Polish is optional; can be addressed post-deployment

---

## Completion Checklist

- [x] All Phase 1 tasks complete (Setup)
- [x] All Phase 2 tasks complete (User Story 1 - MVP)
- [x] All Phase 3 tasks complete (User Story 2)
- [x] All Phase 4 tasks complete (User Story 3)
- [x] All Phase 5 tasks complete (Testing)
- [x] All Phase 6 tasks complete (Polish)
- [x] Frais and Mode d'accueil filters display as radio buttons
- [x] All acceptance scenarios from spec pass
- [x] No console errors or warnings
- [x] Code follows existing patterns
- [x] Ready for production deployment
- [x] Bug fix: Added modes_accueil filter parameter to page.tsx
- [x] Bug fix: Added publics filter parameter to page.tsx
- [x] All filters now properly update service list
