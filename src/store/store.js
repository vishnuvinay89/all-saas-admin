import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      pid: "",
      // state: "",
      // district: "",
      // block: "",
      setPid: (newPid) => set((state) => ({ pid: newPid })),
      // setPid: (newPid) => set((state) => ({ pid: newPid })),
      // setPid: (newPid) => set((state) => ({ pid: newPid })),
      // setPid: (newPid) => set((state) => ({ pid: newPid })),
    }),
    {
      name: "adminApp",
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
