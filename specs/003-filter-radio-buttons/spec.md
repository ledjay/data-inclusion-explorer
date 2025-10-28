# Feature Specification: Filter Radio Button UX Enhancement

**Feature Branch**: `003-filter-radio-buttons`  
**Created**: Oct 28, 2025  
**Status**: Ready for Planning  
**Input**: User description: "create a new quick strpine to update 2 filters for UX enhancement. Inside our filter sidebar we need the Frais and Mode d'accueil filters to be radio buttons instead of dropdowns"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Quick Filter Selection with Radio Buttons (Priority: P1)

As a user filtering services, I want to select Frais (cost) and Mode d'accueil (reception mode) options using radio buttons instead of dropdowns so that I can see all available options at a glance and make faster selections without clicking through a dropdown menu.

**Why this priority**: These two filters have only 2 options each (Frais: gratuit/payant, Mode d'accueil: à distance/en présentiel), making them perfect candidates for radio buttons. Radio buttons provide immediate visibility of all options and reduce interaction steps from 2 clicks (open dropdown + select) to 1 click (select radio). This is the core UX improvement.

**Independent Test**: Open the filter sidebar, verify that Frais and Mode d'accueil display as radio button groups showing all options inline, and confirm that selecting an option immediately applies the filter without additional clicks.

**Acceptance Scenarios**:

1. **Given** I open the filter sidebar, **When** I view the Frais filter, **Then** I see two radio buttons labeled "Gratuit" and "Payant" displayed inline without needing to open a dropdown
2. **Given** I view the Mode d'accueil filter, **When** I look at the options, **Then** I see two radio buttons labeled "À distance" and "En présentiel" displayed inline
3. **Given** no filter is selected, **When** I click a radio button option, **Then** the filter is immediately applied and the service list updates
4. **Given** I have selected a radio option, **When** I click a different radio option in the same filter, **Then** the previous selection is replaced with the new one

---

### User Story 2 - Clear Filter Selection (Priority: P2)

As a user who has applied a radio button filter, I want a clear way to remove the filter selection so that I can return to viewing all services without that constraint.

**Why this priority**: While applying filters is the primary action (P1), users also need to remove filters. This is secondary because the "Réinitialiser tous les filtres" button already exists as a fallback, but having per-filter clearing improves UX.

**Independent Test**: Apply a radio button filter, then verify there's a clear way to deselect it and return to the unfiltered state.

**Acceptance Scenarios**:

1. **Given** I have selected a radio button option, **When** I click a "clear" or "all" option, **Then** the filter is removed and all services are shown again
2. **Given** I have selected a radio button option, **When** I click the "Réinitialiser tous les filtres" button, **Then** the radio button returns to its unselected/default state

---

### User Story 3 - Consistent Visual Design (Priority: P3)

As a user, I want the radio button filters to match the existing design system so that the interface feels cohesive and professional.

**Why this priority**: Visual consistency is important for polish but doesn't affect core functionality. Users can successfully use radio buttons even if styling isn't perfect.

**Independent Test**: Review the radio button filters and verify they use the same styling, spacing, and visual patterns as other UI elements in the sidebar.

**Acceptance Scenarios**:

1. **Given** I view the filter sidebar, **When** I compare radio button filters to other filters, **Then** they use consistent spacing, typography, and color schemes
2. **Given** I switch between light and dark mode, **When** I view the radio button filters, **Then** they adapt appropriately to both themes

### Edge Cases

- What happens when a user has a filter value in the URL that doesn't match any radio option (e.g., invalid value)?
- How does the system handle URL state synchronization when radio buttons are selected?
- What happens if the API adds a third option to Frais or Mode d'accueil in the future?
- How are radio buttons displayed on mobile devices with limited screen width?
- What happens when a user rapidly clicks multiple radio options in succession?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST render the Frais filter as a radio button group instead of a dropdown/combobox
- **FR-002**: System MUST render the Mode d'accueil filter as a radio button group instead of a dropdown/combobox
- **FR-003**: System MUST display all radio options inline without requiring a click to reveal them
- **FR-004**: System MUST allow only one option to be selected at a time within each radio group (mutually exclusive selection)
- **FR-005**: System MUST provide a way to clear/deselect the radio button selection (e.g., "Tous" or "All" option)
- **FR-006**: System MUST maintain existing filter behavior: selecting a radio option immediately updates the URL and triggers service list refresh
- **FR-007**: System MUST synchronize radio button state with URL parameters (on page load and when URL changes)
- **FR-008**: System MUST preserve the existing "Réinitialiser tous les filtres" button functionality with radio buttons
- **FR-009**: System MUST keep all other filters (Sources, Types, Publics, Commune, Score de qualité) unchanged as dropdowns/sliders
- **FR-010**: Radio button groups MUST be accessible via keyboard navigation (Tab, Arrow keys, Space/Enter to select)
- **FR-011**: Radio button groups MUST have proper ARIA labels and roles for screen readers

### Key Entities

- **Filter**: Existing entity representing a filter configuration (id, label, type, options, etc.). The `type` field currently supports 'categorical', 'numeric', 'boolean'. This feature adds a new rendering mode for categorical filters with 2 options.
- **FilterOption**: Existing entity representing a selectable option within a filter (value, label, available). Used by both dropdown and radio button filters.
- **FilterState**: Existing entity representing the current state of all applied filters. Radio button selections are stored the same way as dropdown selections.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can see all Frais and Mode d'accueil options without clicking (0 clicks to view options, down from 1 click to open dropdown)
- **SC-002**: Users can select a Frais or Mode d'accueil option with 1 click (down from 2 clicks: open dropdown + select option)
- **SC-003**: Radio button filters display all options inline on screens ≥768px wide without horizontal scrolling
- **SC-004**: Radio button state correctly synchronizes with URL parameters on page load and navigation (100% accuracy)
- **SC-005**: Radio button filters are keyboard accessible and can be navigated and selected using only keyboard (Tab, Arrow keys, Space/Enter)
- **SC-006**: All other filters (7 total) remain unchanged and function identically to before this change
