import { NextRequest, NextResponse } from "next/server";
import type { Attraction, AttractionsResponse } from "@/types/attraction";

const TAIPEI_API_BASE = "https://www.travel.taipei/open-api/zh-tw/Attractions/All";

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

  const res = await fetch(`${TAIPEI_API_BASE}?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch attractions" },
      { status: res.status }
    );
  }

  const json: TaipeiApiResponse = await res.json();

  const body: AttractionsResponse = {
    total: json.total,
    data: json.data.map(transformItem),
  };

  return NextResponse.json(body);
}
