# Quickstart: Complete Service Data Display

**Feature**: Complete Service Data Display  
**Branch**: `002-complete-structure-display`  
**Date**: Oct 28, 2025

## Overview

This guide provides code templates and patterns for implementing the complete service data display feature. Use these as starting points for the actual implementation.

---

## File to Modify

**Primary**: `src/components/ServiceDetail.tsx`

---

## Implementation Patterns

### Pattern 1: Adding a Simple Text Field

```tsx
{service.presentation_resume && (
  <div>
    <h3 className="font-semibold mb-1">Résumé</h3>
    <p className="text-gray-700 dark:text-gray-300">
      {service.presentation_resume}
    </p>
  </div>
)}
```

**Use for**: `presentation_resume`, `presentation_detail`, `frais_precisions`, `publics_precisions`, `mobilisation_precisions`, `horaires_accueil`

---

### Pattern 2: Adding Address Fields

```tsx
{(service.adresse || service.complement_adresse || service.code_insee) && (
  <div>
    <h3 className="font-semibold mb-1">Adresse complète</h3>
    <div className="text-gray-700 dark:text-gray-300">
      {service.adresse && <p>{service.adresse}</p>}
      {service.complement_adresse && <p>{service.complement_adresse}</p>}
      <p>
        {service.commune} {service.code_postal}
        {service.code_insee && ` (INSEE: ${service.code_insee})`}
      </p>
    </div>
  </div>
)}
```

**Use for**: Complete address display in Location section

---

### Pattern 3: Adding Geographic Coordinates with Map Link

```tsx
{service.latitude && service.longitude && (
  <div>
    <h3 className="font-semibold mb-1">Coordonnées géographiques</h3>
    <p className="text-gray-700 dark:text-gray-300">
      Latitude: {service.latitude.toFixed(6)}, Longitude: {service.longitude.toFixed(6)}
      {' '}
      <a
        href={`https://www.openstreetmap.org/?mlat=${service.latitude}&mlon=${service.longitude}&zoom=15`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        Voir sur la carte →
      </a>
    </p>
  </div>
)}
```

**Use for**: `longitude` / `latitude` display

**Alternative map services**:
- Google Maps: `https://www.google.com/maps?q=${lat},${lon}`
- Apple Maps: `https://maps.apple.com/?ll=${lat},${lon}`

---

### Pattern 4: Adding Array Fields as Tags

```tsx
{service.zone_eligibilite && service.zone_eligibilite.length > 0 && (
  <div>
    <h3 className="font-semibold mb-2">Zones d'éligibilité</h3>
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

**Use for**: `zone_eligibilite`, `modes_mobilisation`, `mobilisable_par`

**Color variants** (for visual distinction):
- Purple: `bg-purple-100 dark:bg-purple-900`
- Orange: `bg-orange-100 dark:bg-orange-900`
- Teal: `bg-teal-100 dark:bg-teal-900`

---

### Pattern 5: Adding Quality Score with Visual Indicator

```tsx
{service.score_qualite !== undefined && (
  <div>
    <h3 className="font-semibold mb-2">Score de qualité</h3>
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {(service.score_qualite * 100).toFixed(0)}%
      </span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          service.score_qualite >= 0.8
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : service.score_qualite >= 0.5
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}
      >
        {service.score_qualite >= 0.8
          ? 'Excellent'
          : service.score_qualite >= 0.5
          ? 'Bon'
          : 'À améliorer'}
      </span>
    </div>
  </div>
)}
```

**Use for**: `score_qualite` display

---

### Pattern 6: Adding Technical Metadata

```tsx
{service.structure_id && (
  <div>
    <h3 className="font-semibold mb-1">Identifiant de structure</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
      {service.structure_id}
    </p>
  </div>
)}
```

**Use for**: `structure_id` (technical field, less prominent)

---

## Section Organization Template

```tsx
export function ServiceDetail({ service, showRawData, onToggleRawData, onClose }: ServiceDetailProps) {
  return (
    <>
      {/* Header with toggle button - EXISTING */}
      <div className="flex justify-between items-center mb-4">
        {/* ... existing code ... */}
      </div>

      <div className={showRawData ? "grid grid-cols-2 gap-6 mt-8" : "mt-8"}>
        <div>
          {/* Title - EXISTING */}
          <h1 className="text-4xl font-bold mb-6">{service.nom}</h1>

          <div className="space-y-6">
            {/* SECTION 1: Description & Presentation */}
            {service.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {service.presentation_resume && (
              <div>
                <h3 className="font-semibold mb-1">Résumé</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {service.presentation_resume}
                </p>
              </div>
            )}

            {service.presentation_detail && (
              <div>
                <h3 className="font-semibold mb-1">Présentation détaillée</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {service.presentation_detail}
                </p>
              </div>
            )}

            {/* SECTION 2: Classification - EXISTING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.type && (
                <div>
                  <h3 className="font-semibold mb-1">Type</h3>
                  <p className="text-gray-700 dark:text-gray-300">{service.type}</p>
                </div>
              )}

              {service.frais && (
                <div>
                  <h3 className="font-semibold mb-1">Frais</h3>
                  <p className="text-gray-700 dark:text-gray-300">{service.frais}</p>
                </div>
              )}
            </div>

            {service.frais_precisions && (
              <div>
                <h3 className="font-semibold mb-1">Précisions sur les frais</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {service.frais_precisions}
                </p>
              </div>
            )}

            {/* SECTION 3: Contact - EXISTING + ADDITIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ... existing contact fields ... */}
            </div>

            {/* SECTION 4: Location - EXISTING + ADDITIONS */}
            {/* Add address fields and coordinates here */}

            {/* SECTION 5: Mobilization - NEW */}
            {(service.modes_mobilisation || service.mobilisable_par || service.mobilisation_precisions || service.zone_eligibilite) && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Mobilisation</h2>
                <div className="space-y-4">
                  {/* Add mobilization fields here */}
                </div>
              </div>
            )}

            {/* SECTION 6: Access & Conditions - EXISTING + ADDITIONS */}
            {/* Add horaires_accueil here */}

            {/* SECTION 7: Quality & Metadata - NEW */}
            {service.score_qualite !== undefined && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Qualité</h2>
                {/* Add quality score here */}
              </div>
            )}

            {/* SECTION 8: Themes & Publics - EXISTING + ADDITIONS */}
            {service.thematiques && service.thematiques.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Thématiques</h3>
                {/* ... existing code ... */}
              </div>
            )}

            {service.publics && service.publics.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Publics</h3>
                {/* ... existing code ... */}
              </div>
            )}

            {service.publics_precisions && (
              <div>
                <h3 className="font-semibold mb-1">Précisions sur les publics</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {service.publics_precisions}
                </p>
              </div>
            )}

            {/* Footer - EXISTING + structure_id */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500">
                ID: {service.id}
                {service.structure_id && ` • Structure: ${service.structure_id}`}
                {service.source && ` • Source: ${service.source}`}
                {service.date_maj &&
                  ` • Mis à jour le: ${new Date(service.date_maj).toLocaleDateString("fr-FR")}`}
              </p>
            </div>
          </div>
        </div>

        {/* Raw JSON view - EXISTING */}
        {showRawData && (
          <div className="sticky top-8 self-start">
            {/* ... existing code ... */}
          </div>
        )}
      </div>
    </>
  );
}
```

---

## Testing Checklist

### Manual Testing
- [ ] Load service with all fields populated - verify all display
- [ ] Load service with minimal fields - verify no empty sections
- [ ] Test map link opens correctly
- [ ] Test quality score colors (try 0.9, 0.6, 0.3)
- [ ] Test dark mode rendering
- [ ] Test mobile responsive layout
- [ ] Compare displayed fields to raw JSON (toggle view)

### Unit Tests
```typescript
// tests/unit/service-detail.test.tsx
import { render, screen } from '@testing-library/react';
import { ServiceDetail } from '@/components/ServiceDetail';

describe('ServiceDetail - Complete Fields', () => {
  it('displays presentation_resume when present', () => {
    const service = {
      id: '1',
      nom: 'Test Service',
      description: 'Test',
      presentation_resume: 'Short summary',
    };
    render(<ServiceDetail service={service} showRawData={false} onToggleRawData={() => {}} />);
    expect(screen.getByText('Short summary')).toBeInTheDocument();
  });

  it('displays geographic coordinates with map link', () => {
    const service = {
      id: '1',
      nom: 'Test Service',
      description: 'Test',
      latitude: 48.8566,
      longitude: 2.3522,
    };
    render(<ServiceDetail service={service} showRawData={false} onToggleRawData={() => {}} />);
    expect(screen.getByText(/Latitude: 48.8566/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voir sur la carte/i })).toHaveAttribute(
      'href',
      expect.stringContaining('openstreetmap.org')
    );
  });

  it('hides sections when fields are null', () => {
    const service = {
      id: '1',
      nom: 'Test Service',
      description: 'Test',
      // No optional fields
    };
    render(<ServiceDetail service={service} showRawData={false} onToggleRawData={() => {}} />);
    expect(screen.queryByText('Mobilisation')).not.toBeInTheDocument();
  });
});
```

---

## Common Pitfalls

1. **Forgetting conditional rendering**: Always check if field exists before displaying
2. **Missing dark mode classes**: Add `dark:` variants for all colors
3. **Inconsistent spacing**: Use existing patterns (`space-y-6`, `gap-2`)
4. **Breaking existing layout**: Test with `showRawData` toggle
5. **Hardcoding text**: Use French labels consistently

---

## Quick Reference: Field → Section Mapping

| Field | Section | Pattern |
|-------|---------|---------|
| `presentation_resume` | Description | Pattern 1 |
| `presentation_detail` | Description | Pattern 1 |
| `frais_precisions` | Classification | Pattern 1 |
| `publics_precisions` | Themes & Publics | Pattern 1 |
| `adresse`, `complement_adresse`, `code_insee` | Location | Pattern 2 |
| `longitude`, `latitude` | Location | Pattern 3 |
| `zone_eligibilite` | Mobilization | Pattern 4 |
| `modes_mobilisation` | Mobilization | Pattern 4 |
| `mobilisable_par` | Mobilization | Pattern 4 |
| `mobilisation_precisions` | Mobilization | Pattern 1 |
| `horaires_accueil` | Access & Conditions | Pattern 1 |
| `score_qualite` | Quality & Metadata | Pattern 5 |
| `structure_id` | Footer | Pattern 6 |

---

## Next Steps

1. Read the full `ServiceDetail.tsx` component
2. Identify insertion points for each section
3. Add fields incrementally (test after each addition)
4. Run tests to verify completeness
5. Compare UI to raw JSON to ensure 100% coverage
