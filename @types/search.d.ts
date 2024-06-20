interface ISearch {
  page: number;
  limit: number;
  query?: string | null;
  category?: string | null;
  brand?: string | null;
}
