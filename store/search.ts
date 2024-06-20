import { create } from "zustand";

type searchState = {
  search: ISearch;
  setSearch: (search: ISearch) => void;
};
export const useSearchStore = create<searchState>((set) => ({
  search: { page: 1, limit: 10 } as ISearch,
  setSearch: (search: ISearch) => set({ search }),
}));
