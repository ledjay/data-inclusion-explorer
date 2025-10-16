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

const ITEMS_PER_PAGE = 50;
const API_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr/api/v1";

async function getServices(
  page: number,
  source?: string,
  scoreQualite?: string,
  codeCommune?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: ITEMS_PER_PAGE.toString(),
  });

  if (source) {
    params.set("sources", source);
  }

  if (scoreQualite) {
    params.set("score_qualite_minimum", scoreQualite);
  }

  if (codeCommune) {
    params.set("code_commune", codeCommune);
  }

  const url = `${API_BASE_URL}/search/services?${params.toString()}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }

    const data: ApiResponse = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sources?: string;
    score_qualite_minimum?: string;
    code_commune?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const sourceFilter = params.sources;
  const scoreQualite = params.score_qualite_minimum;
  const codeCommune = params.code_commune;

  const { data, error } = await getServices(
    currentPage,
    sourceFilter,
    scoreQualite,
    codeCommune
  );
  const services = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Helper pour générer les URLs de pagination avec les filtres
  const buildPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (page > 1) urlParams.set("page", page.toString());
    if (sourceFilter) urlParams.set("sources", sourceFilter);
    if (scoreQualite) urlParams.set("score_qualite_minimum", scoreQualite);
    if (codeCommune) urlParams.set("code_commune", codeCommune);
    const query = urlParams.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="mx-auto grid grid-cols-4 gap-10 ">
        <ServiceFilters />

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!error && (
          <div className="col-span-3">
            <div className="space-y-6 ">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {total} service{total > 1 ? "s" : ""} au total - Page{" "}
                {currentPage} sur {totalPages}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {services.map((item) => (
                  <ServiceCard
                    key={item.service.id}
                    service={item.service}
                    distance={item.distance}
                  />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-8">
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
          </div>
        )}
      </main>
    </div>
  );
}
