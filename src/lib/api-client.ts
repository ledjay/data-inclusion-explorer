import { NextResponse } from "next/server";

const DEFAULT_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr";
const DEFAULT_VERSION = "v1";

type FetchDataInclusionOptions = {
  endpoint: string;
  searchParams: URLSearchParams;
  transferParams?: boolean;
};

type ApiResult = {
  data: unknown;
  error: string | null;
  status: number;
};

export async function fetchDataInclusion({
  endpoint,
  searchParams,
  transferParams = true,
}: FetchDataInclusionOptions) {
  try {
    // Récupérer l'URL de base et la version depuis les paramètres ou utiliser les valeurs par défaut
    const baseUrl = searchParams.get("baseUrl") || DEFAULT_BASE_URL;
    const version = searchParams.get("version") || DEFAULT_VERSION;

    // Retirer baseUrl et version des paramètres pour ne pas les transférer à l'API
    const apiParams = new URLSearchParams(searchParams);
    apiParams.delete("baseUrl");
    apiParams.delete("version");

    // Construire l'URL de l'API Data Inclusion
    const apiUrl = new URL(`${baseUrl}/api/${version}${endpoint}`);

    // Transférer tous les paramètres de recherche (sauf baseUrl et version) si demandé
    if (transferParams) {
      apiParams.forEach((value, key) => {
        apiUrl.searchParams.append(key, value);
      });
    }

    // Faire la requête vers l'API Data Inclusion
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: "Erreur lors de la récupération des données",
        status: response.status,
      };
    }

    const data = await response.json();

    return { data, error: null, status: 200 };
  } catch (error) {
    console.error("Erreur API Data Inclusion:", error);
    return {
      data: null,
      error: "Erreur serveur lors de la récupération des données",
      status: 500,
    };
  }
}

export function createApiResponse(result: ApiResult) {
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }
  return NextResponse.json(result.data);
}
