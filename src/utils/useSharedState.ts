import { create } from "zustand";

const useSubmittedButtonStore = create((set) => ({
  submittedButtonStatus: false,
  setSubmittedButtonStatus: (status: boolean) =>
    set({ submittedButtonStatus: status }),
  adminInformation: {},
  setAdminInformation: (data: any) => set({ adminInformation: data }),
//  setSubmittedButtonStatus: (status: boolean) => set({ submittedButtonStatus: status }),
  userEnteredEmail:"",
  setUserEnteredEmail: (status: string) => set({ userEnteredEmail: status }),

}));

export default useSubmittedButtonStore;
