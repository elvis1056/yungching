import { NextResponse } from "next/server";

interface TaipeiCategory {
  id: number;
  name: string;
}

interface TaipeiCategoriesResponse {
  total: number;
  data: {
    Category?: TaipeiCategory[];
  };
}

export async function GET() {
  const res = await fetch(
    "https://www.travel.taipei/open-api/zh-tw/Miscellaneous/Categories?type=Attractions",
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; NextJS/14)",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: res.status }
    );
  }

  const json: TaipeiCategoriesResponse = await res.json();

  return NextResponse.json(json.data.Category ?? []);
}
