/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

const taxonomyStore = create(
  persist(
    (set) => ({
      state: "",
      board: "",
      taxonomyMedium: "",
      taxonomyGrade: "",
      taxonomyType: "",
      taxonomySubject: "",
      setState: (newState) =>
        set((state) => ({ state: newState})),
      setBoard: (newBoard) =>
        set((state) => ({ board: newBoard})),
      setTaxonomyMedium: (newTaxonomyMedium) =>
        set((state) => ({ taxonomyMedium: newTaxonomyMedium})),
      setTaxonomyGrade: (newTaxonomyGrade) =>
        set((state) => ({ taxonomyGrade: newTaxonomyGrade})),
      setTaxonomyType: (newTaxonomyType) =>
        set((state) => ({ taxonomyType: newTaxonomyType})),
      setTaxonomySubject: (newTaxonomySubject) =>
        set((state) => ({ taxonomySubject: newTaxonomySubject})),
    }),
    {
      name: "taxonomy",
      getStorage: () => localStorage,
    }
  )
);

export default taxonomyStore;
