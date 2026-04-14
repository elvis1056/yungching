const BASE = "https://www.travel.taipei/open-api/zh-tw";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (compatible; NextJS/14)",
};

export class TaipeiApiError extends Error {
  constructor(public status: number, path: string) {
    super(`Taipei API error: ${status} ${path}`);
  }
}

export async function fetchTaipeiApi<T>(
  path: string,
  revalidate = 300
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: DEFAULT_HEADERS,
    next: { revalidate },
  });

  if (!res.ok) {
    throw new TaipeiApiError(res.status, path);
  }

  return res.json();
}
