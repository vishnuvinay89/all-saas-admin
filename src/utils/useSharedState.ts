import { create } from "zustand";

const useSubmittedButtonStore = create((set) => ({
  submittedButtonStatus: false,
  setSubmittedButtonStatus: (status: boolean) =>
    set({ submittedButtonStatus: status }),
  adminInformation: {},
  setAdminInformation: (data: any) => set({ adminInformation: data }),
}));

export default useSubmittedButtonStore;
