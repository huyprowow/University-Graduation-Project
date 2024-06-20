import { create } from "zustand";

type invoiceState = {
  invoice: IInvoice[];
  setInvoice: (invoice: IInvoice[]) => void;
  currentInvoice: IInvoice;
  setCurrentInvoice: (currentInvoice: IInvoice) => void;
};
export const useInvoiceStore = create<invoiceState>((set) => ({
  invoice: [],
  setInvoice: (invoice: IInvoice[]) => set({ invoice }),
  currentInvoice: {} as IInvoice,
  setCurrentInvoice: (currentInvoice: IInvoice) => set({ currentInvoice }),
}));
