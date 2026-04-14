import { NextRequest, NextResponse } from "next/server";
import { fetchTaipeiApi, TaipeiApiError } from "@/lib/taipei-api";
import type { Attraction, AttractionsResponse } from "@/types/attraction";

interface TaipeiApiImage {
  src: string;
  subject: string;
  ext: string;
}

interface TaipeiApiCategory {
  id: number;
  name: string;
}

interface TaipeiApiItem {
  id: number;
  name: string;
  introduction: string;
  address: string;
  tel: string;
  official_site: string;
  images: TaipeiApiImage[];
  category: TaipeiApiCategory[];
}

interface TaipeiApiResponse {
  total: number;
  data: TaipeiApiItem[];
}

function transformItem(item: TaipeiApiItem): Attraction {
  return {
    id: String(item.id),
    name: item.name,
    introduction: item.introduction,
    address: item.address,
    tel: item.tel,
    official_site: item.official_site,
    image: item.images?.[0]?.src ?? "",
    categoryIds: item.category?.map((c) => c.id) ?? [],
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") ?? "1";
  const categoryIds = searchParams.get("categoryIds");

  const params = new URLSearchParams({ page });
  if (categoryIds) params.set("categoryIds", categoryIds);

  try {
    const json = await fetchTaipeiApi<TaipeiApiResponse>(
      `/Attractions/All?${params}`
    );

    const body: AttractionsResponse = {
      total: json.total,
      data: json.data.map(transformItem),
    };

    return NextResponse.json(body);
  } catch (err) {
    if (err instanceof TaipeiApiError) {
      return NextResponse.json(
        { error: "Failed to fetch attractions" },
        { status: err.status }
      );
    }
    throw err;
  }
}
