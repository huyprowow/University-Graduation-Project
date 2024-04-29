import { create } from "zustand";

type productState = {
  product: IProduct[];
  setProduct: (product: IProduct[]) => void;
};
export const useProductStore = create<productState>((set) => ({
  product: [],
  setProduct: (product: IProduct[]) => set({ product }),
}));
