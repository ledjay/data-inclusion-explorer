"use client";

/**
 * ServiceFilters Component
 * Main filter sidebar for the Data Inclusion Explorer
 * Displays all available filters organized by category
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL_FILTERS, FILTER_MAP } from "~/config/filters.config";
import { FilterControl } from "~/components/FilterControl";
import {
  urlParamsToFilterState,
  filterStateToUrlParams,
} from "~/lib/filter-utils";
import { Button } from "~/components/ui/button";

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterState, setFilterState] = useState<
    Record<string, string | number | boolean | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<{ value: string; label: string; available: boolean }>>
  >({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch communes data from local API endpoint (initially top communes)
  useEffect(() => {
    const fetchCommunes = async () => {
      try {
        const response = await fetch("/api/communes");
        const communes = (await response.json()) as Array<{
          code: string;
          nom: string;
          codeRegion: string;
        }>;

        const options = communes.map((commune) => ({
          value: commune.code,
          label: `${commune.nom} (${commune.codeRegion})`,
          available: true,
        }));

        // Update state with initial communes
        setFilterOptions((prev) => ({ ...prev, code_commune: options }));

        // Also update FILTER_MAP for validation
        const communesFilter = FILTER_MAP.get("code_commune");
        if (communesFilter && communesFilter.options) {
          communesFilter.options = options;
        }
      } catch (err) {
        console.error("Failed to fetch communes:", err);
      }
    };

    fetchCommunes();
  }, []);

  // Handle communes search
  const handleCommunesSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      // Reset to top communes if search is too short
      const response = await fetch("/api/communes");
      const communes = (await response.json()) as Array<{
        code: string;
        nom: string;
        codeRegion: string;
      }>;

      const options = communes.map((commune) => ({
        value: commune.code,
        label: `${commune.nom} (${commune.codeRegion})`,
        available: true,
      }));

      setFilterOptions((prev) => ({ ...prev, code_commune: options }));
      return;
    }

    try {
      const response = await fetch(
        `/api/communes?search=${encodeURIComponent(searchTerm)}`
      );
      const communes = (await response.json()) as Array<{
        code: string;
        nom: string;
        codeRegion: string;
      }>;

      const options = communes.map((commune) => ({
        value: commune.code,
        label: `${commune.nom} (${commune.codeRegion})`,
        available: true,
      }));

      setFilterOptions((prev) => ({ ...prev, code_commune: options }));
    } catch (err) {
      console.error("Failed to search communes:", err);
    }
  }, []);

  // Initialize filter state from URL parameters
  useEffect(() => {
    const state = urlParamsToFilterState(searchParams, ALL_FILTERS);

    // For code_commune, add it directly from URL even if validation fails
    // (options might not be loaded yet)
    const communeCode = searchParams.get("code_commune");
    if (communeCode && !state.code_commune) {
      state.code_commune = communeCode;
    }

    setFilterState(state);
  }, [searchParams]);

  // Ensure URL commune is in options
  useEffect(() => {
    const communeCode = searchParams.get("code_commune");
    if (communeCode && filterOptions.code_commune) {
      const hasCommune = filterOptions.code_commune.some(
        (opt) => opt.value === communeCode
      );

      if (!hasCommune) {
        // Fetch this specific commune by code to add to options
        fetch(`/api/communes?code=${communeCode}`)
          .then((res) => res.json())
          .then(
            (
              communes: Array<{ code: string; nom: string; codeRegion: string }>
            ) => {
              if (communes.length > 0) {
                const commune = communes[0];
                const newOption = {
                  value: commune.code,
                  label: `${commune.nom} (${commune.codeRegion})`,
                  available: true,
                };
                setFilterOptions((prev) => ({
                  ...prev,
                  code_commune: [newOption, ...(prev.code_commune || [])],
                }));
              }
            }
          )
          .catch((err) => console.error("Failed to fetch commune from URL:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filterOptions.code_commune?.length]);

  // Handle filter change
  const handleFilterChange = (
    filterId: string,
    value: string | number | boolean
  ) => {
    const newState = { ...filterState, [filterId]: value };
    setFilterState(newState);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce URL updates (300ms) to avoid excessive re-renders
    debounceTimerRef.current = setTimeout(() => {
      // Update URL with merged filters (include dynamic options)
      const mergedFilters = ALL_FILTERS.map((filter) => {
        const cachedOptions = filterOptions[filter.id];
        return cachedOptions ? { ...filter, options: cachedOptions } : filter;
      });
      const params = filterStateToUrlParams(newState, mergedFilters);
      params.delete("page"); // Reset to page 1 when filters change
      router.push(`/?${params.toString()}`);
    }, 300);
  };

  // Handle filter clear
  const handleClearFilter = (filterId: string) => {
    const newState = { ...filterState };
    delete newState[filterId];
    setFilterState(newState);

    // Update URL
    const params = filterStateToUrlParams(newState, ALL_FILTERS);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  // Handle reset all filters
  const handleResetAll = () => {
    setFilterState({});
    router.push("/");
  };

  return (
    <div className="sticky top-8 self-start space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Explorateur Data Inclusion</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explorez les services de l&apos;API Data Inclusion. Utilisez les
          filtres ci-dessous pour affiner votre recherche.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Chargement des filtres...
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-6">
        {ALL_FILTERS.map((filter) => {
          const onSearchProp =
            filter.id === "code_commune" ? handleCommunesSearch : undefined;
          const cachedOptions = filterOptions[filter.id];
          const filterToPass = cachedOptions
            ? { ...filter, options: cachedOptions }
            : filter;

          return (
            <FilterControl
              key={filter.id}
              filter={filterToPass}
              value={filterState[filter.id] ?? filter.defaultValue}
              onChange={(value) => handleFilterChange(filter.id, value)}
              onClear={() => handleClearFilter(filter.id)}
              onSearch={onSearchProp}
            />
          );
        })}
      </div>

      {/* Reset All Button */}
      {Object.keys(filterState).length > 0 && (
        <Button variant="outline" onClick={handleResetAll} className="w-full">
          Réinitialiser tous les filtres
        </Button>
      )}
    </div>
  );
}
