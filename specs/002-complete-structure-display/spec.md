# Feature Specification: Complete Service Data Display

**Feature Branch**: `002-complete-structure-display`  
**Created**: Oct 28, 2025  
**Status**: Ready for Planning  
**Input**: User description: "we should make sure that every structure's data item is shown on the structures detail component" + "your source of truth is the data inclusion api"

## Source of Truth

**The Data Inclusion API is the authoritative source for all service data.** All fields, data types, and structures must align with what the API provides. The service detail component must display all fields returned by the API without adding, removing, or transforming data beyond presentation formatting.

**API Reference**: https://api.data.inclusion.beta.gouv.fr/api/docs  
**Endpoint**: GET /api/v1/services/{id}

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All Service Data Fields (Priority: P1)

As a user viewing service details, I want to see all available data fields for a service so that I have complete information to make informed decisions about using the service.

**Why this priority**: This is the core requirement - ensuring data completeness is essential for user trust and decision-making. Missing fields mean users may lack critical information.

**Independent Test**: Open any service detail page and verify that all non-null fields from the Service type are displayed in the UI. Compare displayed fields against the raw JSON data view.

**Acceptance Scenarios**:

1. **Given** a service with all optional fields populated, **When** I view the service detail page, **Then** all fields are displayed in appropriate sections
2. **Given** a service with presentation_resume and presentation_detail fields, **When** I view the service detail, **Then** both presentation fields are shown in addition to the description
3. **Given** a service with address fields (adresse, complement_adresse, code_insee), **When** I view the location section, **Then** all address components are displayed
4. **Given** a service with mobilization fields (modes_mobilisation, mobilisable_par, mobilisation_precisions), **When** I view the service detail, **Then** all mobilization information is visible

---

### User Story 2 - Organized Data Presentation (Priority: P2)

As a user, I want service data organized into logical sections so that I can quickly find specific types of information without being overwhelmed.

**Why this priority**: While showing all data is critical (P1), organizing it well enhances usability and prevents information overload.

**Independent Test**: Review the service detail page layout and verify that fields are grouped logically (e.g., contact info together, location info together, mobilization info together).

**Acceptance Scenarios**:

1. **Given** a service with multiple data fields, **When** I view the detail page, **Then** fields are grouped into semantic sections: Contact (phone, email), Location (address, coordinates with map link), Mobilization (modes, actors, precisions), Quality (score), Access (hours, conditions)
2. **Given** array fields like zone_eligibilite or modes_mobilisation, **When** displayed, **Then** they are shown as formatted lists or tags, not raw arrays

---

### User Story 3 - Handle Missing Data Gracefully (Priority: P3)

As a user, I want the interface to handle missing data fields gracefully so that the page doesn't look broken or confusing when some fields are empty.

**Why this priority**: This is about polish and edge cases - important for quality but not blocking core functionality.

**Independent Test**: View services with varying levels of data completeness and verify the UI adapts appropriately.

**Acceptance Scenarios**:

1. **Given** a service with many null/undefined fields, **When** I view the detail page, **Then** only populated fields are shown (no empty sections)
2. **Given** a service with no optional fields, **When** I view the detail page, **Then** the page shows required fields cleanly without gaps or "N/A" placeholders

---

### Edge Cases

- What happens when a service has very long text in presentation_detail or mobilisation_precisions fields?
- How does the system handle services with all optional fields null/undefined?
- What if zone_eligibilite or other array fields have many items (10+)?
- How are special characters or HTML in text fields handled?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all populated Service fields returned by the Data Inclusion API in the detail view
- **FR-002**: System MUST use the Data Inclusion API as the single source of truth for field names, types, and values
- **FR-003**: System MUST display presentation_resume and presentation_detail fields when available
- **FR-004**: System MUST display complete address information including adresse, complement_adresse, and code_insee
- **FR-005**: System MUST display all mobilization-related fields (modes_mobilisation, mobilisable_par, mobilisation_precisions)
- **FR-006**: System MUST display zone_eligibilite array as formatted tags or list items
- **FR-007**: System MUST display frais_precisions when frais field is present
- **FR-008**: System MUST display publics_precisions when publics field is present
- **FR-009**: System MUST display horaires_accueil (opening hours) when available
- **FR-010**: System MUST display structure_id when present
- **FR-011**: System MUST display geographic coordinates (longitude, latitude) when available as formatted text with labels AND include a clickable map link (e.g., Google Maps or OpenStreetMap)
- **FR-012**: System MUST display score_qualite (quality score) prominently
- **FR-013**: System MUST only show sections for fields that have non-null/non-empty values
- **FR-014**: System MUST format array fields (thematiques, publics, modes_accueil, modes_mobilisation, zone_eligibilite, mobilisable_par) as visual tags or lists
- **FR-015**: System MUST NOT add, remove, or transform field data beyond presentation formatting (the API is authoritative)

### Currently Missing Fields

Based on the Service type definition, the following fields are NOT currently displayed in ServiceDetail component:

- `presentation_resume` - Short presentation text
- `presentation_detail` - Detailed presentation text  
- `structure_id` - Associated structure identifier
- `frais_precisions` - Additional fee details
- `publics_precisions` - Additional public details
- `code_insee` - INSEE code for location
- `adresse` - Street address
- `complement_adresse` - Address complement
- `longitude` / `latitude` - Geographic coordinates
- `zone_eligibilite` - Eligibility zones array
- `modes_mobilisation` - Mobilization modes array
- `mobilisable_par` - Who can mobilize array
- `mobilisation_precisions` - Mobilization details
- `horaires_accueil` - Opening hours
- `score_qualite` - Quality score

### Key Entities

- **Service**: Represents a social service with 34 possible data fields including identification, description, contact, location, access conditions, and quality metrics

## Clarifications

### Session 2025-10-28

- Q: How should the 15+ missing fields be organized into sections? → A: Group by semantic purpose (Contact, Location, Mobilization, Quality, etc.)
- Q: How should geographic coordinates be displayed? → A: Display both formatted text AND a map link

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of non-null Service fields are displayed in the detail view (verifiable by comparing UI to raw JSON)
- **SC-002**: Users can view all address components (street, complement, postal code, INSEE code) in a single location section
- **SC-003**: Users can view all mobilization information (modes, actors, precisions) in a dedicated section
- **SC-004**: Array fields (zones, modes, publics) are displayed as formatted visual elements, not raw comma-separated text
- **SC-005**: Quality score is prominently displayed and easy to locate
- **SC-006**: Services with minimal data (only required fields) display cleanly without empty sections or placeholders
- **SC-007**: Geographic coordinates are displayed as formatted text with labels AND include a clickable map link
