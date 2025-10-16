import { NextRequest } from "next/server";
import { fetchDataInclusion, createApiResponse } from "~/lib/api-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const result = await fetchDataInclusion({
    endpoint: "/search/services",
    searchParams,
    transferParams: true,
  });

  return createApiResponse(result);
}
