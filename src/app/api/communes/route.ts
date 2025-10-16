import { NextRequest, NextResponse } from "next/server";

const GEO_API_BASE_URL = "https://geo.api.gouv.fr";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Construire l'URL de l'API Géo
    const apiUrl = new URL(`${GEO_API_BASE_URL}/communes`);
    
    // Transférer tous les paramètres de recherche
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    // Faire la requête vers l'API Géo
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des communes" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API Géo communes:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des communes" },
      { status: 500 }
    );
  }
}
