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

export type ServiceSearchResult = {
  service: Service;
  distance: number | null;
};

export type ApiResponse = {
  items: ServiceSearchResult[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
