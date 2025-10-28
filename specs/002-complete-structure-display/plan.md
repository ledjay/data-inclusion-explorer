# Implementation Plan: Complete Service Data Display

**Branch**: `002-complete-structure-display` | **Date**: Oct 28, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-complete-structure-display/spec.md`

## Summary

Display all service data fields returned by the Data Inclusion API in the ServiceDetail component. Currently, 15 fields are missing from the UI. The implementation will add these fields organized into semantic sections (Contact, Location, Mobilization, Quality, Access) while maintaining the Data Inclusion API as the single source of truth. Geographic coordinates will be displayed as formatted text with clickable map links.

## Technical Context

**Language/Version**: TypeScript 5.9+ / React 19+ / Next.js 15+  
**Primary Dependencies**: 
- shadcn/ui (Radix UI components)
- Tailwind CSS 4+
- Lucide React (icons)

**Storage**: N/A (read-only from Data Inclusion API)  
**Testing**: Jest (unit), Playwright (E2E)  
**Target Platform**: Web (modern browsers, mobile responsive)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- Component render < 100ms
- No layout shift when fields load
- Smooth scrolling for long content

**Constraints**: 
- MUST display all API fields without transformation
- MUST maintain Data Inclusion API as source of truth
- MUST handle missing/null fields gracefully
- MUST be accessible (WCAG 2.1 AA)

**Scale/Scope**: 
- Single component modification (ServiceDetail.tsx)
- 15 new fields to display
- ~5 semantic sections to organize
- Estimated 200-300 lines of code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Accessibility First** | ✅ PASS | All fields displayed in human-readable format with clear labels. No technical jargon exposed to users. |
| **II. Visual-First Data Presentation** | ✅ PASS | Fields organized into visual sections. Raw JSON already available via toggle. New fields follow same pattern. |
| **III. Filter-Driven Exploration** | ✅ N/A | Not applicable - this feature displays detail view, not filters. |
| **IV. Live Documentation** | ✅ PASS | Displaying all API fields demonstrates complete API capabilities. Shows real data examples. |
| **V. Performance & Responsiveness** | ✅ PASS | Component-level change, minimal performance impact. Conditional rendering prevents layout shift. |
| **VI. Progressive Disclosure** | ✅ PASS | Technical fields (structure_id, coordinates) shown but not prominent. Raw data toggle unchanged. |
| **VII. Minimalism & Simplicity** | ✅ PASS | Minimal change: adding fields to existing component. No new dependencies. No abstractions. |

**Overall**: ✅ **PASS** - All applicable principles satisfied. No violations to justify.

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
│   ├── ServiceDetail.tsx          # PRIMARY: Component to modify
│   ├── ServiceDetailPanel.tsx     # May need updates for layout
│   └── ui/                        # shadcn/ui components (existing)
├── types/
│   └── service.ts                 # Service type definition (reference only)
└── app/
    └── services/[id]/
        └── page.tsx               # Service detail page (uses ServiceDetail)

tests/
├── e2e/
│   └── service-detail.spec.ts    # E2E tests for new fields
└── unit/
    └── service-detail.test.tsx   # Component tests
```

**Structure Decision**: Next.js App Router web application. Primary change is to `src/components/ServiceDetail.tsx`. The Service type in `src/types/service.ts` already defines all 34 fields - we're just adding UI for the 15 missing ones.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this section intentionally left empty.

---

## Phase 0: Research ✅ COMPLETE

**Output**: `research.md`

**Key Decisions**:
1. Section organization: Group by semantic purpose
2. Geographic coordinates: Formatted text + map link (OpenStreetMap)
3. Array fields: Continue using tag/badge pattern
4. Missing fields: Conditional rendering only
5. Quality score: Prominent display with visual indicator

**No unknowns remaining** - all technical decisions resolved.

---

## Phase 1: Design ✅ COMPLETE

**Outputs**:
- `data-model.md` - Complete Service entity with 34 fields documented
- `quickstart.md` - Implementation patterns and code templates
- `.windsurf/rules/specify-rules.md` - Updated agent context

**Key Artifacts**:
- 15 missing fields identified and mapped to 6 semantic sections
- 6 implementation patterns documented with code examples
- Field-to-section mapping table for quick reference

**Agent Context Updated**: TypeScript/React/Next.js stack confirmed

---

## Next Steps

Run `/speckit.tasks` to generate the implementation task list.

**Estimated Effort**: 2-3 hours
- Component modification: 1-2 hours
- Testing: 30-60 minutes
- Review & polish: 30 minutes

**Files to Modify**:
- `src/components/ServiceDetail.tsx` (primary)
- `tests/e2e/service-detail.spec.ts` (new tests)
- `tests/unit/service-detail.test.tsx` (new tests)
