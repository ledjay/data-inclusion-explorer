"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Slider } from "~/components/ui/slider";
import { Source } from "~/types/source";
import { Commune } from "~/types/commune";

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sources, setSources] = useState<Source[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCommune, setOpenCommune] = useState(false);
  const [communeSearch, setCommuneSearch] = useState("");
  const [qualityScore, setQualityScore] = useState<number[]>([
    Number(searchParams.get("score_qualite_minimum")) || 0,
  ]);

  const currentSource = searchParams.get("sources") || "all";
  const currentCommune = searchParams.get("code_commune") || "";

  useEffect(() => {
    async function fetchSources() {
      try {
        const response = await fetch("/api/sources");
        if (response.ok) {
          const data = await response.json();
          setSources(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sources:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSources();
  }, []);

  // Charger les communes avec debounce sur la recherche
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (communeSearch.length >= 2) {
        setLoadingCommunes(true);
        try {
          const response = await fetch(
            `/api/communes?nom=${encodeURIComponent(communeSearch)}&limit=50`
          );
          if (response.ok) {
            const data = await response.json();
            setCommunes(data);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des communes:", error);
        } finally {
          setLoadingCommunes(false);
        }
      } else {
        setCommunes([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [communeSearch]);

  // Debounce pour le score de qualité
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (qualityScore[0] > 0) {
        params.set("score_qualite_minimum", qualityScore[0].toString());
      } else {
        params.delete("score_qualite_minimum");
      }

      // Réinitialiser à la page 1 lors du changement de filtre
      params.delete("page");

      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [qualityScore, router, searchParams]);

  const handleSourceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("sources");
    } else {
      params.set("sources", value);
    }

    // Réinitialiser à la page 1 lors du changement de filtre
    params.delete("page");

    router.push(`/?${params.toString()}`);
  };

  const handleCommuneChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("code_commune", value);
    } else {
      params.delete("code_commune");
    }

    // Réinitialiser à la page 1 lors du changement de filtre
    params.delete("page");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="sticky top-8 self-start">
      <h1 className="text-4xl font-bold mb-4">Data Inclusion Explorer</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Explorez les services de l&apos;API Data Inclusion. Filtrez par source
        de données, commune et score de qualité pour trouver les services qui
        correspondent à vos besoins.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Source de données
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={loading}
              >
                {currentSource === "all"
                  ? "Toutes les sources"
                  : sources.find((source) => source.slug === currentSource)
                      ?.nom || "Sélectionner une source"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher une source..." />
                <CommandList>
                  <CommandEmpty>Aucune source trouvée.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        handleSourceChange("all");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentSource === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Toutes les sources
                    </CommandItem>
                    {sources.map((source) => (
                      <CommandItem
                        key={source.slug}
                        value={source.slug}
                        onSelect={(value) => {
                          handleSourceChange(value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentSource === source.slug
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {source.nom}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {currentSource !== "all" && (
            <button
              type="button"
              onClick={() => handleSourceChange("all")}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Score de qualité minimum : {qualityScore[0].toFixed(2)}
          </label>
          <Slider
            value={qualityScore}
            onValueChange={setQualityScore}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0</span>
            <span>1.0</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Commune</label>
          <Popover open={openCommune} onOpenChange={setOpenCommune}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCommune}
                className="w-full justify-between"
              >
                {currentCommune && selectedCommune
                  ? `${selectedCommune.nom} (${selectedCommune.code})`
                  : currentCommune
                  ? currentCommune
                  : "Sélectionner une commune"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Rechercher une commune..."
                  value={communeSearch}
                  onValueChange={setCommuneSearch}
                />
                <CommandList>
                  {communeSearch.length < 2 && (
                    <CommandEmpty>
                      Tapez au moins 2 caractères pour rechercher.
                    </CommandEmpty>
                  )}
                  {communeSearch.length >= 2 && loadingCommunes && (
                    <CommandEmpty>Recherche en cours...</CommandEmpty>
                  )}
                  {communeSearch.length >= 2 &&
                    !loadingCommunes &&
                    communes.length === 0 && (
                      <CommandEmpty>Aucune commune trouvée.</CommandEmpty>
                    )}
                  {communes.length > 0 && (
                    <CommandGroup>
                      {communes.map((commune) => (
                        <CommandItem
                          key={commune.code}
                          value={commune.code}
                          onSelect={(value) => {
                            setSelectedCommune(commune);
                            handleCommuneChange(value);
                            setOpenCommune(false);
                            setCommuneSearch("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentCommune === commune.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {commune.nom} ({commune.codesPostaux[0]})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {currentCommune && (
            <button
              type="button"
              onClick={() => {
                setSelectedCommune(null);
                handleCommuneChange("");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
