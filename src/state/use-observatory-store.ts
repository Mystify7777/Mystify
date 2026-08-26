import { create } from "zustand";

export type ObservatoryMode = "recruiter" | "explorer" | "engineer";

interface ObservatoryState {
  mode: ObservatoryMode | null;
  setMode: (mode: ObservatoryMode) => void;
}

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
}));
