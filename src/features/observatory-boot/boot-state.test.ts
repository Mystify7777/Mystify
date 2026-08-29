import { describe, expect, it, vi } from "vitest";
import {
  OBSERVATORY_BOOT_STAGES,
  getNextObservatoryBootStage,
  getObservatoryBootDuration,
  scheduleObservatoryBootTransition,
} from "@/features/observatory-boot/boot-state";

describe("Observatory boot state", () => {
  it("progresses through every locked boot stage in order", () => {
    expect(OBSERVATORY_BOOT_STAGES).toEqual([
      "INITIALIZING",
      "MORPHING",
      "TRACING",
      "GREETING",
      "COMPLETE",
    ]);

    let stage = OBSERVATORY_BOOT_STAGES[0];
    const progression = [stage];

    while (stage !== "COMPLETE") {
      stage = getNextObservatoryBootStage(stage);
      progression.push(stage);
    }

    expect(progression).toEqual([...OBSERVATORY_BOOT_STAGES]);
  });

  it("keeps completion terminal", () => {
    expect(getNextObservatoryBootStage("COMPLETE")).toBe("COMPLETE");
  });

  it("preserves every conceptual stage with reduced motion", () => {
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
    vi.useRealTimers();
  });

  it("runs a scheduled transition once when not cancelled", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    scheduleObservatoryBootTransition(callback, 500);
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
