import { NextResponse } from "next/server";
import { fetchTaipeiApi, TaipeiApiError } from "@/lib/taipei-api";

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
  try {
    const json = await fetchTaipeiApi<TaipeiCategoriesResponse>(
      "/Miscellaneous/Categories?type=Attractions",
      3600
    );

    return NextResponse.json(json.data.Category ?? []);
  } catch (err) {
    if (err instanceof TaipeiApiError) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: err.status }
      );
    }
    throw err;
  }
}
