"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { ServiceCard } from "~/components/ServiceCard";
import { ApiResponse } from "~/types/service";
import ServiceFilters from "~/components/ServiceFilters";
import { ServiceDetailPanel } from "~/components/ServiceDetailPanel";

const ITEMS_PER_PAGE = 50;
const API_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr/api/v1";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Panel state
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  // Data state
  const [services, setServices] = useState<ApiResponse["items"]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current filters from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const sourceFilter = searchParams.get("sources") || undefined;
  const scoreQualite = searchParams.get("score_qualite_minimum") || undefined;
  const codeCommune = searchParams.get("code_commune") || undefined;
  const typesFilter = searchParams.get("types") || undefined;
  const fraisFilter = searchParams.get("frais") || undefined;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Fetch services when filters change
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: ITEMS_PER_PAGE.toString(),
      });

      if (sourceFilter) params.set("sources", sourceFilter);
      if (scoreQualite) params.set("score_qualite_minimum", scoreQualite);
      if (codeCommune) params.set("code_commune", codeCommune);
      if (typesFilter) params.set("types", typesFilter);
      if (fraisFilter && fraisFilter !== "all")
        params.set("frais", fraisFilter);

      const url = `${API_BASE_URL}/search/services?${params.toString()}`;

      try {
        const response = await fetch(url, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data: ApiResponse = await response.json();
        setServices(data.items);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setServices([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [
    currentPage,
    sourceFilter,
    scoreQualite,
    codeCommune,
    typesFilter,
    fraisFilter,
  ]);

  // Sync panel state with URL
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setSelectedServiceId(serviceParam);
    }
  }, [searchParams]);

  // Helper pour générer les URLs de pagination avec les filtres
  const buildPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (page > 1) urlParams.set("page", page.toString());
    if (sourceFilter) urlParams.set("sources", sourceFilter);
    if (scoreQualite) urlParams.set("score_qualite_minimum", scoreQualite);
    if (codeCommune) urlParams.set("code_commune", codeCommune);
    if (typesFilter) urlParams.set("types", typesFilter);
    if (fraisFilter) urlParams.set("frais", fraisFilter);
    const query = urlParams.toString();
    return query ? `/?${query}` : "/";
  };

  // Handle card click - open panel and update URL
  const handleCardClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("service", serviceId);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Handle panel close - clear selection and remove from URL
  const handlePanelClose = () => {
    setSelectedServiceId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("service");
    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <main
        className={`grid gap-4 h-full w-full transition-all duration-300 ${
          selectedServiceId
            ? "grid-cols-1 md:grid-cols-[1fr_1fr_2fr]"
            : "grid-cols-1 md:grid-cols-[1fr_3fr]"
        }`}
      >
        {/* Filter bar - fixed 25% width */}
        <div
          className={`overflow-y-auto min-w-0 p-4 border-r ${
            selectedServiceId ? "hidden md:block" : ""
          }`}
        >
          <ServiceFilters />
        </div>

        {/* Card list - flexible width */}
        <div
          className={`overflow-y-auto min-w-0 p-4 ${
            selectedServiceId ? "hidden md:block" : ""
          }`}
        >
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!error && (
            <>
              <div className="min-w-0">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600 dark:text-gray-400">
                      Chargement...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {total} service{total > 1 ? "s" : ""} au total - Page{" "}
                      {currentPage} sur {totalPages}
                    </p>

                    <div
                      className={`grid gap-4 w-full min-w-0 ${
                        selectedServiceId ? "grid-cols-1" : "grid-cols-2"
                      }`}
                    >
                      {services.map((item) => (
                        <ServiceCard
                          key={item.service.id}
                          service={item.service}
                          distance={item.distance}
                          onClick={handleCardClick}
                          isSelected={selectedServiceId === item.service.id}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8 w-full min-w-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={
                          currentPage > 1 ? buildPageUrl(currentPage - 1) : "#"
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href={buildPageUrl(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href={
                          currentPage < totalPages
                            ? buildPageUrl(currentPage + 1)
                            : "#"
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        {/* Side panel - 50% width when open */}
        {selectedServiceId && (
          <div className="contents">
            <ServiceDetailPanel
              serviceId={selectedServiceId}
              isOpen={selectedServiceId !== null}
              onClose={handlePanelClose}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          Chargement...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
