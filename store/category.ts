import { create } from "zustand";

type categoryState = {
  category: ICategory[];
  currentCategory:ICategory;
  setCurrentCategory: (currentCategory: ICategory) => void;
  setCategory: (category: ICategory[]) => void;
};
export const useCategoryStore = create<categoryState>((set) => ({
  category: [],
  setCategory: (category: ICategory[]) => set({ category }),
  currentCategory:{} as ICategory,
  setCurrentCategory: (currentCategory: ICategory) => set({ currentCategory })
}));
