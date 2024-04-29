import { create } from "zustand";

type brandState = {
  brand: IBrand[];
  setBrand: (brand: IBrand[]) => void;
};
export const useBrandStore = create<brandState>((set) => ({
  brand: [],
  setBrand: (brand: IBrand[]) => set({ brand }),
}));
