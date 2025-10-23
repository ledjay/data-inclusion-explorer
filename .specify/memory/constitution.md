<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0 (new principle added + technical standards expanded)
- Modified principles: None
- Added principles:
  - Principle VII: Minimalism & Simplicity
- Modified sections:
  - Technical Standards: Added Architecture section, clarified API integration as bridge pattern
  - Technical Standards: Added Source of Truth section for Data Inclusion API
- Removed sections: None
- Templates requiring updates:
  ✅ plan-template.md (reviewed - Constitution Check section compatible)
  ✅ spec-template.md (reviewed - minimalism principle aligns)
  ✅ tasks-template.md (reviewed - task structure compatible)
- Follow-up TODOs: None
-->

# Data Inclusion Explorer Constitution

## Core Principles

### I. Accessibility First (NON-NEGOTIABLE)

The application MUST be usable by non-technical users without requiring knowledge of APIs, JSON, or development concepts.

**Rules**:
- All data MUST be presented in human-readable formats (tables, cards, visual layouts)
- Technical jargon MUST be avoided or explained in plain language
- Navigation MUST be intuitive with clear visual hierarchy
- Filters and search MUST use natural language labels, not API parameter names
- Error messages MUST be user-friendly and actionable

**Rationale**: The primary users are non-developers exploring social inclusion data. Technical barriers prevent the target audience from accessing critical information.

### II. Visual-First Data Presentation

Data from the API MUST be transformed into visual, scannable formats by default, with optional access to raw data for technical users.

**Rules**:
- Visual presentation (cards, tables, structured layouts) MUST be the default view
- Raw JSON MUST NOT be shown by default to avoid overwhelming non-technical users
- Technical users MUST be able to access raw data through explicit UI controls (e.g., "Show Raw Data" button)
- Key information MUST be highlighted and easily scannable in visual views
- Relationships between entities MUST be visually represented
- Empty states and loading states MUST provide clear feedback
- Raw data views MUST be clearly labeled and contextual

**Rationale**: Visual presentation serves non-technical users while optional raw data access empowers technical users to inspect API responses, debug, and understand data structures.

### III. Filter-Driven Exploration

Users MUST be able to narrow down and explore data through intuitive, composable filters without writing queries.

**Rules**:
- All API query parameters MUST be exposed as user-friendly filters
- Filters MUST be clearly labeled with their purpose and effect
- Filter state MUST be visible and easily modifiable
- Multiple filters MUST work together predictably
- Filter results MUST update responsively with clear feedback

**Rationale**: Non-technical users need guided exploration. Filters provide structure while maintaining flexibility.

### IV. Live Documentation

The application MUST serve as living documentation for the Data Inclusion API, showing real examples and capabilities.

**Rules**:
- Available API endpoints MUST be discoverable through the UI
- Real data examples MUST demonstrate API capabilities
- API structure and relationships MUST be evident from the interface
- Changes to the API MUST be reflected in the application
- Documentation MUST be embedded contextually, not in separate docs

**Rationale**: The best API documentation shows real data in action. The explorer teaches by example.

### V. Performance & Responsiveness

The application MUST feel fast and responsive, even when working with large datasets or slow API responses.

**Rules**:
- Initial page load MUST be under 3 seconds on standard connections
- Filter changes MUST provide immediate visual feedback
- Loading states MUST be clear and informative
- Large result sets MUST be paginated or virtualized
- API errors MUST be handled gracefully without breaking the UI

**Rationale**: Slow or unresponsive interfaces frustrate users and create the perception of broken functionality.

### VI. Progressive Disclosure for Technical Users

Technical users MUST be able to inspect underlying API data structures without cluttering the interface for non-technical users.

**Rules**:
- Raw API responses (JSON) MUST be accessible via explicit UI controls (buttons, toggles, expandable sections)
- Technical details MUST be hidden by default and revealed on demand
- Raw data views MUST include syntax highlighting and formatting for readability
- Copy-to-clipboard functionality MUST be provided for raw data
- API endpoint URLs and request parameters MUST be visible to technical users
- Response metadata (status codes, headers, timing) SHOULD be available for debugging
- Technical views MUST NOT interfere with the primary visual presentation

**Rationale**: Developers and technical users need to understand API behavior, debug issues, and learn the API structure. Progressive disclosure serves both audiences without compromise.

### VII. Minimalism & Simplicity (NON-NEGOTIABLE)

The codebase and user interface MUST remain minimal, clean, and free of unnecessary complexity.

**Rules**:
- Code MUST be minimalistic: no over-engineering, no premature abstractions
- Components MUST do one thing well rather than many things poorly
- Dependencies MUST be justified: avoid adding libraries for trivial functionality
- UI MUST be clean and uncluttered: every element must serve a clear purpose
- Features MUST be essential: resist feature creep and scope expansion
- Complexity MUST be justified in writing before implementation
- Refactoring MUST simplify, not complicate

**Rationale**: Simple code is maintainable code. Clean interfaces are usable interfaces. Complexity is a liability that compounds over time. Start simple, stay simple.

## Technical Standards

### Architecture

**Pattern**: Next.js frontend with API Routes bridge

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Next.js App Router)                               │
│ - React components (shadcn/ui + Tailwind CSS)              │
│ - Client-side state management                             │
│ - UI logic and presentation                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ API Routes (Next.js /app/api)                               │
│ - Bridge to Data Inclusion API                             │
│ - Request transformation and validation                    │
│ - Response caching (optional)                              │
│ - Error handling and logging                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Data Inclusion API (External)                               │
│ https://api-staging.data.inclusion.beta.gouv.fr             │
│ - Source of truth for all data                             │
│ - API documentation: /api/docs                             │
└─────────────────────────────────────────────────────────────┘
```

**Rules**:
- Frontend MUST NOT call Data Inclusion API directly (use API routes)
- API routes MUST act as a thin bridge, not a complex backend
- Data transformations SHOULD happen in the frontend when possible
- API routes SHOULD only handle authentication, rate limiting, and error normalization

### Technology Stack

**Core Framework**: Next.js 15+ with React 19+
- Server-side rendering for performance
- App Router for modern routing patterns
- TypeScript for type safety

**Styling**: Tailwind CSS 4+
- Utility-first approach for rapid development
- Consistent design system
- Responsive by default

**UI Components**: shadcn/ui (built on Radix UI)
- Accessible components out of the box
- Customizable and composable
- Production-ready patterns

**Icons**: Lucide React
- Consistent icon system
- Lightweight and tree-shakeable

### Code Quality Standards

- TypeScript MUST be used for all new code
- ESLint rules MUST be followed (no warnings in production)
- Components MUST be modular and reusable
- API calls MUST be centralized in service layers
- Error boundaries MUST catch and display errors gracefully

### Source of Truth

**Data Inclusion API**: https://api-staging.data.inclusion.beta.gouv.fr

**Rules**:
- The Data Inclusion API is the SINGLE source of truth for all data
- API documentation MUST be consulted before implementing features: https://api-staging.data.inclusion.beta.gouv.fr/api/docs
- Data models MUST match the API schema exactly
- API changes MUST be reflected in the application immediately
- When in doubt about data structure or behavior, check the API docs first
- Feature requests that require API changes MUST be documented and communicated to the API team

**Rationale**: The application is a visualization layer for the Data Inclusion API. The API defines the data model, capabilities, and constraints. Staying synchronized with the API is critical.

### API Integration

- Frontend MUST call internal API routes (e.g., `/api/structures`), not external Data Inclusion API directly
- API routes MUST forward requests to Data Inclusion API with minimal transformation
- All API calls MUST go through centralized service functions in the frontend
- API responses MUST be typed with TypeScript interfaces matching Data Inclusion API schema
- Loading and error states MUST be handled consistently
- API errors MUST be logged for debugging
- Rate limiting and retry logic SHOULD be implemented in API routes when appropriate

## Development Workflow

### Feature Development

1. **Specification**: Features MUST be specified using `/speckit.specify` before implementation
2. **Planning**: Implementation plans MUST be created using `/speckit.plan`
3. **Task Generation**: Tasks MUST be generated using `/speckit.tasks`
4. **Implementation**: Follow the task list in dependency order
5. **Validation**: Test features against acceptance criteria before considering complete

### Code Changes

- Changes MUST be focused and minimal
- Existing patterns MUST be followed unless explicitly improving them
- Breaking changes MUST be documented and justified
- Commits MUST be atomic and well-described

### Testing Strategy

- User acceptance testing MUST verify features work for non-technical users
- Visual regression testing SHOULD be used for UI changes
- API integration MUST be tested against real or mocked endpoints
- Edge cases (empty data, errors, slow responses) MUST be tested

### Deployment

- Production deployment is via Vercel
- All changes MUST be tested in preview deployments before production
- Breaking changes MUST be communicated to users
- Rollback procedures MUST be documented

## Governance

### Amendment Process

This constitution can be amended when:
- New principles emerge from project evolution
- Existing principles prove insufficient or incorrect
- Technology stack changes require updated standards
- User feedback reveals gaps in current principles

Amendments MUST:
1. Be proposed with clear rationale
2. Be reviewed against existing principles for conflicts
3. Update version number according to semantic versioning
4. Propagate changes to all dependent templates and documentation
5. Include a Sync Impact Report

### Versioning Policy

- **MAJOR** (X.0.0): Backward-incompatible principle changes, removals, or redefinitions
- **MINOR** (0.X.0): New principles added or existing principles materially expanded
- **PATCH** (0.0.X): Clarifications, wording improvements, non-semantic refinements

### Compliance

- All feature specifications MUST reference relevant constitutional principles
- Implementation plans MUST include a Constitution Check section
- Code reviews MUST verify compliance with applicable principles
- Violations MUST be justified in the Complexity Tracking section of plan.md
- This constitution supersedes all other practices in case of conflict

### Continuous Improvement

- Principles SHOULD be refined based on real-world application
- Feedback from users and developers SHOULD inform amendments
- Regular reviews SHOULD identify outdated or incomplete guidance
- Documentation MUST stay synchronized with constitutional changes

**Version**: 1.2.0 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
