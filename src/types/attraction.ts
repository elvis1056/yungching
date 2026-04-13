export interface Attraction {
  id: string;
  name: string;
  introduction: string;
  address: string;
  tel: string;
  official_site: string;
  image: string;
  categoryIds: number[];
}

export interface AttractionsResponse {
  total: number;
  data: Attraction[];
}

export interface AttractionsQuery {
  page?: number;
  categoryIds?: number[];
}
