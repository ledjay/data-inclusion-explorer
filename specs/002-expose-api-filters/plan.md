# Implementation Plan: Expose All Data Inclusion API Filters to Sidebar

**Branch**: `002-expose-api-filters` | **Date**: Oct 28, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-expose-api-filters/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Expose all available Data Inclusion API filters in the sidebar by refactoring the hardcoded filter configuration into a dynamic, category-based system. The implementation will fetch filter metadata from a centralized configuration, render appropriate UI controls for each filter type (categorical, numeric, boolean), and maintain filter state in URL parameters. Mobile devices will use a modal/drawer pattern while desktop maintains a persistent sidebar. No caching is used to ensure fresh filter options on every interaction.

## Technical Context

**Language/Version**: TypeScript 5.9+ with React 19+ and Next.js 15+  
**Primary Dependencies**: React, Next.js, shadcn/ui, Tailwind CSS, Lucide React  
**Storage**: N/A (stateless frontend, state in URL parameters)  
**Testing**: Playwright (E2E), Jest (unit tests)  
**Target Platform**: Web (desktop and mobile browsers)  
**Project Type**: Web application (Next.js frontend with API routes bridge)  
**Performance Goals**: Filter updates within 500ms (excluding API response time); sidebar responsive on all devices  
**Constraints**: No caching of filter options; fresh fetch on every page load/interaction; graceful handling of unsupported filters  
**Scale/Scope**: Sidebar component refactor affecting ~500 LOC; support for 10+ filter categories with 50+ total filter options

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I: Accessibility First** ✅ PASS
- Filters will use human-readable labels, not API parameter names
- Filter categories will be clearly organized for intuitive navigation
- Error states will be user-friendly and actionable

**Principle II: Visual-First Data Presentation** ✅ PASS
- Filter UI will use visual controls (dropdowns, sliders, radio buttons) appropriate to each filter type
- Loading and empty states will provide clear feedback
- No raw JSON will be exposed in the filter UI

**Principle III: Filter-Driven Exploration** ✅ PASS
- All API query parameters will be exposed as user-friendly filters
- Multiple filters will work together predictably
- Filter results will update responsively

**Principle IV: Live Documentation** ✅ PASS
- The expanded filter sidebar serves as documentation of available API capabilities
- Real data examples demonstrate filter effects

**Principle V: Performance & Responsiveness** ✅ PASS
- Filter changes will provide immediate visual feedback
- Loading states will be clear and informative
- Target: filter updates within 500ms (excluding API response)

**Principle VI: Progressive Disclosure for Technical Users** ✅ PASS
- Technical users can inspect filter parameters in URL
- Raw API responses remain accessible via existing service detail panel

**Principle VII: Minimalism & Simplicity** ✅ PASS
- Refactor will simplify filter management by centralizing configuration
- No over-engineering; use existing shadcn/ui components
- Avoid unnecessary abstractions

**GATE RESULT**: ✅ **PASS** - Feature aligns with all constitutional principles

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ServiceFilters.tsx          # Main filter sidebar component (refactored)
│   ├── FilterCategory.tsx          # New: Category grouping component
│   ├── FilterControl.tsx           # New: Generic filter control renderer
│   └── ui/                         # Existing shadcn/ui components
├── config/
│   └── filters.config.ts           # New: Centralized filter configuration
├── types/
│   ├── filter.ts                   # New: Filter type definitions
│   └── [existing types]
├── lib/
│   ├── filter-utils.ts             # New: Filter validation and transformation
│   └── [existing utilities]
└── app/
    ├── page.tsx                    # Existing home page (uses ServiceFilters)
    └── api/
        └── [existing API routes]

tests/
├── e2e/
│   └── filters.spec.ts             # New: E2E tests for filter functionality
└── unit/
    ├── filter-utils.test.ts        # New: Filter utility tests
    └── [existing tests]
```

**Structure Decision**: Web application with Next.js frontend. The refactor is primarily a component-level change affecting `ServiceFilters.tsx` and introducing new supporting components and configuration. No backend changes required; existing API routes remain unchanged.

## Complexity Tracking

> **No constitutional violations. All complexity is justified and minimal.**

| Item | Justification |
|------|---------------|
| New `FilterControl.tsx` component | Centralizes UI rendering logic for different filter types (categorical, numeric, boolean), reducing duplication and improving maintainability |
| New `filters.config.ts` configuration | Enables dynamic filter discovery without hardcoding; single source of truth for filter metadata |
| New `filter-utils.ts` utilities | Encapsulates validation and URL parameter handling logic; reusable across components |
| No caching strategy | Ensures fresh filter options on every interaction per specification; simplicity over premature optimization |
