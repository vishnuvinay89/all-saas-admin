import { create } from 'zustand';

const useSubmittedButtonStore = create((set) => ({
  submittedButtonStatus: false,
  submittedButtonEnable: false, 

  setSubmittedButtonStatus: (status: boolean) => set({ submittedButtonStatus: status }),
  setSubmittedButtonEnable: (status: boolean) => set({ submittedButtonEnable: status }),
}));

export default useSubmittedButtonStore;
