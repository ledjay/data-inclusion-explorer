import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE_URL = "https://api-staging.data.inclusion.beta.gouv.fr";
const DEFAULT_VERSION = "v1";

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche de la requête
    const searchParams = request.nextUrl.searchParams;

    // Récupérer l'URL de base et la version depuis les paramètres ou utiliser les valeurs par défaut
    const baseUrl = searchParams.get("baseUrl") || DEFAULT_BASE_URL;
    const version = searchParams.get("version") || DEFAULT_VERSION;

    // Retirer baseUrl et version des paramètres pour ne pas les transférer à l'API
    const apiParams = new URLSearchParams(searchParams);
    apiParams.delete("baseUrl");
    apiParams.delete("version");

    // Construire l'URL de l'API Data Inclusion avec les paramètres
    const apiUrl = new URL(`${baseUrl}/api/${version}/search/services`);

    // Transférer tous les paramètres de recherche (sauf baseUrl et version)
    apiParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    // Faire la requête vers l'API Data Inclusion
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des données" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API Data Inclusion:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
