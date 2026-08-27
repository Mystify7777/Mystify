import { describe, expect, it } from "vitest";
import {
  useObservatoryStore,
  type ObservatoryMode,
} from "@/state/use-observatory-store";

describe("observatory mode state", () => {
  it("starts without assuming a visitor mode", () => {
    useObservatoryStore.getState().clearMode();
    expect(useObservatoryStore.getState().mode).toBeNull();
  });

  it.each<ObservatoryMode>(["recruiter", "explorer", "engineer"])(
    "selects %s as the single active mode",
    (mode) => {
      useObservatoryStore.getState().setMode(mode);
      expect(useObservatoryStore.getState().mode).toBe(mode);
    },
  );

  it("clears the active mode without affecting shell state", () => {
    const store = useObservatoryStore.getState();
    store.setMode("engineer");
    store.clearMode();

    expect(useObservatoryStore.getState().mode).toBeNull();
    expect(useObservatoryStore.getState().windows).toEqual([]);
    expect(useObservatoryStore.getState().commands).toEqual([]);
  });
});
