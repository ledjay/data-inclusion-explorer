# Research: Complete Service Data Display

**Feature**: Complete Service Data Display  
**Branch**: `002-complete-structure-display`  
**Date**: Oct 28, 2025

## Overview

This document captures research findings and design decisions for displaying all service data fields in the ServiceDetail component.

## Technical Decisions

### Decision 1: Section Organization Strategy

**Decision**: Group fields by semantic purpose (Contact, Location, Mobilization, Quality, Access)

**Rationale**:
- Improves scannability for users looking for specific information
- Matches mental models (users think "where is the contact info?" not "what's field 12?")
- Aligns with Constitution Principle I (Accessibility First) - intuitive navigation
- Follows existing pattern in ServiceDetail component (already has some grouping)

**Alternatives Considered**:
- **Flat list**: Simpler to implement but harder to scan with 34 fields
- **API order**: No control over presentation, may not be logical
- **Data type grouping**: Technical, not user-friendly

**Implementation Notes**:
- Use existing Tailwind spacing patterns (`space-y-6` for sections)
- Add semantic headings (`<h2>` or `<h3>`) for each section
- Maintain conditional rendering (only show sections with data)

---

### Decision 2: Geographic Coordinates Display

**Decision**: Display as formatted text with labels AND clickable map link

**Rationale**:
- **Formatted text**: Makes coordinates readable and copyable
- **Map link**: Provides immediate visual context without embedding heavy map component
- **No embedded map**: Avoids adding Google Maps/Mapbox dependency (Principle VII: Minimalism)
- **External link**: Leverages existing map services users already trust

**Alternatives Considered**:
- **Raw numbers only**: Not user-friendly, unclear which is lat vs lon
- **Formatted text only**: Misses opportunity for visual exploration
- **Embedded map**: Adds significant complexity and dependencies

**Implementation**:
```tsx
{service.latitude && service.longitude && (
  <div>
    <h3>Coordonnées géographiques</h3>
    <p>
      Latitude: {service.latitude}, Longitude: {service.longitude}
      {' '}
      <a 
        href={`https://www.openstreetmap.org/?mlat=${service.latitude}&mlon=${service.longitude}&zoom=15`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Voir sur la carte →
      </a>
    </p>
  </div>
)}
```

**Map Service Choice**: OpenStreetMap
- Open source, no API key required
- Privacy-friendly (no tracking)
- Widely recognized and trusted
- Alternative: Google Maps (`https://www.google.com/maps?q=${lat},${lon}`)

---

### Decision 3: Array Field Presentation

**Decision**: Continue using existing tag/badge pattern for array fields

**Rationale**:
- Consistent with existing implementation (thematiques, publics, modes_accueil already use this)
- Visual, scannable, and space-efficient
- No new patterns needed - reuse existing Tailwind classes

**Implementation Pattern**:
```tsx
{service.zone_eligibilite && service.zone_eligibilite.length > 0 && (
  <div>
    <h3>Zones d'éligibilité</h3>
    <div className="flex flex-wrap gap-2">
      {service.zone_eligibilite.map((zone) => (
        <span
          key={zone}
          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm"
        >
          {zone}
        </span>
      ))}
    </div>
  </div>
)}
```

---

### Decision 4: Missing Field Handling

**Decision**: Conditional rendering - only show sections/fields when data exists

**Rationale**:
- Prevents empty sections and "N/A" clutter
- Aligns with Constitution Principle II (Visual-First) - clean presentation
- Matches existing pattern in ServiceDetail component
- Gracefully handles sparse data

**Implementation**: Use `&&` conditional rendering for all optional fields

---

### Decision 5: Quality Score Display

**Decision**: Display prominently in Quality section with visual indicator

**Rationale**:
- Quality score is important metadata for users evaluating services
- Should be easy to locate (Success Criterion SC-005)
- Visual indicator (color, badge) helps quick assessment

**Implementation**:
```tsx
{service.score_qualite !== undefined && (
  <div>
    <h3>Score de qualité</h3>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">
        {(service.score_qualite * 100).toFixed(0)}%
      </span>
      <span className={`px-2 py-1 rounded text-sm ${
        service.score_qualite >= 0.8 ? 'bg-green-100 text-green-800' :
        service.score_qualite >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {service.score_qualite >= 0.8 ? 'Excellent' :
         service.score_qualite >= 0.5 ? 'Bon' : 'À améliorer'}
      </span>
    </div>
  </div>
)}
```

---

## Best Practices Applied

### React/TypeScript
- Use optional chaining (`service.field?.subfield`) for nested access
- Type-safe with existing Service interface
- Conditional rendering for optional fields
- Semantic HTML (`<h2>`, `<h3>`, `<section>`)

### Tailwind CSS
- Reuse existing utility classes
- Maintain consistent spacing (`space-y-6`, `gap-2`)
- Responsive design (`md:grid-cols-2`)
- Dark mode support (`dark:bg-*`)

### Accessibility
- Semantic headings for screen readers
- Clear link text ("Voir sur la carte" not "click here")
- Sufficient color contrast
- Keyboard navigation (links are focusable)

---

## Performance Considerations

**Impact**: Minimal
- No new API calls (data already fetched)
- No heavy dependencies added
- Conditional rendering prevents unnecessary DOM nodes
- Component remains under 500 lines

**Optimization**: None needed at this scale

---

## Testing Strategy

### Unit Tests
- Test conditional rendering for each field
- Test section grouping logic
- Test map link generation
- Test quality score formatting

### E2E Tests
- Verify all fields display when present
- Verify sections hidden when fields missing
- Verify map link opens correctly
- Compare UI to raw JSON for completeness

---

## Migration Notes

**Breaking Changes**: None
- Additive change only
- Existing fields unchanged
- Backward compatible

**Deployment**: Safe to deploy immediately
- No database changes
- No API changes
- Pure frontend enhancement
