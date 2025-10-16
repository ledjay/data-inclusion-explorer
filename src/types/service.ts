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
  publics?: string[];
  commune?: string;
  code_postal?: string;
  telephone?: string;
  courriel?: string;
  modes_accueil?: string[];
  lien_mobilisation?: string;
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
