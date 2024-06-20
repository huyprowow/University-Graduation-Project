import { create } from "zustand";

type productState = {
  product: IProduct[];
  setProduct: (product: IProduct[]) => void;
  currentProduct: IProduct | null | undefined;
  setCurrentProduct: (currentProduct: IProduct) => void;
  countProduct: number;
  setCountProduct: (countProduct: number) => void;
  similarProduct: IProduct[];
  setSimilarProduct: (similarProduct: IProduct[]) => void;
};
export const useProductStore = create<productState>((set) => ({
  countProduct: 0,
  product: [],
  currentProduct: null,
  setCurrentProduct: (currentProduct) => set({ currentProduct }),
  setProduct: (product: IProduct[]) => set({ product }),
  setCountProduct: (countProduct: number) => set({ countProduct }),
  similarProduct: [],
  setSimilarProduct: (similarProduct: IProduct[]) => set({ similarProduct }),
}));
