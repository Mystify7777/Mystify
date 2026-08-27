import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useObservatoryStore,
  type ObservatoryMode,
} from "@/state/use-observatory-store";

const storage = new Map<string, string>();
const sessionStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

describe("observatory mode state", () => {
  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("window", { sessionStorage });
    useObservatoryStore.setState({ mode: null });
  });

  it("starts without assuming a visitor mode", () => {
    expect(useObservatoryStore.getState().mode).toBeNull();
  });

  it.each<ObservatoryMode>(["recruiter", "explorer", "engineer"])(
    "selects %s as the single active mode",
    (mode) => {
      useObservatoryStore.getState().setMode(mode);
      expect(useObservatoryStore.getState().mode).toBe(mode);
    },
  );

  it("persists a selected mode for the current session", () => {
    useObservatoryStore.getState().setMode("explorer");

    expect(storage.get("observatory.mode")).toBe("explorer");
  });

  it("clears the persisted mode when the active mode is cleared", () => {
    useObservatoryStore.getState().setMode("engineer");
    useObservatoryStore.getState().clearMode();

    expect(storage.has("observatory.mode")).toBe(false);
    expect(useObservatoryStore.getState().mode).toBeNull();
  });

  it("restores a valid stored mode during client hydration", () => {
    storage.set("observatory.mode", "recruiter");

    useObservatoryStore.getState().hydrateMode();

    expect(useObservatoryStore.getState().mode).toBe("recruiter");
  });

  it("ignores an invalid stored mode during client hydration", () => {
    storage.set("observatory.mode", "unknown");

    useObservatoryStore.getState().hydrateMode();

    expect(useObservatoryStore.getState().mode).toBeNull();
  });

  it("clears the active mode without affecting shell state", () => {
    const store = useObservatoryStore.getState();
    store.setMode("engineer");
    store.clearMode();

    expect(useObservatoryStore.getState().mode).toBeNull();
    expect(useObservatoryStore.getState().windows).toEqual([]);
    expect(useObservatoryStore.getState().commands).toEqual([]);
  });
});
