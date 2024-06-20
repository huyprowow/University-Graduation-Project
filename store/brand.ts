import { create } from "zustand";

type brandState = {
  brand: IBrand[];
  setBrand: (brand: IBrand[]) => void;
  currentBrand:IBrand;
   setCurrentBrand: (currentBrand: IBrand) => void;
};
export const useBrandStore = create<brandState>((set) => ({
  brand: [],
  setBrand: (brand: IBrand[]) => set({ brand }),
  currentBrand:{} as IBrand,
  setCurrentBrand: (currentBrand: IBrand) => set({ currentBrand }),
}));
