// ServiceDetail component - extracted from services/[id]/page.tsx
// This component displays service details in a visual format

import { Service } from "~/types/service";

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

      <div className={showRawData ? "grid grid-cols-2 gap-6 mt-8" : "mt-8"}>
        <div>
          <h1 className="text-4xl font-bold mb-6">{service.nom}</h1>

          <div className="space-y-6">
            {service.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.type && (
                <div>
                  <h3 className="font-semibold mb-1">Type</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {service.type}
                  </p>
                </div>
              )}

              {service.frais && (
                <div>
                  <h3 className="font-semibold mb-1">Frais</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {service.frais}
                  </p>
                </div>
              )}

              {service.commune && (
                <div>
                  <h3 className="font-semibold mb-1">Commune</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {service.commune}{" "}
                    {service.code_postal && `(${service.code_postal})`}
                  </p>
                </div>
              )}

              {service.telephone && (
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
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
                  <h3 className="font-semibold mb-1">Email</h3>
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
                  <h3 className="font-semibold mb-1">Lien</h3>
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
            </div>

            {service.thematiques && service.thematiques.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Thématiques</h3>
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
                <h3 className="font-semibold mb-2">Publics</h3>
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

            {service.modes_accueil && service.modes_accueil.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Modes d&apos;accueil</h3>
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

            {service.conditions_acces && (
              <div>
                <h3 className="font-semibold mb-2">
                  Conditions d&apos;accès
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {service.conditions_acces}
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500">
                ID: {service.id}
                {service.source && ` • Source: ${service.source}`}
                {service.date_maj &&
                  ` • Mis à jour le: ${new Date(
                    service.date_maj
                  ).toLocaleDateString("fr-FR")}`}
              </p>
            </div>
          </div>
        </div>

        {showRawData && (
          <div className="sticky top-8 self-start">
            <h2 className="text-xl font-semibold mb-4">
              Données brutes (JSON)
            </h2>
            <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 overflow-auto max-h-[calc(100vh-200px)] text-xs">
              <code>{JSON.stringify(service, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
