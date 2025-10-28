/**
 * Filter Configuration
 * Centralized configuration for all available filters
 * Maps to Data Inclusion API parameters
 * 
 * API Documentation: https://api.data.inclusion.beta.gouv.fr/api/docs
 * Endpoint: GET /api/v1/services
 */

import { FilterCategory } from '~/types/filter';

/**
 * All available filter categories organized by display order
 * Order: 1. Source, 2. Type, 3. Fees, 4. Quality, 5. Public, 6. Commune, 7. Reception
 */
export const FILTER_CATEGORIES: FilterCategory[] = [
  // 1. Data Source
  {
    id: 'source',
    label: 'Source de données',
    order: 1,
    expanded: true,
    filters: [
      {
        id: 'sources',
        label: 'Source',
        type: 'categorical',
        category: 'source',
        paramName: 'sources',
        required: false,
        defaultValue: null,
        description: 'Filtrer les services par source de données',
        options: [
          { value: 'action-logement', label: 'Action Logement', available: true },
          { value: 'agefiph', label: 'AGEFIPH', available: true },
          { value: 'cd35', label: "Annuaire social d'Ille-et-Vilaine", available: true },
          { value: 'dora', label: 'DORA', available: true },
          { value: 'emplois-de-linclusion', label: "Emplois de l'inclusion", available: true },
          { value: 'france-travail', label: 'France Travail', available: true },
          { value: 'mission-locale', label: 'Mission Locale', available: true },
          { value: 'mediation-numerique', label: 'Médiation Numérique', available: true },
          { value: 'mes-aides', label: 'Mes Aides France Travail', available: true },
          { value: 'monenfant', label: 'Monenfant.fr', available: true },
          { value: 'odspep', label: 'Base de ressources France Travail', available: true },
          { value: 'reseau-alpha', label: 'Réseau Alpha', available: true },
          { value: 'soliguide', label: 'Soliguide', available: true },
          { value: 'fredo', label: 'Fredo', available: true },
          { value: 'carif-oref', label: 'Réseau des CARIF OREF', available: true },
          { value: 'ma-boussole-aidants', label: 'Ma Boussole Aidants', available: true },
        ],
      },
    ],
  },
  // 2. Service Type
  {
    id: 'service-type',
    label: 'Type de service',
    order: 2,
    expanded: true,
    filters: [
      {
        id: 'types',
        label: 'Type',
        type: 'categorical',
        category: 'service-type',
        paramName: 'types',
        required: false,
        defaultValue: null,
        description: 'Filtrer les services par type',
        options: [
          { value: 'accompagnement', label: 'Accompagnement', available: true },
          { value: 'aide-financiere', label: 'Aide financière', available: true },
          { value: 'aide-materielle', label: 'Aide matérielle', available: true },
          { value: 'atelier', label: 'Atelier', available: true },
          { value: 'formation', label: 'Formation', available: true },
          { value: 'information', label: 'Information', available: true },
        ],
      },
    ],
  },
  // 3. Cost/Fees
  {
    id: 'cost',
    label: 'Coût',
    order: 3,
    expanded: true,
    filters: [
      {
        id: 'frais',
        label: 'Frais',
        type: 'categorical',
        category: 'cost',
        paramName: 'frais',
        required: false,
        defaultValue: null,
        description: 'Filtrer les services par type de frais',
        options: [
          { value: 'gratuit', label: 'Gratuit', available: true },
          { value: 'payant', label: 'Payant', available: true },
        ],
      },
    ],
  },
  // 4. Quality
  {
    id: 'quality',
    label: 'Qualité',
    order: 4,
    expanded: true,
    filters: [
      {
        id: 'score_qualite_minimum',
        label: 'Score de qualité minimum',
        type: 'numeric',
        category: 'quality',
        paramName: 'score_qualite_minimum',
        required: false,
        defaultValue: 0,
        description: 'Filtrer les services par score de qualité minimum',
        min: 0,
        max: 1,
        step: 0.01,
        unit: 'score',
      },
    ],
  },
  // 5. Target Audience (Public)
  {
    id: 'audience',
    label: 'Public cible',
    order: 5,
    expanded: true,
    filters: [
      {
        id: 'publics',
        label: 'Public',
        type: 'categorical',
        category: 'audience',
        paramName: 'publics',
        required: false,
        defaultValue: null,
        description: 'Filtrer les services par public cible',
        options: [
          { value: 'actifs', label: 'Actifs', available: true },
          { value: 'beneficiaires-des-minimas-sociaux', label: 'Bénéficiaires des minimas sociaux', available: true },
          { value: 'demandeurs-emploi', label: "Demandeurs d'emploi", available: true },
          { value: 'etudiants', label: 'Étudiants', available: true },
          { value: 'familles', label: 'Familles', available: true },
          { value: 'femmes', label: 'Femmes', available: true },
          { value: 'jeunes', label: 'Jeunes', available: true },
          { value: 'personnes-en-situation-de-handicap', label: 'Personnes en situation de handicap', available: true },
          { value: 'personnes-en-situation-durgence', label: "Personnes en situation d'urgence", available: true },
          { value: 'personnes-en-situation-juridique-specifique', label: 'Personnes en situation juridique spécifique', available: true },
          { value: 'personnes-exilees', label: 'Personnes exilées', available: true },
          { value: 'residents-qpv-frr', label: 'Résidents en QPV ou FRR', available: true },
          { value: 'seniors', label: 'Séniors', available: true },
          { value: 'tous-publics', label: 'Tous publics', available: true },
        ],
      },
    ],
  },
  // 6. Location (Commune)
  {
    id: 'location',
    label: 'Localisation',
    order: 6,
    expanded: true,
    filters: [
      {
        id: 'code_commune',
        label: 'Commune',
        type: 'categorical',
        category: 'location',
        paramName: 'code_commune',
        required: false,
        defaultValue: null,
        description: 'Filtrer les services par commune (code INSEE)',
        options: [], // Populated dynamically from API
      },
    ],
  },
  // 7. Access & Reception
  {
    id: 'access',
    label: "Mode d'accueil",
    order: 7,
    expanded: true,
    filters: [
      {
        id: 'modes_accueil',
        label: "Mode d'accueil",
        type: 'categorical',
        category: 'access',
        paramName: 'modes_accueil',
        required: false,
        defaultValue: null,
        description: "Filtrer les services par mode d'accueil (présentiel, à distance, etc.)",
        options: [
          { value: 'a-distance', label: 'À distance', available: true },
          { value: 'en-presentiel', label: 'En présentiel', available: true },
        ],
      },
    ],
  },
];

/**
 * Flattened array of all filters for easy iteration
 * Useful for lookups and validation
 */
export const ALL_FILTERS = FILTER_CATEGORIES.flatMap(cat => cat.filters);

/**
 * Map of filter ID to filter definition for O(1) lookup
 * Used for validation and state management
 */
export const FILTER_MAP = new Map(ALL_FILTERS.map(f => [f.id, f]));

/**
 * Map of parameter name to filter definition
 * Used for URL parameter handling
 */
export const PARAM_NAME_MAP = new Map(ALL_FILTERS.map(f => [f.paramName, f]));
