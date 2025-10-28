# Data Model: Complete Service Data Display

**Feature**: Complete Service Data Display  
**Branch**: `002-complete-structure-display`  
**Date**: Oct 28, 2025

## Overview

This document defines the data model for the Service entity as returned by the Data Inclusion API. The Service type is already defined in `src/types/service.ts` - this document provides semantic grouping and field descriptions for UI implementation.

## Entity: Service

**Source of Truth**: Data Inclusion API  
**Endpoint**: GET /api/v1/services/{id}  
**Type Definition**: `src/types/service.ts`

### Complete Field List (34 fields)

#### Core Identification
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique service identifier |
| `nom` | string | ✅ Yes | Service name |
| `source` | string | ❌ No | Data source identifier |
| `structure_id` | string | ❌ No | Associated structure/organization ID |
| `date_maj` | string | ❌ No | Last update date (ISO 8601) |

#### Description & Presentation
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `description` | string | ✅ Yes | Main service description | ✅ Displayed |
| `presentation_resume` | string | ❌ No | Short presentation summary | ❌ **MISSING** |
| `presentation_detail` | string | ❌ No | Detailed presentation text | ❌ **MISSING** |

#### Service Classification
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `type` | string | ❌ No | Service type (e.g., "accompagnement") | ✅ Displayed |
| `thematiques` | string[] | ❌ No | Service themes/topics | ✅ Displayed |

#### Cost Information
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `frais` | string | ❌ No | Cost type ("gratuit", "payant") | ✅ Displayed |
| `frais_precisions` | string | ❌ No | Additional cost details | ❌ **MISSING** |

#### Target Audience
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `publics` | string[] | ❌ No | Target audiences | ✅ Displayed |
| `publics_precisions` | string | ❌ No | Additional audience details | ❌ **MISSING** |

#### Location & Address
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `commune` | string | ❌ No | City/commune name | ✅ Displayed |
| `code_postal` | string | ❌ No | Postal code | ✅ Displayed |
| `code_insee` | string | ❌ No | INSEE code | ❌ **MISSING** |
| `adresse` | string | ❌ No | Street address | ❌ **MISSING** |
| `complement_adresse` | string | ❌ No | Address complement | ❌ **MISSING** |
| `longitude` | number | ❌ No | Geographic longitude | ❌ **MISSING** |
| `latitude` | number | ❌ No | Geographic latitude | ❌ **MISSING** |

#### Contact Information
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `telephone` | string | ❌ No | Phone number | ✅ Displayed |
| `courriel` | string | ❌ No | Email address | ✅ Displayed |
| `lien_mobilisation` | string | ❌ No | Service website/link | ✅ Displayed |

#### Access & Reception
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `modes_accueil` | string[] | ❌ No | Reception modes (e.g., "en-presentiel") | ✅ Displayed |
| `horaires_accueil` | string | ❌ No | Opening hours | ❌ **MISSING** |
| `conditions_acces` | string | ❌ No | Access conditions | ✅ Displayed |

#### Eligibility & Mobilization
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `zone_eligibilite` | string[] | ❌ No | Eligibility zones | ❌ **MISSING** |
| `modes_mobilisation` | string[] | ❌ No | Mobilization modes | ❌ **MISSING** |
| `mobilisable_par` | string[] | ❌ No | Who can mobilize the service | ❌ **MISSING** |
| `mobilisation_precisions` | string | ❌ No | Mobilization details | ❌ **MISSING** |

#### Quality Metrics
| Field | Type | Required | Description | UI Status |
|-------|------|----------|-------------|-----------|
| `score_qualite` | number | ❌ No | Quality score (0.0 to 1.0) | ❌ **MISSING** |

---

## Semantic Grouping for UI

### Section 1: Description & Presentation
**Purpose**: Main service information  
**Fields**:
- `nom` (already displayed as page title)
- `description` ✅
- `presentation_resume` ❌ **ADD**
- `presentation_detail` ❌ **ADD**

**Layout**: Stacked, full-width text blocks

---

### Section 2: Contact
**Purpose**: How to reach the service  
**Fields**:
- `telephone` ✅
- `courriel` ✅
- `lien_mobilisation` ✅

**Layout**: Grid (2 columns on desktop)

---

### Section 3: Location
**Purpose**: Where the service is located  
**Fields**:
- `commune` ✅
- `code_postal` ✅
- `code_insee` ❌ **ADD**
- `adresse` ❌ **ADD**
- `complement_adresse` ❌ **ADD**
- `longitude` / `latitude` ❌ **ADD** (with map link)

**Layout**: Stacked address components, coordinates with map link

---

### Section 4: Mobilization
**Purpose**: How to access and use the service  
**Fields**:
- `modes_mobilisation` ❌ **ADD**
- `mobilisable_par` ❌ **ADD**
- `mobilisation_precisions` ❌ **ADD**
- `zone_eligibilite` ❌ **ADD**

**Layout**: Tags for arrays, text for precisions

---

### Section 5: Quality & Metadata
**Purpose**: Service quality and administrative info  
**Fields**:
- `score_qualite` ❌ **ADD** (prominent display)
- `structure_id` ❌ **ADD**
- `source` ✅
- `date_maj` ✅

**Layout**: Quality score prominent, metadata in footer

---

### Section 6: Access & Conditions
**Purpose**: When and how to access  
**Fields**:
- `horaires_accueil` ❌ **ADD**
- `modes_accueil` ✅
- `conditions_acces` ✅

**Layout**: Text blocks and tags

---

## Field Validation Rules

**From API**: No client-side validation needed - API is source of truth

**Display Rules**:
- All fields are optional except `id`, `nom`, `description`
- Only display sections that have at least one populated field
- Arrays: display as tags/badges
- URLs: make clickable links
- Dates: format in French locale
- Numbers: format with appropriate precision

---

## State Transitions

**N/A**: Service data is read-only in this feature. No state transitions.

---

## Relationships

```
Service
├── belongs to → Structure (via structure_id)
└── sourced from → DataSource (via source)
```

**Note**: Relationships are informational only. This feature does not navigate or display related entities.

---

## Data Volume Assumptions

- **Services**: ~100,000+ in production
- **Field Completeness**: Varies by source (some services have all fields, others minimal)
- **Array Sizes**: 
  - `thematiques`: typically 1-5 items
  - `publics`: typically 1-10 items
  - `zone_eligibilite`: typically 0-20 items
  - `modes_mobilisation`: typically 1-3 items

**UI Implications**: Must handle sparse data gracefully (many fields will be null/empty)

---

## Type Definition Reference

```typescript
// src/types/service.ts (existing)
export type Service = {
  id: string;
  nom: string;
  description: string;
  presentation_resume?: string;
  presentation_detail?: string;
  source?: string;
  structure_id?: string;
  date_maj?: string;
  type?: string;
  thematiques?: string[];
  frais?: string;
  frais_precisions?: string;
  publics?: string[];
  publics_precisions?: string;
  commune?: string;
  code_postal?: string;
  code_insee?: string;
  adresse?: string;
  complement_adresse?: string;
  longitude?: number;
  latitude?: number;
  telephone?: string;
  courriel?: string;
  modes_accueil?: string[];
  zone_eligibilite?: string[];
  conditions_acces?: string;
  lien_mobilisation?: string;
  modes_mobilisation?: string[];
  mobilisable_par?: string[];
  mobilisation_precisions?: string;
  horaires_accueil?: string;
  score_qualite?: number;
};
```

**No changes needed** - type definition is already complete.
