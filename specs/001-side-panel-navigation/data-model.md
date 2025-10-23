# Data Model: Side Panel Navigation

**Feature**: Side Panel Navigation  
**Date**: 2025-10-23

## Overview

This feature is primarily a UI refactoring task with minimal data model changes. The existing `Service` type from the Data Inclusion API remains unchanged. We introduce client-side state models for panel management.

---

## Existing Data Models (No Changes)

### Service

**Source**: Data Inclusion API  
**Location**: `src/types/service.ts`  
**Purpose**: Represents a social inclusion service from the API

```typescript
export type Service = {
  id: string;                      // Unique identifier
  nom: string;                     // Service name
  description: string;             // Full description
  presentation_resume?: string;    // Short summary
  presentation_detail?: string;    // Detailed presentation
  source?: string;                 // Data source
  structure_id?: string;           // Parent structure ID
  date_maj?: string;               // Last update date
  type?: string;                   // Service type
  thematiques?: string[];          // Themes/categories
  frais?: string;                  // Cost (gratuit/payant)
  frais_precisions?: string;       // Cost details
  publics?: string[];              // Target audiences
  publics_precisions?: string;     // Audience details
  commune?: string;                // City name
  code_postal?: string;            // Postal code
  code_insee?: string;             // INSEE code
  adresse?: string;                // Street address
  complement_adresse?: string;     // Address complement
  longitude?: number;              // GPS longitude
  latitude?: number;               // GPS latitude
  telephone?: string;              // Phone number
  courriel?: string;               // Email
  modes_accueil?: string[];        // Access modes
  zone_eligibilite?: string[];     // Eligibility zones
  conditions_acces?: string;       // Access conditions
  lien_mobilisation?: string;      // Service link
  modes_mobilisation?: string[];   // Mobilization modes
  mobilisable_par?: string[];      // Who can mobilize
  mobilisation_precisions?: string;// Mobilization details
  horaires_accueil?: string;       // Opening hours
  score_qualite?: number;          // Quality score (0-1)
};
```

**Validation Rules**:
- `id` is required and unique
- `nom` is required
- `score_qualite` must be between 0 and 1 if present

**Relationships**:
- Service belongs to a Structure (via `structure_id`)
- Service has a Source (via `source`)

---

## New Client-Side State Models

### PanelState

**Purpose**: Manages the state of the side panel (open/closed, selected service)  
**Location**: Component state in `src/app/page.tsx`  
**Lifecycle**: Ephemeral (exists only while page is mounted)

```typescript
interface PanelState {
  selectedServiceId: string | null;  // ID of service displayed in panel
  isOpen: boolean;                   // Computed: selectedServiceId !== null
}
```

**State Transitions**:
```
Initial State: { selectedServiceId: null, isOpen: false }

User clicks card → { selectedServiceId: "abc123", isOpen: true }
User clicks another card → { selectedServiceId: "xyz789", isOpen: true }
User closes panel → { selectedServiceId: null, isOpen: false }
User presses Escape → { selectedServiceId: null, isOpen: false }
```

**Validation Rules**:
- `selectedServiceId` must be a valid service ID or null
- `isOpen` is derived from `selectedServiceId !== null`

---

### ServiceDetailState

**Purpose**: Manages loading and error states for service details in panel  
**Location**: Component state in `src/components/ServiceDetailPanel.tsx`  
**Lifecycle**: Ephemeral (exists only while panel is mounted)

```typescript
interface ServiceDetailState {
  service: Service | null;     // Loaded service data
  loading: boolean;            // Whether service is being fetched
  error: string | null;        // Error message if fetch fails
  showRawData: boolean;        // Whether to show JSON view
}
```

**State Transitions**:
```
Initial State: { service: null, loading: true, error: null, showRawData: false }

Fetch starts → { service: null, loading: true, error: null, showRawData: false }
Fetch succeeds → { service: {...}, loading: false, error: null, showRawData: false }
Fetch fails → { service: null, loading: false, error: "Error message", showRawData: false }
User toggles raw data → { service: {...}, loading: false, error: null, showRawData: true }
```

**Validation Rules**:
- If `loading` is true, `service` should be null
- If `error` is not null, `service` should be null
- `service` and `error` cannot both be non-null

---

## URL State Model

### Query Parameters

**Purpose**: Persist panel state in URL for back button support and sharing  
**Location**: URL search parameters  
**Lifecycle**: Persists across page reloads

```typescript
interface URLState {
  service?: string;              // Service ID to display in panel
  // Existing filter parameters (unchanged)
  page?: string;
  sources?: string;
  score_qualite_minimum?: string;
  code_commune?: string;
  types?: string;
  frais?: string;
}
```

**Example URLs**:
```
/ → No panel open
/?service=abc123 → Panel open with service abc123
/?service=abc123&page=2&sources=dora → Panel + filters + pagination
```

**State Sync**:
- URL parameter `service` syncs with `PanelState.selectedServiceId`
- When user clicks card, URL updates with `service` parameter
- When user closes panel, `service` parameter is removed from URL
- Browser back button removes `service` parameter, closing panel

---

## Component Props Models

### ServiceDetailPanelProps

**Purpose**: Props for the side panel component  
**Location**: `src/components/ServiceDetailPanel.tsx`

```typescript
interface ServiceDetailPanelProps {
  serviceId: string | null;      // ID of service to display
  isOpen: boolean;               // Whether panel is visible
  onClose: () => void;           // Callback to close panel
}
```

**Usage**:
```tsx
<ServiceDetailPanel
  serviceId={selectedServiceId}
  isOpen={selectedServiceId !== null}
  onClose={() => setSelectedServiceId(null)}
/>
```

---

### ServiceDetailProps

**Purpose**: Props for the extracted service detail component  
**Location**: `src/components/ServiceDetail.tsx`

```typescript
interface ServiceDetailProps {
  service: Service;              // Service data to display
  showRawData: boolean;          // Whether to show JSON view
  onToggleRawData: () => void;   // Callback to toggle raw data view
  onClose?: () => void;          // Optional close callback (for panel)
}
```

**Usage in Panel**:
```tsx
<ServiceDetail
  service={service}
  showRawData={showRawData}
  onToggleRawData={() => setShowRawData(!showRawData)}
  onClose={onClose}
/>
```

**Usage in Page**:
```tsx
<ServiceDetail
  service={service}
  showRawData={showRawData}
  onToggleRawData={() => setShowRawData(!showRawData)}
  // No onClose (page doesn't need close button)
/>
```

---

### ServiceCardProps (Modified)

**Purpose**: Props for service card component  
**Location**: `src/components/ServiceCard.tsx`

```typescript
interface ServiceCardProps {
  service: Service;              // Service data to display
  distance?: number | null;      // Distance from user (optional)
  onClick?: (serviceId: string) => void;  // NEW: Optional click handler
}
```

**Behavior**:
- If `onClick` is provided, call it instead of navigating to `/services/[id]`
- If `onClick` is not provided, maintain existing behavior (open in new tab)
- Allows gradual migration: cards with onClick open panel, others open new tab

**Usage**:
```tsx
{/* With panel (new behavior) */}
<ServiceCard
  service={service}
  distance={distance}
  onClick={(id) => setSelectedServiceId(id)}
/>

{/* Without panel (existing behavior) */}
<ServiceCard
  service={service}
  distance={distance}
/>
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks ServiceCard                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ page.tsx: setSelectedServiceId(serviceId)                   │
│ URL updates: /?service=abc123                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ ServiceDetailPanel renders with serviceId                   │
│ Panel slides in from right (CSS transition)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ ServiceDetailPanel fetches service data                     │
│ GET /api/v1/services/{serviceId}                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ ServiceDetail component renders service data                │
│ Shows name, description, fields, "Show Raw Data" button     │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Summary

| State | Location | Persistence | Purpose |
|-------|----------|-------------|---------|
| `selectedServiceId` | `page.tsx` | URL (optional) | Track which service is in panel |
| `service` | `ServiceDetailPanel.tsx` | None | Loaded service data |
| `loading` | `ServiceDetailPanel.tsx` | None | Fetch loading state |
| `error` | `ServiceDetailPanel.tsx` | None | Fetch error state |
| `showRawData` | `ServiceDetailPanel.tsx` | None | Toggle JSON view |

**No server-side state** - All state is client-side and ephemeral (except URL parameters)

**No database changes** - All data comes from existing Data Inclusion API

**No API changes** - Reuses existing endpoints

---

## Migration Notes

### Existing Code Compatibility

- **ServiceCard**: Backward compatible (onClick is optional)
- **Service Type**: No changes, fully compatible
- **API Routes**: No changes, fully compatible
- **ServiceFilters**: No changes, fully compatible

### Breaking Changes

**None** - This is a purely additive change. Existing functionality remains intact.

