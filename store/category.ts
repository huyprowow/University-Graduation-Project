import { create } from "zustand";

type categoryState = {
  category: ICategory[];
  setCategory: (category: ICategory[]) => void;
};
export const useCategoryStore = create<categoryState>((set) => ({
  category: [],
  setCategory: (category: ICategory[]) => set({ category }),
}));
