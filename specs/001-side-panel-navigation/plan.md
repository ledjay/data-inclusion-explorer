# Implementation Plan: Side Panel Navigation

**Branch**: `001-side-panel-navigation` | **Date**: 2025-10-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-side-panel-navigation/spec.md`

## Summary

Replace the current "open in new tab" behavior for service cards with a side panel that slides in from the right, taking 50% of the screen. The card list resizes responsively while the filter bar remains fixed. This is a refactoring task that reuses existing components.

## Technical Context

**Language/Version**: TypeScript 5 with Next.js 15.5.5, React 19.1.0  
**Primary Dependencies**: Next.js App Router, shadcn/ui (Radix UI), Tailwind CSS 4, Lucide React  
**Storage**: N/A (data fetched from Data Inclusion API)  
**Testing**: Manual testing (no automated tests currently in project)  
**Target Platform**: Web (responsive design, desktop and mobile)  
**Project Type**: Single web application (Next.js frontend + API routes)  
**Performance Goals**: Panel animations < 300ms, service details load < 2s  
**Constraints**: Filter bar must remain fixed, panel must be 50% width, no masking/overlay  
**Scale/Scope**: Refactoring existing components, minimal new code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Accessibility First (NON-NEGOTIABLE)
- ✅ **Pass**: Panel keeps list visible, improves UX for non-technical users
- ✅ **Pass**: Keyboard accessible (Escape to close, Tab navigation)
- ✅ **Pass**: No technical jargon, clear visual feedback

### Principle II: Visual-First Data Presentation
- ✅ **Pass**: Service details displayed visually in panel (reuses existing detail page)
- ✅ **Pass**: Raw data toggle already exists in detail page component

### Principle III: Filter-Driven Exploration
- ✅ **Pass**: Filter bar remains functional and unchanged
- ✅ **Pass**: No impact on existing filter functionality

### Principle IV: Live Documentation
- ✅ **Pass**: Panel shows real API data, maintains existing documentation approach

### Principle V: Performance & Responsiveness
- ✅ **Pass**: Smooth animations (< 300ms), responsive layout
- ✅ **Pass**: Maintains existing API performance

### Principle VI: Progressive Disclosure for Technical Users
- ✅ **Pass**: "Show Raw Data" button already exists in detail page component

### Principle VII: Minimalism & Simplicity (NON-NEGOTIABLE)
- ✅ **Pass**: Reuses existing `ServiceCard`, `ServiceFilters`, and detail page components
- ✅ **Pass**: Minimal code changes: add panel wrapper, modify click handler
- ✅ **Pass**: No new dependencies, no over-engineering

### Architecture: Next.js Frontend + API Routes Bridge
- ✅ **Pass**: No changes to API routes, only frontend modifications
- ✅ **Pass**: Maintains existing architecture

### Source of Truth: Data Inclusion API
- ✅ **Pass**: No changes to data fetching logic
- ✅ **Pass**: API remains source of truth

**Gate Result**: ✅ **PASS** - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-side-panel-navigation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
└── quickstart.md        # Phase 1 output (to be created)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                    # Main page with card list (MODIFY)
│   ├── services/[id]/page.tsx      # Detail page component (REUSE in panel)
│   └── layout.tsx                  # Root layout (no changes)
├── components/
│   ├── ServiceCard.tsx             # Card component (MODIFY click handler)
│   ├── ServiceFilters.tsx          # Filter bar (NO CHANGES)
│   ├── ServiceDetailPanel.tsx      # NEW: Side panel wrapper component
│   └── ui/                         # shadcn/ui components (use existing)
├── types/
│   └── service.ts                  # Service types (no changes)
└── lib/
    ├── api-client.ts               # API client (no changes)
    └── utils.ts                    # Utilities (no changes)
```

**Structure Decision**: Single web application with Next.js App Router. The existing structure is well-organized with clear separation between pages, components, types, and utilities. We'll add one new component (`ServiceDetailPanel.tsx`) and modify two existing files (`page.tsx` and `ServiceCard.tsx`).

## Complexity Tracking

> **No violations** - This feature aligns perfectly with all constitutional principles, especially Minimalism & Simplicity. We're reusing existing components and making minimal changes.

---

## Phase 0: Research & Technical Decisions

### Research Tasks

1. **Panel Animation Patterns in Next.js/React**
   - Research: Best practices for slide-in panel animations with Tailwind CSS
   - Decision needed: CSS transitions vs Framer Motion vs Tailwind animate
   - Constraint: Must complete in < 300ms

2. **Responsive Layout with Fixed Sidebar**
   - Research: CSS Grid vs Flexbox for 3-column layout (filter | cards | panel)
   - Decision needed: How to keep filter bar fixed while resizing card list
   - Constraint: Filter bar must not move or resize

3. **Client-Side State Management**
   - Research: React state vs URL state for panel open/close
   - Decision needed: Should panel state be in URL (for back button support)?
   - Constraint: Must work with Next.js App Router

4. **Component Reusability**
   - Research: How to reuse `/services/[id]/page.tsx` component in panel
   - Decision needed: Extract shared component or render existing page component
   - Constraint: Must maintain existing "Show Raw Data" functionality

### Expected Outputs

- `research.md` with decisions on:
  - Animation approach (CSS transitions recommended for simplicity)
  - Layout strategy (CSS Grid for 3-column layout)
  - State management (React state + optional URL param)
  - Component extraction strategy (create shared `ServiceDetail` component)

---

## Phase 1: Design & Contracts

### Data Model

**Entity: PanelState** (client-side only, no API changes)
- `isOpen`: boolean - Whether panel is currently open
- `selectedServiceId`: string | null - ID of service currently displayed in panel
- `isLoading`: boolean - Whether service details are loading
- `error`: string | null - Error message if service fetch fails

### API Contracts

**No new API endpoints needed** - Reuses existing:
- `GET /api/v1/services/{id}` - Fetch service details (already implemented)
- `GET /api/v1/search/services` - Search services (already implemented)

### Component Contracts

**ServiceDetailPanel Component**
```typescript
interface ServiceDetailPanelProps {
  serviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**ServiceCard Component** (modified)
```typescript
interface ServiceCardProps {
  service: Service;
  distance?: number | null;
  onClick?: (serviceId: string) => void; // NEW: Optional click handler
}
```

### Quickstart

**To test the side panel navigation:**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click on any service card - panel should slide in from right

4. Verify:
   - Panel takes 50% of screen width
   - Card list resizes responsively
   - Filter bar remains fixed (no movement/resizing)
   - Click another card - panel content updates
   - Click outside panel or close button - panel slides out
   - Press Escape key - panel closes

5. Test responsive behavior:
   - Resize browser window - verify 50/50 split maintains
   - Test on mobile (< 768px) - panel should adapt

---

## Phase 2: Implementation Tasks

**Note**: Tasks will be generated in detail using `/speckit.tasks` command. This section provides high-level task categories.

### Setup Tasks
- T001: Create `ServiceDetailPanel.tsx` component skeleton
- T002: Add panel state management to `page.tsx`

### Core Implementation
- T003: Implement panel slide animation (CSS transitions)
- T004: Implement 3-column responsive layout (filter | cards | panel)
- T005: Extract `ServiceDetail` component from `/services/[id]/page.tsx`
- T006: Integrate `ServiceDetail` into `ServiceDetailPanel`
- T007: Modify `ServiceCard` to accept `onClick` prop
- T008: Wire up panel open/close logic in `page.tsx`

### Polish & Testing
- T009: Add keyboard accessibility (Escape, Tab navigation)
- T010: Test responsive behavior and mobile adaptation
- T011: Verify filter bar remains fixed during all animations
- T012: Test panel with various service data (long descriptions, missing fields)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup**: No dependencies
- **Core Implementation**: Depends on Setup completion
- **Polish & Testing**: Depends on Core Implementation completion

### Task Dependencies
- T003-T004 can run in parallel (animations + layout)
- T005 must complete before T006 (extract component before using it)
- T007-T008 can run in parallel (modify card + wire up logic)
- T009-T012 depend on T001-T008 completion

---

## Notes

- **Existing Code Reuse**: The detail page at `/services/[id]/page.tsx` already has all the service display logic and "Show Raw Data" toggle. We'll extract this into a shared component.
- **Filter Bar**: Located in `ServiceFilters.tsx`, uses `sticky top-8` positioning. Must remain unchanged.
- **Card List**: Currently in `page.tsx` using `grid grid-cols-2`. Will need to adjust grid to accommodate panel.
- **API Client**: `api-client.ts` provides `fetchDataInclusion` helper for API routes. No changes needed.
- **Styling**: Project uses Tailwind CSS 4 with shadcn/ui components. All animations should use Tailwind utilities.
- **No Tests**: Project currently has no automated tests. Manual testing required.

