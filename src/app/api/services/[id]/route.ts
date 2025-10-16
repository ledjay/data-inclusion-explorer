import { NextRequest } from "next/server";
import { fetchDataInclusion, createApiResponse } from "~/lib/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;

  const result = await fetchDataInclusion({
    endpoint: `/services/${id}`,
    searchParams,
    transferParams: false,
  });

  return createApiResponse(result);
}
