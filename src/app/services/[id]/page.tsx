"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Service } from "~/types/service";
import { ServiceDetail } from "~/components/ServiceDetail";

const API_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr/api/v1";

export const dynamic = "force-dynamic";

export default function ServicePage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(`${API_BASE_URL}/services/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Service non trouvé");
          } else {
            setError("Erreur lors de la récupération du service");
          }
          return;
        }

        const data: Service = await response.json();
        setService(data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors de la récupération du service");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 pb-20 sm:p-20 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen p-8 pb-20 sm:p-20">
        <main className="max-w-4xl mx-auto">
          <button
            onClick={() => window.close()}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-4 inline-block cursor-pointer"
          >
            ← Retour à la liste
          </button>
          <div className="mt-8">
            <p className="text-red-600 dark:text-red-400">
              {error || "Service non trouvé"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className={showRawData ? "mx-auto" : "max-w-4xl mx-auto"}>
        <div className="mb-4">
          <button
            onClick={() => window.close()}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer"
          >
            ← Retour à la liste
          </button>
        </div>
        <ServiceDetail
          service={service}
          showRawData={showRawData}
          onToggleRawData={() => setShowRawData(!showRawData)}
        />
      </main>
    </div>
  );
}
