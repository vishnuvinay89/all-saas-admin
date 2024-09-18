import { create } from "zustand";

const useSubmittedButtonStore = create((set) => ({
  submittedButtonStatus: false,
  setSubmittedButtonStatus: (status: boolean) =>
    set({ submittedButtonStatus: status }),
    reassignButtonStatus: false,
    setReassignButtonStatus: (status: boolean) =>
      set({ reassignButtonStatus: status }),
  adminInformation: {},
  setAdminInformation: (data: any) => set({ adminInformation: data }),
//  setSubmittedButtonStatus: (status: boolean) => set({ submittedButtonStatus: status }),
  userEnteredEmail:"",
  noError:false,
  setNoError:(data: boolean) => set({ noError: data }),
  setUserEnteredEmail: (status: string) => set({ userEnteredEmail: status }),
  shouldFetch:true,
   setShouldFetch:(data: boolean) => set({ shouldFetch: data }),

}));

export default useSubmittedButtonStore;
