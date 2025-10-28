# Phase 0: Research & Clarifications

**Feature**: Expose All Data Inclusion API Filters to Sidebar  
**Date**: Oct 28, 2025  
**Status**: Complete

## Research Summary

All critical clarifications were resolved during the `/speckit.clarify` workflow. This document consolidates findings and decisions.

---

## Q1: Filter Schema Discovery

**Decision**: Filters are inferred from API documentation and hardcoded based on known API capabilities (no dedicated schema endpoint).

**Rationale**: 
- The Data Inclusion API does not expose a dedicated `/filters` or `/schema` endpoint
- Current implementation already follows this pattern (hardcoded `TYPES` array in `ServiceFilters.tsx`)
- Aligns with existing codebase patterns and API integration approach

**Alternatives Considered**:
- A: Dedicated `/filters` endpoint - Not available in API
- C: Partial documentation - Insufficient for complete filter exposure
- D: Unknown - Avoided due to risk and implementation uncertainty

**Implementation Approach**:
- Create `src/config/filters.config.ts` with centralized filter definitions
- Document all available filters based on Data Inclusion API documentation
- Update configuration when API adds new filters (manual process, acceptable given API stability)

---

## Q2: Filter Ordering and Organization

**Decision**: Filters are grouped by category (e.g., "Location", "Service Type", "Quality", "Cost") for better UX.

**Rationale**:
- Improves discoverability and reduces cognitive load for users
- Aligns with Principle III (Filter-Driven Exploration) from constitution
- Common pattern in search interfaces and data exploration tools
- Supports scalability as more filters are added

**Alternatives Considered**:
- A: API documentation order - No inherent organization
- C: Alphabetical - Less intuitive for user mental models
- D: User-customizable - Adds complexity; not justified for MVP

**Implementation Approach**:
- Define filter categories in configuration
- Create `FilterCategory.tsx` component for grouping
- Use collapsible sections or visual grouping in UI
- Order categories by importance: Location → Service Type → Quality → Cost

---

## Q3: Mobile/Responsive Sidebar Behavior

**Decision**: Modal/drawer on mobile devices; persistent sidebar on desktop.

**Rationale**:
- Maximizes screen real estate on mobile while maintaining desktop UX
- Aligns with Principle V (Performance & Responsiveness) from constitution
- Industry-standard pattern for responsive filter interfaces
- Supports all screen sizes without compromising usability

**Alternatives Considered**:
- A: Collapsible groups - Insufficient for mobile; still consumes space
- B: Scrollable sidebar - Poor UX on mobile; difficult to interact with
- D: Paginated filters - Adds unnecessary complexity

**Implementation Approach**:
- Use Tailwind CSS responsive classes (`hidden md:block`)
- Implement drawer component using shadcn/ui `Drawer` or `Sheet`
- Desktop: Persistent sidebar with sticky positioning
- Mobile: Trigger button opens full-screen drawer with all filters

---

## Q4: Filter Caching Strategy

**Decision**: No caching; fetch filter options fresh on every page load or interaction.

**Rationale**:
- Ensures data freshness and consistency
- Simplicity: avoids cache invalidation complexity
- Aligns with Principle VII (Minimalism & Simplicity) from constitution
- API response times are acceptable for this use case
- Specification explicitly requires fresh fetches

**Alternatives Considered**:
- B: Session cache - Adds state management complexity
- C: Time-based cache - Requires cache invalidation logic
- D: Persistent cache - Risk of stale data; localStorage management overhead

**Implementation Approach**:
- Fetch filter configuration on component mount
- No caching layer; rely on browser HTTP cache if desired
- Loading states provide feedback during fetch
- Error handling for failed fetches

---

## Q5: Handling Unknown/Unsupported Filters in URL

**Decision**: Silently ignore unsupported filter parameters without notifying the user.

**Rationale**:
- Graceful degradation: system remains functional with invalid parameters
- Improves user experience: no confusing error messages
- Handles edge cases (outdated bookmarks, API deprecations)
- Aligns with Principle I (Accessibility First) from constitution

**Alternatives Considered**:
- B: Preserve and warn - Adds UI clutter; confuses non-technical users
- C: Preserve silently - Risk of silent failures; API may reject parameters
- D: Error state - Breaks functionality; poor UX

**Implementation Approach**:
- Create `filter-utils.ts` with validation function
- Filter URL parameters against known filter definitions
- Remove unsupported parameters before passing to API
- Log warnings in development for debugging

---

## Technology Decisions

### UI Component Library
**Decision**: Continue using shadcn/ui (Radix UI + Tailwind CSS)

**Rationale**:
- Already in use throughout the project
- Accessible components out of the box
- Customizable and composable
- Reduces dependency bloat

### State Management
**Decision**: URL query parameters + React component state

**Rationale**:
- Aligns with existing pattern in `page.tsx`
- Enables bookmarking and sharing of filtered views
- Simplicity: no additional state management library needed
- Specification requirement: FR-004

### Filter Type Rendering
**Decision**: Generic `FilterControl.tsx` component with type-specific rendering

**Rationale**:
- Reduces code duplication
- Supports multiple filter types (categorical, numeric, boolean)
- Easy to extend for new filter types
- Maintainability: single source of truth for filter UI logic

---

## Implementation Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| API filter schema changes | Document process for updating `filters.config.ts`; add comments with API documentation links |
| Mobile drawer UX issues | Test on multiple devices; use proven shadcn/ui drawer component |
| Performance with many filters | Implement lazy loading or virtualization if needed; monitor with performance metrics |
| URL parameter pollution | Validate and sanitize all parameters; log invalid parameters in development |

---

## Next Steps

- **Phase 1**: Generate data model, API contracts, and quickstart documentation
- **Phase 2**: Generate task list with dependency ordering
- **Implementation**: Follow task list in priority order

