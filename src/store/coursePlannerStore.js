/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

const coursePlannerStore = create(
  persist(
    (set) => ({
      boardName: "",
      taxanomySubject: "",
      setBoardname: (newBoardname) =>
        set((state) => ({ boardName: newBoardname })),
      setTaxanomySubject: (newTaxanomySubject) =>
        set((state) => ({ taxanomySubject: newTaxanomySubject})),
    }),
    {
      name: "adminApp",
      getStorage: () => localStorage,
    }
  )
);

export default coursePlannerStore;
