// ServiceDetail component - extracted from services/[id]/page.tsx
// This component displays service details in a visual format

import { useState } from "react";
import { Service } from "~/types/service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Info, X, FileText, Code } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Helper component for field labels with data key tooltips
function FieldLabel({
  label,
  dataKey,
  className = "font-semibold mb-1",
}: {
  label: string;
  dataKey: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <h3 className={className}>{label}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help mt-0.5" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">Clé: {dataKey}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface ServiceDetailProps {
  service: Service;
  showRawData: boolean;
  onToggleRawData: () => void;
  onClose?: () => void;
}

export function ServiceDetail({
  service,
  showRawData,
  onToggleRawData,
  onClose,
}: ServiceDetailProps) {
  const [showRawDescription, setShowRawDescription] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer"
          >
            ← Fermer
          </button>
        )}
        <button
          onClick={onToggleRawData}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors ml-auto"
        >
          {showRawData ? "Masquer" : "Voir"} les données brutes
        </button>
      </div>

      <div className="mt-8">
        <h1 className="text-4xl font-bold mb-6">{service.nom}</h1>
        {(service.structure?.id ||
          service.structure?.source ||
          service.structure?.lien_source ||
          service.structure?.date_maj) && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              {service.structure?.id && `ID: ${service.structure.id}`}
              {service.structure?.source &&
                ` • Source: ${service.structure.source}`}
              {service.structure?.lien_source && (
                <>
                  {" • "}
                  <a
                    href={service.structure?.lien_source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Source originale →
                  </a>
                </>
              )}
            </p>
          </div>
        )}
        <div className="space-y-6">
          {service.description && (
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <h2 className="text-xl font-semibold">Description</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help mt-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">Clé: description</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <button
                  onClick={() => setShowRawDescription(!showRawDescription)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title={
                    showRawDescription
                      ? "Afficher le rendu"
                      : "Afficher le texte brut"
                  }
                >
                  {showRawDescription ? (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      Markdown rendu
                    </>
                  ) : (
                    <>
                      <Code className="h-3.5 w-3.5" />
                      Texte brut
                    </>
                  )}
                </button>
              </div>
              {showRawDescription ? (
                <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap border rounded p-6 bg-gray-50 dark:bg-gray-900 text-sm font-mono">
                  {service.description}
                </pre>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none border rounded p-6">
                  <ReactMarkdown>{service.description}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {service.presentation_resume && (
            <div>
              <FieldLabel label="Résumé" dataKey="presentation_resume" />
              <p className="text-gray-700 dark:text-gray-300">
                {service.presentation_resume}
              </p>
            </div>
          )}

          {service.presentation_detail && (
            <div>
              <FieldLabel
                label="Présentation détaillée"
                dataKey="presentation_detail"
              />
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {service.presentation_detail}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.type && (
              <div>
                <FieldLabel label="Type" dataKey="type" />
                <p className="text-gray-700 dark:text-gray-300">
                  {service.type}
                </p>
              </div>
            )}

            {service.frais && (
              <div>
                <FieldLabel label="Frais" dataKey="frais" />
                <p className="text-gray-700 dark:text-gray-300">
                  {service.frais}
                </p>
              </div>
            )}
          </div>

          {service.frais_precisions && (
            <div>
              <FieldLabel
                label="Précisions sur les frais"
                dataKey="frais_precisions"
              />
              <p className="text-gray-700 dark:text-gray-300">
                {service.frais_precisions}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.commune && (
              <div>
                <FieldLabel label="Commune" dataKey="commune" />
                <p className="text-gray-700 dark:text-gray-300">
                  {service.commune}{" "}
                  {service.code_postal && `(${service.code_postal})`}
                </p>
              </div>
            )}
          </div>

          {(service.adresse ||
            service.complement_adresse ||
            service.code_insee) && (
            <div>
              <FieldLabel
                label="Adresse complète"
                dataKey="adresse, complement_adresse, code_insee"
              />
              <div className="text-gray-700 dark:text-gray-300">
                {service.adresse && <p>{service.adresse}</p>}
                {service.complement_adresse && (
                  <p>{service.complement_adresse}</p>
                )}
                {service.code_insee && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Code INSEE: {service.code_insee}
                  </p>
                )}
              </div>
            </div>
          )}

          {service.latitude && service.longitude && (
            <div>
              <FieldLabel
                label="Coordonnées géographiques"
                dataKey="latitude, longitude"
              />
              <p className="text-gray-700 dark:text-gray-300">
                Latitude: {service.latitude.toFixed(6)}, Longitude:{" "}
                {service.longitude.toFixed(6)}{" "}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.telephone && (
              <div>
                <FieldLabel label="Téléphone" dataKey="telephone" />
                <a
                  href={`tel:${service.telephone}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {service.telephone}
                </a>
              </div>
            )}

            {service.courriel && (
              <div>
                <FieldLabel label="Email" dataKey="courriel" />
                <a
                  href={`mailto:${service.courriel}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {service.courriel}
                </a>
              </div>
            )}

            {service.lien_mobilisation && (
              <div>
                <FieldLabel label="Lien" dataKey="lien_mobilisation" />
                <a
                  href={service.lien_mobilisation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Accéder au service →
                </a>
              </div>
            )}

            {service.contact_nom_prenom && (
              <div>
                <FieldLabel label="Contact" dataKey="contact_nom_prenom" />
                <p className="text-gray-700 dark:text-gray-300">
                  {service.contact_nom_prenom}
                </p>
              </div>
            )}
          </div>

          {service.thematiques && service.thematiques.length > 0 && (
            <div>
              <FieldLabel
                label="Thématiques"
                dataKey="thematiques"
                className="font-semibold mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {service.thematiques.map((thematique) => (
                  <span
                    key={thematique}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    {thematique}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.publics && service.publics.length > 0 && (
            <div>
              <FieldLabel
                label="Publics"
                dataKey="publics"
                className="font-semibold mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {service.publics.map((public_) => (
                  <span
                    key={public_}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm"
                  >
                    {public_}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.publics_precisions && (
            <div>
              <FieldLabel
                label="Précisions sur les publics"
                dataKey="publics_precisions"
              />
              <p className="text-gray-700 dark:text-gray-300">
                {service.publics_precisions}
              </p>
            </div>
          )}

          {service.modes_accueil && service.modes_accueil.length > 0 && (
            <div>
              <FieldLabel
                label="Modes d'accueil"
                dataKey="modes_accueil"
                className="font-semibold mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {service.modes_accueil.map((mode) => (
                  <span
                    key={mode}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.horaires_accueil && (
            <div>
              <FieldLabel
                label="Horaires d'accueil"
                dataKey="horaires_accueil"
              />
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {service.horaires_accueil}
              </p>
            </div>
          )}

          {(service.volume_horaire_hebdomadaire || service.nombre_semaines) && (
            <div>
              <FieldLabel
                label="Durée"
                dataKey="volume_horaire_hebdomadaire, nombre_semaines"
                className="font-semibold mb-2"
              />
              <div className="text-gray-700 dark:text-gray-300">
                {service.volume_horaire_hebdomadaire && (
                  <p>
                    Volume horaire hebdomadaire:{" "}
                    {service.volume_horaire_hebdomadaire}h
                  </p>
                )}
                {service.nombre_semaines && (
                  <p>Nombre de semaines: {service.nombre_semaines}</p>
                )}
              </div>
            </div>
          )}

          {service.conditions_acces && (
            <div>
              <FieldLabel
                label="Conditions d'accès"
                dataKey="conditions_acces"
                className="font-semibold mb-2"
              />
              <p className="text-gray-700 dark:text-gray-300">
                {service.conditions_acces}
              </p>
            </div>
          )}

          {(service.zone_eligibilite ||
            service.modes_mobilisation ||
            service.mobilisable_par ||
            service.mobilisation_precisions) && (
            <div>
              <div className="flex items-start gap-2 mb-4">
                <h2 className="text-xl font-semibold">Mobilisation</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help mt-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">
                      Section: zone_eligibilite, modes_mobilisation,
                      mobilisable_par, mobilisation_precisions
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-4">
                {service.zone_eligibilite &&
                  service.zone_eligibilite.length > 0 && (
                    <div>
                      <FieldLabel
                        label="Zones d'éligibilité"
                        dataKey="zone_eligibilite"
                        className="font-semibold mb-2"
                      />
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

                {service.modes_mobilisation &&
                  service.modes_mobilisation.length > 0 && (
                    <div>
                      <FieldLabel
                        label="Modes de mobilisation"
                        dataKey="modes_mobilisation"
                        className="font-semibold mb-2"
                      />
                      <div className="flex flex-wrap gap-2">
                        {service.modes_mobilisation.map((mode) => (
                          <span
                            key={mode}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900 rounded-full text-sm"
                          >
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {service.mobilisable_par &&
                  service.mobilisable_par.length > 0 && (
                    <div>
                      <FieldLabel
                        label="Mobilisable par"
                        dataKey="mobilisable_par"
                        className="font-semibold mb-2"
                      />
                      <div className="flex flex-wrap gap-2">
                        {service.mobilisable_par.map((actor) => (
                          <span
                            key={actor}
                            className="px-3 py-1 bg-teal-100 dark:bg-teal-900 rounded-full text-sm"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {service.mobilisation_precisions && (
                  <div>
                    <FieldLabel
                      label="Précisions sur la mobilisation"
                      dataKey="mobilisation_precisions"
                    />
                    <p className="text-gray-700 dark:text-gray-300">
                      {service.mobilisation_precisions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {service.score_qualite !== undefined && (
            <div>
              <div className="flex items-start gap-2 mb-4">
                <h2 className="text-xl font-semibold">Qualité</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help mt-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">Clé: score_qualite</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {(service.score_qualite * 100).toFixed(0)}%
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.score_qualite >= 0.8
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : service.score_qualite >= 0.5
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {service.score_qualite >= 0.8
                    ? "Excellent"
                    : service.score_qualite >= 0.5
                    ? "Bon"
                    : "À améliorer"}
                </span>
              </div>
            </div>
          )}

          {service.structure && (
            <div>
              <div className="flex items-start gap-2 mb-4">
                <h2 className="text-xl font-semibold">Structure</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help mt-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">Objet: structure</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {service.structure.nom && (
                  <div>
                    <FieldLabel
                      label="Nom de la structure"
                      dataKey="structure.nom"
                    />
                    <p className="text-gray-700 dark:text-gray-300">
                      {service.structure.nom}
                    </p>
                  </div>
                )}
                {service.structure.description && (
                  <div>
                    <FieldLabel
                      label="Description"
                      dataKey="structure.description"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                      {service.structure.description}
                    </p>
                  </div>
                )}
                {service.structure.siret && (
                  <div>
                    <FieldLabel label="SIRET" dataKey="structure.siret" />
                    <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                      {service.structure.siret}
                    </p>
                  </div>
                )}

                {(service.structure.adresse || service.structure.commune) && (
                  <div>
                    <FieldLabel
                      label="Adresse"
                      dataKey="structure.adresse, structure.commune, structure.code_postal, structure.code_insee"
                    />
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {service.structure.adresse && (
                        <p>{service.structure.adresse}</p>
                      )}
                      {service.structure.complement_adresse && (
                        <p>{service.structure.complement_adresse}</p>
                      )}
                      {service.structure.commune && (
                        <p>
                          {service.structure.commune}
                          {service.structure.code_postal &&
                            ` ${service.structure.code_postal}`}
                          {service.structure.code_insee &&
                            ` (INSEE: ${service.structure.code_insee})`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {service.structure.latitude && service.structure.longitude && (
                  <div>
                    <FieldLabel
                      label="Coordonnées"
                      dataKey="structure.latitude, structure.longitude"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {service.structure.latitude.toFixed(6)},{" "}
                      {service.structure.longitude.toFixed(6)}{" "}
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${service.structure.latitude}&mlon=${service.structure.longitude}&zoom=15`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Voir sur la carte →
                      </a>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.structure.telephone && (
                    <div>
                      <FieldLabel
                        label="Téléphone"
                        dataKey="structure.telephone"
                      />
                      <a
                        href={`tel:${service.structure.telephone}`}
                        className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                      >
                        {service.structure.telephone}
                      </a>
                    </div>
                  )}
                  {service.structure.courriel && (
                    <div>
                      <FieldLabel label="Email" dataKey="structure.courriel" />
                      <a
                        href={`mailto:${service.structure.courriel}`}
                        className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                      >
                        {service.structure.courriel}
                      </a>
                    </div>
                  )}
                </div>

                {service.structure.site_web && (
                  <div>
                    <FieldLabel label="Site web" dataKey="structure.site_web" />
                    <a
                      href={service.structure.site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                    >
                      {service.structure.site_web} →
                    </a>
                  </div>
                )}

                {service.structure.horaires_accueil && (
                  <div>
                    <FieldLabel
                      label="Horaires d'accueil"
                      dataKey="structure.horaires_accueil"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {service.structure.horaires_accueil}
                    </p>
                  </div>
                )}

                {service.structure.accessibilite_lieu && (
                  <div>
                    <FieldLabel
                      label="Accessibilité"
                      dataKey="structure.accessibilite_lieu"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {service.structure.accessibilite_lieu}
                    </p>
                  </div>
                )}

                {service.structure.reseaux_porteurs &&
                  service.structure.reseaux_porteurs.length > 0 && (
                    <div>
                      <FieldLabel
                        label="Réseaux porteurs"
                        dataKey="structure.reseaux_porteurs"
                      />
                      <div className="flex flex-wrap gap-2">
                        {service.structure.reseaux_porteurs.map((reseau) => (
                          <span
                            key={reseau}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded text-xs"
                          >
                            {reseau}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between">
            <p className="text-sm text-gray-500">
              {service.date_maj &&
                `Mis à jour le: ${new Date(service.date_maj).toLocaleDateString(
                  "fr-FR"
                )}`}
            </p>
            {service.lien_source && (
              <>
                <a
                  href={service.lien_source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Source originale →
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Raw JSON Overlay Modal */}
      {showRawData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Données brutes (JSON)</h2>
              <button
                onClick={onToggleRawData}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-xs">
                <code>{JSON.stringify(service, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
