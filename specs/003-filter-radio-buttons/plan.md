# Implementation Plan: Filter Radio Button UX Enhancement

**Branch**: `003-filter-radio-buttons` | **Date**: Oct 28, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-filter-radio-buttons/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Convert two categorical filters (Frais and Mode d'accueil) from dropdown/combobox UI to inline radio button groups. Each filter has exactly 2 options, making radio buttons the optimal UX pattern. This change reduces user interaction from 2 clicks (open dropdown + select) to 1 click (select radio), while providing immediate visibility of all available options. Implementation involves modifying the FilterControl component to detect 2-option categorical filters and render them using the existing shadcn/ui RadioGroup component instead of the Popover/Command dropdown pattern.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9+, React 19+, Next.js 15+  
**Primary Dependencies**: shadcn/ui (Radix UI), Tailwind CSS 4+, Lucide React  
**Storage**: N/A (UI-only change, no data persistence)  
**Testing**: Manual testing, visual regression testing  
**Target Platform**: Web browsers (Chrome, Firefox, Safari), responsive design (mobile + desktop)
**Project Type**: Web application (Next.js frontend)  
**Performance Goals**: Immediate visual feedback on radio selection (<50ms), no layout shift  
**Constraints**: Must maintain existing filter state management, URL synchronization, and accessibility standards  
**Scale/Scope**: 2 filters affected (Frais, Mode d'accueil), 1 component modified (FilterControl.tsx), ~50-100 LOC change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Accessibility First ✅ PASS
- Radio buttons improve accessibility by making all options visible without interaction
- Keyboard navigation fully supported (Tab, Arrow keys, Space/Enter)
- Screen reader support via proper ARIA labels and roles (FR-010, FR-011)
- Reduces cognitive load by eliminating dropdown interaction pattern

### Principle II: Visual-First Data Presentation ✅ PASS
- Radio buttons are inherently visual - all options displayed inline
- No hidden state (dropdown closed vs open)
- Clear visual feedback on selection
- Maintains existing visual hierarchy in filter sidebar

### Principle III: Filter-Driven Exploration ✅ PASS
- Improves filter UX by reducing clicks from 2 to 1
- Makes filter options immediately scannable
- Maintains existing filter composition and URL state behavior
- No change to filter logic, only presentation

### Principle IV: Live Documentation ✅ PASS
- No impact (UI change only, API unchanged)

### Principle V: Performance & Responsiveness ✅ PASS
- Radio buttons are lighter than dropdown popovers (no Command component overhead)
- Immediate visual feedback on selection
- No additional API calls or data fetching
- Performance improvement: simpler DOM structure

### Principle VI: Progressive Disclosure ✅ PASS
- No impact (no technical details involved)

### Principle VII: Minimalism & Simplicity ✅ PASS
- **Simplifies UI**: Removes dropdown complexity for 2-option filters
- **No new dependencies**: Uses existing shadcn/ui RadioGroup component
- **Minimal code change**: ~50-100 LOC in FilterControl.tsx
- **Clear purpose**: Each radio button serves one clear function
- **Reduces abstractions**: Simpler rendering logic for 2-option categorical filters
- **Justified complexity**: None added, actually reduces UI complexity

### Technical Standards ✅ PASS
- Uses existing Next.js 15+ / React 19+ / TypeScript stack
- Uses existing shadcn/ui components (RadioGroup already available)
- Follows existing Tailwind CSS patterns
- No API integration changes (frontend-only)
- Maintains existing code quality standards

**Overall Assessment**: ✅ **PASS** - Feature aligns with all constitutional principles and technical standards. Improves UX while maintaining simplicity.

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── FilterControl.tsx        # ← MODIFY: Add radio button rendering for 2-option filters
│   ├── ServiceFilters.tsx       # ← No changes needed (uses FilterControl)
│   └── ui/
│       ├── radio-group.tsx      # ← EXISTING: shadcn/ui RadioGroup component
│       └── label.tsx            # ← EXISTING: shadcn/ui Label component
├── config/
│   └── filters.config.ts        # ← No changes needed (filter definitions unchanged)
├── types/
│   └── filter.ts                # ← No changes needed (Filter type unchanged)
└── lib/
    └── filter-utils.ts          # ← No changes needed (URL sync logic unchanged)

tests/
└── manual/
    └── filter-radio-buttons.md  # ← CREATE: Manual test checklist
```

**Structure Decision**: Next.js web application with component-based architecture. This is a UI-only change affecting a single component (FilterControl.tsx). The existing filter infrastructure (config, types, utils) remains unchanged. Radio button rendering is added as a conditional branch within the CategoricalFilterControl function, triggered when a categorical filter has exactly 2 options.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations**: This feature aligns with all constitutional principles and adds no complexity. In fact, it reduces UI complexity by simplifying the interaction pattern for 2-option filters.

---

## Phase Completion Status

### Phase 0: Research ✅ COMPLETE
- **Output**: `research.md` created with 5 research questions answered
- **Key Decisions**:
  - Use radio buttons for 2-option categorical filters
  - Add "Tous" option for clearing filters
  - Automatic detection based on option count
  - Use existing shadcn/ui RadioGroup component
  - Vertical stacking for mobile responsiveness

### Phase 1: Design & Contracts ✅ COMPLETE
- **Output**: `data-model.md` created (no schema changes, reference only)
- **Output**: `quickstart.md` created with implementation guide
- **Output**: Agent context updated (`.windsurf/rules/specify-rules.md`)
- **Key Findings**:
  - No data model changes required
  - No API contracts needed (UI-only change)
  - Single component modification (FilterControl.tsx)
  - Estimated implementation time: 1-2 hours

### Phase 2: Task Generation 🔄 PENDING
- **Next Step**: Run `/speckit.tasks` to generate actionable task list
- **Expected Tasks**: ~5-10 tasks (setup, implementation, testing, polish)
