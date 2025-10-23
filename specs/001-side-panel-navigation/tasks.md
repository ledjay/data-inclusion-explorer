# Tasks: Side Panel Navigation

**Input**: Design documents from `/specs/001-side-panel-navigation/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: This feature does NOT include automated tests (project has no test infrastructure). Manual testing will be performed using quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below use absolute paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component structure

- [x] T001 Create `src/components/ServiceDetail.tsx` component file (empty skeleton)
- [x] T002 Create `src/components/ServiceDetailPanel.tsx` component file (empty skeleton)
- [x] T003 [P] Review existing `src/app/page.tsx` structure and layout
- [x] T004 [P] Review existing `src/components/ServiceCard.tsx` component

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Extract service detail display logic from `src/app/services/[id]/page.tsx` into `src/components/ServiceDetail.tsx` component
- [x] T006 Update `src/app/services/[id]/page.tsx` to use the new `ServiceDetail` component (verify existing page still works)
- [x] T007 Add panel state management to `src/app/page.tsx` (useState for selectedServiceId)
- [x] T008 Add URL parameter sync logic to `src/app/page.tsx` (optional: service parameter in URL)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Card Details in Side Panel (Priority: P1) 🎯 MVP

**Goal**: Users can click a card and see details in a side panel that slides in from the right, taking 50% of screen width, while the card list resizes and the filter bar remains fixed.

**Independent Test**: Click any card in the list and verify that a side panel slides in from the right taking 50% of the screen, while the card list container responsively resizes, and the filter bar on the far left remains completely unchanged.

### Implementation for User Story 1

- [x] T009 [P] [US1] Implement `ServiceDetailPanel` component in `src/components/ServiceDetailPanel.tsx` with slide animation (CSS transitions)
- [x] T010 [P] [US1] Add service data fetching logic to `ServiceDetailPanel` component (fetch from API when serviceId changes)
- [x] T011 [US1] Integrate `ServiceDetail` component into `ServiceDetailPanel` (pass fetched service data as props)
- [x] T012 [US1] Add loading and error states to `ServiceDetailPanel` component
- [x] T013 [US1] Implement panel slide-in animation using Tailwind CSS transitions (translate-x-0 when open, translate-x-full when closed)
- [x] T014 [US1] Add close button to `ServiceDetailPanel` component (calls onClose callback)
- [x] T015 [US1] Modify `src/components/ServiceCard.tsx` to accept optional onClick prop
- [x] T016 [US1] Update `ServiceCard` component to call onClick instead of Link when onClick is provided
- [x] T017 [US1] Update `src/app/page.tsx` layout to use CSS Grid 3-column layout (filter | cards | panel)
- [x] T018 [US1] Implement responsive grid columns in `page.tsx` (auto for filter, 1fr for cards, 50% for panel when open)
- [x] T019 [US1] Wire up ServiceCard onClick handler in `page.tsx` to set selectedServiceId
- [x] T020 [US1] Render `ServiceDetailPanel` in `page.tsx` when selectedServiceId is not null
- [x] T021 [US1] Implement panel close logic in `page.tsx` (setSelectedServiceId to null)
- [x] T022 [US1] Add click-outside-to-close functionality to `ServiceDetailPanel` component
- [x] T023 [US1] Verify filter bar in `src/components/ServiceFilters.tsx` remains unchanged (no code changes needed, just visual verification)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate Between Cards Without Closing Panel (Priority: P2)

**Goal**: Users can click different cards while the panel is open to update the panel content without closing it, enabling quick comparison.

**Independent Test**: Open the side panel with one card, then click another card in the resized list and verify the panel updates with the new card's details without closing or resizing.

### Implementation for User Story 2

- [x] T024 [US2] Update `ServiceDetailPanel` to handle serviceId prop changes (useEffect to refetch when serviceId changes)
- [x] T025 [US2] Add smooth content transition animation to `ServiceDetailPanel` (fade effect when content updates)
- [x] T026 [US2] Verify panel width remains stable at 50% when switching between services
- [x] T027 [US2] Verify card list width remains stable when switching between services
- [x] T028 [US2] Test rapid clicking between multiple cards (ensure no race conditions or stale data)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Visual Indication of Selected Card (Priority: P3)

**Goal**: Users can see which card is currently displayed in the panel through visual highlighting.

**Independent Test**: Open the side panel and verify that the currently selected card has a distinct visual indicator (highlight, border, or background color) that differentiates it from other cards.

### Implementation for User Story 3

- [x] T029 [US3] Add isSelected prop to `ServiceCard` component interface in `src/components/ServiceCard.tsx`
- [x] T030 [US3] Implement visual highlight styles for selected card in `ServiceCard` component (border, background, or ring effect)
- [x] T031 [US3] Pass isSelected prop to ServiceCard in `page.tsx` (compare service.id with selectedServiceId)
- [x] T032 [US3] Verify highlight is removed when panel closes (selectedServiceId becomes null)
- [x] T033 [US3] Verify highlight updates when switching between cards

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T034 [P] Implement Escape key handler in `ServiceDetailPanel` to close panel
- [x] T035 [P] Implement Tab key focus trap in `ServiceDetailPanel` (focus stays within panel when open)
- [x] T036 [P] Add ARIA attributes to `ServiceDetailPanel` (role="dialog", aria-modal="true", aria-labelledby)
- [x] T037 [P] Implement mobile responsive styles for `ServiceDetailPanel` (full-screen overlay on < 768px)
- [x] T038 [P] Add responsive grid adjustments to `page.tsx` for mobile (hide cards when panel open on mobile)
- [x] T039 Test panel animations are smooth and complete in < 300ms (use browser DevTools Performance tab)
- [x] T040 Test service details load in < 2 seconds (use browser DevTools Network tab)
- [x] T041 Verify filter bar remains completely fixed during all panel operations (visual inspection)
- [x] T042 Test panel with services containing long descriptions and many fields (verify scrolling works)
- [x] T043 Test panel with services missing optional fields (verify no layout breaks)
- [x] T044 Test browser window resize with panel open (verify 50/50 split maintains)
- [x] T045 Test on mobile devices or mobile viewport (verify full-screen overlay works)
- [x] T046 Run through all test scenarios in `specs/001-side-panel-navigation/quickstart.md`
- [x] T047 Verify all constitutional principles are met (Accessibility, Visual-First, Minimalism, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable

### Within Each User Story

- Tasks within a story follow natural dependency order:
  - Component creation before integration
  - State management before UI updates
  - Core functionality before polish
- Tasks marked [P] can run in parallel within the same phase

### Critical Path

```
Setup (T001-T004)
    ↓
Foundational (T005-T008) ← BLOCKING
    ↓
    ├─→ User Story 1 (T009-T023) ← MVP
    ├─→ User Story 2 (T024-T028)
    └─→ User Story 3 (T029-T033)
    ↓
Polish (T034-T047)
```

### Parallel Opportunities

**Within Setup Phase**:
- T003 and T004 can run in parallel (reviewing different files)

**Within Foundational Phase**:
- T007 and T008 can run in parallel (different concerns in same file)

**Within User Story 1**:
- T009 and T010 can run in parallel (panel component structure + fetch logic)
- T015 and T016 can run together (modifying ServiceCard)
- T017 and T018 can run together (page layout changes)

**Within Polish Phase**:
- T034, T035, T036, T037, T038 can all run in parallel (different files/concerns)

**Across User Stories** (if team has multiple developers):
- After Foundational phase completes, US1, US2, US3 can all start in parallel
- Each developer takes one user story
- Stories integrate at the end

---

## Parallel Example: User Story 1

```bash
# Can run in parallel:
Task T009: Implement ServiceDetailPanel component structure
Task T010: Add service data fetching logic to ServiceDetailPanel

# Can run in parallel:
Task T015: Modify ServiceCard to accept onClick prop
Task T016: Update ServiceCard to use onClick

# Can run in parallel:
Task T017: Update page.tsx layout to CSS Grid
Task T018: Implement responsive grid columns
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T008) - CRITICAL
3. Complete Phase 3: User Story 1 (T009-T023)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md
5. Deploy/demo if ready

**MVP Deliverable**: Users can click a card and see details in a side panel that slides in from the right, taking 50% of screen. Filter bar remains fixed, card list resizes responsively.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T009-T023) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T024-T028) → Test independently → Deploy/Demo
4. Add User Story 3 (T029-T033) → Test independently → Deploy/Demo
5. Add Polish (T034-T047) → Final testing → Deploy/Demo
6. Each increment adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T008)
2. Once Foundational is done:
   - Developer A: User Story 1 (T009-T023)
   - Developer B: User Story 2 (T024-T028) - can start in parallel
   - Developer C: User Story 3 (T029-T033) - can start in parallel
3. Stories complete and integrate independently
4. Team tackles Polish together (T034-T047)

---

## Notes

- **[P] tasks**: Different files or independent concerns, no dependencies on incomplete tasks
- **[Story] label**: Maps task to specific user story for traceability
- **Each user story is independently completable and testable**
- **No automated tests**: Project has no test infrastructure, manual testing required
- **Commit strategy**: Commit after each task or logical group
- **Stop at any checkpoint**: Validate story independently before proceeding
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Total Tasks**: 47
- **Setup Phase**: 4 tasks
- **Foundational Phase**: 4 tasks (BLOCKING)
- **User Story 1 (P1 - MVP)**: 15 tasks
- **User Story 2 (P2)**: 5 tasks
- **User Story 3 (P3)**: 5 tasks
- **Polish Phase**: 14 tasks

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel  
**MVP Scope**: Phases 1-3 (23 tasks) delivers functional side panel  
**Full Feature**: All 47 tasks for complete, polished implementation

---

## Validation Checklist

Before considering feature complete:

- [ ] All 47 tasks checked off
- [ ] Each user story tested independently (see quickstart.md)
- [ ] Filter bar verified to remain completely fixed (visual inspection)
- [ ] Panel animations smooth (< 300ms)
- [ ] Service details load quickly (< 2s)
- [ ] Keyboard navigation works (Escape, Tab)
- [ ] Mobile responsive (full-screen overlay)
- [ ] No console errors or warnings
- [ ] Code follows existing patterns and style
- [ ] All constitutional principles satisfied

