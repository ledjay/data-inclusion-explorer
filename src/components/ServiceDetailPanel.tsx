"use client";

import { useEffect, useState, useRef } from "react";
import { Service } from "~/types/service";
import { ServiceDetail } from "~/components/ServiceDetail";

const API_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr/api/v1";

interface ServiceDetailPanelProps {
  serviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceDetailPanel({
  serviceId,
  isOpen,
  onClose,
}: ServiceDetailPanelProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch service details when serviceId changes
  useEffect(() => {
    if (!serviceId) {
      setService(null);
      return;
    }

    async function fetchService() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);

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
  }, [serviceId]);

  // Click outside to close (but not on cards)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Don't close if clicking on a card (check for card-related elements)
      if (target.closest("[data-card]")) {
        return;
      }

      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    }

    if (isOpen) {
      // Add delay to prevent immediate close on initial card click
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Escape key to close panel
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      className="bg-white border-l border-gray-200 overflow-y-auto h-full min-w-0 w-full md:relative md:w-full md:h-full fixed inset-0 md:inset-auto z-50 md:z-auto"
    >
      <div className="p-8">
        <h2 id="panel-title" className="sr-only">
          Détails du service
        </h2>
        {loading && (
          <div className="flex items-center justify-center h-64 animate-in fade-in duration-200">
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-64 animate-in fade-in duration-200">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

        {service && !loading && (
          <div className="animate-in fade-in duration-300">
            <ServiceDetail
              service={service}
              showRawData={showRawData}
              onToggleRawData={() => setShowRawData(!showRawData)}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
