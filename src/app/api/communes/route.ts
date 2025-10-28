import { NextRequest, NextResponse } from "next/server";

const GEO_API_BASE_URL = "https://geo.api.gouv.fr";

// Top French cities to pre-populate
const TOP_COMMUNES = [
  { code: "75056", nom: "Paris", codeRegion: "75" },
  { code: "13055", nom: "Marseille", codeRegion: "13" },
  { code: "69123", nom: "Lyon", codeRegion: "69" },
  { code: "31555", nom: "Toulouse", codeRegion: "31" },
  { code: "06088", nom: "Nice", codeRegion: "06" },
  { code: "59350", nom: "Lille", codeRegion: "59" },
  { code: "33063", nom: "Bordeaux", codeRegion: "33" },
  { code: "37261", nom: "Tours", codeRegion: "37" },
  { code: "44109", nom: "Nantes", codeRegion: "44" },
  { code: "67482", nom: "Strasbourg", codeRegion: "67" },
  { code: "59183", nom: "Lens", codeRegion: "59" },
  { code: "62041", nom: "Arras", codeRegion: "62" },
  { code: "92012", nom: "Boulogne-Billancourt", codeRegion: "92" },
  { code: "92050", nom: "Neuilly-sur-Seine", codeRegion: "92" },
  { code: "92044", nom: "Issy-les-Moulineaux", codeRegion: "92" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const code = searchParams.get("code");

    // If code is provided, fetch specific commune by code
    if (code) {
      const apiUrl = new URL(`${GEO_API_BASE_URL}/communes/${code}`);
      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        return NextResponse.json([], { status: 200 }); // Return empty array if not found
      }

      const commune = await response.json();
      return NextResponse.json([commune]); // Return as array for consistency
    }

    // If no search query, return top communes
    if (!search || search.length < 2) {
      return NextResponse.json(TOP_COMMUNES);
    }

    // Fetch from geo.api.gouv.fr with search query
    const apiUrl = new URL(`${GEO_API_BASE_URL}/communes`);
    apiUrl.searchParams.append("nom", search);
    apiUrl.searchParams.append("limit", "50");

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

    // Ensure we always return an array
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Erreur API Géo communes:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des communes" },
      { status: 500 }
    );
  }
}
