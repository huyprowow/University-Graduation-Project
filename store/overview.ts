import { create } from "zustand";
type userState = {
  overview: IOverview;
  setOverview: (overview: IOverview) => void;
};
export const useOverviewStore = create<userState>((set) => ({
  overview: {} as IOverview,
  setOverview: (overview: IOverview) => set({ overview }),
}));
