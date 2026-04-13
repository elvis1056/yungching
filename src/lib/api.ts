import type { AttractionsQuery, AttractionsResponse, Category } from "@/types/attraction";

export async function fetchAttractions(
  query: AttractionsQuery = {}
): Promise<AttractionsResponse> {
  const { page = 1, categoryIds } = query;

  const params = new URLSearchParams({ page: String(page) });
  if (categoryIds?.length) params.set("categoryIds", categoryIds.join(","));

  const res = await fetch(`/api/attractions?${params}`);

  if (!res.ok) throw new Error("Failed to fetch attractions");

  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
