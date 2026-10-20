import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BOOT_SKIP_MINIMUM_VISITS,
  BOOT_VISIT_STORAGE_KEY,
  OBSERVATORY_BOOT_STAGES,
  getNextObservatoryBootStage,
  getObservatoryBootDuration,
  registerBootVisit,
  scheduleObservatoryBootTransition,
  shouldOfferBootSkip,
} from "@/features/observatory-boot/boot-state";

function createStorage(initialValue: string | null = null) {
  const values = new Map<string, string>();
  if (initialValue !== null) values.set(BOOT_VISIT_STORAGE_KEY, initialValue);

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
}

describe("Observatory boot state", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("progresses through every locked boot stage in order and keeps completion terminal", () => {
    expect(OBSERVATORY_BOOT_STAGES).toEqual([
      "INITIALIZING",
      "MORPHING",
      "TRACING",
      "GREETING",
      "COMPLETE",
    ]);

    let stage: (typeof OBSERVATORY_BOOT_STAGES)[number] = OBSERVATORY_BOOT_STAGES[0];
    const progression: (typeof OBSERVATORY_BOOT_STAGES)[number][] = [stage];
    while (stage !== "COMPLETE") {
      stage = getNextObservatoryBootStage(stage);
      progression.push(stage);
    }

    expect(progression).toEqual([...OBSERVATORY_BOOT_STAGES]);
    expect(getNextObservatoryBootStage("COMPLETE")).toBe("COMPLETE");
  });

  it("reduces each boot-stage duration without removing stages", () => {
    for (const stage of OBSERVATORY_BOOT_STAGES.slice(0, -1)) {
      expect(getObservatoryBootDuration(stage, true)).toBeGreaterThan(0);
      expect(getObservatoryBootDuration(stage, true)).toBeLessThan(
        getObservatoryBootDuration(stage, false),
      );
    }
  });

  it("cleans up scheduled transitions", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const cancel = scheduleObservatoryBootTransition(callback, 500);
    cancel();
    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("runs a scheduled transition once when not cancelled", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    scheduleObservatoryBootTransition(callback, 500);
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("increments the browser-profile visit counter", () => {
    const storage = createStorage();
    expect(registerBootVisit(storage)).toBe(1);
    expect(registerBootVisit(storage)).toBe(2);
    expect(registerBootVisit(storage)).toBe(3);
    expect(storage.getItem(BOOT_VISIT_STORAGE_KEY)).toBe("3");
  });

  it("offers Skip only from the third eligible load", () => {
    expect(shouldOfferBootSkip(1)).toBe(false);
    expect(shouldOfferBootSkip(2)).toBe(false);
    expect(shouldOfferBootSkip(BOOT_SKIP_MINIMUM_VISITS)).toBe(true);
    expect(shouldOfferBootSkip(10)).toBe(true);
    expect(shouldOfferBootSkip(-1)).toBe(false);
    expect(shouldOfferBootSkip(Number.NaN)).toBe(false);
  });

  it("treats malformed visit counts as a fresh count", () => {
    const storage = createStorage("not-a-count");
    expect(registerBootVisit(storage)).toBe(1);
    expect(storage.getItem(BOOT_VISIT_STORAGE_KEY)).toBe("1");
  });

  it("safely handles storage failures", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("storage disabled");
      }),
      setItem: vi.fn(),
    };
    expect(registerBootVisit(storage)).toBe(1);
    expect(shouldOfferBootSkip(1)).toBe(false);
  });
});
