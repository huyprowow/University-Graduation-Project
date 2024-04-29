import { create } from "zustand";
type userState = {
  info: {};
  setUserInfo: (info: IUserInfo) => void;
};
export const useChatStore = create<userState>((set) => ({
  info: {},
  setUserInfo: (info: IUserInfo) => set({ info }),
}));
